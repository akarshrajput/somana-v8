import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail } from "lucide-react";

const footerLinks = [
  {
    title: "Explore",
    description: "Discover insightful blogs, creative stories, and podcasts uploaded by global creators. Find study materials, notes, and academic content.",
    links: [
      { name: "Blogs & Stories", href: "/" },
      { name: "Stories Directory", href: "/story/directory" },
      { name: "Podcasts Directory", href: "/podcast" },
      { name: "Study Notes & Materials", href: "/notes" },
      { name: "Colleges Notes Directory", href: "/notes/search?category=Colleges" },
    ],
  },
  {
    title: "Company",
    description: "Read about the team behind Somana, get in touch for support, view career opportunities, or read our terms and privacy policy.",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Privacy Policy", href: "/privacy-policy" },
    ],
  },
  {
    title: "Community",
    description: "Contribute to our open-source project, view the list of top independent creators, and keep up with upcoming events.",
    links: [
      { name: "Contribute", href: "/contribute" },
      { name: "Creators", href: "/creators" },
      { name: "Events", href: "/events" },
    ],
  },
];

const popularTopics = [];

const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t border-muted py-12 mt-32">
      <div className="w-full max-w-[1200px] mx-auto px-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <div className="text-xl font-semibold tracking-tight">Somana</div>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Somana is a creative hub for blogs, stories, and podcasts—powered by independent creators. 
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
              <p>Akarsh Rajput | Founder & CEO Somana Corp.</p>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h2 className="text-md font-medium mb-2">{section.title}</h2>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                {section.description}
              </p>
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
        {popularTopics.length > 0 && (
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
        )}

        {/* Bottom */}
        <div className="mt-12 border-t border-muted pt-6 text-xs text-muted-foreground text-center">
          &copy; {new Date().getFullYear()} Somana. All rights reserved.
          <p className="text-sm text-stone-500 max-w-sm mt-4 mx-auto">
            Somana is designed and maintained as an open-source platform celebrating independent creators worldwide. 
            All stories, podcasts, and notes belong to their respective authors.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
