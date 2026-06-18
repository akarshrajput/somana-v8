const BASE_URL = "https://www.somana.in";

// Static routes
const staticRoutes = [
  { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/careers`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/contribute`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  { url: `${BASE_URL}/creators`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/events`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: "always", priority: 0.5 },
  { url: `${BASE_URL}/podcast`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
];

const storyTopics = [];

async function fetchAllBlogSlugs() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/blogs?limit=1000&fields=slug,updatedAt`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.blogs || [];
  } catch {
    return [];
  }
}

async function fetchAllUsernames() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/users?limit=1000&fields=userName,updatedAt`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.users || [];
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const [blogs, users] = await Promise.allSettled([
    fetchAllBlogSlugs(),
    fetchAllUsernames(),
  ]);

  const blogRoutes =
    blogs.status === "fulfilled"
      ? blogs.value.map((blog) => ({
          url: `${BASE_URL}/story/${blog.slug}`,
          lastModified: blog.updatedAt ? new Date(blog.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.9,
        }))
      : [];

  const userRoutes =
    users.status === "fulfilled"
      ? users.value.map((user) => ({
          url: `${BASE_URL}/user/${user.userName}`,
          lastModified: user.updatedAt ? new Date(user.updatedAt) : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        }))
      : [];

  const topicRoutes = storyTopics.map((topic) => ({
    url: `${BASE_URL}/story/topic/${topic.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...topicRoutes,
    ...blogRoutes,
    ...userRoutes,
  ];
}
