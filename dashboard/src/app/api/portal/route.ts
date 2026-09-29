import { createHmac, timingSafeEqual } from "node:crypto";
import { nextTicketId, slugify, ticketDate, ticketMarkdown, validate } from "@/lib/portal";

// Client Portal webhook → new ticket in elevador/entrada/ (committed through the GitHub API).
// Required env: PORTAL_WEBHOOK_SECRET, GITHUB_TOKEN (contents:write), GITHUB_REPO (owner/name).

const STATES = ["entrada", "em-curso", "aguarda-aprovacao", "concluido"];
const MAX_BODY = 16_000;

function signatureOk(raw: string, header: string | null, secret: string) {
  if (!header?.startsWith("sha256=")) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(raw).digest("hex"));
  const given = Buffer.from(header.slice(7));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

async function github(path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${process.env.GITHUB_REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...init.headers,
    },
  });
}

async function existingTicketFiles() {
  const lists = await Promise.all(
    STATES.map(async (s) => {
      const res = await github(`contents/elevador/${s}`);
      return res.ok ? ((await res.json()) as { name: string }[]).map((f) => f.name) : [];
    }),
  );
  return lists.flat();
}

export async function POST(request: Request) {
  const { PORTAL_WEBHOOK_SECRET: secret, GITHUB_TOKEN, GITHUB_REPO } = process.env;
  if (!secret) return Response.json({ error: "webhook not configured" }, { status: 503 });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return Response.json({ error: "payload too large" }, { status: 413 });
  if (!signatureOk(raw, request.headers.get("x-ividi-signature"), secret)) {
    return Response.json({ error: "invalid signature" }, { status: 401 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }
  const result = validate(parsed);
  if (!result.ok) return Response.json({ error: result.error }, { status: 422 });
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return Response.json({ error: "GitHub access not configured" }, { status: 503 });
  }

  const date = ticketDate(new Date());
  const files = await existingTicketFiles();

  // Two attempts in case another request took the same number in the meantime.
  for (let attempt = 0; attempt < 2; attempt++) {
    const id = nextTicketId(date, files);
    const path = `elevador/entrada/${id}-${slugify(result.value.title)}.md`;
    const res = await github(`contents/${path}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `feat(elevador): novo pedido do portal ${id}`,
        content: Buffer.from(ticketMarkdown(id, date, result.value)).toString("base64"),
      }),
    });
    if (res.ok) return Response.json({ id, path }, { status: 201 });
    if (res.status !== 422) return Response.json({ error: "could not create ticket" }, { status: 502 });
    files.push(`${id}-`);
  }
  return Response.json({ error: "could not allocate ticket id" }, { status: 409 });
}
