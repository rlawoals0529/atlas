export const MAX_MEDIA_HTML_BYTES = 2 * 1024 * 1024;
export const MAX_MEDIA_IMAGE_BYTES = 16 * 1024 * 1024;
const MAX_MEDIA_REDIRECTS = 4;

const PRIVATE_HOST = /^(?:localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|100\.(?:6[4-9]|[789]\d|1[01]\d|12[0-7])\.|172\.(?:1[6-9]|2\d|3[01])\.|\[?::1\]?|\[?f[cd][0-9a-f:]*\]?|\[?fe[89ab][0-9a-f:]*\]?)/i;

export function safeHttpsUrl(value: string, base?: string): string | null {
  try {
    const url = new URL(value, base);
    if (
      url.protocol !== "https:"
      || url.username
      || url.password
      || PRIVATE_HOST.test(url.hostname)
      || !url.hostname.includes(".")
    ) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export async function fetchWithSafeRedirects(
  input: string,
  init: RequestInit = {},
  fetcher: typeof fetch = fetch,
): Promise<Response | null> {
  let current = safeHttpsUrl(input);
  if (!current) return null;

  for (let redirectCount = 0; redirectCount <= MAX_MEDIA_REDIRECTS; redirectCount += 1) {
    const response = await fetcher(current, { ...init, redirect: "manual" });
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    if (redirectCount === MAX_MEDIA_REDIRECTS) return null;
    const location = response.headers.get("location");
    current = location ? safeHttpsUrl(location, current) : null;
    if (!current) return null;
  }

  return null;
}

export async function readTextLimited(response: Response, maxBytes = MAX_MEDIA_HTML_BYTES): Promise<string | null> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return null;
  if (!response.body) return "";

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      result += decoder.decode(value, { stream: true });
    }
    result += decoder.decode();
    return result;
  } finally {
    reader.releaseLock();
  }
}

export async function readBytesLimited(response: Response, maxBytes = MAX_MEDIA_IMAGE_BYTES): Promise<Uint8Array | null> {
  const declaredLength = Number(response.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) return null;
  if (!response.body) return new Uint8Array();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const output = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}
