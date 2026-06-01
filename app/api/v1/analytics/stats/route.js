import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import Visit from "@/app/_models/visitModel";
import User from "@/app/_models/userModel";
import Blog from "@/app/_models/blogModel";
import Podcast from "@/app/_models/podcastModel";
import Music from "@/app/_models/musicModel";
import Feedback from "@/app/_models/feedbackModel";
import Comment from "@/app/_models/commentModel";
import { auth } from "@/app/_lib/auth";

// Helper to calculate session durations from visits
function calculateDurationsAndBounceRate(visits) {
  if (!visits || visits.length === 0) {
    return { avgDurationSeconds: 0, bounceRate: 0 };
  }

  // 1. Bounce Rate Calculation
  // Group pageviews by IP
  const ipCounts = {};
  visits.forEach(v => {
    ipCounts[v.ip] = (ipCounts[v.ip] || 0) + 1;
  });
  const uniqueVisitors = Object.keys(ipCounts).length;
  const singlePageVisits = Object.values(ipCounts).filter(count => count === 1).length;
  const bounceRate = uniqueVisitors > 0 ? Math.round((singlePageVisits / uniqueVisitors) * 100) : 0;

  // 2. Avg Session Duration Calculation
  // Group visits by IP
  const sessions = {};
  visits.forEach(v => {
    if (!sessions[v.ip]) {
      sessions[v.ip] = [];
    }
    sessions[v.ip].push(new Date(v.createdAt).getTime());
  });

  let totalDurationMs = 0;
  let sessionCount = 0;

  Object.values(sessions).forEach(times => {
    // Sort times ascending
    times.sort((a, b) => a - b);
    
    // Group timestamps into sessions with max 30 mins gap
    let currentSessionStart = times[0];
    let currentSessionLast = times[0];

    for (let i = 1; i < times.length; i++) {
      if (times[i] - currentSessionLast < 30 * 60 * 1000) {
        currentSessionLast = times[i];
      } else {
        // session ended, add duration
        totalDurationMs += (currentSessionLast - currentSessionStart);
        sessionCount += 1;
        currentSessionStart = times[i];
        currentSessionLast = times[i];
      }
    }
    // add final session
    totalDurationMs += (currentSessionLast - currentSessionStart);
    sessionCount += 1;
  });

  const avgDurationSeconds = sessionCount > 0 ? Math.round((totalDurationMs / 1000) / sessionCount) : 0;

  return { avgDurationSeconds, bounceRate };
}

export async function GET(request) {
  try {
    await connectMongoDB();

    // 1. Authorize - must be logged in admin
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findOne({ email: session.user.email }).lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse URL parameters
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "7d"; // today, 7d, 30d, custom
    const deviceParam = searchParams.get("device") || "all";
    const pathQuery = searchParams.get("path") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const startParam = searchParams.get("startDate");
    const endParam = searchParams.get("endDate");

    // 3. Determine current period dates
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date(now);

    if (range === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (range === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (range === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (range === "custom" && startParam && endParam) {
      startDate = new Date(startParam);
      endDate = new Date(endParam);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    // 4. Calculate previous period dates for comparison metrics
    const diffTime = Math.abs(endDate - startDate);
    const prevStartDate = new Date(startDate.getTime() - diffTime);
    const prevEndDate = new Date(startDate.getTime() - 1);

    // 5. Build query filters
    const matchStage = {
      createdAt: { $gte: startDate, $lte: endDate },
    };

    const prevMatchStage = {
      createdAt: { $gte: prevStartDate, $lte: prevEndDate },
    };

    if (deviceParam !== "all") {
      matchStage.device = deviceParam;
      prevMatchStage.device = deviceParam;
    }

    if (pathQuery) {
      matchStage.path = { $regex: pathQuery, $options: "i" };
      prevMatchStage.path = { $regex: pathQuery, $options: "i" };
    }

    // 6. Query system database counts for admin overview cards
    const [totalUsers, totalStories, totalPodcasts, totalMusic, totalFeedbacks, totalComments] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments(),
      Podcast.countDocuments(),
      Music.countDocuments(),
      Feedback.countDocuments(),
      Comment.countDocuments()
    ]);

    // 7. Fetch current period traffic data from MongoDB
    const realVisitsCount = await Visit.countDocuments(matchStage);
    let realVisits = [];
    if (realVisitsCount > 0) {
      realVisits = await Visit.find(matchStage)
        .populate("user", "name email photo role")
        .sort({ createdAt: -1 })
        .lean();
    }

    // 8. Fetch previous period traffic counts for calculations
    const prevPageviewsCount = await Visit.countDocuments(prevMatchStage);
    const prevUniqueVisitors = (await Visit.distinct("ip", prevMatchStage)).length;
    let prevVisits = [];
    if (prevPageviewsCount > 0) {
      prevVisits = await Visit.find(prevMatchStage).lean();
    }

    // 9. Compute Metrics
    const totalPageviews = realVisits.length;
    const uniqueIPs = new Set(realVisits.map(v => v.ip));
    const uniqueVisitors = uniqueIPs.size;

    const { avgDurationSeconds, bounceRate } = calculateDurationsAndBounceRate(realVisits);
    const { avgDurationSeconds: prevAvgDurationSecs, bounceRate: prevBounceRate } = calculateDurationsAndBounceRate(prevVisits);

    // Format Duration
    const formatDuration = (secs) => {
      if (secs === 0) return "0s";
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return m > 0 ? `${m}m ${s}s` : `${s}s`;
    };
    const avgDurationStr = formatDuration(avgDurationSeconds);

    // Compute Percentage Changes
    const getPercentChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 1000) / 10;
    };

    const pageviewsChange = getPercentChange(totalPageviews, prevPageviewsCount);
    const visitorsChange = getPercentChange(uniqueVisitors, prevUniqueVisitors);
    const bounceChange = getPercentChange(bounceRate, prevBounceRate);
    const durationChange = getPercentChange(avgDurationSeconds, prevAvgDurationSecs);

    // 10. Aggregations: Pageviews Over Time (grouped by date)
    const dailyDataMap = {};
    
    // Initialise dates in range with 0 to ensure continuous chart lines
    const dateCursor = new Date(startDate);
    while (dateCursor <= endDate) {
      const dateStr = dateCursor.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      dailyDataMap[dateStr] = { date: dateStr, pageviews: 0, visitors: new Set() };
      dateCursor.setDate(dateCursor.getDate() + 1);
    }
    
    // Populate values
    realVisits.forEach(v => {
      const dateStr = new Date(v.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (dailyDataMap[dateStr]) {
        dailyDataMap[dateStr].pageviews += 1;
        dailyDataMap[dateStr].visitors.add(v.ip);
      }
    });

    const visitsOverTime = Object.values(dailyDataMap).map(d => ({
      date: d.date,
      pageviews: d.pageviews,
      visitors: d.visitors.size
    }));

    // 11. Top Pages
    const pagesMap = {};
    realVisits.forEach(v => {
      pagesMap[v.path] = (pagesMap[v.path] || 0) + 1;
    });
    const topPages = Object.entries(pagesMap)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 12. Top Countries
    const countriesMap = {};
    realVisits.forEach(v => {
      if (!countriesMap[v.country]) {
        countriesMap[v.country] = { name: v.country, code: v.countryCode, count: 0, visitors: new Set() };
      }
      countriesMap[v.country].count += 1;
      countriesMap[v.country].visitors.add(v.ip);
    });
    const topCountries = Object.values(countriesMap)
      .map(c => ({
        name: c.name,
        code: c.code,
        count: c.count,
        visitors: c.visitors.size,
        percentage: Math.round((c.count / (totalPageviews || 1)) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // 13. Devices & Browsers Distribution
    const devicesMap = { desktop: 0, mobile: 0, tablet: 0 };
    const browsersMap = {};
    
    realVisits.forEach(v => {
      if (devicesMap[v.device] !== undefined) {
        devicesMap[v.device] += 1;
      }
      browsersMap[v.browser] = (browsersMap[v.browser] || 0) + 1;
    });

    const topDevices = Object.entries(devicesMap).map(([device, count]) => ({
      name: device,
      count,
      percentage: totalPageviews > 0 ? Math.round((count / totalPageviews) * 100) : 0
    }));

    const topBrowsers = Object.entries(browsersMap)
      .map(([browser, count]) => ({
        name: browser,
        count,
        percentage: totalPageviews > 0 ? Math.round((count / totalPageviews) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    // 14. Pagination for logs
    const totalLogs = realVisits.length;
    const totalPages = Math.ceil(totalLogs / limit);
    const paginatedLogs = realVisits.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalStories,
          totalPodcasts,
          totalMusic,
          totalFeedbacks,
          totalComments
        },
        metrics: {
          pageviews: { value: totalPageviews, change: pageviewsChange },
          visitors: { value: uniqueVisitors, change: visitorsChange },
          bounceRate: { value: bounceRate, change: bounceChange },
          avgDuration: { value: { label: avgDurationStr, seconds: avgDurationSeconds }, change: durationChange }
        },
        visitsOverTime,
        topPages,
        topCountries,
        topDevices,
        topBrowsers,
        logs: {
          records: paginatedLogs,
          pagination: {
            page,
            limit,
            totalPages,
            totalLogs
          }
        }
      }
    });

  } catch (error) {
    console.error("Error retrieving stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
