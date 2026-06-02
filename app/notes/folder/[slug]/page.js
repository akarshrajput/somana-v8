import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Folder, File, ChevronRight, Home } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectMongoDB();
  const folder = await Note.findOne({ slug, type: "folder" }).lean();

  if (!folder) return { title: "Folder Not Found" };

  return {
    title: `${folder.name} Notes & Study Materials — Somana`,
    description: folder.description,
    keywords: folder.keywords,
    alternates: {
      canonical: `https://www.somana.in/notes/folder/${slug}`,
    },
    openGraph: {
      title: `${folder.name} Notes | Somana`,
      description: folder.description,
      type: "website",
      url: `https://www.somana.in/notes/folder/${slug}`,
    },
  };
}

// Helper to get breadcrumbs by recursively fetching parents (simplified approach for this version)
// In a highly nested system, a materialized path or recursive aggregation is better.
async function getBreadcrumbs(folderId) {
  const breadcrumbs = [];
  let currentId = folderId;
  
  // Prevent infinite loops just in case, max depth 10
  let depth = 0;
  while (currentId && depth < 10) {
    const node = await Note.findById(currentId).select("name slug parent").lean();
    if (!node) break;
    breadcrumbs.unshift(node);
    currentId = node.parent;
    depth++;
  }
  return breadcrumbs;
}

export default async function FolderPage({ params }) {
  const { slug } = await params;
  await connectMongoDB();

  // Find the current folder
  const currentFolder = await Note.findOneAndUpdate(
    { slug, type: "folder" },
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).lean();

  if (!currentFolder) {
    notFound();
  }

  // Find children (both folders and files)
  const children = await Note.find({ parent: currentFolder._id })
    .sort({ type: -1, createdAt: -1 }) // folders first, then files
    .lean();

  const breadcrumbs = await getBreadcrumbs(currentFolder._id);

  // SEO JSON-LD schema for a CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${currentFolder.name} Notes`,
    "description": currentFolder.description,
    "url": `https://www.somana.in/notes/folder/${slug}`,
    "keywords": currentFolder.keywords,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-stone-50/50 py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
            <Link href="/notes" className="hover:text-stone-900 flex items-center gap-1">
              <Home size={14} /> Notes Directory
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb._id.toString()}>
                <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                <Link 
                  href={`/notes/folder/${crumb.slug}`}
                  className={`hover:text-stone-900 truncate max-w-[150px] ${idx === breadcrumbs.length - 1 ? "font-semibold text-stone-800 pointer-events-none" : ""}`}
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          {/* Folder Header */}
          <div className="mb-10 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs flex items-start gap-4 md:gap-6">
            <div className="bg-blue-50 text-blue-500 p-4 rounded-xl hidden sm:block">
              <Folder size={48} fill="currentColor" className="opacity-20 absolute" />
              <Folder size={48} className="relative z-10" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight mb-2">
                {currentFolder.name}
              </h1>
              <p className="text-stone-600 leading-relaxed max-w-3xl">
                {currentFolder.description}
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded">
                  {children.length} Items
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-stone-100 text-stone-600 rounded">
                  {currentFolder.viewsCount} Views
                </span>
              </div>
            </div>
          </div>

          {/* Contents Grid */}
          {children.length === 0 ? (
            <div className="py-20 text-center bg-white border border-stone-200 rounded-2xl shadow-xs">
              <Folder size={64} className="mx-auto text-stone-200 mb-4" />
              <h3 className="text-lg font-medium text-stone-700">This folder is empty</h3>
              <p className="text-stone-500 mt-1">Check back later for new study materials.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {children.map((child) => (
                <Link
                  key={child._id.toString()}
                  href={child.type === "folder" ? `/notes/folder/${child.slug}` : `/notes/file/${child.slug}`}
                  className="group flex items-start gap-4 p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition"
                >
                  <div className={`p-2 rounded-lg flex-shrink-0 transition duration-300 group-hover:scale-110 ${child.type === "folder" ? "bg-blue-50 text-blue-500" : "bg-emerald-50 text-emerald-500"}`}>
                    {child.type === "folder" ? (
                      <>
                        <Folder size={24} fill="currentColor" className="opacity-20 absolute" />
                        <Folder size={24} className="relative z-10" />
                      </>
                    ) : (
                      <File size={24} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-tight group-hover:text-black">
                      {child.name}
                    </h3>
                    <p className="text-[10px] font-medium text-stone-400 uppercase tracking-wider mt-1">
                      {child.type}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
