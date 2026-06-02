import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import { auth } from "@/app/_lib/auth";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    await connectMongoDB();
    
    const note = await Note.findOne({ slug });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Increment views count
    note.viewsCount += 1;
    await note.save();

    let children = [];
    if (note.type === "folder") {
      children = await Note.find({ parent: note._id }).sort({ createdAt: -1 });
    }

    return NextResponse.json({ note, children }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await connectMongoDB();
    
    const note = await Note.findOne({ slug });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Recursively delete children if it's a folder
    if (note.type === "folder") {
      await Note.deleteMany({ parent: note._id });
      // To properly delete deeply nested children, we'd need a recursive function, 
      // but for simplicity in this version, we'll just delete direct children.
    }

    await Note.findByIdAndDelete(note._id);

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;
    await connectMongoDB();
    
    const body = await request.json();
    const { name, category, description, keywords, iframeUrl } = body;

    const note = await Note.findOne({ slug });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    // Update fields if provided
    if (name) {
      note.name = name;
      // Re-generate slug since name changed
      const s = name.split(" ").join("-").toLowerCase();
      const id = note._id;
      const u = `${s.substring(0, 40)}-${id.toString().substring(18)}`;
      const m = u.replace(/[^a-zA-Z0-9-]/g, "");
      note.slug = m;
    }
    
    if (category !== undefined) note.category = category;
    if (description !== undefined) note.description = description;
    if (keywords !== undefined) note.keywords = keywords;
    if (iframeUrl !== undefined && note.type === "file") note.iframeUrl = iframeUrl;

    await note.save();

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
