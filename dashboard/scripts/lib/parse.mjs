// Parsing of the building's Markdown files (tickets and records).
// Pure functions only, so they can be unit-tested without touching the disk.

export const STATES = ["entrada", "em-curso", "aguarda-aprovacao", "concluido"];

const PRIORITIES = ["P0", "P1", "P2", "P3"];

function cleanValue(raw) {
  // Drop inline comments ("value   # comment") but keep "#" inside quotes.
  let value = raw.trim();
  if (!value.startsWith('"') && !value.startsWith("'")) {
    value = value.replace(/\s+#.*$/, "").trim();
  }
  if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

/** @returns {{ data: Record<string, string | boolean>, body: string }} */
export function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(text);
  if (!match) return { data: {}, body: text };
  /** @type {Record<string, string | boolean>} */
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (kv) data[kv[1]] = cleanValue(kv[2]);
  }
  return { data, body: text.slice(match[0].length) };
}

export function parseHistory(body) {
  const section = /##\s+Hist[óo]rico\s*\n([\s\S]*?)(\n##\s|$)/.exec(body);
  if (!section) return [];
  return section[1]
    .split("\n")
    .filter((l) => /^\|\s*\d{4}-\d{2}-\d{2}/.test(l))
    .map((l) => {
      const [data, piso, acao, estado] = l.split("|").slice(1, -1).map((c) => c.trim());
      return { data, piso, acao, estado };
    });
}

function section(body, title) {
  const re = new RegExp(`##\\s+${title}\\s*\\n([\\s\\S]*?)(\\n##\\s|$)`);
  const m = re.exec(body);
  if (!m) return "";
  return m[1].replace(/<!--[\s\S]*?-->/g, "").trim();
}

export function parseTicket(text, folderState) {
  const { data, body } = parseFrontmatter(text);
  const titleLine = /^#\s+(.+)$/m.exec(body);
  const priority = PRIORITIES.includes(data.prioridade) ? data.prioridade : "P2";
  return {
    id: String(data.id ?? ""),
    title: String(data.titulo || titleLine?.[1] || data.id || ""),
    // The folder is the source of truth for the state.
    state: folderState,
    declaredState: String(data.estado ?? ""),
    origin: String(data.origem ?? ""),
    floor: String(data["piso-destino"] ?? ""),
    priority,
    type: String(data.tipo ?? ""),
    clientRef: String(data["cliente-ref"] ?? ""),
    product: String(data.produto ?? ""),
    needsApproval: data["requer-aprovacao"] === true,
    approvalAction: String(data["acao-aprovacao"] ?? ""),
    created: String(data.criado ?? ""),
    updated: String(data.atualizado ?? data.criado ?? ""),
    request: section(body, "Pedido"),
    history: parseHistory(body),
  };
}

export function parseRecord(fileName, text) {
  const date = /^(\d{4}-\d{2}-\d{2})/.exec(fileName)?.[1] ?? "";
  const title = /^#\s+(.+)$/m.exec(text)?.[1]?.trim() ?? fileName.replace(/\.md$/, "");
  return { file: fileName, date, title };
}

/**
 * @param {{ state: string, floor: string }[]} tickets
 * @returns {{ byState: Record<string, number>, byFloor: Record<string, Record<string, number>>, total: number }}
 */
export function summarize(tickets) {
  const byState = Object.fromEntries(STATES.map((s) => [s, 0]));
  /** @type {Record<string, Record<string, number>>} */
  const byFloor = {};
  for (const t of tickets) {
    byState[t.state] += 1;
    const key = t.floor || "sem-destino";
    byFloor[key] ??= Object.fromEntries(STATES.map((s) => [s, 0]));
    byFloor[key][t.state] += 1;
  }
  return { byState, byFloor, total: tickets.length };
}
