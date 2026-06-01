import React from "react";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "Events — Somana",
  description:
    "Explore upcoming events by Somana — creator meetups, storytelling nights, podcast live sessions, and music showcases.",
  alternates: { canonical: `${BASE_URL}/events` },
  openGraph: {
    title: "Events — Somana",
    description: "Explore upcoming events by Somana — creator meetups, storytelling nights, and music showcases.",
    url: `${BASE_URL}/events`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Somana Events" }],
  },
  twitter: {
    card: "summary",
    title: "Events — Somana",
    description: "Explore upcoming creator events on Somana.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        <p className="text-stone-600 mb-8 max-w-2xl">
          Creator meetups, storytelling nights, podcast live recording sessions, and music showcases — all on Somana. 
          We bring our community of writers, musicians, podcasters, and listeners together both online and offline.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
          <div className="border p-6 rounded-xl hover:bg-stone-50 transition">
            <h2 className="text-lg font-semibold mb-2">🎭 Storytelling Nights</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Join our regular virtual gatherings where writers, poets, and storytellers read their latest works live. 
              It is a space to listen to raw narratives, share immediate feedback, and connect with fellow readers.
            </p>
          </div>
          <div className="border p-6 rounded-xl hover:bg-stone-50 transition">
            <h2 className="text-lg font-semibold mb-2">🤝 Creator Meetups</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              We organize remote and regional meetups for independent creators to network, share tech tips, discuss 
              monetization strategies, collaborate on projects, and share updates on the platform&apos;s roadmap.
            </p>
          </div>
          <div className="border p-6 rounded-xl hover:bg-stone-50 transition">
            <h2 className="text-lg font-semibold mb-2">🎙️ Live Podcasts</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Experience live podcast recordings with prominent creators, featuring Q&A sessions where listeners can 
              ask questions in real-time, share ideas, and participate in lively discussions.
            </p>
          </div>
          <div className="border p-6 rounded-xl hover:bg-stone-50 transition">
            <h2 className="text-lg font-semibold mb-2">🎵 Music Showcases</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Tune into acoustic sets, beat-making showcases, and new track release parties hosted on the platform. 
              Discover fresh musical talent and support independent artists directly.
            </p>
          </div>
        </div>

        <section className="mt-12 pt-6 border-t border-stone-200 max-w-4xl">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">About Somana Events</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            Somana events are designed to bring together India&apos;s growing community of independent content creators. 
            Whether you are a writer wanting to share your work with an audience, a podcaster seeking collaboration 
            opportunities, or a musician looking to perform live, our events provide a welcoming and supportive environment. 
            Events are free to attend and open to all registered members of the Somana platform.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mt-3">
            We host a mix of virtual sessions that anyone can join from anywhere, and occasional in-person meetups 
            in select Indian cities. Stay tuned for announcements about upcoming events by following our social media 
            channels and checking this page regularly. If you would like to host or co-organize an event with Somana, 
            reach out to us through our contact page — we love partnering with passionate community members.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
