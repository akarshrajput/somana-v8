import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";

export async function generateMetadata() {
  await connectMongoDB();
  
  const rootFolders = await Note.find({ parent: null }).select("name category").lean();
  
  const collegeNames = rootFolders.filter(f => f.category === "Colleges").map(f => f.name).join(", ");
  const courseNames = rootFolders.filter(f => f.category === "Courses").map(f => f.name).join(", ");
  const dynamicKeywords = rootFolders.map(f => `${f.name} notes`).join(", ");

  return {
    title: "Notes & Study Materials — Somana",
    description: `Explore a comprehensive collection of college notes, engineering materials, and course study guides. Find structured content for ${collegeNames || "top colleges"} including ${courseNames || "various courses"}.`,
    keywords: `college notes, engineering notes, study materials, computer science notes, somana notes, ${dynamicKeywords}`,
    alternates: {
      canonical: "https://www.somana.in/notes",
    },
    openGraph: {
      title: "Notes & Study Materials | Somana",
      description: `Free notes and study materials for ${collegeNames || "top colleges"}.`,
      type: "website",
      url: "https://www.somana.in/notes",
    },
  };
}

export default async function NotesPage() {
  await connectMongoDB();

  // Fetch root folders (parent is null) grouped by category
  const [colleges, courses, others] = await Promise.all([
    Note.find({ parent: null, category: "Colleges" }).sort({ createdAt: -1 }).limit(16).lean(),
    Note.find({ parent: null, category: "Courses" }).sort({ createdAt: -1 }).limit(16).lean(),
    Note.find({ parent: null, category: "Other" }).sort({ createdAt: -1 }).limit(16).lean(),
  ]);

  const renderSection = (title, items, exploreLink) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6 border-b border-stone-200 pb-2">
          <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
          <Link href={exploreLink} className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition">
            Explore all {title.toLowerCase()} <ArrowRight size={14} />
          </Link>
        </div>
        
        {/* 8-column grid for large screens, scaling down for smaller screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {items.map((folder) => (
            <Link 
              key={folder._id.toString()} 
              href={`/notes/folder/${folder.slug}`}
              className="group flex flex-col items-center p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition text-center"
            >
              <div className="bg-blue-50 text-blue-500 p-3 rounded-xl group-hover:scale-110 transition duration-300 mb-3">
                <Folder size={32} fill="currentColor" className="opacity-20 absolute" />
                <Folder size={32} className="relative z-10" />
              </div>
              <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-tight group-hover:text-black">
                {folder.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>
    );
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Notes & Study Materials",
    "description": "A comprehensive directory of free college notes, previous year papers, and study materials.",
    "url": "https://www.somana.in/notes",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-stone-50/50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        
        {/* Header Hero */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-4">
            Notes & Study Materials
          </h1>
          <p className="text-stone-600">
            Access a highly curated, structured directory of college notes, engineering resources, and course materials. 
            Navigate through the folders below to find exactly what you need.
          </p>
        </div>

        {/* Categories */}
        {renderSection("Colleges", colleges, "/notes/search?category=Colleges")}
        {renderSection("Courses", courses, "/notes/search?category=Courses")}
        {renderSection("Other Materials", others, "/notes/search?category=Other")}

      </div>
    </div>
    </>
  );
}
