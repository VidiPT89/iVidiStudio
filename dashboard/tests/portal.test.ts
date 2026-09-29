import { describe, expect, it } from "vitest";
import { nextTicketId, redact, slugify, ticketMarkdown, validate } from "@/lib/portal";
import { parseTicket } from "../scripts/lib/parse.mjs";

describe("redact", () => {
  it("removes emails, phone numbers and NIF but keeps dates", () => {
    const out = redact("Falar com ana@exemplo.pt ou +351 912 345 678, NIF 123456789, até 2026-10-01");
    expect(out).not.toMatch(/ana@|912|123456789/);
    expect(out).toContain("2026-10-01");
  });
});

describe("validate", () => {
  const good = { clientRef: "CLI-0007", title: "Novo site", summary: "Quero um site." };

  it("accepts a minimal valid payload with defaults", () => {
    const r = validate(good);
    expect(r).toEqual({ ok: true, value: { ...good, type: "pedido-cliente", priority: "P2" } });
  });

  it.each([
    [null, "JSON object"],
    [{ ...good, clientRef: "ana@exemplo.pt" }, "clientRef"],
    [{ ...good, type: "hack" }, "type"],
    [{ ...good, title: "x" }, "title"],
    [{ ...good, summary: "" }, "summary"],
    [{ ...good, priority: "P9" }, "priority"],
  ])("rejects %j", (input, field) => {
    const r = validate(input);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain(field);
  });

  it("flattens the title to one line so it cannot break the frontmatter", () => {
    const r = validate({ ...good, title: "linha 1\n---\nid: falso" });
    expect(r.ok && r.value.title).toBe("linha 1 --- id: falso");
  });
});

describe("nextTicketId", () => {
  it("continues the day's sequence across all states", () => {
    expect(nextTicketId("2026-09-29", [])).toBe("T-20260929-001");
    expect(nextTicketId("2026-09-29", ["T-20260929-002-a.md", "T-20260929-010-b.md", "T-20260928-050-c.md"])).toBe(
      "T-20260929-011",
    );
  });
});

describe("slugify", () => {
  it("makes safe file names", () => {
    expect(slugify("Site para o Restaurante Açoriano!")).toBe("site-para-o-restaurante-acoriano");
    expect(slugify("***")).toBe("pedido");
  });
});

describe("ticketMarkdown", () => {
  it("produces a ticket the dashboard parser understands", () => {
    const r = validate({ clientRef: "CLI-0007", title: 'Loja "online"', summary: "Detalhes", priority: "P1" });
    if (!r.ok) throw new Error(r.error);
    const t = parseTicket(ticketMarkdown("T-20260929-001", "2026-09-29", r.value), "entrada");
    expect(t).toMatchObject({ id: "T-20260929-001", title: "Loja 'online'", priority: "P1", clientRef: "CLI-0007", origin: "portal" });
    expect(t.request).toBe("Detalhes");
    expect(t.history).toHaveLength(1);
  });
});
