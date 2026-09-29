// The live demo: iVidi Studio working on its own, generated from the clock.
// Everything is a pure function of time, so every visitor sees the same building at
// the same moment, with no server, no database and no personal data. The products and
// services are the studio's real ones; the requests themselves are simulated.

import type { Lang } from "./i18n";

type Text = Record<Lang, string>;

export type TicketState = "entrada" | "em-curso" | "aguarda-aprovacao" | "concluido";
export const STATES: TicketState[] = ["entrada", "em-curso", "aguarda-aprovacao", "concluido"];

export type Priority = "P0" | "P1" | "P2" | "P3";

interface SimEvent {
  time: number;
  ticketId: string;
  floor: string;
  state: TicketState;
  action: Text;
}

export interface SimTicket {
  id: string;
  title: Text;
  priority: Priority;
  created: number;
  state: TicketState;
  floor: string;
  approvalAction: Text | null;
  history: SimEvent[];
}

export interface Simulation {
  now: number;
  tickets: SimTicket[];
  recent: SimEvent[];
  liveFloor: string;
  byFloor: Record<string, Record<TicketState, number>>;
  byState: Record<TicketState, number>;
  requestsToday: number;
  doneToday: number;
}

export const SLOT_MS = 7000;
/** The elevator stays at least this long on a floor, so the eye can follow it. */
const ELEVATOR_STOP_MS = 4000;
const DONE_VISIBLE_MS = 45_000;
const MAX_LIFETIME_MS = 260_000;
const DAY_MS = 86_400_000;

// ---------------------------------------------------------------------------
// Deterministic randomness: the same slot always produces the same ticket.

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T,>(r: () => number, list: readonly T[]) => list[Math.floor(r() * list.length)];
const between = (r: () => number, min: number, max: number) => Math.round(min + r() * (max - min));

// ---------------------------------------------------------------------------
// The studio's real catalogue.

// The studio's real apps and games, exactly as they are named on GitHub and in the stores.
const GAMES = [
  "iTetris",
  "iPinball",
  "iLemmings",
  "iSudoku",
  "iSueca",
  "iSolitaire",
  "iMahjong",
  "iPetanque",
  "iXadrez",
  "iBeyblade",
  "iPacManHD",
  "DroidSudoku",
  "DroidMahjong",
  "DroidXadrez",
];
const APPS = [...GAMES, "PhotographersPocketKnife", "iSpoonFit", "iFaceAIID"];

const CLIENTS: Text[] = [
  { pt: "Site com reservas para um restaurante em Cascais", en: "Booking website for a restaurant in Cascais" },
  { pt: "Loja online para uma marca de roupa", en: "Online store for a clothing brand" },
  { pt: "App de marcações para um ginásio", en: "Class booking app for a gym" },
  { pt: "Portal de clientes para um gabinete de contabilidade", en: "Client portal for an accounting firm" },
  { pt: "Site bilingue para um alojamento local", en: "Bilingual website for a guesthouse" },
  { pt: "Integração Salesforce para uma PME", en: "Salesforce integration for a small business" },
  { pt: "App iOS para uma clínica de fisioterapia", en: "iOS app for a physiotherapy clinic" },
  { pt: "Galeria online para um fotógrafo de casamentos", en: "Online gallery for a wedding photographer" },
];

const WORK: Record<string, Text> = {
  "00-rececao": { pt: "Pedido recebido e classificado", en: "Request received and triaged" },
  "01-vendas": { pt: "Proposta e orçamento preparados", en: "Proposal and quote drafted" },
  "02-marketing": { pt: "Conteúdo PT/EN preparado", en: "PT/EN content prepared" },
  "03-produto": { pt: "Spec com critérios de aceitação", en: "Spec with acceptance criteria" },
  "04-engenharia": { pt: "Implementado numa branch, PR aberto", en: "Built on a branch, pull request opened" },
  "05-qa": { pt: "Testes a passar, PR revisto", en: "Tests passing, pull request reviewed" },
  "06-sucesso-cliente": { pt: "Resposta ao cliente redigida", en: "Reply to the customer drafted" },
  "07-financas": { pt: "Dados de faturação preparados", en: "Invoicing data prepared" },
  "08-juridico": { pt: "Rascunho jurídico preparado", en: "Legal draft prepared" },
  "09-pessoas": { pt: "Onboarding e acessos preparados", en: "Onboarding and access prepared" },
  "10-direcao": { pt: "Relatório gerado", en: "Report generated" },
  "-1-infraestrutura": { pt: "Verificado e registado", en: "Checked and logged" },
};

interface Template {
  weight: number;
  make: (r: () => number) => { title: Text; route: string[]; gate: { floor: string; action: Text } | null; priority?: Priority };
}

const TEMPLATES: Template[] = [
  {
    weight: 5,
    make: (r) => ({
      title: pick(r, CLIENTS),
      route: ["01-vendas", "08-juridico", "07-financas"],
      gate: { floor: "01-vendas", action: { pt: "enviar proposta e contrato ao cliente", en: "send the proposal and contract to the client" } },
    }),
  },
  {
    weight: 4,
    make: (r) => {
      const app = pick(r, APPS);
      return {
        title: { pt: `Nova versão do ${app}`, en: `New ${app} release` },
        route: ["03-produto", "04-engenharia", "05-qa", "02-marketing", "08-juridico"],
        gate: { floor: "02-marketing", action: { pt: `publicar o ${app} na loja`, en: `publish ${app} to the store` } },
      };
    },
  },
  {
    weight: 4,
    make: (r) => {
      const app = pick(r, APPS);
      return {
        title: { pt: `Bug reportado no ${app}`, en: `Bug reported in ${app}` },
        route: ["05-qa", "04-engenharia", "05-qa"],
        gate: { floor: "05-qa", action: { pt: "merge do PR em main", en: "merge the pull request into main" } },
        priority: r() < 0.25 ? "P0" : "P1",
      };
    },
  },
  {
    weight: 3,
    make: (r) => {
      const app = pick(r, GAMES);
      const stars = between(r, 2, 5);
      return {
        title: { pt: `Review de ${stars}★ no ${app}`, en: `${stars}★ review on ${app}` },
        route: ["06-sucesso-cliente"],
        gate: { floor: "06-sucesso-cliente", action: { pt: "publicar a resposta à review", en: "publish the reply to the review" } },
      };
    },
  },
  {
    weight: 2,
    make: (r) => ({
      title: pick(r, [
        { pt: "Artigo: do fotojornalismo ao código", en: "Article: from photojournalism to code" },
        (() => {
          const app = pick(r, APPS);
          return { pt: `Post: bastidores do ${app}`, en: `Post: behind the scenes of ${app}` };
        })(),
        { pt: "Newsletter do mês", en: "Monthly newsletter" },
        { pt: "SEO da página de projetos do ividi.dev", en: "SEO for the ividi.dev projects page" },
      ]),
      route: ["02-marketing"],
      gate: { floor: "02-marketing", action: { pt: "publicar", en: "publish" } },
    }),
  },
  {
    weight: 3,
    make: (r) => ({
      title: pick(r, [
        { pt: "Backup semanal do Client Portal", en: "Weekly Client Portal backup" },
        { pt: "Verificação de uptime do ividi.dev", en: "ividi.dev uptime check" },
        { pt: "Renovação de certificados", en: "Certificate renewal" },
        { pt: "Atualizar dependências do ividi.dev", en: "Update ividi.dev dependencies" },
      ]),
      route: ["-1-infraestrutura"],
      gate: r() < 0.3 ? { floor: "-1-infraestrutura", action: { pt: "deploy em produção", en: "deploy to production" } } : null,
      priority: "P2",
    }),
  },
  {
    weight: 2,
    make: (r) => ({
      title: pick(r, [
        { pt: `Fatura do marco ${between(r, 1, 3)} de um projeto`, en: `Milestone ${between(r, 1, 3)} invoice for a project` },
        { pt: "Preparar o IVA do trimestre", en: "Prepare the quarterly VAT" },
        { pt: "Rever subscrições e custos fixos", en: "Review subscriptions and fixed costs" },
      ]),
      route: ["07-financas"],
      gate: { floor: "07-financas", action: { pt: "emitir no software certificado", en: "issue in the certified invoicing software" } },
    }),
  },
  {
    weight: 2,
    make: (r) => {
      const app = pick(r, APPS);
      return {
        title: { pt: `Política de privacidade do ${app}`, en: `${app} privacy policy` },
        route: ["08-juridico"],
        gate: { floor: "08-juridico", action: { pt: "publicar a política (revista por advogado)", en: "publish the policy (reviewed by a lawyer)" } },
      };
    },
  },
  {
    weight: 1,
    make: (r) => ({
      title: pick(r, [
        { pt: "Onboarding de um designer freelancer", en: "Onboarding a freelance designer" },
        { pt: "Parceria com um fotógrafo de eventos", en: "Partnership with an event photographer" },
      ]),
      route: ["09-pessoas", "08-juridico"],
      gate: { floor: "09-pessoas", action: { pt: "assinar o acordo", en: "sign the agreement" } },
    }),
  },
  {
    weight: 1,
    make: () => ({
      title: { pt: "Relatório de KPIs de todos os pisos", en: "KPI report across every floor" },
      route: ["10-direcao"],
      gate: null,
      priority: "P3",
    }),
  },
];

const TOTAL_WEIGHT = TEMPLATES.reduce((n, t) => n + t.weight, 0);

const RECEIVED: Text = WORK["00-rececao"];
const ARRIVED = (floor: string): Text => WORK[floor];
const WAITING = (action: Text): Text => ({ pt: `À espera de aprovação: ${action.pt}`, en: `Waiting for approval: ${action.en}` });
const APPROVED: Text = { pt: "Aprovado por um humano e executado", en: "Approved by a human and carried out" };
const FINISHED: Text = { pt: "Concluído", en: "Done" };

// ---------------------------------------------------------------------------

function ticketId(slot: number) {
  const start = slot * SLOT_MS;
  const day = new Date(start).toISOString().slice(0, 10).replaceAll("-", "");
  const inDay = Math.floor((start % DAY_MS) / SLOT_MS) + 1;
  return `T-${day}-${String(inDay).padStart(5, "0")}`;
}

/** The full life of the ticket born in a slot, including events that are still in the future. */
export function ticketForSlot(slot: number) {
  const r = rng(Math.imul(slot, 0x9e3779b1));
  let roll = r() * TOTAL_WEIGHT;
  const template = TEMPLATES.find((t) => (roll -= t.weight) < 0) ?? TEMPLATES[0];
  const spec = template.make(r);
  const id = ticketId(slot);
  const created = slot * SLOT_MS;
  const p = r();
  const priority: Priority = spec.priority ?? (p < 0.2 ? "P1" : p < 0.85 ? "P2" : "P3");

  const events: SimEvent[] = [{ time: created, ticketId: id, floor: "00-rececao", state: "entrada", action: RECEIVED }];
  let t = created + between(r, 4000, 9000);
  for (const floor of spec.route) {
    events.push({ time: t, ticketId: id, floor, state: "em-curso", action: ARRIVED(floor) });
    t += between(r, 9000, 22_000);
  }
  if (spec.gate) {
    events.push({ time: t, ticketId: id, floor: spec.gate.floor, state: "aguarda-aprovacao", action: WAITING(spec.gate.action) });
    t += between(r, 18_000, 40_000);
    events.push({ time: t, ticketId: id, floor: spec.gate.floor, state: "concluido", action: APPROVED });
  } else {
    events.push({ time: t, ticketId: id, floor: spec.route.at(-1)!, state: "concluido", action: FINISHED });
  }

  return { id, title: spec.title, priority, created, events, approvalAction: spec.gate?.action ?? null, doneAt: t };
}

const emptyCounts = () => ({ entrada: 0, "em-curso": 0, "aguarda-aprovacao": 0, concluido: 0 });

/** The building as it is at `now`. */
export function simulate(now: number): Simulation {
  const lastSlot = Math.floor(now / SLOT_MS);
  const firstSlot = Math.floor((now - MAX_LIFETIME_MS) / SLOT_MS);
  const dayStartSlot = Math.ceil((now - (now % DAY_MS)) / SLOT_MS);

  const tickets: SimTicket[] = [];
  const recent: SimEvent[] = [];
  const byState = emptyCounts();
  const byFloor: Record<string, Record<TicketState, number>> = {};
  let doneRecentToday = 0;

  for (let slot = firstSlot; slot <= lastSlot; slot++) {
    const life = ticketForSlot(slot);
    const history = life.events.filter((e) => e.time <= now);
    if (history.length === 0) continue;
    recent.push(...history);
    const current = history.at(-1)!;
    if (current.state === "concluido" && slot >= dayStartSlot) doneRecentToday++;
    if (current.state === "concluido" && now - life.doneAt > DONE_VISIBLE_MS) continue;

    tickets.push({
      id: life.id,
      title: life.title,
      priority: life.priority,
      created: life.created,
      state: current.state,
      floor: current.floor,
      approvalAction: life.approvalAction,
      history,
    });
    byState[current.state]++;
    (byFloor[current.floor] ??= emptyCounts())[current.state]++;
  }

  recent.sort((a, b) => b.time - a.time);
  // Slots older than the look-back window are all finished by now.
  const olderToday = Math.max(0, firstSlot - dayStartSlot);

  return {
    now,
    tickets,
    recent: recent.slice(0, 8),
    liveFloor: recent.find((e) => e.time <= now - (now % ELEVATOR_STOP_MS))?.floor ?? "00-rececao",
    byFloor,
    byState,
    requestsToday: Math.max(0, lastSlot - dayStartSlot + 1),
    doneToday: olderToday + doneRecentToday,
  };
}

const PRIORITY_RANK: Record<Priority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };

/** Most urgent first, then oldest first. */
export const byPriority = (a: SimTicket, b: SimTicket) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.created - b.created;
