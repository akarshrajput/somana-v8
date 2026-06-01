import React from "react";
import HorizontalList from "@/app/_components/podcastComponents/HorizontalList";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Podcasts — Somana",
  description:
    "Listen to original podcasts from independent creators on Somana. Explore conversations, storytelling, and ideas from voices across India.",
  alternates: { canonical: `${BASE_URL}/podcast` },
  openGraph: {
    title: "Podcasts — Somana",
    description: "Listen to original podcasts from independent creators on Somana.",
    url: `${BASE_URL}/podcast`,
    type: "website",
    siteName: "Somana",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Somana Podcasts" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Podcasts — Somana",
    description: "Listen to original podcasts from independent creators on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Independent Podcasts</h1>
        <p className="text-stone-600 mb-8 max-w-2xl text-sm leading-relaxed">
          Welcome to the podcast center of Somana. Dive into deep conversations, immersive storytelling, talk shows, 
          and educational logs recorded by independent podcasters across India. Explore our list of episodes, 
          discover new concepts, and hear directly from passionate creators who share their perspectives. 
          Click on any podcast to launch the built-in player.
        </p>
        <HorizontalList />
      </div>
    </div>
  );
};

export default page;

