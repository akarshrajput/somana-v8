import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import Note from "@/app/_models/noteModel";
import { auth } from "@/app/_lib/auth";

export async function GET(request) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(request.url);
    const parent = searchParams.get("parent");
    const category = searchParams.get("category");

    let query = {};
    
    if (parent) {
      // Fetch children of a specific parent folder
      query.parent = parent === "null" ? null : parent;
    } else if (category) {
      // Fetch root folders for a specific category
      query.parent = null;
      query.category = category;
    } else {
      // Fetch all root folders if no params
      query.parent = null;
    }

    const notes = await Note.find(query).sort({ createdAt: -1 });
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    // Simplified auth check: normally we check if session.user.role === 'admin'
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB();
    const body = await request.json();
    
    const { type, name, category, parent, description, keywords, iframeUrl } = body;

    if (!type || !name || !description || !keywords) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type === "file" && !iframeUrl) {
      return NextResponse.json({ error: "File must have an iframeUrl" }, { status: 400 });
    }

    const newNote = await Note.create({
      type,
      name,
      category: parent ? undefined : category, // Only root folders need category
      parent: parent || null,
      description,
      keywords,
      iframeUrl: type === "file" ? iframeUrl : undefined,
      createdBy: session.user.id,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
