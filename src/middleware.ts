import { NextRequest, NextResponse } from "next/server";
import {
  isDev,
  safeStringify,
  maskSensitiveData,
  formatBytes,
} from "@/lib/utils";

const need  = false; // Set to true if you want to enable logging in production
export async function middleware(request: NextRequest) {
  // Only log in development environment
  if (!isDev || !need) {
    return NextResponse.next();
  }

  const start = Date.now();
  const { pathname, search } = request.nextUrl;
  const method = request.method;
  const url = `${pathname}${search}`;

  // Log request details
  console.log("\n🚀 === INCOMING REQUEST ===");
  console.log(`📍 Route: ${method} ${url}`);
  console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
  console.log(
    `🌐 User Agent: ${request.headers.get("user-agent") || "Unknown"}`,
  );
  console.log(
    `📡 IP: ${request.ip || request.headers.get("x-forwarded-for") || "Unknown"}`,
  );

  // Log headers (mask sensitive ones)
  console.log("📋 Headers:");
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const maskedHeaders = maskSensitiveData(headers);
  console.log(safeStringify(maskedHeaders, 2));

  // Log cookies
  console.log("🍪 Cookies:");
  const cookieEntries = request.cookies.getAll();
  if (cookieEntries.length > 0) {
    const cookies: Record<string, string> = {};
    cookieEntries.forEach((cookie) => {
      cookies[cookie.name] = cookie.value;
    });
    const maskedCookies = maskSensitiveData(cookies);
    console.log(safeStringify(maskedCookies, 2));
  } else {
    console.log("  No cookies");
  }

  // Log request body (for POST, PUT, PATCH requests)
  let requestBody = null;
  if (["POST", "PUT", "PATCH"].includes(method)) {
    try {
      // Clone the request to read the body without consuming it
      const clonedRequest = request.clone();
      const body = await clonedRequest.text();

      if (body) {
        const bodySize = new TextEncoder().encode(body).length;
        console.log(`📦 Request Body (${formatBytes(bodySize)}):`);
        try {
          // Try to parse as JSON for prettier output
          const jsonBody = JSON.parse(body);
          const maskedBody = maskSensitiveData(jsonBody);
          console.log(safeStringify(maskedBody, 2));
          requestBody = jsonBody;
        } catch {
          // If not JSON, log as text (truncate if too long)
          const truncatedBody =
            body.length > 1000
              ? body.substring(0, 1000) + "... (truncated)"
              : body;
          console.log(truncatedBody);
          requestBody = body;
        }
      } else {
        console.log("📦 Request Body: Empty");
      }
    } catch (error) {
      console.log("📦 Request Body: Could not read body -", error);
    }
  }

  // Continue with the request
  const response = NextResponse.next();

  // Log response details
  const duration = Date.now() - start;
  console.log("\n📤 === OUTGOING RESPONSE ===");
  console.log(`📍 Route: ${method} ${url}`);
  console.log(`⏱️  Duration: ${duration}ms`);
  console.log(
    `🔢 Status: ${response.status} ${getStatusText(response.status)}`,
  );

  // Log response headers
  console.log("📋 Response Headers:");
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });
  console.log(safeStringify(responseHeaders, 2));

  // Log response cookies (if any were set)
  const responseCookies = response.cookies.getAll();
  if (responseCookies.length > 0) {
    console.log("🍪 Response Cookies:");
    const cookies: Record<string, string> = {};
    responseCookies.forEach((cookie) => {
      cookies[cookie.name] = cookie.value;
    });
    const maskedCookies = maskSensitiveData(cookies);
    console.log(safeStringify(maskedCookies, 2));
  }

  console.log("=".repeat(50));

  return response;
}

// Helper function to get status text
function getStatusText(status: number): string {
  const statusTexts: Record<number, string> = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };
  return statusTexts[status] || "";
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
