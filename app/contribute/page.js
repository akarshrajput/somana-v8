import React from "react";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Contribute to Somana",
  description:
    "Become a creator on Somana. Write stories, share podcasts, and upload music. Join a community of independent creators building a new kind of media.",
  alternates: { canonical: `${BASE_URL}/contribute` },
  openGraph: {
    title: "Contribute to Somana",
    description:
      "Write stories, share podcasts, and upload music on Somana. Join independent creators.",
    url: `${BASE_URL}/contribute`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Contribute to Somana" }],
  },
  twitter: {
    card: "summary",
    title: "Contribute to Somana",
    description: "Write stories, share podcasts, and upload music on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Contribute to Somana</h1>
        <p className="text-stone-600 mb-8">
          Share your voice. Write stories, upload podcasts, and publish music for audiences across India.
        </p>
        <p className="text-stone-500">
          Contact the Somana team to become a verified creator.
        </p>
      </div>
    </div>
  );
};

export default page;
