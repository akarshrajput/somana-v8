import AddComment from "@/app/_components/articleComponents/AddComment";
import BlogComments from "@/app/_components/articleComponents/BlogComments";
import DeleteButton from "@/app/_components/articleComponents/DeleteBlog";
import IFrameViewer from "@/app/_components/articleComponents/IFrameViewer";
import LikeButton from "@/app/_components/articleComponents/LikeButton";
import VerticalAd from "@/app/_components/googleads/vertical_ad";
import { auth } from "@/app/_lib/auth";
import { Button } from "@/components/ui/button";
import { Pen, User } from "lucide-react";
import { Lora, Roboto_Slab } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
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
    let baseUrl =
      process.env.HOSTNAME ||
      process.env.NEXT_PUBLIC_HOSTNAME ||
      "http://localhost:3000";
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `http://${baseUrl}`;
    }
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
  const BASE_URL = "https://somana.in";

  if (!blog) {
    return {
      title: "Story Not Found",
      description: "The story you are looking for does not exist.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BASE_URL}/story/${slug}`;
  const ogImage = blog.featuredImage || `${BASE_URL}/logo.png`;
  const authorName = blog.author?.name || "Somana Creator";

  return {
    title: blog.heading,
    description: blog.description,
    alternates: { canonical: canonicalUrl },
    keywords: [
      blog.genre,
      "somana",
      "story",
      "india",
      authorName,
      ...(blog.tags || []),
    ].filter(Boolean),
    authors: [{ name: authorName }],
    category: blog.genre || "Story",
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: blog.heading,
      description: blog.description,
      siteName: "Somana",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: blog.heading,
        },
      ],
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: [`${BASE_URL}/user/${blog.author?.userName}`],
      section: blog.genre,
    },
    twitter: {
      card: "summary_large_image",
      site: "@somana_in",
      title: blog.heading,
      description: blog.description,
      images: [ogImage],
    },
  };
}


const Page = async ({ params }) => {
  const { slug } = await params;
  const article = await fetchBlogData(slug);
  const session = await auth();

  if (!article) {
    return (
      <div className="mt-44 text-center text-red-600">Blog not found.</div>
    );
  }

  const BASE_URL = "https://somana.in";
  const modifiedContent = article.content?.replace(/target="_blank"/g, "");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}/story/${slug}#article`,
    headline: article.heading,
    description: article.description,
    image: article.featuredImage ? [article.featuredImage] : [`${BASE_URL}/logo.png`],
    datePublished: article.createdAt,
    dateModified: article.updatedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "Somana Creator",
      url: article.author?.userName
        ? `${BASE_URL}/user/${article.author.userName}`
        : BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Somana",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/story/${slug}`,
    },
    articleSection: article.genre,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${BASE_URL}/#website` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Stories", item: `${BASE_URL}/story` },
        { "@type": "ListItem", position: 3, name: article.heading, item: `${BASE_URL}/story/${slug}` },
      ],
    },
  };

  return (
    <>
      <Script
        id="article-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <div className="mt-44 flex flex-col items-center p-1">
        <div className="w-full max-w-[860px] flex flex-col items-center">
          {/* <VerticalAd /> */}
          <p className="text-sm border w-fit rounded-full px-4 py-1.5 border-stone-600">
            {article?.genre}
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

          <div className="my-4 flex items-center gap-4">
            {session?.user ? (
              <LikeButton
                blogId={slug}
                initialLikes={article.likesCount}
                userId={session.user.userId}
              />
            ) : null}
            <p className="font-medium dark:bg-gray-800 p-1 px-2 rounded-md text-sm">
              {article.viewsCount} views
            </p>

            {session &&
              (session.user.userId === article.author._id ||
                session.user.role === "admin") && (
                <div className="flex items-center gap-2">
                  {article?._id && (
                    <Link href={`/story/edit/${article._id}`}>
                      <Button variant="secondary" size="sm">
                        <Pen weight="bold" />
                        Edit
                      </Button>
                    </Link>
                  )}
                  <DeleteButton blogId={article._id} />
                </div>
              )}
          </div>

          <Link href={`/user/${article?.author?.userName}`}>
            <div className="mt-4 flex flex-col items-center">
              {article.author?.photo ? (
                <img
                  className="rounded-full aspect-square size-8 object-cover"
                  src={article.author.photo}
                  alt={article.author.name}
                />
              ) : (
                <div className="rounded-full size-8 border bg-stone-100 dark:bg-neutral-800 flex items-center justify-center text-stone-600 dark:text-neutral-300">
                  <User size={16} />
                </div>
              )}
              <p className="font-semibold text-sm mt-1">{article.author?.name}</p>
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
              className={`${crimsonText.className} font-medium col-span-5 leading-normal my-10 custom-link text-xl text-gray-900 dark:text-gray-200`}
              dangerouslySetInnerHTML={{ __html: modifiedContent }}
            ></div>
          </div>

          <div className="mt-20 w-full">
            {session?.user ? (
              <AddComment
                session={session}
                hostname={process.env.HOSTNAME}
                blogId={article._id}
                authorId={session.user.userId}
              />
            ) : (
              <p className="text-gray-500">Log in to comment on this blog.</p>
            )}
            <BlogComments hostname={process.env.HOSTNAME} blogId={article._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;


