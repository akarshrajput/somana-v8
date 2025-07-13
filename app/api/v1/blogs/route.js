import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import APIFeatures from "@/app/_utils/apiFeatures";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectMongoDB();
    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());

    // Apply filtering, sorting, limiting, and pagination
    const features = new APIFeatures(Blog.find().select("-content"), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Fetch blogs using the modified query
    const blogs = await features.query;

    return NextResponse.json(
      {
        statusText: "success",
        message: "Blogs fetched successfully",
        results: blogs.length,
        data: {
          blogs,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching blogs:", err);

    return NextResponse.json(
      {
        statusText: "error",
        message: "Error getting blogs",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectMongoDB();
    const data = await request.json();
    const newBlog = await Blog.create(data);
    return NextResponse.json(
      {
        statusText: "success",
        message: "Blog created successfully",
        data: {
          newBlog,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error creating blog:", err);
    return NextResponse.json(
      {
        statusText: "error",
        message: "Error creating Blog",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
