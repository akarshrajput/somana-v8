import IFrameViewer from "@/app/_components/articleComponents/IFrameViewer";
import { Lora, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import React from "react";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const crimsonText = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const fetchBlogData = async (slug) => {
  if (!slug) return null;

  try {
    const baseUrl =
      process.env.HOSTNAME ||
      process.env.NEXT_PUBLIC_HOSTNAME ||
      "http://localhost:3000";
    const apiUrl = `${baseUrl}/api/v1/blogs/slug/${slug}`;
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      console.error("Fetch failed:", res.status, res.statusText);
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await fetchBlogData(slug);

  if (!blog) {
    return {
      title: "Not Found",
      description: "The blog post you are looking for does not exist.",
    };
  }

  return {
    title: `${blog.heading} - My Blog`,
    description: blog.description,
    openGraph: {
      title: blog.heading,
      description: blog.description,
      images: [blog.featuredImage],
      url: `${process.env.HOSTNAME}/blog/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.heading,
      description: blog.description,
      image: blog.featuredImage,
    },
  };
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const article = await fetchBlogData(slug);

  if (!article) {
    return (
      <div className="mt-44 text-center text-red-600">Blog not found.</div>
    );
  }

  const modifiedContent = article.content?.replace(/target="_blank"/g, "");

  return (
    <div className="mt-44 flex flex-col items-center p-1">
      <div className="w-full max-w-[860px] flex flex-col items-center">
        <p className="text-sm border w-fit rounded-full px-4 py-1.5 border-stone-600">
          19th Century
        </p>

        <p
          className={`${lora.className} mt-6 text-stone-800 text-center text-5xl font-medium tracking-tight w-full max-w-[600px] leading-tight`}
        >
          {article.heading}
        </p>

        <p
          className={`${crimsonText.className} mt-2 text-black font-medium text-center text-xl tracking-tighter w-full max-w-[600px]`}
        >
          {article.description}
        </p>

        <Link href={`/user/${article?.author?.userName}`}>
          <div className="mt-4 flex flex-col items-center">
            <img
              className="rounded-full aspect-square size-8"
              src={article.author?.photo}
              alt={article.author?.name}
            />
            <p>{article.author?.name}</p>
          </div>
        </Link>
        {article?.genre === "Notes" ? (
          ""
        ) : (
          <div className="w-full mt-6">
            <img
              className="rounded-md w-full"
              src={article.featuredImage}
              alt="Featured"
            />
          </div>
        )}

        {article?.fileLinks?.length > 0 ? (
          <IFrameViewer fileLinks={article.fileLinks} />
        ) : (
          ""
        )}

        <div className="grid grid-cols-6">
          <div
            className={`${crimsonText.className} col-span-5 leading-normal my-10 custom-link text-xl text-gray-700 dark:text-gray-200`}
            dangerouslySetInnerHTML={{ __html: modifiedContent }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Page;
