// Reads the building (elevator tickets + floor records) and writes
// src/data/building.json, which the dashboard renders at build time.
import { mkdirSync, readdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STATES, parseRecord, parseTicket, summarize } from "./lib/parse.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = process.env.IVIDI_HQ_ROOT ?? join(here, "..", "..");
const out = join(here, "..", "src", "data", "building.json");

const markdown = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".md")).sort() : [];

const tickets = STATES.flatMap((state) => {
  const dir = join(root, "elevador", state);
  return markdown(dir)
    .filter((f) => f.startsWith("T-"))
    .map((f) => parseTicket(readFileSync(join(dir, f), "utf8"), state));
});

for (const t of tickets) {
  if (t.declaredState && t.declaredState !== t.state) {
    console.warn(`aviso: ${t.id} está em elevador/${t.state}/ mas declara "estado: ${t.declaredState}"`);
  }
}

const floorsDir = join(root, "pisos");
const floors = (existsSync(floorsDir) ? readdirSync(floorsDir) : [])
  .filter((slug) => existsSync(join(floorsDir, slug, "README.md")))
  .map((slug) => {
    const recordsDir = join(floorsDir, slug, "registos");
    const records = markdown(recordsDir).map((f) =>
      parseRecord(f, readFileSync(join(recordsDir, f), "utf8")),
    );
    return { slug, records };
  });

const recent = floors
  .flatMap((f) => f.records.map((r) => ({ ...r, floor: f.slug })))
  .sort((a, b) => b.date.localeCompare(a.date) || b.file.localeCompare(a.file))
  .slice(0, 8);

const snapshot = {
  generatedAt: new Date().toISOString(),
  summary: summarize(tickets),
  tickets,
  records: Object.fromEntries(floors.map((f) => [f.slug, f.records.length])),
  recent,
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n");
console.log(`building.json: ${tickets.length} tickets, ${floors.length} floors`);
