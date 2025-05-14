"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Play, PlayCircle, Podcast } from "lucide-react";
import { Lora } from "next/font/google";
import Link from "next/link";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchPodcasts = async () => {
  const res = await axios.get("/api/v1/podcasts?limit=9");
  return res?.data?.data?.podcasts;
};

const HorizontalList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["podcasts"],
    queryFn: fetchPodcasts,
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {data?.map((podcast) => (
          <Link
            href={`/podcast/${podcast._id}`}
            key={podcast._id}
            className="flex items-center gap-4"
          >
            <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
              <img
                src={podcast.featuredImage}
                alt={podcast.podcastName}
                className="object-cover rounded w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <PlayCircle size={20} fill color="white" />
              </div>
            </div>

            <div className="flex flex-col justify-center overflow-hidden">
              <p className="text-xs px-2 rounded-full border border-neutral-300 w-fit text-neutral-700">
                {podcast.podcastType}
              </p>
              <p
                className={`${lora.className} text-sm font-medium text-black dark:text-white mt-1 line-clamp-2`}
              >
                {podcast.podcastName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalList;
