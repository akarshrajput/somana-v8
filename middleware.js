import { NextResponse } from "next/server";

export function middleware(request) {
  const { hostname, pathname, search } = request.nextUrl;

  // Redirect non-www to www (permanent 308)
  if (hostname === "somana.in") {
    const url = new URL(`https://www.somana.in${pathname}${search}`);
    return NextResponse.redirect(url, 308);
  }

  // Redirect /story/topic/Uppercase to /story/topic/lowercase (permanent 308)
  const topicMatch = pathname.match(/^\/story\/topic\/([^/]+)$/);
  if (topicMatch) {
    const topic = topicMatch[1];
    const lowered = topic.toLowerCase();
    if (topic !== lowered) {
      const url = request.nextUrl.clone();
      url.pathname = `/story/topic/${lowered}`;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff2?|ttf)).*)" ],
};
