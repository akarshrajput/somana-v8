import React from "react";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Careers at Somana",
  description:
    "Join the Somana team. We're looking for passionate creators, engineers, and storytellers to help build India's leading creative content platform.",
  alternates: { canonical: `${BASE_URL}/careers` },
  openGraph: {
    title: "Careers at Somana",
    description:
      "Join the Somana team. Build India's leading creative content platform.",
    url: `${BASE_URL}/careers`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Careers at Somana" }],
  },
  twitter: {
    card: "summary",
    title: "Careers at Somana",
    description: "Join the Somana team and build India's creative content platform.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Careers at Somana</h1>
        <p className="text-stone-600 mb-8">
          We&apos;re building India&apos;s leading creative content platform. Join us.
        </p>
        <p className="text-stone-500">
          No open positions right now — check back soon or email us at careers@somana.in
        </p>
      </div>
    </div>
  );
};

export default page;
