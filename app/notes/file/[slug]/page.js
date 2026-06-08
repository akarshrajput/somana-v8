import React, { cache } from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, ChevronRight, Home, ExternalLink } from "lucide-react";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectMongoDB();
  const file = await Note.findOne({ slug, type: "file" }).lean();

  if (!file) return { title: "File Not Found" };

  const breadcrumbs = await getBreadcrumbs(file.parent);
  const breadcrumbNames = breadcrumbs.map((b) => b.name);
  const titlePath = [...breadcrumbNames, file.name].join(" > ");

  return {
    title: `${titlePath} — Study Material | Somana Notes`,
    description: file.description,
    keywords: file.keywords,
    alternates: {
      canonical: `https://www.somana.in/notes/file/${slug}`,
    },
    openGraph: {
      title: `${titlePath} | Somana Notes`,
      description: file.description,
      type: "article",
      url: `https://www.somana.in/notes/file/${slug}`,
    },
  };
}

const getBreadcrumbs = cache(async (folderId) => {
  const breadcrumbs = [];
  let currentId = folderId;
  let depth = 0;
  while (currentId && depth < 10) {
    const node = await Note.findById(currentId).select("name slug parent").lean();
    if (!node) break;
    breadcrumbs.unshift(node);
    currentId = node.parent;
    depth++;
  }
  return breadcrumbs;
});

export default async function FilePage({ params }) {
  const { slug } = await params;
  await connectMongoDB();

  // Find the current file
  const currentFile = await Note.findOneAndUpdate(
    { slug, type: "file" },
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).lean();

  if (!currentFile) {
    notFound();
  }

  const breadcrumbs = await getBreadcrumbs(currentFile.parent);

  // Fetch 5 other files for cross-linking SEO
  const recommendedFiles = await Note.find({
    type: "file",
    _id: { $ne: currentFile._id }
  })
    .select("name slug")
    .limit(5)
    .lean();

  // SEO JSON-LD schema for an Article/LearningResource
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "name": currentFile.name,
    "description": currentFile.description,
    "url": `https://www.somana.in/notes/file/${slug}`,
    "keywords": currentFile.keywords,
    "learningResourceType": "Study Guide",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-stone-50/50 py-8 flex flex-col">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 w-full flex-1 flex flex-col">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar shrink-0">
            <Link href="/notes" className="hover:text-stone-900 flex items-center gap-1">
              <Home size={14} /> Notes Directory
            </Link>
            {breadcrumbs.map((crumb) => (
              <React.Fragment key={crumb._id.toString()}>
                <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
                <Link
                  href={`/notes/folder/${crumb.slug}`}
                  className="hover:text-stone-900 truncate max-w-[150px]"
                >
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
            <ChevronRight size={14} className="text-stone-300 flex-shrink-0" />
            <span className="font-semibold text-stone-800 truncate max-w-[200px]">{currentFile.name}</span>
          </nav>

          {/* File Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 text-emerald-500 p-3 rounded-xl">
                <FileText size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-stone-900 tracking-tight leading-tight">
                  {currentFile.name}
                </h1>
                <p className="text-xs font-medium text-stone-500 mt-1">
                  {currentFile.viewsCount} Views • Study Material
                </p>
              </div>
            </div>
            <a
              href={currentFile.iframeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition shadow-sm shrink-0"
            >
              Open in full screen <ExternalLink size={16} />
            </a>
          </div>

          <div className="mb-6 shrink-0 max-w-4xl text-stone-600 text-sm leading-relaxed">
            {currentFile.description}
          </div>

          {/* Iframe Container */}
          <div className="flex-1 w-full bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden min-h-[600px] relative">
            {!currentFile.iframeUrl ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                <FileText size={48} className="mb-4 opacity-50" />
                <p>No preview available for this file.</p>
              </div>
            ) : (
              <iframe
                src={currentFile.iframeUrl.includes('drive.google.com') && !currentFile.iframeUrl.includes('preview')
                  ? currentFile.iframeUrl.replace('/view', '/preview')
                  : currentFile.iframeUrl}
                className="absolute inset-0 w-full h-full border-0 bg-stone-100"
                allow="autoplay"
                title={currentFile.name}
              />
            )}
          </div>

          {/* Recommended Files for SEO Internal Linking */}
          {recommendedFiles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-stone-900 mb-4">Related Study Materials</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recommendedFiles.map((recFile) => (
                  <Link
                    key={recFile._id.toString()}
                    href={`/notes/file/${recFile.slug}`}
                    className="flex items-center gap-3 p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition"
                  >
                    <div className="bg-emerald-50 text-emerald-500 p-2 rounded-lg flex-shrink-0">
                      <FileText size={20} />
                    </div>
                    <span className="text-sm font-semibold text-stone-800 truncate">
                      {recFile.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Shared Educational Info Block */}
          <div className="mt-16 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
            <h2 className="text-lg font-bold text-stone-900 mb-3">About Somana Study Materials</h2>
            <p className="text-sm text-stone-600 leading-relaxed mb-4">
              Somana Study Materials is an open, student-driven academic directory containing lecture notes, study guides,
              and previous year question papers. All files are uploaded by independent student contributors and creators
              aiming to make higher education resources accessible to all. We cover courses from leading universities.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              If you have study materials, question papers, or course syllabus PDFs that you would like to share,
              please consider joining our community. By contributing your notes, you help fellow students prepare for exams
              and succeed academically. Navigate to our contribute page to learn more about uploading your resources.
            </p>
          </div>

        </div>
      </div>
    </>
  );
}
