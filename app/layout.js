import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "./_components/main/Header";
import ReactQueryProvider from "./_components/providers/ReactQueryProvider";
import Footer from "./_components/main/Footer";
import Script from "next/script";
import { UserProvider } from "./_context/UserContext";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const BASE_URL = "https://www.somana.in";
const OG_IMAGE = `${BASE_URL}/logo.png`;

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Somana — Stories, Podcasts & Notes",
    template: "%s | Somana",
  },
  description:
    "Somana is a creative content platform for discovering and sharing stories, blogs, podcasts, and college notes from independent creators across the globe.",
  keywords: [
    "somana",
    "stories",
    "creative",
    "global creators",
    "notes",
    "study materials",
    "blogs",
    "podcasts",
    "creative platform",
    "blog",
    "independent content",
    "college notes",
    "engineering notes",
    "computer science notes",
    "cse notes",
    "study materials",
    "lpu notes",
    "cu notes",
    "upes notes",
    "graphic era notes",
    "uttranchal university notes",
    "iit notes",
    "indian institute of technology notes",
    "nit notes",
    "national institute of technology notes",
    "iim notes",
    "indian institute of management notes",
    "iiser notes",
    "indian institute of science education and research notes",
    "iiscr notes",
    "iisc notes",
    "indian institute of science notes",
    "iim",
    "nit",
    "iit",
    "iiser",
    "iisc",
    "lpu",
    "upes",
    "graphic era",
    "notes",
    "notes pdf",
    "pdf",
    "somana.in",
  ],
  authors: [{ name: "Somana", url: BASE_URL }],
  creator: "Somana",
  publisher: "Somana",
  category: "Media & Entertainment",
  applicationName: "Somana",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Somana",
    title: "Somana — Stories, Podcasts & Notes",
    description:
      "Discover stories, podcasts, and notes from independent creators. Somana is a global creative content platform.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Somana — Stories, Podcasts & Notes",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@somana_in",
    creator: "@somana_in",
    title: "Somana — Stories, Podcasts & Notes",
    description:
      "Discover stories, podcasts, and notes from independent creators. Somana is a global creative content platform.",
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    apple: "/logo.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add your Google Search Console verification token here
    // google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
  other: {
    "google-adsense-account": "ca-pub-3750195818284635",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "Somana",
      description: "Somana is a creative content platform for stories, podcasts, and notes.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "Somana",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: OG_IMAGE,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/somana_in",
        "https://instagram.com/somana.in",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        url: `${BASE_URL}/contact`,
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-4T3N7M8Q6Y"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4T3N7M8Q6Y', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* Website + Organization JSON-LD */}
        <Script
          id="website-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        {/* Theme color */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />


      </head>

      <body className={`${dmSans.className} antialiased`}>
        <ReactQueryProvider>
          <UserProvider>
            <div className="flex min-h-screen flex-col">
              <div className="sticky top-0 left-0 w-full z-50">
                <Header />
              </div>
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster richColors closeButton position="top-center" />
          </UserProvider>
        </ReactQueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
