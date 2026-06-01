import ArticleGrid from "./_components/articleComponents/ArticleGrid";
import BestArticle from "./_components/articleComponents/BestArticle";
import TrendingList from "./_components/articleComponents/TrendingList";
import VerticalList from "./_components/articleComponents/VerticalList";
import HeaderButton from "./_components/buttons/HeaderButton";
import TagSlider from "./_components/main/TagSlider";
import MusicHorizontalList from "./_components/musicComponents/MusicHorizontalList";
import Quotes from "./_components/other/Quotes";
import HorizontalList from "./_components/podcastComponents/HorizontalList";
import TopCreatorsList from "./_components/userComponents/TopCreatorsList";
import Script from "next/script";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Somana — Discover Stories, Music & Podcasts",
  description:
    "Read the best independent stories, listen to podcasts, and discover music by creators across India. Somana is where creativity meets community.",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Somana — Discover Stories, Music & Podcasts",
    description:
      "Read the best independent stories, listen to podcasts, and discover music by creators across India.",
    url: BASE_URL,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/logo.png`,
        width: 1200,
        height: 630,
        alt: "Somana — Stories, Music & Podcasts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Somana — Discover Stories, Music & Podcasts",
    description:
      "Read the best independent stories, listen to podcasts, and discover music by creators across India.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/#webpage`,
  url: BASE_URL,
  name: "Somana — Discover Stories, Music & Podcasts",
  description:
    "Read the best independent stories, listen to podcasts, and discover music by creators across India.",
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
      <div className="w-full max-w-[1200px] px-2">
        <div className="pb-12">
          <TagSlider />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <HeaderButton>TODAY PICK</HeaderButton>
            <div>
              <VerticalList />
            </div>
          </div>
          <div className="col-span-2">
            <BestArticle />
          </div>
          <div className="col-span-1">
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
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="col-span-2">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                PODCASTS
              </span>
            </p>
            <div>
              <HorizontalList />
            </div>
          </div>
          <div className="col-span-1">
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
        <div className="grid grid-cols-3 gap-4 mt-16">
          <div className="col-span-full">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                MUSIC
              </span>
            </p>
            <div>
              <MusicHorizontalList />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
