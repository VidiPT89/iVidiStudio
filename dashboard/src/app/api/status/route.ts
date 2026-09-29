// Uptime of the public sites, checked server-side (browsers can't, because of CORS).
export const revalidate = 300;

const SITES = [
  { name: "ividi.dev", url: "https://ividi.dev" },
  { name: "portal.ividi.dev", url: "https://portal.ividi.dev" },
];

async function check(site: (typeof SITES)[number]) {
  const started = Date.now();
  try {
    const res = await fetch(site.url, { method: "HEAD", redirect: "follow", signal: AbortSignal.timeout(8000) });
    return { ...site, up: res.status < 500, ms: Date.now() - started };
  } catch {
    return { ...site, up: false, ms: null };
  }
}

export async function GET() {
  return Response.json({ checkedAt: new Date().toISOString(), sites: await Promise.all(SITES.map(check)) });
}
