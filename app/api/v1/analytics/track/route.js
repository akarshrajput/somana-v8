import { NextResponse } from "next/server";
import axios from "axios";
import connectMongoDB from "@/app/_lib/mongodb";
import Visit from "@/app/_models/visitModel";
import { auth } from "@/app/_lib/auth";

// Simple User Agent Parser
function parseUserAgent(ua) {
  if (!ua) {
    return { device: "desktop", browser: "Unknown", os: "Unknown" };
  }

  const uaLower = ua.toLowerCase();
  
  // 1. Device Type
  let device = "desktop";
  if (/ipad|tablet|playbook|silk/.test(uaLower)) {
    device = "tablet";
  } else if (/mobi|android|iphone|ipod|blackberry|iemobile|opera mini/.test(uaLower)) {
    device = "mobile";
  }

  // 2. OS Detection
  let os = "Other";
  if (uaLower.includes("windows")) os = "Windows";
  else if (uaLower.includes("macintosh") || uaLower.includes("mac os x")) os = "macOS";
  else if (/iphone|ipad|ipod/.test(uaLower)) os = "iOS";
  else if (uaLower.includes("android")) os = "Android";
  else if (uaLower.includes("linux")) os = "Linux";

  // 3. Browser Detection
  let browser = "Other";
  if (/edg\//.test(uaLower)) browser = "Edge";
  else if (/opr\/|opera/.test(uaLower)) browser = "Opera";
  else if (/chrome|crios/.test(uaLower)) browser = "Chrome";
  else if (/firefox|fxios/.test(uaLower)) browser = "Firefox";
  else if (/safari/.test(uaLower) && !/chrome|crios|artemis/.test(uaLower)) browser = "Safari";

  return { device, browser, os };
}

export async function POST(request) {
  try {
    await connectMongoDB();
    
    // Check if user is logged in (optional association)
    const session = await auth();
    const userId = session?.user?.userId || null;

    const body = await request.json();
    const { path, referrer } = body;

    if (!path) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 });
    }

    // Get User Agent
    const ua = request.headers.get("user-agent") || "";
    const { device, browser, os } = parseUserAgent(ua);

    // Get Client IP
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Geolocation Lookup via ipinfo.io
    let country = "India";
    let countryCode = "IN";
    let city = "Mumbai";

    // For localhost / local testing, use a mock IP to fetch realistic data or randomize mock geolocation
    let ipToLookup = ip;
    if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost" || ip.startsWith("10.") || ip.startsWith("192.168.")) {
      // Array of realistic sample client IPs from different countries
      const sampleIps = [
        { ip: "103.15.250.1", country: "India", code: "IN", city: "Mumbai" },
        { ip: "8.8.8.8", country: "United States", code: "US", city: "Mountain View" },
        { ip: "82.165.197.124", country: "Germany", code: "DE", city: "Karlsruhe" },
        { ip: "109.110.128.0", country: "United Kingdom", code: "GB", city: "London" },
        { ip: "210.140.10.0", country: "Japan", code: "JP", city: "Tokyo" },
        { ip: "14.136.0.0", country: "Hong Kong", code: "HK", city: "Hong Kong" },
        { ip: "200.120.0.0", country: "Chile", code: "CL", city: "Santiago" },
        { ip: "1.1.1.1", country: "Australia", code: "AU", city: "Sydney" },
        { ip: "197.210.0.0", country: "Nigeria", code: "NG", city: "Lagos" },
        { ip: "177.126.0.0", country: "Brazil", code: "BR", city: "Sao Paulo" }
      ];
      // Pick a random sample IP
      const selected = sampleIps[Math.floor(Math.random() * sampleIps.length)];
      ipToLookup = selected.ip;
      country = selected.country;
      countryCode = selected.code;
      city = selected.city;
    }

    try {
      // Use existing token from geo/route.js
      const response = await axios.get(
        `https://ipinfo.io/${ipToLookup}/json?token=7ba5dd09527cf4`,
        { timeout: 3000 }
      );
      if (response.data) {
        city = response.data.city || city;
        // Translate country code to country name
        countryCode = response.data.country || countryCode;
        
        // Simple country code mapping
        const countriesMap = {
          "IN": "India",
          "US": "United States",
          "DE": "Germany",
          "GB": "United Kingdom",
          "JP": "Japan",
          "HK": "Hong Kong",
          "CL": "Chile",
          "AU": "Australia",
          "NG": "Nigeria",
          "BR": "Brazil",
          "FR": "France",
          "CA": "Canada",
          "SG": "Singapore"
        };
        country = countriesMap[countryCode] || response.data.country || country;
      }
    } catch (geoError) {
      console.warn("Geolocation lookup failed, using fallback:", geoError.message);
    }

    // Save Visit
    const visit = await Visit.create({
      path,
      referrer: referrer || "Direct",
      country,
      countryCode,
      city,
      device,
      browser,
      os,
      ip,
      user: userId,
    });

    return NextResponse.json({ success: true, visitId: visit._id });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
