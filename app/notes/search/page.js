import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import Link from "next/link";
import { Folder, ChevronLeft } from "lucide-react";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "All";

  await connectMongoDB();
  const folders = await Note.find({ parent: null, category: category === "All" ? { $exists: true } : category }).select("name").lean();
  const folderNames = folders.map(f => f.name).join(", ");
  const dynamicKeywords = folders.map(f => `${f.name} notes`).join(", ");

  let title = "Search Notes";
  let description = "Find free college notes and study materials.";

  if (category === "Colleges") {
    title = "All Colleges Notes | Somana";
    description = `Browse free notes and study materials for top colleges including ${folderNames || "various universities"}.`;
  } else if (category === "Courses") {
    title = "All Courses Notes | Somana";
    description = `Browse free notes and study materials for top courses including ${folderNames || "engineering and computer science subjects"}.`;
  }

  return {
    title,
    description,
    keywords: `${category.toLowerCase()} notes, study materials, engineering notes, somana notes, ${dynamicKeywords}`,
    alternates: {
      canonical: `https://www.somana.in/notes/search?category=${category}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://www.somana.in/notes/search?category=${category}`,
    },
  };
}

export default async function SearchNotesPage(props) {
  const searchParams = await props.searchParams;
  const category = searchParams?.category || "All";

  await connectMongoDB();
  const query = { parent: null };
  if (category !== "All") {
    query.category = category;
  }

  const folders = await Note.find(query).sort({ createdAt: -1 }).lean();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Notes`,
    "description": `A comprehensive directory of free notes for ${category}.`,
    "url": `https://www.somana.in/notes/search?category=${category}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen bg-stone-50/50 py-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Link href="/notes" className="text-stone-500 hover:text-stone-900 flex items-center gap-1 mb-4 w-fit transition">
              <ChevronLeft size={16} /> Back to Directory
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 mb-2">
              Explore {category === "All" ? "All Notes" : category}
            </h1>
            <p className="text-stone-600">
              Browse all available {category.toLowerCase()} folders and their complete study materials.
            </p>
          </div>

          {folders.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-stone-300 rounded-xl bg-white">
              <p className="text-stone-500">No {category.toLowerCase()} found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {folders.map((folder) => (
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
