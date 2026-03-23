import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const BAD_HOSTS = new Set(["0.0.0.0", "127.0.0.1", "localhost"]);

function isPrivateIpv4(hostname: string) {
  if (/^10\./.test(hostname)) return true;
  if (/^192\.168\./.test(hostname)) return true;
  const match = hostname.match(/^172\.(\d{1,3})\./);
  if (match) {
    const second = Number(match[1]);
    return second >= 16 && second <= 31;
  }
  return false;
}

function isSpecialLocalHostname(hostname: string) {
  return hostname.endsWith('.local') || hostname.endsWith('.internal');
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");
  if (!src) {
    return new NextResponse("Missing src", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(src);
  } catch {
    return new NextResponse("Invalid src", { status: 400 });
  }

  if (!["http:", "https:"].includes(target.protocol)) {
    return new NextResponse("Unsupported protocol", { status: 400 });
  }

  if (BAD_HOSTS.has(target.hostname)) {
    target.hostname = "127.0.0.1";
    if (!target.port && request.nextUrl.port) target.port = request.nextUrl.port;
  } else if (isPrivateIpv4(target.hostname) || isSpecialLocalHostname(target.hostname)) {
    target.hostname = "127.0.0.1";
  }

  try {
    const upstream = await fetch(target.toString(), {
      headers: {
        accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return new NextResponse("Image unavailable", { status: upstream.status });
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await upstream.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new NextResponse("Image fetch failed", { status: 502 });
  }
}
