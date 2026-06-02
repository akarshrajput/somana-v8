import ArticleGrid from "./_components/articleComponents/ArticleGrid";
import BestArticle from "./_components/articleComponents/BestArticle";
import TrendingList from "./_components/articleComponents/TrendingList";
import VerticalList from "./_components/articleComponents/VerticalList";
import HeaderButton from "./_components/buttons/HeaderButton";
import TagSlider from "./_components/main/TagSlider";
import Quotes from "./_components/other/Quotes";
import NotesHomeSection from "./_components/notesComponents/NotesHomeSection";
import HorizontalList from "./_components/podcastComponents/HorizontalList";
import TopCreatorsList from "./_components/userComponents/TopCreatorsList";
import Script from "next/script";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "Somana — Discover Stories, Podcasts & Notes",
  description:
    "Read the best independent stories, listen to podcasts, and find study notes by creators across the globe. Somana is where creativity meets community.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Somana — Discover Stories, Podcasts & Notes",
    description:
      "Read the best independent stories, listen to podcasts, and find study notes by creators across the globe.",
    url: BASE_URL,
    siteName: "Somana",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Somana — Stories, Podcasts & Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Somana — Discover Stories, Podcasts & Notes",
    description:
      "Read the best independent stories, listen to podcasts, and find study notes by creators across the globe.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: "Somana — Discover Stories, Podcasts & Notes",
  description:
    "Read the best independent stories, listen to podcasts, and find study notes by creators across the globe.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
    ],
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="homepage-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }}
      />
      <div className="flex flex-col items-center my-4">
        <h1 className="sr-only">Somana</h1>
        <div className="w-full max-w-[1200px] px-2">
          <div className="pb-12">
            <TagSlider />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="col-span-1">
              <HeaderButton>TODAY PICK</HeaderButton>
              <div>
                <VerticalList />
              </div>
            </div>
            <div className="col-span-1 lg:col-span-2 mt-8 lg:mt-0">
              <BestArticle />
            </div>
            <div className="col-span-1 mt-8 lg:mt-0">
              <p className="text-center mb-6">
                <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                  TRENDING
                </span>
              </p>
              <div>
                <TrendingList />
              </div>
            </div>
          </div>
          <NotesHomeSection />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-16">
            <div className="col-span-1 lg:col-span-2">
              <p className="text-center mb-6">
                <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                  PODCASTS
                </span>
              </p>
              <div>
                <HorizontalList />
              </div>
            </div>
            <div className="col-span-1 mt-12 lg:mt-0">
              <p className="text-center mb-6">
                <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                  🏆 TOP CREATORS
                </span>
              </p>
              <div>
                <TopCreatorsList />
              </div>
            </div>
          </div>
          <div className="mt-16">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                More
              </span>
            </p>
            <div>
              <ArticleGrid />
            </div>
          </div>
          <section className="mt-16 pt-8 border-t border-stone-200">
            <h2 className="text-xl font-semibold text-stone-800 mb-2">Discover Stories, Podcasts & Notes</h2>
            <p className="mb-6 text-stone-600 max-w-3xl leading-relaxed">
            Somana is a global independent creative content platform where writers and podcasters share
            their original work. Browse curated stories from emerging voices, access comprehensive college notes and
              engineering study materials, and listen to thought-provoking podcasts — all in one place, free from algorithmic feeds.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-stone-700 mb-1">Independent Stories</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Read original articles, essays, personal reflections, and creative narratives from independent writers
                across the globe. Every story on Somana is handcrafted by real creators — not generated by algorithms.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-stone-700 mb-1">Podcasts & Audio</h3>
                <p className="text-stone-500 text-sm leading-relaxed">
                  Listen to podcasts covering technology, culture, storytelling, business, health, and more. Somana hosts
                audio content from diverse podcasters from around the world who share unique perspectives and deep insights.
                </p>
              </div>
            </div>
            <p className="mt-6 text-stone-500 text-sm leading-relaxed max-w-4xl">
              Somana was created to give independent creators a dedicated platform to publish and grow their work.
              Whether you are a writer looking to share your latest essay, or a podcaster starting a new series,
              Somana offers the tools and audience to help you succeed.
              Join thousands of creators and readers who are building a community around authentic, human-made content.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
