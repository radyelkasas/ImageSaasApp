import { clerkMiddleware } from "@clerk/nextjs/server";

// Use clerkMiddleware directly
export default clerkMiddleware();

// Configure matcher to EXCLUDE the /api/webhooks/clerk route
export const config = {
  matcher: [
    // Exclude webhook route and static files
    "/((?!api/webhooks/clerk|_next/static|_next/image|favicon.ico).*)",
  ],
};