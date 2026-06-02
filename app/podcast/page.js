import React from "react";
import HorizontalList from "@/app/_components/podcastComponents/HorizontalList";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "Podcasts — Somana",
  description:
    "Listen to original podcasts from independent creators on Somana. Explore conversations, storytelling, and ideas from voices across the globe. Find stories, podcasts, and notes in one place.",
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
          and educational logs recorded by independent podcasters around the world. Explore our list of episodes, 
          discover new concepts, and hear directly from passionate creators who share their perspectives. 
          Click on any podcast to launch the built-in player.
        </p>
        <HorizontalList />

        <section className="mt-12 pt-6 border-t border-stone-200 max-w-4xl">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">Discover Podcasts on Somana</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Somana hosts a growing library of podcasts covering topics like technology, culture, personal development, 
            business, health, entertainment, and more. Each episode is uploaded directly by independent creators who 
            own their content and connect authentically with their listeners. Whether you prefer quick ten-minute 
            insights or hour-long deep-dives, you will find audio content that matches your interests.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mt-3">
            All podcasts on Somana are free to stream — no subscription required. You can listen directly in your 
            browser using our built-in audio player. We add new episodes regularly as our community of podcasters 
            continues to grow. If you are a podcaster looking for a platform to host and share your episodes, 
            visit our contribute page to learn how to get started on Somana.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;

