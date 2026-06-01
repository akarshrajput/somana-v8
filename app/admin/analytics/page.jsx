"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  Laptop, 
  Smartphone, 
  Tablet, 
  RefreshCw, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// Country Flag Emoji Resolver
function getFlagEmoji(countryCode) {
  if (!countryCode) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  try {
    return String.fromCodePoint(...codePoints);
  } catch (e) {
    return "🌐";
  }
}

export default function AdminAnalyticsPage() {
  // Query Filters State
  const [range, setRange] = useState("7d");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [pathSearch, setPathSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  // Hover State for SVG Chart tooltip
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Fetch Stats from API
  const fetchStats = async () => {
    setLoading(true);
    try {
      let url = `/api/v1/analytics/stats?range=${range}&device=${deviceFilter}&path=${encodeURIComponent(pathSearch)}&page=${page}&limit=${limit}`;
      if (range === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      const res = await axios.get(url);
      if (res.data.success) {
        setStats(res.data.data);
      } else {
        toast.error("Failed to load statistics");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast.error(err.response?.data?.error || "Error loading dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [range, deviceFilter, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStats();
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (!stats?.logs?.records || stats.logs.records.length === 0) {
      toast.error("No visitor log data available to export");
      return;
    }
    
    // Header row
    const headers = ["Timestamp", "IP Address", "Path", "Referrer", "Country", "City", "Device", "OS", "Browser"];
    
    // Data rows
    const rows = stats.logs.records.map(r => [
      new Date(r.createdAt).toLocaleString(),
      r.ip,
      r.path,
      r.referrer,
      r.country,
      r.city,
      r.device,
      r.os,
      r.browser
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `somana_analytics_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV export downloaded successfully!");
  };

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;
  
  const getChartPoints = (data, key) => {
    if (!data || data.length === 0) return { linePath: "", areaPath: "", points: [] };
    
    const maxVal = Math.max(...data.map(d => d[key]), 10);
    const widthActive = chartWidth - paddingLeft - paddingRight;
    const heightActive = chartHeight - paddingTop - paddingBottom;
    
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1 || 1)) * widthActive + paddingLeft;
      const y = chartHeight - paddingBottom - (d[key] / maxVal) * heightActive;
      return { x, y, value: d[key], date: d.date, visitors: d.visitors };
    });
    
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingBottom} L ${points[0].x} ${chartHeight - paddingBottom} Z` 
      : "";
      
    return { linePath, areaPath, points };
  };

  const chartData = stats?.visitsOverTime || [];
  const pageviewsChart = getChartPoints(chartData, "pageviews");
  const visitorsChart = getChartPoints(chartData, "visitors");

  return (
    <div className="flex-1 space-y-6 pb-12">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Analytics</h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-semibold">
              <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Monitoring
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-1">Real-time portal traffic and user engagement insights.</p>
        </div>
        
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={fetchStats}
            className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-stone-600 transition"
            title="Refresh statistics"
          >
            <RefreshCw size={16} className={loading ? "animate-spin text-stone-400" : ""} />
          </button>
          
          <select 
            value={range} 
            onChange={(e) => { setRange(e.target.value); setPage(1); }}
            className="p-2 text-sm font-medium border border-stone-200 rounded-lg bg-white shadow-xs focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-700"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>
      </div>

      {/* Custom Date Picker row */}
      {range === "custom" && (
        <div className="bg-white p-4 border border-stone-200 rounded-xl flex flex-wrap gap-4 items-end shadow-xs animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500">Start Date</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 text-stone-800"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500">End Date</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-stone-200 rounded-lg text-sm bg-stone-50 text-stone-800"
            />
          </div>
          <button 
            onClick={() => { setPage(1); fetchStats(); }}
            className="p-2 px-4 text-sm font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition"
          >
            Apply Dates
          </button>
        </div>
      )}

      {loading && !stats ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="size-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-500">Retrieving system-wide analytics data...</p>
        </div>
      ) : (
        <>
          {/* 2. Overview Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Pageviews */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pageviews</p>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">{stats?.metrics?.pageviews?.value?.toLocaleString()}</h3>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                <span>{stats?.metrics?.pageviews?.change}%</span>
                <span className="text-stone-400 font-normal">vs prev period</span>
              </div>
              <TrendingUp className="absolute right-4 top-4 size-5 text-stone-300" />
            </div>

            {/* Card 2: Unique Visitors */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Unique Visitors</p>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">{stats?.metrics?.visitors?.value?.toLocaleString()}</h3>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                <span>{stats?.metrics?.visitors?.change}%</span>
                <span className="text-stone-400 font-normal">vs prev period</span>
              </div>
              <Users className="absolute right-4 top-4 size-5 text-stone-300" />
            </div>

            {/* Card 3: Avg. Session Duration */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Avg. Session Duration</p>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">{stats?.metrics?.avgDuration?.value?.label}</h3>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowUpRight size={14} />
                <span>{stats?.metrics?.avgDuration?.change}%</span>
                <span className="text-stone-400 font-normal">vs prev period</span>
              </div>
              <Clock className="absolute right-4 top-4 size-5 text-stone-300" />
            </div>

            {/* Card 4: Bounce Rate */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[110px]">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Bounce Rate</p>
                <h3 className="text-2xl font-extrabold text-stone-900 mt-1">{stats?.metrics?.bounceRate?.value}%</h3>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <ArrowDownRight size={14} className="text-emerald-600" />
                <span>{stats?.metrics?.bounceRate?.change}%</span>
                <span className="text-stone-400 font-normal">improvement</span>
              </div>
              <div className="absolute right-4 top-4 size-1.5 bg-stone-300 rounded-full" />
            </div>
          </div>

          {/* 3. Chart & Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Traffic Trend Chart */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Traffic Trend</h3>
                    <p className="text-xs text-stone-400">Total views and visitors charted over time.</p>
                  </div>
                  <div className="flex gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-stone-700">
                      <span className="size-2 bg-stone-900 rounded-full" />
                      Pageviews
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-450">
                      <span className="size-2 bg-indigo-500 rounded-full" />
                      Unique Visitors
                    </div>
                  </div>
                </div>

                {chartData.length === 0 ? (
                  <div className="h-[220px] flex items-center justify-center text-xs text-stone-400 font-medium">
                    No data points to chart in this range.
                  </div>
                ) : (
                  <div className="relative">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible">
                      <defs>
                        <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1c1917" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#1c1917" stopOpacity="0.0" />
                        </linearGradient>
                        <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {chartData.map((d, i) => {
                        const shouldRenderLabel = chartData.length <= 10 || i % Math.ceil(chartData.length / 8) === 0;
                        const x = (i / (chartData.length - 1 || 1)) * (chartWidth - paddingLeft - paddingRight) + paddingLeft;
                        
                        return (
                          <g key={i}>
                            {shouldRenderLabel && (
                              <>
                                <line 
                                  x1={x} 
                                  y1={paddingTop} 
                                  x2={x} 
                                  y2={chartHeight - paddingBottom} 
                                  stroke="#f4f4f5" 
                                  strokeWidth="1.5" 
                                />
                                <text 
                                  x={x} 
                                  y={chartHeight - paddingBottom + 20} 
                                  textAnchor="middle" 
                                  fill="#a1a1aa" 
                                  fontSize="10" 
                                  fontWeight="600"
                                >
                                  {d.date}
                                </text>
                              </>
                            )}
                          </g>
                        );
                      })}

                      {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                        const y = chartHeight - paddingBottom - ratio * (chartHeight - paddingTop - paddingBottom);
                        const maxVal = Math.max(...chartData.map(d => d.pageviews), 10);
                        const labelValue = Math.round(ratio * maxVal);
                        
                        return (
                          <g key={idx}>
                            <line 
                              x1={paddingLeft} 
                              y1={y} 
                              x2={chartWidth - paddingRight} 
                              y2={y} 
                              stroke="#f4f4f5" 
                              strokeWidth="1.5" 
                            />
                            <text 
                              x={paddingLeft - 12} 
                              y={y + 3.5} 
                              textAnchor="end" 
                              fill="#a1a1aa" 
                              fontSize="10" 
                              fontWeight="600"
                            >
                              {labelValue}
                            </text>
                          </g>
                        );
                      })}

                      <path d={visitorsChart.areaPath} fill="url(#visitorsGrad)" />
                      <path d={pageviewsChart.areaPath} fill="url(#viewsGrad)" />

                      <path 
                        d={visitorsChart.linePath} 
                        fill="none" 
                        stroke="#6366f1" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      <path 
                        d={pageviewsChart.linePath} 
                        fill="none" 
                        stroke="#1c1917" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />

                      {pageviewsChart.points.map((p, i) => (
                        <g key={i}>
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="12" 
                            fill="transparent" 
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPoint({
                              x: p.x,
                              y: p.y,
                              date: p.date,
                              pageviews: p.value,
                              visitors: p.visitors
                            })}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                          <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r="4" 
                            fill="#1c1917" 
                            stroke="#ffffff" 
                            strokeWidth="1.5" 
                            className="pointer-events-none" 
                          />
                        </g>
                      ))}
                    </svg>

                    {hoveredPoint && (
                      <div 
                        className="absolute bg-stone-900 text-white p-3 rounded-lg shadow-xl text-xs space-y-1.5 z-40 pointer-events-none w-36 border border-stone-800"
                        style={{ 
                          left: `${(hoveredPoint.x / chartWidth) * 100}%`, 
                          top: `${(hoveredPoint.y / chartHeight) * 100 - 30}%`, 
                          transform: "translate(-50%, -100%)" 
                        }}
                      >
                        <p className="font-bold border-b border-stone-800 pb-1 text-[10px] text-stone-400 uppercase tracking-wider">{hoveredPoint.date}</p>
                        <div className="flex justify-between">
                          <span className="text-stone-300">Views:</span>
                          <span className="font-extrabold">{hoveredPoint.pageviews}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-300">Visitors:</span>
                          <span className="font-extrabold text-indigo-400">{hoveredPoint.visitors}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Device and Browser Breakdown Card */}
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Devices & Browsers</h3>
                <p className="text-xs text-stone-400 mb-5">Traffic distribution across user technologies.</p>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1 text-stone-700">
                      <span>Devices</span>
                    </div>
                    <div className="flex h-3.5 w-full rounded-full overflow-hidden bg-stone-100 mt-2">
                      {stats?.topDevices?.map((device, idx) => {
                        const colors = {
                          "desktop": "bg-indigo-500",
                          "mobile": "bg-emerald-500",
                          "tablet": "bg-amber-500"
                        };
                        const colorClass = colors[device.name] || "bg-stone-500";
                        if (device.percentage === 0) return null;
                        
                        return (
                          <div 
                            key={device.name}
                            className={`${colorClass} transition-all`} 
                            style={{ width: `${device.percentage}%` }}
                            title={`${device.name}: ${device.percentage}%`}
                          />
                        );
                      })}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mt-3 text-[10px] font-bold uppercase tracking-wider text-stone-550">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 bg-indigo-500 rounded-full" />
                        <span>Desk ({stats?.topDevices?.find(d => d.name === "desktop")?.percentage || 0}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 bg-emerald-500 rounded-full" />
                        <span>Mobi ({stats?.topDevices?.find(d => d.name === "mobile")?.percentage || 0}%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 bg-amber-500 rounded-full" />
                        <span>Tab ({stats?.topDevices?.find(d => d.name === "tablet")?.percentage || 0}%)</span>
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-100" />

                  <div className="space-y-3 mt-4">
                    <p className="text-xs font-semibold text-stone-700">Browsers</p>
                    {stats?.topBrowsers?.map((browser) => (
                      <div key={browser.name} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-stone-600">
                          <span>{browser.name}</span>
                          <span>{browser.percentage}%</span>
                        </div>
                        <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-stone-900 rounded-full transition-all" 
                            style={{ width: `${browser.percentage}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Top Pages & Country breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">Top Pages</h3>
                    <p className="text-xs text-stone-400">Most visited paths on the website.</p>
                  </div>
                  <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                    <input 
                      type="text" 
                      placeholder="Filter path..." 
                      value={pathSearch}
                      onChange={(e) => setPathSearch(e.target.value)}
                      className="p-1 px-2.5 pr-8 border border-stone-200 rounded-lg text-xs w-40 bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-850"
                    />
                    <button type="submit" className="absolute right-2 text-stone-455 hover:text-stone-700">
                      <Search size={12} />
                    </button>
                  </form>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        <th className="py-2.5">Page Path</th>
                        <th className="py-2.5 text-right">Pageviews</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-600">
                      {stats?.topPages?.map((page, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50 transition">
                          <td className="py-3 font-semibold text-stone-800 break-all">{page.path}</td>
                          <td className="py-3 text-right font-extrabold text-stone-900">{page.count.toLocaleString()}</td>
                        </tr>
                      ))}
                      {(!stats?.topPages || stats.topPages.length === 0) && (
                        <tr>
                          <td colSpan="2" className="py-8 text-center text-stone-400">No active pages found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Top Countries</h3>
                <p className="text-xs text-stone-400 mb-4">Traffic sources grouped by geographical region.</p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                        <th className="py-2.5">Country</th>
                        <th className="py-2.5 text-right">Views</th>
                        <th className="py-2.5 text-right">Unique Visitors</th>
                        <th className="py-2.5 text-right">Share</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-600">
                      {stats?.topCountries?.map((country, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50 transition">
                          <td className="py-3 flex items-center gap-2 font-semibold text-stone-850">
                            <span className="text-base">{getFlagEmoji(country.code)}</span>
                            <span>{country.name}</span>
                          </td>
                          <td className="py-3 text-right font-extrabold text-stone-900">{country.count.toLocaleString()}</td>
                          <td className="py-3 text-right text-stone-500">{country.visitors.toLocaleString()}</td>
                          <td className="py-3 text-right font-semibold text-emerald-600">{country.percentage}%</td>
                        </tr>
                      ))}
                      {(!stats?.topCountries || stats.topCountries.length === 0) && (
                        <tr>
                          <td colSpan="4" className="py-8 text-center text-stone-400">No geographic traffic logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Visitors Detailed Logs Table */}
          <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Visitor Log</h3>
                <p className="text-xs text-stone-400">Raw log of requests received on monitored pages.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={deviceFilter}
                  onChange={(e) => { setDeviceFilter(e.target.value); setPage(1); }}
                  className="p-1.5 text-xs font-semibold border border-stone-200 rounded-lg bg-stone-50 text-stone-700"
                >
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop Only</option>
                  <option value="mobile">Mobile Only</option>
                  <option value="tablet">Tablet Only</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 p-1.5 px-3 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-xs"
                >
                  <Download size={13} />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/50">
                    <th className="p-4 py-3">Time</th>
                    <th className="p-4 py-3">IP Address</th>
                    <th className="p-4 py-3">User Profile</th>
                    <th className="p-4 py-3">Page Visited</th>
                    <th className="p-4 py-3">Referrer</th>
                    <th className="p-4 py-3">Geo Location</th>
                    <th className="p-4 py-3">User Agent Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-600">
                  {stats?.logs?.records?.map((record) => (
                    <tr key={record._id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4 py-3.5 text-stone-500 whitespace-nowrap">
                        {new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <span className="block text-[10px] text-stone-400 font-semibold">{new Date(record.createdAt).toLocaleDateString()}</span>
                      </td>
                      
                      <td className="p-4 py-3.5 font-mono text-stone-800 whitespace-nowrap">
                        {record.ip}
                      </td>

                      <td className="p-4 py-3.5 whitespace-nowrap">
                        {record.user ? (
                          <div className="flex items-center gap-2">
                            <img src={record.user.photo} alt="Avatar" className="size-6 rounded-full border" />
                            <div>
                              <span className="font-semibold text-stone-850 block leading-tight">{record.user.name}</span>
                              <span className="text-[10px] text-stone-400 block mt-0.5 capitalize">{record.user.role}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-stone-400 italic">Guest Visitor</span>
                        )}
                      </td>

                      <td className="p-4 py-3.5 break-all max-w-[200px]">
                        <span className="font-semibold text-stone-850 p-1 px-1.5 bg-stone-50 border border-stone-100 rounded text-[11px] font-mono select-all">
                          {record.path}
                        </span>
                      </td>

                      <td className="p-4 py-3.5 truncate max-w-[120px]" title={record.referrer}>
                        {record.referrer}
                      </td>

                      <td className="p-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{getFlagEmoji(record.countryCode)}</span>
                          <div>
                            <span className="font-semibold text-stone-800 block leading-tight">{record.city || "Unknown"}</span>
                            <span className="text-[10px] text-stone-400 block mt-0.5">{record.country}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 py-3.5 whitespace-nowrap text-stone-500">
                        <div className="flex items-center gap-3">
                          <div className="p-1 bg-stone-100 text-stone-600 rounded">
                            {record.device === "mobile" && <Smartphone size={13} />}
                            {record.device === "tablet" && <Tablet size={13} />}
                            {record.device === "desktop" && <Laptop size={13} />}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-800 block leading-tight">{record.browser}</span>
                            <span className="text-[10px] text-stone-450 block mt-0.5">{record.os}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {(!stats?.logs?.records || stats.logs.records.length === 0) && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-stone-400">No log entries matched selected filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {stats?.logs?.pagination && stats.logs.pagination.totalPages > 1 && (
              <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/20 text-xs">
                <span className="font-semibold text-stone-500">
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, stats.logs.pagination.totalLogs)} of {stats.logs.pagination.totalLogs} visits
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent font-medium flex items-center text-stone-750 transition"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>
                  {[...Array(stats.logs.pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === stats.logs.pagination.totalPages || Math.abs(pageNum - page) <= 1) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-2.5 py-1.5 rounded font-bold transition ${page === pageNum ? "bg-stone-900 text-white" : "border border-stone-200 hover:bg-stone-50 text-stone-750"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="text-stone-400 px-1 font-semibold">...</span>;
                    }
                    return null;
                  })}
                  <button
                    disabled={page >= stats.logs.pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent font-medium flex items-center text-stone-750 transition"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
