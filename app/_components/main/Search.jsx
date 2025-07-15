"use client";
// /api/v1/blogs?heading=hi
import { useSearchParams } from "next/navigation";
import FetchStories from "../articleComponents/FetchStories";

export default function Search() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q"); // Retrieves the value of "q"

  return (
    <div className="px-2 py-2 flex justify-center mt-20">
      <div className="w-[1200px]">
        <div className="bg-neutral-100 w-fit text-sm font-semibold p-2 rounded-md mb-4">
          <p>
            Search -{" "}
            <span className="bg-transparent text-green-600">{query}</span>
          </p>
        </div>
        <div className="grid grid-cols-7 gap-12">
          <div className="col-span-5 flex">
            <div className="flex flex-col gap-4">
              <FetchStories q={query} />
            </div>
          </div>
          {/* <div className="col-span-2 border-neutral-200">
            <div className="flex flex-col gap-8">
              <div className="font-medium flex-col">
                <PodcastGrid api="/api/v1/podcasts?limit=6" />
              </div>
              <div className="font-medium border-neutral-200 flex-col">
                <FetchMusic q={query} />
              </div>
            </div>
          </div> */}
        </div>
        <div className="my-8">{/* <StoryGridFull /> */}</div>
        <div className="my-8">{/* <MusicList /> */}</div>
      </div>
    </div>
  );
}
