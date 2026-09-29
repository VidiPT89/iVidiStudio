import { describe, expect, it } from "vitest";
import { parseFrontmatter, parseHistory, parseRecord, parseTicket, summarize } from "../scripts/lib/parse.mjs";

const ticket = `---
id: T-20260929-001
titulo: "Site para restaurante # Cascais"
piso-destino: 01-vendas
prioridade: P1
estado: em-curso            # comentário
requer-aprovacao: true
acao-aprovacao: enviar proposta a CLI-0001
criado: 2026-09-29
---

# Site para restaurante

## Pedido
<!-- nota interna -->
Quer um site com reservas.

## Histórico
| Data | Piso | Ação | Estado |
|------|------|------|--------|
| 2026-09-29 | 00-rececao | Ticket criado | entrada |
| 2026-09-30 | 01-vendas | Proposta pronta | aguarda-aprovacao |
`;

describe("parseFrontmatter", () => {
  it("reads values, drops inline comments and keeps # inside quotes", () => {
    const { data } = parseFrontmatter(ticket);
    expect(data.titulo).toBe("Site para restaurante # Cascais");
    expect(data.estado).toBe("em-curso");
    expect(data["requer-aprovacao"]).toBe(true);
  });

  it("returns the whole text as body when there is no frontmatter", () => {
    expect(parseFrontmatter("# só texto")).toEqual({ data: {}, body: "# só texto" });
  });
});

describe("parseTicket", () => {
  it("uses the folder as the state and parses request and history", () => {
    const t = parseTicket(ticket, "aguarda-aprovacao");
    expect(t.state).toBe("aguarda-aprovacao");
    expect(t.declaredState).toBe("em-curso");
    expect(t.priority).toBe("P1");
    expect(t.request).toBe("Quer um site com reservas.");
    expect(t.updated).toBe("2026-09-29");
    expect(t.history).toHaveLength(2);
    expect(t.history[1]).toEqual({ data: "2026-09-30", piso: "01-vendas", acao: "Proposta pronta", estado: "aguarda-aprovacao" });
  });

  it("falls back to P2 for unknown priorities", () => {
    expect(parseTicket("---\nprioridade: urgente\n---\n", "entrada").priority).toBe("P2");
  });

  it("ignores the template's placeholder history rows", () => {
    expect(parseHistory("## Histórico\n| AAAA-MM-DD | x | y | z |\n")).toEqual([]);
  });
});

describe("parseRecord", () => {
  it("takes the date from the file name and the title from the first heading", () => {
    expect(parseRecord("2026-09-29-decisao.md", "# Aceitar projeto\n")).toEqual({
      file: "2026-09-29-decisao.md",
      date: "2026-09-29",
      title: "Aceitar projeto",
    });
  });
});

describe("summarize", () => {
  it("counts tickets by state and by floor", () => {
    const s = summarize([
      { state: "entrada", floor: "" },
      { state: "em-curso", floor: "01-vendas" },
      { state: "concluido", floor: "01-vendas" },
    ]);
    expect(s.total).toBe(3);
    expect(s.byState).toEqual({ entrada: 1, "em-curso": 1, "aguarda-aprovacao": 0, concluido: 1 });
    expect(s.byFloor["01-vendas"]["em-curso"]).toBe(1);
    expect(s.byFloor["sem-destino"].entrada).toBe(1);
  });
});
