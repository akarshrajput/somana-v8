export const metadata = {
  title: "Sign In — Somana",
  description:
    "Sign in or create your Somana account to start writing stories, uploading podcasts, and publishing notes. Join the world's creative content community.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Sign In — Somana",
    description: "Join Somana — A global creative content platform for stories, podcasts, and notes.",
    type: "website",
    images: [{ url: "https://www.somana.in/logo.png", width: 1200, height: 630 }],
  },
};

export default function LoginLayout({ children }) {
  return children;
}
