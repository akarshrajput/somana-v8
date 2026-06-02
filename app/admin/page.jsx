import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import Blog from "@/app/_models/blogModel";
import Podcast from "@/app/_models/podcastModel";
import Feedback from "@/app/_models/feedbackModel";
import Comment from "@/app/_models/commentModel";
import { 
  Users, 
  BookOpen, 
  Mic, 
  MessageSquare, 
  Heart,
  Calendar,
  Clock
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Overview — Somana",
  description: "Somana Organization Administrator Portal Overview",
};

export default async function AdminOverviewPage() {
  await connectMongoDB();

  // Query Database Counts
  const [
    totalUsers,
    totalStories,
    totalPodcasts,
    totalFeedbacks,
    totalComments
  ] = await Promise.all([
    User.countDocuments(),
    Blog.countDocuments(),
    Podcast.countDocuments(),
    Feedback.countDocuments(),
    Comment.countDocuments()
  ]);

  // Query Recent items
  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean();
  const recentStories = await Blog.find().sort({ createdAt: -1 }).limit(3).lean();
  const recentPodcasts = await Podcast.find().sort({ createdAt: -1 }).limit(3).lean();
  const recentFeedbacks = await Feedback.find().sort({ createdAt: -1 }).limit(3).lean();
  const recentComments = await Comment.find().sort({ createdAt: -1 }).limit(3).lean();

  const statCards = [
    { label: "Users", count: totalUsers, icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Stories", count: totalStories, icon: BookOpen, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Podcasts", count: totalPodcasts, icon: Mic, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Feedback", count: totalFeedbacks, icon: MessageSquare, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "Comments", count: totalComments, icon: Heart, color: "text-cyan-600 bg-cyan-50 border-cyan-100" }
  ];

  return (
    <div className="flex-1 space-y-8 pb-12 text-stone-800">
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">System Overview</h1>
        <p className="text-sm text-stone-500 mt-1">General statistics, database status, and recent contributions.</p>
      </div>

      {/* Grid of total statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-5 border border-stone-200 rounded-xl shadow-xs flex flex-col justify-between hover:border-stone-300 transition duration-200">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{card.label}</p>
                <div className={`p-1.5 rounded-lg border ${card.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-stone-900 mt-4 leading-none">{card.count}</h3>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grid split in two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Users */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Recent User Registrations</h3>
            <p className="text-xs text-stone-400 mb-4">Latest member signups on the platform.</p>
            <div className="divide-y divide-stone-100">
              {recentUsers.map((user) => (
                <div key={user._id.toString()} className="py-3 flex items-center gap-3">
                  <img 
                    src={user.photo || "https://avatar.iran.liara.run/public"} 
                    alt={user.name} 
                    className="size-9 rounded-full border border-stone-200 object-cover" 
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-900 truncate leading-tight">{user.name}</p>
                    <p className="text-[10px] text-stone-400 truncate mt-0.5">{user.email}</p>
                  </div>
                  <div className="text-[10px] text-stone-400 font-semibold whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="text-xs text-stone-400 py-6 text-center">No users registered yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Middle Column: Recent Content */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs p-5 flex flex-col justify-between lg:col-span-2">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Latest Uploads</h3>
            <p className="text-xs text-stone-400 mb-4">Most recent stories, podcasts, and tracks added by creators.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    <th className="pb-2.5">Title</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-600">
                  {[
                    ...recentStories.map(s => ({ title: s.title, type: "Story", date: s.createdAt, id: s._id })),
                    ...recentPodcasts.map(p => ({ title: p.title, type: "Podcast", date: p.createdAt, id: p._id }))
                  ]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .slice(0, 6)
                    .map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50 transition">
                        <td className="py-3 font-semibold text-stone-800 truncate max-w-[200px]" title={item.title}>{item.title}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            item.type === "Story" ? "bg-amber-50 text-amber-700 border-amber-100" :
                            "bg-emerald-50 text-emerald-700 border-emerald-100"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="py-3 text-stone-400">{new Date(item.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  {recentStories.length === 0 && recentPodcasts.length === 0 && (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-stone-400">No content uploaded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks and Comments Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Feedbacks */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs p-5">
          <h3 className="font-bold text-stone-900 text-sm">Recent Feedback Messages</h3>
          <p className="text-xs text-stone-400 mb-4">Latest inquiries sent through the contact form.</p>
          <div className="space-y-3.5 divide-y divide-stone-50">
            {recentFeedbacks.map((fb, idx) => (
              <div key={fb._id.toString()} className={`pt-3.5 ${idx === 0 ? "pt-0 border-t-0" : ""}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-stone-800">{fb.name}</span>
                    <span className="text-[10px] text-stone-400 ml-2">{fb.email}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{new Date(fb.createdAt || fb.date).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1 italic leading-relaxed line-clamp-2">
                  "{fb.message || fb.text}"
                </p>
              </div>
            ))}
            {recentFeedbacks.length === 0 && (
              <p className="text-xs text-stone-400 py-6 text-center">No feedback received yet.</p>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-white border border-stone-200 rounded-xl shadow-xs p-5">
          <h3 className="font-bold text-stone-900 text-sm">Recent Comments</h3>
          <p className="text-xs text-stone-400 mb-4">Active discussions across stories and media.</p>
          <div className="space-y-3.5 divide-y divide-stone-50">
            {recentComments.map((comment, idx) => (
              <div key={comment._id.toString()} className={`pt-3.5 ${idx === 0 ? "pt-0 border-t-0" : ""}`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-stone-800 capitalize">
                    {comment.authorName || comment.user?.name || "Guest Commenter"}
                  </span>
                  <span className="text-[10px] text-stone-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-stone-505 mt-1 leading-relaxed line-clamp-2">
                  {comment.content || comment.text}
                </p>
              </div>
            ))}
            {recentComments.length === 0 && (
              <p className="text-xs text-stone-450 py-6 text-center">No comments posted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
