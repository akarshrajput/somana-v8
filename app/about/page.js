import React from "react";
import About from "../_components/main/About";
import Script from "next/script";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "About Somana",
  description:
    "Learn about Somana — A global independent creative content platform connecting story writers, podcasters, and students with audiences who care about authentic voices and study materials.",
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: "About Somana",
    description:
      "Learn about Somana — A global independent creative content platform.",
    url: `${BASE_URL}/about`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "About Somana" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Somana",
    description: "Learn about Somana — A global independent creative content platform.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${BASE_URL}/about#webpage`,
  url: `${BASE_URL}/about`,
  name: "About Somana",
  description:
    "Learn about Somana — A global independent creative content platform.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "About", item: `${BASE_URL}/about` },
    ],
  },
};

const page = () => {
  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <About />
    </>
  );
};

export default page;

