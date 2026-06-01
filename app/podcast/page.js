import React from "react";

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
  return <div>page</div>;
};

export default page;

