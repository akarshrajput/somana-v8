import React from "react";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Contribute to Somana",
  description:
    "Become a creator on Somana. Write stories, share podcasts, and upload music. Join a community of independent creators building a new kind of media.",
  alternates: { canonical: `${BASE_URL}/contribute` },
  openGraph: {
    title: "Contribute to Somana",
    description:
      "Write stories, share podcasts, and upload music on Somana. Join independent creators.",
    url: `${BASE_URL}/contribute`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Contribute to Somana" }],
  },
  twitter: {
    card: "summary",
    title: "Contribute to Somana",
    description: "Write stories, share podcasts, and upload music on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Contribute to Somana</h1>
        <p className="text-stone-600 mb-8 max-w-2xl">
          Share your voice. Somana is designed to empower independent content creators by providing a clean, 
          ad-free, and high-performance space to publish original stories, podcasts, and music.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 mb-8 max-w-5xl">
          <div>
            <h2 className="text-xl font-semibold mb-2">Write Stories</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              We publish blog posts, poetry, essays, and news articles. Use our rich-text editor to style your text, 
              insert links, upload featured images, and choose the correct tags to reach the right audience.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Share Podcasts</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Upload your podcast episodes in MP3 format. Design eye-catching cover art and write detailed descriptions 
              so users can discover your talk shows, storytelling series, or discussions easily.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Publish Music</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Share original songs, covers, acoustic tracks, or beats. Upload high-quality audio files, specify the genre, 
              and let the community stream your musical creations.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 max-w-2xl">
          <h2 className="text-lg font-semibold mb-2">Become a Verified Creator</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-4">
            If you want to start contributing and get access to the writer and upload dashboard, register an account on the 
            platform first, update your profile (photo, bio), and email us with links to your previous work.
          </p>
          <p className="text-stone-600 text-sm font-medium">
            Contact us at: <a href="mailto:contact@somana.in" className="text-blue-600 hover:underline">contact@somana.in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
