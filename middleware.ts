import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes and static assets
    if (
        PUBLIC_ROUTES.some((route) => pathname.startsWith(route)) ||
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/images") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Check for auth token
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
