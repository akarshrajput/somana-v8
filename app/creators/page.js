import React from "react";
import TopCreatorsList from "@/app/_components/userComponents/TopCreatorsList";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Top Creators on Somana",
  description:
    "Discover the top creators on Somana. Explore stories, podcasts, and music from India's most talented independent voices and storytellers.",
  alternates: { canonical: `${BASE_URL}/creators` },
  openGraph: {
    title: "Top Creators on Somana",
    description:
      "Explore stories, podcasts, and music from India's most talented independent voices.",
    url: `${BASE_URL}/creators`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Top Creators on Somana" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Creators on Somana",
    description: "Explore stories, podcasts, and music from India's most talented independent voices.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[600px] px-4">
        <h1 className="text-3xl font-bold mb-4">Top Creators</h1>
        <p className="text-stone-600 mb-6 text-sm leading-relaxed">
          Welcome to the Somana Creator Hall of Fame. Here, we highlight our most active independent voices 
          who share their passion, knowledge, and talent with the community. Creators on Somana earn 
          Experience Points (XP) by contributing high-quality stories, uploading podcasts, and publishing original music. 
          The leaderboard below features our top-ranking creators sorted by their activity and contributions. 
          Join our community, share your work, and see your name on the leaderboard!
        </p>
        <TopCreatorsList />
      </div>
    </div>
  );
};

export default page;
