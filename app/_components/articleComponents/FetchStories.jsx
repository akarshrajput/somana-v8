"use client";
import { BookOpen, Sparkle, Verified } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const FetchStories = ({ q }) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/blogs?heading=${q}&limit=12`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        const blogs = data?.data?.blogs;

        setBlogs(blogs); // Assuming the API returns an array of blogs
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [q]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {blogs.map((post, index) => (
        <Link
          href={`/story/${post.slug}`}
          key={post.id}
          className="flex cursor-pointer flex-col hover:bg-neutral-100 duration-300 p-2 gap-1 rounded-lg dark:hover:bg-neutral-800"
        >
          <div className="flex items-center gap-2">
            <img
              alt="Author"
              src={post.author.photo}
              className="h-6 w-6 rounded-full"
            />
            <div className="text-xs font-medium flex items-center gap-1">
              <Link
                href={`profile/${post.author.userName}`}
                className="hover:underline"
              >
                {post.author.name}
              </Link>
              {post.author.verified && (
                <Verified className="text-black size-3" weight="fill" />
              )}
              in
              <Link
                href={`/blogs/topic/${post.genre}`}
                className="hover:underline"
              >
                {post.genre}
              </Link>
            </div>
          </div>

          <Link href={`/story/${post.slug}`}>
            <h3 className="font-semibold text-sm truncate mb-1 leading-5">
              {post.heading}
            </h3>
          </Link>

          <div className="relative">
            <div className="flex justify-center w-full overflow-hidden h-40 md:h-40 rounded-sm">
              <img
                src={post?.featuredImage}
                className="w-full h-full object-cover rounded-md hover:rounded-sm duration-500"
                alt="Featured Image"
              />
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1">
              <BookOpen
                weight="bold"
                className="size-6 text-black bg-neutral-100 p-1 rounded-full"
              />

              <div>
                {post.usedAI && (
                  <Sparkle
                    className="size-6 text-yellow-700 bg-neutral-100 p-1 rounded-full"
                    weight="fill"
                  />
                )}
              </div>
            </div>
          </div>

          {/* <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 line-clamp-3">
          {post.description.substring(0, 100)}...
        </p> */}
        </Link>
      ))}
    </div>
  );
};

export default FetchStories;
