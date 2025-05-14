import BestArticle from "./_components/articleComponents/BestArticle";
import TrendingList from "./_components/articleComponents/TrendingList";
import VerticalList from "./_components/articleComponents/VerticalList";
import Quotes from "./_components/other/Quotes";
import HorizontalList from "./_components/podcastComponents/HorizontalList";

export default function Home() {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px]">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1">
            <p className="text-center mb-6">
              <span className="border-t-2 font-bold text-sm border-red-600 pt-1">
                TODAY'S PICK
              </span>
            </p>
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
        <div className="grid grid-cols-3 gap-4 mt-12">
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
                WHO SAID IT
              </span>
            </p>
            <div>
              <Quotes />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
