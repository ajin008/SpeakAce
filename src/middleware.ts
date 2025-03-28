import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: ["/"],
  afterAuth(auth, req) {
    // Handle all Clerk domain redirects
    if (req.nextUrl.host.includes("accounts.dev")) {
      return Response.redirect(new URL("/", req.url));
    }

    // Protect non-public routes
    if (!auth.userId && !auth.isPublicRoute) {
      return auth.redirectToSignIn({ returnBackUrl: req.url });
    }
  },
});
