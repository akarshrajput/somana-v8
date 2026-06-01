import React from "react";

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
  return <div>page</div>;
};

export default page;

