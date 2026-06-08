import React from "react";
import connectMongoDB from "@/app/_lib/mongodb";
import Blog from "@/app/_models/blogModel";
import Link from "next/link";

const BASE_URL = "https://www.somana.in";

export async function generateMetadata(props) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);

  return {
    title: `Stories Directory${page > 1 ? ` (Page ${page})` : ""}`,
    description: "Browse the complete directory of stories, blogs, and creative content published by independent creators on Somana.",
    alternates: {
      canonical: `${BASE_URL}/story/directory${page > 1 ? `?page=${page}` : ""}`,
    },
    openGraph: {
      title: `Stories Directory${page > 1 ? ` (Page ${page})` : ""}`,
      description: "Browse the complete directory of stories, blogs, and creative content on Somana.",
      url: `${BASE_URL}/story/directory${page > 1 ? `?page=${page}` : ""}`,
      type: "website",
    },
  };
}

export default async function StoriesDirectoryPage(props) {
  const searchParams = await props.searchParams;
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = 50;
  const skip = (page - 1) * limit;

  await connectMongoDB();
  
  const [blogs, totalBlogs] = await Promise.all([
    Blog.find({})
      .select("heading slug createdAt genre")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Blog.countDocuments({}),
  ]);

  const totalPages = Math.ceil(totalBlogs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="min-h-screen bg-stone-50/50 py-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
          <Link href="/" className="hover:text-stone-900">Home</Link>
          <span className="text-stone-300">/</span>
          <span className="font-semibold text-stone-800">Stories Directory</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 mb-2">
            Stories Directory
          </h1>
          <p className="text-stone-600">
            A complete archive of all stories, essays, and articles written by the Somana community.
          </p>
        </div>

        {/* Stories list */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 shadow-xs">
          {blogs.length === 0 ? (
            <p className="text-stone-500 text-center py-8">No stories found.</p>
          ) : (
            <>
              <ul className="divide-y divide-stone-100">
                {blogs.map((blog) => (
                  <li key={blog._id.toString()} className="py-4 first:pt-0 last:pb-0">
                    <Link
                      href={`/story/${blog.slug}`}
                      className="group block"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className="font-semibold text-stone-900 group-hover:text-primary transition line-clamp-2">
                            {blog.heading}
                          </h2>
                          <p className="text-xs text-stone-400 mt-1">
                            Published on {new Date(blog.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {blog.genre && (
                          <span className="text-xs px-2 py-1 bg-stone-100 text-stone-600 rounded shrink-0">
                            {blog.genre}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-stone-100">
                  <div>
                    {hasPrevPage ? (
                      <Link
                        href={`/story/directory?page=${page - 1}`}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 bg-white hover:bg-stone-50 transition font-medium"
                      >
                        &larr; Previous Page
                      </Link>
                    ) : (
                      <span className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-300 bg-stone-50/50 cursor-not-allowed font-medium">
                        &larr; Previous Page
                      </span>
                    )}
                  </div>
                  
                  <span className="text-sm text-stone-500 font-medium">
                    Page {page} of {totalPages}
                  </span>

                  <div>
                    {hasNextPage ? (
                      <Link
                        href={`/story/directory?page=${page + 1}`}
                        className="px-4 py-2 border border-stone-300 rounded-lg text-sm text-stone-700 bg-white hover:bg-stone-50 transition font-medium"
                      >
                        Next Page &rarr;
                      </Link>
                    ) : (
                      <span className="px-4 py-2 border border-stone-200 rounded-lg text-sm text-stone-300 bg-stone-50/50 cursor-not-allowed font-medium">
                        Next Page &rarr;
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Informative Block to keep word count > 200 */}
        <div className="mt-12 bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <h2 className="text-lg font-bold text-stone-900 mb-3">About the Somana Story Directory</h2>
          <p className="text-sm text-stone-600 leading-relaxed mb-4">
            The Somana Stories Directory is a comprehensive archive of articles, creative writing, and digital essays 
            published by our global network of independent creators. We believe in providing an open, algorithmic-free space 
            where storytellers and writers can connect directly with readers who appreciate authentic human voices and 
            quality journalism.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            From technical tutorials and business insights to deep personal narratives and reviews, our directory spans a 
            wide range of categories and genres. Every piece is created by a real person and hosted with care. If you are 
            interested in contributing your own voice, please create an account and access our editor.
          </p>
        </div>

      </div>
    </div>
  );
}
