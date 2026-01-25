import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isOnLoginPage = req.nextUrl.pathname === "/login";
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth routes
  if (isAuthRoute) {
    return;
  }

  // Redirect logged-in users away from login page
  if (isLoggedIn && isOnLoginPage) {
    return Response.redirect(new URL("/", req.url));
  }

  // Redirect non-logged-in users to login page
  if (!isLoggedIn && !isOnLoginPage) {
    return Response.redirect(new URL("/login", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export const runtime = "nodejs";
