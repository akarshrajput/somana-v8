import React from "react";
import MusicHorizontalList from "@/app/_components/musicComponents/MusicHorizontalList";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Music — Somana",
  description:
    "Discover original music from independent artists on Somana. Listen to tracks across genres from India's most creative musicians.",
  alternates: { canonical: `${BASE_URL}/music` },
  openGraph: {
    title: "Music — Somana",
    description: "Discover original music from independent artists on Somana.",
    url: `${BASE_URL}/music`,
    type: "website",
    siteName: "Somana",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Somana Music" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Music — Somana",
    description: "Discover original music from independent artists on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Independent Music</h1>
        <p className="text-stone-600 mb-8 max-w-2xl text-sm leading-relaxed">
          Welcome to the music hub of Somana. We believe in providing independent music artists and creators 
          with a platform to publish their tracks, songs, instrumentals, and audio experiments. 
          Explore our curated selection of tracks below, support independent Indian musicians, 
          and listen to the sounds of tomorrow. Click any track to launch the player and start listening.
        </p>
        <MusicHorizontalList />
      </div>
    </div>
  );
};

export default page;

