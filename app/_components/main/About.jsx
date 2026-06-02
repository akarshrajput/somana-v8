"use client";

import Image from "next/image";
import Link from "next/link";

const About = () => {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <section className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">About Somana</h1>
        <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
          Built by one passionate developer with a vision to empower voices and
          creativity. Somana is a modern hub for music, blogs, podcasts,
          stories, and human expression.
        </p>
      </section>

      <section className="mt-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Meet the Creator</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hey, I’m <span className="font-medium">Akarsh Rajput</span>—a
            full-stack developer, creator, and visionary behind Somana. I
            designed, built, and launched this platform independently with the
            mission to give people a voice and a platform to explore, express,
            and inspire.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            With deep love for music, writing, storytelling, and tech, I built
            Somana to be a space where artists, thinkers, and dreamers can come
            together and create something meaningful.
          </p>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/creator-avatar.png"
            alt="Akarsh Rajput"
            width={250}
            height={250}
            className="rounded-2xl shadow-lg object-cover"
          />
        </div>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Somana?</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-lg font-medium">Unified Platform</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Listen to music, read blogs, explore stories, or dive into
              podcasts — all from one sleek, fast, and responsive platform.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Independent & Open</h3>
            <p className="text-sm text-muted-foreground mt-2">
              No big teams or funding—just a student-built project aiming to
              empower real people, not algorithms.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium">Driven by Passion</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Built from scratch with love and code. Every line, every idea
              comes from a vision to create something truly useful and unique.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Want to Collaborate?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          If you're a content creator, artist, musician, or someone who just
          believes in the idea, I’d love to collaborate, grow, and build
          something together.
        </p>
        <Link
          href="/contact"
          className="inline-block mt-6 px-6 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition"
        >
          Contact Me
        </Link>
      </section>

      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6 text-center">Our Mission & Values</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div>
            <h3 className="text-lg font-medium mb-2">Creator-First Approach</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Everything we build at Somana starts with the creator in mind. From our distraction-free writing editor 
              to our clean audio upload flow, every feature is designed to help independent voices reach their audience 
              without the noise of traditional social media platforms. We believe that quality content deserves quality tools.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Open & Accessible</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Somana is free to use for both creators and readers. There are no paywalls, no premium tiers, and no 
              hidden fees. We want to democratize content publishing worldwide by making professional-grade tools 
              accessible to writers, podcasters, and students who want to share notes, whether you are a college student writing your first blog or an experienced 
              journalist sharing investigative reports.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Quality Over Quantity</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We do not chase viral content or engagement metrics. Somana is built around the idea that thoughtful, 
              well-crafted content creates lasting value. Our platform encourages long-form storytelling, detailed 
              analysis, and creative expression over clickbait headlines and shallow posts.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Built with Modern Technology</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Somana runs on a modern tech stack including Next.js for server-rendered performance, MongoDB for 
              flexible data storage, and a responsive design that works beautifully on desktop, tablet, and mobile 
              devices. We continuously improve the platform&apos;s speed, reliability, and user experience.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
