import React from "react";

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
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Top Creators</h1>
        <p className="text-stone-600">
          Discover India&apos;s most talented independent creators on Somana.
        </p>
      </div>
    </div>
  );
};

export default page;
