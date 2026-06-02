import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";

export default async function NotesHomeSection() {
  await connectMongoDB();

  // Fetch the latest 8 root folders (Colleges or Courses) to display on the homepage
  const notes = await Note.find({ parent: null })
    .sort({ createdAt: -1 })
    .limit(8)
    .lean();

  if (!notes || notes.length === 0) return null;

  return (
    <div className="my-12">
      <div className="flex justify-between items-end mb-4 px-1">
        <p className="text-center">
          <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
            LATEST NOTES & MATERIALS
          </span>
        </p>
        <Link
          href="/notes"
          className="text-sm font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1 transition"
        >
          Explore Notes <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {notes.map((folder) => (
          <Link
            key={folder._id.toString()}
            href={`/notes/folder/${folder.slug}`}
            className="group flex flex-col items-center p-4 bg-white border border-stone-200 rounded-xl hover:border-stone-400 hover:shadow-sm transition text-center"
          >
            <div className="bg-blue-50 text-blue-500 p-3 rounded-xl group-hover:scale-110 transition duration-300 mb-3 relative">
              <Folder size={32} fill="currentColor" className="opacity-20 absolute" />
              <Folder size={32} className="relative z-10" />
            </div>
            <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 leading-tight group-hover:text-black">
              {folder.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
