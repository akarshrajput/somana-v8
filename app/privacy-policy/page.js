import React from "react";

const BASE_URL = "https://www.somana.in";

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
            interacted with via Google Analytics. When you publish stories, share podcasts, or upload notes, 
            the content and associated metadata you provide are stored on our servers to deliver the service.
          </p>
          <h2 className="text-xl font-semibold mt-6">How We Use Your Information</h2>
          <p>
            Your information is used to provide and improve our services, personalize your experience,
            and communicate with you about your account. We use analytics data to understand how users interact 
            with the platform so we can improve performance, fix bugs, and develop new features. We never use 
            your personal data for targeted advertising or sell it to third-party advertisers.
          </p>
          <h2 className="text-xl font-semibold mt-6">Cookies and Tracking</h2>
          <p>
            Somana uses cookies to maintain your login session and remember your preferences. We also use 
            Google Analytics cookies to collect anonymous usage statistics. These cookies help us understand 
            which pages are most popular, how users navigate the site, and where we can improve the experience. 
            You can disable cookies in your browser settings, but some features of the platform may not function 
            correctly without them.
          </p>
          <h2 className="text-xl font-semibold mt-6">Third-Party Services</h2>
          <p>
            We use the following third-party services to operate Somana: Google Analytics for website analytics, 
            Google AdSense for displaying advertisements, Supabase for media file storage, MongoDB Atlas for 
            database hosting, and NextAuth.js for authentication. Each of these services has its own privacy 
            policy that governs how they handle data. We encourage you to review their policies for detailed 
            information about their data practices.
          </p>
          <h2 className="text-xl font-semibold mt-6">Data Storage and Security</h2>
          <p>
            User data is stored securely in MongoDB Atlas with encryption at rest. Media files including images, 
            audio tracks, and podcast episodes are stored on Supabase Storage. We implement industry-standard 
            security measures including HTTPS encryption, secure authentication tokens, and regular security 
            reviews. We do not sell your personal data to any third party.
          </p>
          <h2 className="text-xl font-semibold mt-6">Data Retention</h2>
          <p>
            We retain your account information and content for as long as your account is active. If you choose 
            to delete your account, we will remove your personal information and content from our servers within 
            a reasonable timeframe. Some anonymized usage data may be retained for analytics purposes even after 
            account deletion.
          </p>
          <h2 className="text-xl font-semibold mt-6">Your Rights</h2>
          <p>
            You have the right to access, update, or delete your personal information at any time through your 
            account settings. You may also request a copy of your data or ask us to restrict processing of your 
            information by contacting us directly. If you are a resident of the European Union, you have 
            additional rights under the General Data Protection Regulation (GDPR).
          </p>
          <h2 className="text-xl font-semibold mt-6">Children&apos;s Privacy</h2>
          <p>
            Somana is not intended for use by children under the age of 13. We do not knowingly collect personal 
            information from children. If we become aware that a child under 13 has provided us with personal 
            data, we will take steps to delete such information from our servers promptly.
          </p>
          <h2 className="text-xl font-semibold mt-6">Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
            the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. We encourage you to review 
            this Privacy Policy periodically for any changes.
          </p>
          <h2 className="text-xl font-semibold mt-6">Contact</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your data, contact us at{" "}
            <a href="mailto:privacy@somana.in" className="text-blue-600 hover:underline">privacy@somana.in</a>. 
            We aim to respond to all privacy-related inquiries within 48 business hours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
