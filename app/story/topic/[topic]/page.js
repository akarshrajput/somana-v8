import ArticleGrid2 from "@/app/_components/articleComponents/ArticleGrid2";
import Script from "next/script";
import React from "react";

const BASE_URL = "https://www.somana.in";

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
            {lowercaseTopic === "notes" ? (
              <p className="mt-2 text-stone-600 leading-relaxed max-w-3xl">
                Access a comprehensive collection of college notes, computer science notes, and engineering notes. 
                Whether you are looking for specific CSE notes or general academic study materials, our community 
                of students and educators provides high-quality resources to help you excel in your studies.
              </p>
            ) : (
              <p className="mt-2 text-stone-600 leading-relaxed max-w-3xl">
                Explore the best {topicName.toLowerCase()} stories written by independent creators on Somana. 
                This collection features articles, personal essays, opinion pieces, and in-depth narratives 
                covering every aspect of {topicName.toLowerCase()} — from beginner guides and expert insights 
                to personal experiences and thought-provoking commentary.
              </p>
            )}
          </div>
          <ArticleGrid2 topic={topic} />

          <section className="mt-12 pt-6 border-t border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800 mb-3">About {topicName} on Somana</h2>
            {lowercaseTopic === "notes" ? (
              <>
                <p className="text-stone-600 text-sm leading-relaxed max-w-4xl">
                  Welcome to the {topicName} archive on Somana. This section gathers a curated selection of college notes, 
                  engineering notes, and study guides uploaded by students and educators from across the country. 
                  Dive in to find structured computer science notes, detailed CSE notes, and comprehensive materials 
                  for various technical and non-technical subjects.
                </p>
                <p className="text-stone-600 text-sm leading-relaxed max-w-4xl mt-3">
                  Our platform makes it easy to find exactly what you need for your exams and assignments. 
                  All college notes and engineering resources are free to access and regularly updated by our active 
                  community of contributors. Join us in making education more accessible by sharing your own notes today!
                </p>
              </>
            ) : (
              <>
                <p className="text-stone-600 text-sm leading-relaxed max-w-4xl">
                  Welcome to the {topicName} archive on Somana. This section gathers a curated selection of articles,
                  creative essays, personal reflections, and informative logs written by independent creators from around the world.
                  Every story and note on Somana is handcrafted by real people. Dive in to explore unique angles, fresh perspectives, and deep insights
                  on the subject of {topicName.toLowerCase()}, and discover talented new writers who shape the community.
                </p>
                <p className="text-stone-600 text-sm leading-relaxed max-w-4xl mt-3">
                  Whether you are looking for practical advice, creative inspiration, or simply want to read 
                  something thoughtful about {topicName.toLowerCase()}, you will find it here. Our creators bring diverse 
                  backgrounds and writing styles, ensuring that every piece offers a unique take. New stories are 
                  published regularly, so check back often to stay updated with the latest {topicName.toLowerCase()} content 
                  on Somana.
                </p>
              </>
            )}
          </section>

          <section className="mt-8 pt-6 border-t border-stone-100">
            <h2 className="text-lg font-semibold text-stone-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-4xl">
              <div>
                <h3 className="text-sm font-medium text-stone-700">What kind of {topicName.toLowerCase()} content can I find on Somana?</h3>
                <p className="text-stone-500 text-sm leading-relaxed mt-1">
                  You can find blog posts, personal essays, how-to guides, opinion articles, listicles, and long-form 
                  narratives related to {topicName.toLowerCase()}. All content is written by independent creators who are 
                  passionate about the subject.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-700">How can I contribute a {topicName.toLowerCase()} story?</h3>
                <p className="text-stone-500 text-sm leading-relaxed mt-1">
                  Create a free account on Somana, navigate to the story editor, write your piece, tag it 
                  with &ldquo;{topicName}&rdquo;, and publish. Your story will appear in this collection and be discoverable 
                  by readers interested in {topicName.toLowerCase()} content.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-stone-700">Are {topicName.toLowerCase()} stories on Somana free to read?</h3>
                <p className="text-stone-500 text-sm leading-relaxed mt-1">
                  Yes, all stories on Somana are completely free to read. There are no paywalls or subscription 
                  requirements. We believe in open access to quality independent content for everyone.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default page;

