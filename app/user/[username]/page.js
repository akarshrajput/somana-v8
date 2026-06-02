import UserDataTabs from "@/app/_components/userComponents/UserDataTabs";
import UserProfile from "@/app/_components/userComponents/UserProfile";
import Script from "next/script";
import axios from "axios";

const BASE_URL = "https://www.somana.in";

const fetchUserProfile = async (username) => {
  let baseUrl = process.env.HOSTNAME || "http://localhost:3000";
  if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
    baseUrl = `http://${baseUrl}`;
  }
  const res = await axios.get(
    `${baseUrl}/api/v1/users/userName/${username}`
  );
  return res.data?.data;
};

export async function generateMetadata({ params }) {
  const { username } = await params;
  try {
    const userProfile = await fetchUserProfile(username);
    if (!userProfile) {
      return {
        title: "User Not Found",
        robots: { index: false, follow: false },
      };
    }
    const ogImage = userProfile.photo || `${BASE_URL}/logo.png`;
    return {
      title: `${userProfile.name} (@${userProfile.userName}) — Somana`,
      description:
        userProfile.bio ||
        `Explore stories and podcasts by ${userProfile.name} on Somana.`,
      alternates: { canonical: `${BASE_URL}/user/${username}` },
      openGraph: {
        type: "profile",
        url: `${BASE_URL}/user/${username}`,
        title: `${userProfile.name} on Somana`,
        description:
          userProfile.bio ||
          `Explore content by ${userProfile.name} on Somana.`,
        siteName: "Somana",
        images: [
          { url: ogImage, width: 400, height: 400, alt: userProfile.name },
        ],
      },
      twitter: {
        card: "summary",
        site: "@somana_in",
        title: `${userProfile.name} (@${userProfile.userName}) — Somana`,
        description:
          userProfile.bio ||
          `Explore content by ${userProfile.name} on Somana.`,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Creator Profile — Somana" };
  }
}

const Page = async ({ params }) => {
  const { username } = await params;

  const userProfile = await fetchUserProfile(username);

  if (!userProfile) {
    return <p className="text-center text-red-500">User not found</p>;
  }

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: userProfile.name,
    url: `${BASE_URL}/user/${username}`,
    image: userProfile.photo || `${BASE_URL}/logo.png`,
    description: userProfile.bio || "",
    sameAs: [],
    worksFor: { "@type": "Organization", name: "Somana", url: BASE_URL },
  };

  return (
    <>
      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <div className="flex flex-col items-center my-32">
        <div className="w-full max-w-[1200px]">
          <div className="px-1">
            <UserProfile userProfile={userProfile} />
          </div>
          <div className="mt-6">
            <UserDataTabs userId={userProfile?._id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;

