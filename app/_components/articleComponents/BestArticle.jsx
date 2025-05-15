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
  const res = await axios.get("/api/v1/blogs?limit=1");
  return res?.data?.data?.blogs;
};

const BestArticle = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bestarticle"],
    queryFn: fetchArticles,
  });
  //   console.log(data);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        {data?.map((post) => (
          <Link
            href={`/article/${post.slug}`}
            key={post._id}
            className="bg-white overflow-hidden"
          >
            <p
              className={`${lora.className} text-black text-center text-3xl font-medium mb-4`}
            >
              {post.heading}
            </p>
            <p
              className={`${lora.className} text-black text-center text-base font-medium mb-2`}
            >
              {post.description}
            </p>
            <div className="relative h-full bg-neutral-100 dark:bg-neutral-800">
              <img
                src={post.featuredImage}
                alt={post.heading}
                className="w-full min-h-90 h-full object-cover rounded"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BestArticle;
