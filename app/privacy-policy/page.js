import React from "react";

const BASE_URL = "https://somana.in";

export const metadata = {
  title: "Privacy Policy — Somana",
  description:
    "Read Somana's privacy policy. Learn how we collect, use, and protect your personal information on our creative content platform.",
  alternates: { canonical: `${BASE_URL}/privacy-policy` },
  robots: {
    index: true,
    follow: false,
  },
  openGraph: {
    title: "Privacy Policy — Somana",
    description: "Read Somana's privacy policy and how we protect your data.",
    url: `${BASE_URL}/privacy-policy`,
    type: "website",
    images: [{ url: `${BASE_URL}/logo.png`, width: 1200, height: 630, alt: "Privacy Policy — Somana" }],
  },
};

const page = () => {
  return (
    <div className="flex flex-col items-center my-32">
      <div className="w-full max-w-[800px] px-4">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-stone-500 text-sm mb-4">Last updated: June 2025</p>
        <div className="prose prose-stone max-w-none text-stone-700 space-y-4">
          <p>
            Somana (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates somana.in. This page informs you of our policies
            regarding the collection, use, and disclosure of personal data when you use our Service.
          </p>
          <h2 className="text-xl font-semibold mt-6">Information We Collect</h2>
          <p>
            We collect information you provide directly (name, email, profile photo) via account registration
            or social login (Google, GitHub). We also collect usage data such as pages visited and content
            interacted with via Google Analytics.
          </p>
          <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, personalize your experience,
            and communicate with you about your account.
          </p>
          <h2 className="text-xl font-semibold mt-6">Data Storage</h2>
          <p>
            User data is stored securely in MongoDB. Media files are stored on Supabase Storage.
            We do not sell your personal data.
          </p>
          <h2 className="text-xl font-semibold mt-6">Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, contact us at privacy@somana.in
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
