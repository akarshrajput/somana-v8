"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { name: "Music", href: "/music" },
      { name: "Blogs", href: "/" },
      { name: "Stories", href: "/" },
      { name: "Podcasts", href: "/podcast" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Community",
    links: [
      { name: "Contribute", href: "/contribute" },
      { name: "Creators", href: "/creators" },
      { name: "Events", href: "/events" },
    ],
  },
];

const popularTopics = [
  "Automotive", "Books", "Business", "Culture", "Design", 
  "Environmental", "Fashion", "Fitness", "Gaming", "Gardening", 
  "Health", "Humor", "Legal", "Luxury", "Movies", "Notes", 
  "Photography", "Politics", "Relationships", "Spirituality", 
  "Story", "Technology", "Travel"
];

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-muted py-12 mt-32">
      <div className="w-full max-w-[1200px] mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <div className="text-xl font-semibold tracking-tight">Somana</div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Somana is a creative hub for music, blogs, stories, and podcasts—powered by independent creators. 
              We offer a decentralized space for artists and writers to share their voice, build community, 
              and explore human expression. Built with modern web technology, we prioritize high-quality user 
              experience, clean aesthetics, and creator independence. Join us in exploring and shaping the 
              future of media and digital storytelling.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="https://instagram.com">
                <Instagram className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://twitter.com">
                <Twitter className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://facebook.com">
                <Facebook className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="https://youtube.com">
                <Youtube className="h-5 w-5 hover:text-primary transition" />
              </Link>
              <Link href="/contact">
                <Mail className="h-5 w-5 hover:text-primary transition" />
              </Link>
            </div>
            <div className="mt-4 font-medium text-gray-600 text-sm">
              {/* <a
                href="https://www.linkedin.com/in/akarshrajput"
                target="_blank"
                rel="noopener noreferrer"
              >
                Akarsh Rajput | Founder & CEO
              </a> */}
              <p>Akarsh Rajput | Founder & CEO Somana Corp.</p>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-md font-medium mb-4">{section.title}</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-primary transition"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Topics Tag Cloud */}
        <div className="mt-12 pt-8 border-t border-muted">
          <h3 className="text-sm font-medium text-foreground mb-4">Popular Topics</h3>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic) => (
              <Link
                key={topic}
                href={`/story/topic/${topic.toLowerCase()}`}
                className="text-[11px] bg-stone-100 hover:bg-neutral-800 hover:text-white dark:bg-neutral-800 dark:hover:bg-stone-100 dark:hover:text-black px-2.5 py-1 rounded-full text-muted-foreground transition duration-200"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-muted pt-6 text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Somana. All rights reserved.
          <p className="mt-4 max-w-3xl mx-auto leading-relaxed text-[11px] opacity-80">
            Somana is designed and maintained as an open-source platform celebrating independent Indian creators. 
            All stories, audio podcasts, and musical tracks published on this domain are the intellectual property 
            of their respective creators. We are dedicated to providing a fast, secure, and accessible channel 
            for digital storytelling. Connect with us for partnerships, creator queries, or developer collaborations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
