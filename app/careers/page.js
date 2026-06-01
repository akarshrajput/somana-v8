import React from "react";

const BASE_URL = "https://www.somana.in";

export const metadata = {
  title: "Careers at Somana",
  description:
    "Join the Somana team. We're looking for passionate creators, engineers, and storytellers to help build India's leading creative content platform.",
  alternates: { canonical: `${BASE_URL}/careers` },
  openGraph: {
    title: "Careers at Somana",
    description:
      "Join the Somana team. Build India's leading creative content platform.",
    url: `${BASE_URL}/careers`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Careers at Somana" }],
  },
  twitter: {
    card: "summary",
    title: "Careers at Somana",
    description: "Join the Somana team and build India's creative content platform.",
    images: [`${BASE_URL}/logo.png`],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[1200px] px-4">
        <h1 className="text-3xl font-bold mb-4">Careers at Somana</h1>
        <p className="text-stone-600 mb-8 max-w-2xl">
          We&apos;re building India&apos;s leading creative content platform. Join us on our mission to redefine 
          how digital stories, independent music, and audio podcasts are shared, discovered, and celebrated.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8 max-w-4xl">
          <div>
            <h2 className="text-xl font-semibold mb-2">Our Culture</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              Somana is a remote-first, passion-driven initiative. We value collaborative growth, original thinking, 
              and clean engineering. We encourage team members to explore cross-functional disciplines, blending 
              creative arts with modern software development.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Who We Look For</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              We look for self-motivated creators, designers, front-end engineers, and community managers who are 
              passionate about independent media. If you believe in empowering creators and building algorithmic-free 
              user spaces, you will fit right in.
            </p>
          </div>
        </div>

        <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 max-w-2xl">
          <h2 className="text-lg font-semibold mb-2">Open Applications</h2>
          <p className="text-stone-500 text-sm leading-relaxed mb-4">
            While we do not have specific open positions listed right now, we are always eager to meet talented developers, 
            content editors, and digital artists who want to leave a mark.
          </p>
          <p className="text-stone-600 text-sm font-medium">
            Send your resume, portfolio, or a brief intro to: <a href="mailto:careers@somana.in" className="text-blue-600 hover:underline">careers@somana.in</a>
          </p>
        </div>

        <section className="mt-12 pt-6 border-t border-stone-200 max-w-4xl">
          <h2 className="text-lg font-semibold text-stone-800 mb-3">Life at Somana</h2>
          <p className="text-stone-500 text-sm leading-relaxed">
            At Somana, you will work alongside a small, agile team that cares deeply about independent content 
            creation and digital storytelling. We use modern technologies including Next.js, React, Node.js, 
            and MongoDB to build fast, scalable features that serve thousands of creators and readers every day. 
            We prioritize clean code, thoughtful design, and user-first engineering decisions.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed mt-3">
            Our team members enjoy flexible working hours, the freedom to experiment with new ideas, and the 
            satisfaction of building a platform that genuinely helps independent creators grow their audiences. 
            If you are passionate about media, technology, and empowering creative voices, Somana is the right 
            place for you to make a meaningful impact.
          </p>
        </section>
      </div>
    </div>
  );
};

export default page;
