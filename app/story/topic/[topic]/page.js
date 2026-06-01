import ArticleGrid2 from "@/app/_components/articleComponents/ArticleGrid2";
import Script from "next/script";
import React from "react";
import { permanentRedirect } from "next/navigation";

const BASE_URL = "https://somana.in";

export async function generateMetadata({ params }) {
  const { topic } = await params;
  const topicName = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
  const lowercaseTopic = topic.toLowerCase();
  return {
    title: `${topicName} Stories`,
    description: `Read the best ${topicName} stories from independent creators on Somana. Discover unique perspectives, personal narratives, and in-depth pieces.`,
    alternates: { canonical: `${BASE_URL}/story/topic/${lowercaseTopic}` },
    openGraph: {
      title: `${topicName} Stories`,
      description: `Read the best ${topicName} stories on Somana.`,
      url: `${BASE_URL}/story/topic/${lowercaseTopic}`,
      type: "website",
      siteName: "Somana",
      images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: `${topicName} Stories` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topicName} Stories`,
      description: `Read the best ${topicName} stories on Somana.`,
      images: [`${BASE_URL}/logo.png`],
    },
  };
}

const page = async ({ params }) => {
  const { topic } = await params;
  if (topic !== topic.toLowerCase()) {
    permanentRedirect(`/story/topic/${topic.toLowerCase()}`);
  }
  const topicName = topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
  const lowercaseTopic = topic.toLowerCase();

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/story/topic/${lowercaseTopic}#webpage`,
    url: `${BASE_URL}/story/topic/${lowercaseTopic}`,
    name: `${topicName} Stories`,
    description: `Read the best ${topicName} stories from independent creators on Somana.`,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: topicName, item: `${BASE_URL}/story/topic/${lowercaseTopic}` },
      ],
    },
  };

  return (
    <>
      <Script
        id="topic-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="flex flex-col items-center my-4">
        <div className="w-full max-w-[1200px] px-2">
          <div className="mb-8 pb-2">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">{topicName}</h1>
          </div>
          <ArticleGrid2 topic={topic} />

          <div className="mt-12 pt-6">
            <p className="text-stone-600 text-sm leading-relaxed max-w-4xl">
              Welcome to the {topicName} archive on Somana. This section gathers a curated selection of articles,
              creative essays, personal reflections, and informative logs written by independent creators from India
              and around the world. Dive in to explore unique angles, fresh perspectives, and deep insights
              on the subject of {topicName.toLowerCase()}, and discover talented new writers who shape the community.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

