import snapshot from "@/data/building.json";

export type TicketState = "entrada" | "em-curso" | "aguarda-aprovacao" | "concluido";

export const STATES: TicketState[] = ["entrada", "em-curso", "aguarda-aprovacao", "concluido"];

interface HistoryEntry {
  data: string;
  piso: string;
  acao: string;
  estado: string;
}

export interface Ticket {
  id: string;
  title: string;
  state: TicketState;
  declaredState: string;
  origin: string;
  floor: string;
  priority: "P0" | "P1" | "P2" | "P3";
  type: string;
  clientRef: string;
  product: string;
  needsApproval: boolean;
  approvalAction: string;
  created: string;
  updated: string;
  request: string;
  history: HistoryEntry[];
}

interface RecordEntry {
  file: string;
  date: string;
  title: string;
  floor: string;
}

export interface Building {
  generatedAt: string;
  summary: {
    total: number;
    byState: Record<TicketState, number>;
    byFloor: Record<string, Record<TicketState, number>>;
  };
  tickets: Ticket[];
  records: Record<string, number>;
  recent: RecordEntry[];
}

export const building = snapshot as Building;

const PRIORITY_RANK = { P0: 0, P1: 1, P2: 2, P3: 3 } as const;

export const byPriority = (a: Ticket, b: Ticket) =>
  PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || a.updated.localeCompare(b.updated);

export function daysBetween(from: string, to: string) {
  const a = Date.parse(from);
  const b = Date.parse(to);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86_400_000));
}
