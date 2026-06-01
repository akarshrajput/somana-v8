"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Avoid tracking admin paths, login, or api routes
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api") || pathname.startsWith("/login")) {
      return;
    }

    // Avoid double tracking in React 18/19 Strict Mode for the exact same path load
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    const trackPageView = async () => {
      try {
        await axios.post("/api/v1/analytics/track", {
          path: pathname,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        });
      } catch (err) {
        // Silent fail
      }
    };

    trackPageView();
  }, [pathname]);

  return null;
}
