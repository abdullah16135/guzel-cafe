const BAD_HOSTS = new Set(["0.0.0.0", "127.0.0.1", "localhost"]);

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

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

export function shouldProxyMedia(src?: string | null): boolean {
  if (!src || !isAbsoluteUrl(src)) return false;

  try {
    const url = new URL(src);
    return BAD_HOSTS.has(url.hostname) || isPrivateIpv4(url.hostname) || isSpecialLocalHostname(url.hostname);
  } catch {
    return false;
  }
}

export function resolveMediaUrl(src?: string | null): string | null {
  if (!src) return null;
  if (!isAbsoluteUrl(src)) return src;

  try {
    const url = new URL(src);
    if (BAD_HOSTS.has(url.hostname) || isPrivateIpv4(url.hostname) || isSpecialLocalHostname(url.hostname)) {
      return `/api/media?src=${encodeURIComponent(src)}`;
    }
    return src;
  } catch {
    return src;
  }
}
