import React from "react";
import TopCreatorsList from "@/app/_components/userComponents/TopCreatorsList";

const BASE_URL = "https://www.somana.in";

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

        <section className="mt-12 pt-6 border-t border-stone-200">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">How the Creator Leaderboard Works</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Every creator on Somana earns Experience Points through their contributions. Publishing a story, 
            uploading a podcast episode, or sharing an original music track adds to your XP score. The more 
            consistently you contribute quality content, the higher you climb on the leaderboard. This system 
            rewards dedication and creativity rather than follower counts or viral metrics.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mt-3">
            Becoming a top creator on Somana means being recognized as one of the most active and valued voices 
            on the platform. Top creators get featured on the homepage, receive higher visibility in topic archives, 
            and build a loyal readership over time. Whether you write about technology, record storytelling podcasts, 
            or produce indie music, there is a place for you in our creator community.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
