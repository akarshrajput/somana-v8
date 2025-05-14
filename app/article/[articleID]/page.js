import {
  Crimson_Text,
  Lora,
  Merriweather,
  Prata,
  Roboto_Slab,
  Tinos,
} from "next/font/google";
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
  const api = `${process.env.HOSTNAME}/api/v1/blogs/slug/${slug}`;
  try {
    const res = await fetch(api, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch blog data");
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching blog data:", error);
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { articleID: slug } = params;
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
      url: `${process.env.HOSTNAME}/article/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.heading,
      description: blog.description,
      image: blog.featuredImage,
    },
  };
}

const page = async ({ params }) => {
  const { articleID: slug } = params;
  const article = await fetchBlogData(slug);

  if (!article) {
    return (
      <div className="mt-44 text-center text-red-600">Blog not found.</div>
    );
  }

  const contentWithLineBreaks = article?.content;
  const modifiedContent = contentWithLineBreaks.replace(/target="_blank"/g, "");
  return (
    <div className="mt-44 flex flex-col items-center p-1">
      <div className="w-full max-w-[860px] flex flex-col items-center">
        <p className="text-sm border w-fit rounded-full px-4 py-1.5 border-stone-600">
          19th Century
        </p>
        <p
          className={`${lora.className} mt-6 text-stone-800 text-center text-5xl font-medium tracking-tight w-full max-w-[600px] leading-tight`}
        >
          {article?.heading}
        </p>
        <p
          className={`${crimsonText.className} mt-2 text-black font-medium text-center text-xl tracking-tighter w-full max-w-[600px]`}
        >
          {article?.description}
        </p>
        <div className="mt-4 flex flex-col items-center">
          <img
            className="rounded-full aspect-square size-8"
            src={`${article?.author?.photo}`}
          />
          <p>{article?.author?.name}</p>
        </div>

        <div className="w-full mt-6">
          <img
            className="rounded-md w-full"
            src={`${article?.featuredImage}`}
          />
        </div>
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

export default page;
