"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Lora } from "next/font/google";
import Link from "next/link";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fetchArticles = async () => {
  const res = await axios.get("/api/v1/blogs?limit=4");
  return res?.data?.data?.blogs;
};

const TrendingList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles2"],
    queryFn: fetchArticles,
  });
  //   console.log(data);

  //   if (isLoading) {
  //     return <p className="text-center text-gray-500">Loading...</p>;
  //   }

  //   if (error) {
  //     return <p className="text-center text-red-500">Error fetching articles</p>;
  //   }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {data?.map((post) => (
          <Link
            href={`/article/${post.slug}`}
            key={post._id}
            className="flex items-center gap-4 transition bg-white"
          >
            {/* Image Section */}
            <div className="min-w-[72px] min-h-[72px] w-16 h-16 relative overflow-hidden rounded bg-neutral-100 dark:bg-neutral-800">
              <img
                src={post.featuredImage}
                alt={post.heading}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text Section */}
            <div className="flex flex-col justify-center overflow-hidden">
              <p className="text-xs px-2 rounded-full border border-neutral-300 dark:border-neutral-600 w-fit text-neutral-700 dark:text-neutral-300">
                {post.tags}
              </p>
              <p
                className={`${lora.className} text-sm font-medium text-black dark:text-white mt-1 line-clamp-2`}
              >
                {post.heading}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingList;
