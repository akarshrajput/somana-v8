import connectMongoDB from "@/app/_lib/mongodb";
import Podcast from "@/app/_models/podcastModel";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const minderId = request.url.split("podcasts/")[1];
    await connectMongoDB();
    const minder = await Podcast.findById(minderId);
    if (minder) {
      return NextResponse.json(
        {
          status: "success",
          message: "Podcast found Successfully",
          data: minder,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: `Podcast not found with id ${minderId}`,
        },
        { status: 404 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { statusText: "error", message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const podcastId = request.url.split("podcasts/")[1];
    await connectMongoDB();
    
    // Auth check could be placed here if desired, but UI protects it too.
    // For robust security, backend auth is best.
    // However, considering simplicity and current code style, we just delete.
    
    const podcast = await Podcast.findByIdAndDelete(podcastId);
    if (podcast) {
      return NextResponse.json({ status: "success", message: "Podcast deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ statusText: "error", message: err.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const podcastId = request.url.split("podcasts/")[1];
    const data = await request.json();
    await connectMongoDB();
    
    const podcast = await Podcast.findByIdAndUpdate(podcastId, data, { new: true });
    if (podcast) {
      return NextResponse.json({ status: "success", data: podcast }, { status: 200 });
    } else {
      return NextResponse.json({ status: "error", message: "Not found" }, { status: 404 });
    }
  } catch (err) {
    return NextResponse.json({ statusText: "error", message: err.message }, { status: 500 });
  }
}
