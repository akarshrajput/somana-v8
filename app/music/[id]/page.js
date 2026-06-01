import FullMusic from "@/app/_components/musicComponents/FullMusic";
import Script from "next/script";
import React from "react";

const BASE_URL = "https://somana.in";

async function fetchMusicData(id) {
  try {
    let baseUrl = process.env.HOSTNAME || "http://localhost:3000";
    if (!baseUrl.startsWith("http://") && !baseUrl.startsWith("https://")) {
      baseUrl = `http://${baseUrl}`;
    }
    const res = await fetch(`${baseUrl}/api/v1/music/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const track = await fetchMusicData(id);

  if (!track) {
    return {
      title: "Track Not Found — Somana",
      robots: { index: false, follow: false },
    };
  }

  const ogImage = track.featuredImage || `${BASE_URL}/logo.png`;

  return {
    title: `${track.name} — Somana Music`,
    description:
      track.description ||
      `Listen to "${track.name}" on Somana. Original music from independent artists.`,
    alternates: { canonical: `${BASE_URL}/music/${id}` },
    openGraph: {
      title: `${track.name} — Somana Music`,
      description:
        track.description || `Listen to "${track.name}" on Somana Music.`,
      url: `${BASE_URL}/music/${id}`,
      type: "music.song",
      siteName: "Somana",
      images: [{ url: ogImage, width: 1200, height: 630, alt: track.name }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@somana_in",
      title: `${track.name} — Somana Music`,
      description: track.description || `Listen to "${track.name}" on Somana.`,
      images: [ogImage],
    },
  };
}

const page = async ({ params }) => {
  const { id } = await params;
  const track = await fetchMusicData(id);

  const musicJsonLd = track
    ? {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        name: track.name,
        description: track.description || "",
        image: track.featuredImage || `${BASE_URL}/logo.png`,
        url: `${BASE_URL}/music/${id}`,
        inAlbum: track.album
          ? { "@type": "MusicAlbum", name: track.album }
          : undefined,
        byArtist: track.artist
          ? { "@type": "MusicGroup", name: track.artist }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: "Somana",
          url: BASE_URL,
        },
      }
    : null;

  return (
    <>
      {musicJsonLd && (
        <Script
          id="music-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicJsonLd) }}
        />
      )}
      <div className="flex flex-col items-center my-4">
        <div className="w-full max-w-[1200px] px-2">
          <FullMusic id={id} />
        </div>
      </div>
    </>
  );
};

export default page;
