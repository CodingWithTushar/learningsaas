import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoutes = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
  "/about",
  "/social",
  "/uploadvideo",
  "/terms",
  "/privacy",
]);

const isPublicApiRoutes = createRouteMatcher(["/api/videos"]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "api/admin(.*)",
  "/dashboard/analytics",
]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth;
  const currentUrl = new URL(req.url);
  const isHomePage = currentUrl.pathname === "/home";
  const isApiReq = currentUrl.pathname.startsWith("/api");

  if (isAdminRoute(req)) {
    //If is not a user then redirect to the "/signin" route.
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    //If user is not an admin then redirect to the "/signin" route.
    if (userId.role !== "admin") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  //If user is LoggedIn and accessing the public route and this route is not a home then user will be go to the home route first then user can change it
  if (userId && isPublicRoutes(req) && !isHomePage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  //If the User is not LoggedIn
  if (!userId) {
    //ProtectedRoutes user can not access them without LoggedIn
    if (!isPublicRoutes(req) && !isPublicApiRoutes(req)) {
      const signinUrl = new URL("/sign-in", req.url);
      signinUrl.searchParams.set("redirect_url", currentUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }

    if (isApiReq && !isPublicApiRoutes(req)) {
      return NextResponse.json(
        {
          error: "UnAuthorized",
          message: "You must be logged in",
        },
        { status: 401 },
      );
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
      "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
