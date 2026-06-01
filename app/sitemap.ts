import { MetadataRoute } from "next";

const BASE_URL = "https://somana.in";

// Static routes with their SEO priority and change frequency
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/careers`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contribute`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/creators`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/events`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/privacy-policy`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/search`,
    lastModified: new Date(),
    changeFrequency: "always",
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/music`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/podcast`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  },
];

// Dynamic story topics
const storyTopics = [
  "Technology",
  "Science",
  "Culture",
  "Travel",
  "Food",
  "Lifestyle",
  "Business",
  "Health",
  "Entertainment",
  "Sports",
  "Art",
  "Photography",
  "History",
  "Politics",
  "Education",
  "Notes",
];

async function fetchAllBlogSlugs(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/blogs?limit=1000&fields=slug,updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.blogs || [];
  } catch {
    return [];
  }
}

async function fetchAllUsernames(): Promise<{ userName: string; updatedAt: string }[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/users?limit=1000&fields=userName,updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.users || [];
  } catch {
    return [];
  }
}

async function fetchAllMusicIds(): Promise<{ _id: string; updatedAt: string }[]> {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/music?limit=1000&fields=_id,updatedAt`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.tracks || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogs, users, music] = await Promise.allSettled([
    fetchAllBlogSlugs(),
    fetchAllUsernames(),
    fetchAllMusicIds(),
  ]);

  const blogRoutes: MetadataRoute.Sitemap =
    blogs.status === "fulfilled"
      ? blogs.value.map((blog) => ({
          url: `${BASE_URL}/story/${blog.slug}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.9,
        }))
      : [];

  const userRoutes: MetadataRoute.Sitemap =
    users.status === "fulfilled"
      ? users.value.map((user) => ({
          url: `${BASE_URL}/user/${user.userName}`,
          lastModified: user.updatedAt ? new Date(user.updatedAt) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }))
      : [];

  const musicRoutes: MetadataRoute.Sitemap =
    music.status === "fulfilled"
      ? music.value.map((track) => ({
          url: `${BASE_URL}/music/${track._id}`,
          lastModified: track.updatedAt ? new Date(track.updatedAt) : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }))
      : [];

  const topicRoutes: MetadataRoute.Sitemap = storyTopics.map((topic) => ({
    url: `${BASE_URL}/story/topic/${topic.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...blogRoutes,
    ...userRoutes,
    ...musicRoutes,
  ];
}
