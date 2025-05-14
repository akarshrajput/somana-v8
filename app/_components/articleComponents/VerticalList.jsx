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
  const res = await axios.get("/api/v1/blogs?limit=2");
  return res?.data?.data?.blogs;
};

const VerticalList = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles1"],
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
            className="bg-white overflow-hidden"
          >
            <div className="relative h-32 bg-neutral-100 dark:bg-neutral-800">
              <img
                src={post.featuredImage}
                alt={post.heading}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <p className="text-xs px-2 rounded-full border w-fit mt-1">
              {post.tags}
            </p>
            <p className={`${lora.className} text-black font-medium mt-1`}>
              {post.heading}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VerticalList;
