import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://workbond-api.vercel.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  try {
    // Safely await params
    let path: string[] = [];
    try {
      const resolvedParams = await params;
      path = resolvedParams?.path || [];
    } catch (paramError) {
      console.error("Error resolving params:", paramError);
      return NextResponse.json(
        { success: false, error: "Invalid request parameters" },
        { status: 400 }
      );
    }

    if (!Array.isArray(path) || path.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid path" },
        { status: 400 }
      );
    }

    // Build target URL
    const pathString = path.join("/");
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const queryString = searchParams ? `?${searchParams}` : "";
    const targetUrl = `${API_BASE_URL}/api/${pathString}${queryString}`;

    // Build headers
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    // Set Content-Type only for methods that send bodies
    if (["POST", "PUT", "PATCH"].includes(method)) {
      headers["Content-Type"] = "application/json";
    }

    // Forward authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    // Forward cookies
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    // Get request body only for methods that have bodies
    let body: string | undefined = undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        const contentLength = request.headers.get("content-length");
        const contentType = request.headers.get("content-type");

        // Only read body if we have content
        if (contentLength && parseInt(contentLength) > 0) {
          body = await request.text();
          if (!body || body.trim().length === 0) {
            body = undefined;
          }
        } else if (contentType?.includes("application/json")) {
          // Try reading if content-type suggests JSON
          try {
            body = await request.text();
            if (!body || body.trim().length === 0) {
              body = undefined;
            }
          } catch {
            body = undefined;
          }
        }
      } catch (bodyError) {
        // No body is fine
        body = undefined;
      }
    }

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      fetchOptions.body = body;
    }

    // Make the request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(targetUrl, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse response - read body once
      let data: any;
      const contentType = response.headers.get("content-type") || "";
      const responseText = await response.text();

      if (contentType.includes("application/json")) {
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (parseError) {
          // If JSON parse fails, return error object
          console.error("JSON parse error:", parseError);
          data = {
            success: false,
            error: "Invalid JSON response",
            raw: responseText.substring(0, 200), // First 200 chars for debugging
          };
        }
      } else {
        data = responseText;
      }

      // Create Next.js response
      const nextResponse = NextResponse.json(data, {
        status: response.status,
        statusText: response.statusText,
      });

      // Forward cookies
      const setCookieHeaders = response.headers.getSetCookie();
      if (setCookieHeaders && setCookieHeaders.length > 0) {
        setCookieHeaders.forEach((cookie) => {
          nextResponse.headers.append("Set-Cookie", cookie);
        });
      }

      // Forward cache control
      const cacheControl = response.headers.get("cache-control");
      if (cacheControl) {
        nextResponse.headers.set("Cache-Control", cacheControl);
      }

      return nextResponse;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        return NextResponse.json(
          { success: false, error: "Request timeout" },
          { status: 504 }
        );
      }

      // Re-throw to be caught by outer catch
      throw fetchError;
    }
  } catch (error: any) {
    // Log error for debugging
    const errorMessage = error?.message || "Unknown error";
    const errorStack = error?.stack;

    console.error("[API Proxy Error]", {
      method,
      error: errorMessage,
      stack: errorStack,
    });

    // Return user-friendly error
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: errorMessage,
        ...(process.env.NODE_ENV === "development" && { stack: errorStack }),
      },
      { status: 500 }
    );
  }
}
