import React from "react";
import Contact from "../_components/main/Contact";
import Script from "next/script";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "Contact Somana",
  description:
    "Get in touch with the Somana team. We'd love to hear from creators, partners, and readers. Reach out for collaborations, support, or just to say hello.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact Somana",
    description: "Get in touch with the Somana team for collaborations, support, or partnerships.",
    url: `${BASE_URL}/contact`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Contact Somana" }],
  },
  twitter: {
    card: "summary",
    title: "Contact Somana",
    description: "Get in touch with the Somana team.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${BASE_URL}/contact#webpage`,
  url: `${BASE_URL}/contact`,
  name: "Contact Somana",
  description: "Get in touch with the Somana team.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE_URL}/contact` },
    ],
  },
};

const page = () => {
  return (
    <>
      <Script
        id="contact-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <Contact />
    </>
  );
};

export default page;

