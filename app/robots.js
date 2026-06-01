export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/me",
          "/me/",
          "/story/write",
          "/story/edit/",
          "/upload",
          "/upload/",
          "/podcast/upload",
          "/music/upload",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/me",
          "/story/write",
          "/story/edit/",
          "/upload",
          "/podcast/upload",
          "/music/upload",
        ],
      },
    ],
    sitemap: "https://somana.in/sitemap.xml",
    host: "https://somana.in",
  };
}
