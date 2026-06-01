import React from "react";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Events — Somana",
  description:
    "Explore upcoming events by Somana — creator meetups, storytelling nights, podcast live sessions, and music showcases.",
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title: "Events — Somana",
    description: "Explore upcoming events by Somana — creator meetups, storytelling nights, and music showcases.",
    url: `${BASE_URL}/events`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Somana Events" }],
  },
  twitter: {
    card: "summary",
    title: "Events — Somana",
    description: "Explore upcoming creator events on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-stone-600">
          Creator meetups, storytelling nights, podcast sessions, and music showcases — all on Somana.
        </p>
      </div>
    </div>
  );
};

export default page;
