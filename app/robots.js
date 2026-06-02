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
        ],
      },
    ],
    sitemap: "https://www.somana.in/sitemap.xml",
    host: "https://www.somana.in",
  };
}
