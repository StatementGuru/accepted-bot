// middleware.js
// Place this file at the ROOT of your Next.js project (same level as package.json, next.config.js)
// Handles subdomain-based routing so studio.accepted.bot serves /studio routes
// while accepted.bot continues to serve the existing undergrad UI.

import { NextResponse } from 'next/server';

export function middleware(req) {
  const hostname = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  // Detect studio subdomain
  // Matches: studio.accepted.bot, studio.localhost (for dev), studio.<anything>
  const isStudio = hostname.startsWith('studio.');

  // Avoid rewriting if we're already in /studio path (prevents loops)
  if (isStudio && !url.pathname.startsWith('/studio') && !url.pathname.startsWith('/api')) {
    url.pathname = `/studio${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // Future subdomains drop in here the same way:
  // const isLaw = hostname.startsWith('law.');
  // const isMed = hostname.startsWith('med.');
  // etc.

  return NextResponse.next();
}

// Run middleware on all routes except Next.js internals and static assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
