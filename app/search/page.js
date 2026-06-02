export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Search from "../_components/main/Search";

export const metadata = {
  title: "Search Somana — Stories & Podcasts",
  description:
    "Search for stories, podcasts, and creators on Somana. Find the content you love from World independent creators.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center my-4">
      <div className="w-full max-w-[1200px] px-2">
        <Suspense>
          <Search />
        </Suspense>
      </div>
    </div>
  );
}

