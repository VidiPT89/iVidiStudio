import type { Lang } from "./i18n";

type Text = Record<Lang, string>;

export interface Floor {
  slug: string;
  level: number;
  label: Text;
  name: Text;
  mission: Text;
  agents: string[];
  kpis: { name: Text; target: string }[];
}

const t = (pt: string, en: string): Text => ({ pt, en });

// Top to bottom, as the building is drawn.
export const FLOORS: Floor[] = [
  {
    slug: "10-direcao",
    level: 10,
    label: t("Cobertura", "Penthouse"),
    name: t("Direção (CEO)", "Leadership (CEO)"),
    mission: t(
      "KPIs de todos os pisos, relatório semanal e decisões que exigem aprovação humana.",
      "KPIs across every floor, the weekly report and decisions that need human approval.",
    ),
    agents: ["chefe-direcao"],
    kpis: [
      { name: t("Aprovações pendentes > 48 h", "Approvals pending > 48 h"), target: "0" },
      { name: t("Objetivos trimestrais no caminho", "Quarterly goals on track"), target: "≥ 70 %" },
    ],
  },
  {
    slug: "09-pessoas",
    level: 9,
    label: t("Piso 9", "Floor 9"),
    name: t("Pessoas & Parcerias", "People & Partnerships"),
    mission: t(
      "Freelancers, parceiros e onboarding de colaboradores.",
      "Freelancers, partners and onboarding.",
    ),
    agents: ["chefe-pessoas"],
    kpis: [
      { name: t("Onboarding até ao primeiro PR", "Onboarding to first PR"), target: "< 5 d" },
      { name: t("Acessos revogados no offboarding", "Access revoked at offboarding"), target: "100 %" },
    ],
  },
  {
    slug: "08-juridico",
    level: 8,
    label: t("Piso 8", "Floor 8"),
    name: t("Jurídico & Compliance", "Legal & Compliance"),
    mission: t(
      "RGPD, políticas de privacidade, termos, contratos e licenças.",
      "GDPR, privacy policies, terms, contracts and licences.",
    ),
    agents: ["chefe-juridico"],
    kpis: [
      { name: t("Apps com política de privacidade", "Apps with a privacy policy"), target: "100 %" },
      { name: t("Contratos assinados antes de começar", "Contracts signed before kickoff"), target: "100 %" },
    ],
  },
  {
    slug: "07-financas",
    level: 7,
    label: t("Piso 7", "Floor 7"),
    name: t("Finanças", "Finance"),
    mission: t(
      "Orçamentos, faturação certificada, IVA, tesouraria e subscrições.",
      "Budgets, certified invoicing, VAT, cash flow and subscriptions.",
    ),
    agents: ["chefe-financas"],
    kpis: [
      { name: t("Dias médios de recebimento", "Average days to get paid"), target: "< 30" },
      { name: t("Obrigações fiscais em atraso", "Overdue tax obligations"), target: "0" },
    ],
  },
  {
    slug: "06-sucesso-cliente",
    level: 6,
    label: t("Piso 6", "Floor 6"),
    name: t("Sucesso do Cliente", "Customer Success"),
    mission: t(
      "Suporte, onboarding, FAQs, reviews das lojas e NPS.",
      "Support, onboarding, FAQs, store reviews and NPS.",
    ),
    agents: ["chefe-sucesso-cliente"],
    kpis: [
      { name: t("Primeira resposta", "First response"), target: "< 24 h" },
      { name: t("NPS", "NPS"), target: "≥ 50" },
    ],
  },
  {
    slug: "05-qa",
    level: 5,
    label: t("Piso 5", "Floor 5"),
    name: t("QA & Testes", "QA & Testing"),
    mission: t(
      "Testes automáticos, revisão de PRs, relatórios de bugs e TestFlight.",
      "Automated tests, PR reviews, bug reports and TestFlight.",
    ),
    agents: ["chefe-qa"],
    kpis: [
      { name: t("Revisão de PR", "PR review time"), target: "< 24 h" },
      { name: t("Bugs reabertos", "Reopened bugs"), target: "< 10 %" },
    ],
  },
  {
    slug: "04-engenharia",
    level: 4,
    label: t("Piso 4", "Floor 4"),
    name: t("Engenharia", "Engineering"),
    mission: t(
      "Web, iOS e Android: implementa specs em branches e abre PRs.",
      "Web, iOS and Android: turns specs into branches and pull requests.",
    ),
    agents: ["chefe-engenharia", "engenharia-web", "engenharia-ios", "engenharia-android"],
    kpis: [
      { name: t("Ticket → PR", "Ticket → PR"), target: "< 5 d" },
      { name: t("Cobertura de testes", "Test coverage"), target: "≥ 70 %" },
    ],
  },
  {
    slug: "03-produto",
    level: 3,
    label: t("Piso 3", "Floor 3"),
    name: t("Produto & Design", "Product & Design"),
    mission: t(
      "Roadmap de cada app, specs, UX e design system.",
      "Roadmaps for every app, specs, UX and the design system.",
    ),
    agents: ["chefe-produto", "produto-ux"],
    kpis: [
      { name: t("Specs com critérios de aceitação", "Specs with acceptance criteria"), target: "100 %" },
      { name: t("Rating médio das apps", "Average app rating"), target: "≥ 4.5" },
    ],
  },
  {
    slug: "02-marketing",
    level: 2,
    label: t("Piso 2", "Floor 2"),
    name: t("Marketing & Conteúdos", "Marketing & Content"),
    mission: t(
      "SEO do ividi.dev, blog, redes sociais, fichas das lojas e newsletter.",
      "ividi.dev SEO, blog, social media, store listings and newsletter.",
    ),
    agents: ["chefe-marketing", "marketing-lojas"],
    kpis: [
      { name: t("Posts por semana", "Posts per week"), target: "≥ 2" },
      { name: t("Conversão da página de loja", "Store page conversion"), target: "—" },
    ],
  },
  {
    slug: "01-vendas",
    level: 1,
    label: t("Piso 1", "Floor 1"),
    name: t("Vendas", "Sales"),
    mission: t(
      "Leads, qualificação, propostas e orçamentos.",
      "Leads, qualification, proposals and quotes.",
    ),
    agents: ["chefe-vendas", "vendas-propostas"],
    kpis: [
      { name: t("Conversão proposta → projeto", "Proposal → project conversion"), target: "≥ 30 %" },
      { name: t("Tempo até à proposta", "Time to proposal"), target: "< 3 d" },
    ],
  },
  {
    slug: "00-rececao",
    level: 0,
    label: t("R/C", "Lobby"),
    name: t("Receção & Triagem", "Reception & Triage"),
    mission: t(
      "Recebe pedidos do portal, email e formulários, classifica e encaminha.",
      "Takes in requests from the portal, email and forms, then sorts and routes them.",
    ),
    agents: ["porteiro", "chefe-rececao"],
    kpis: [
      { name: t("Tempo até triagem", "Time to triage"), target: "< 1 h" },
      { name: t("Tickets com dados pessoais", "Tickets with personal data"), target: "0" },
    ],
  },
  {
    slug: "-1-infraestrutura",
    level: -1,
    label: t("Cave", "Basement"),
    name: t("Infraestrutura & Segurança", "Infrastructure & Security"),
    mission: t(
      "CI/CD, deploys, backups, monitorização e segredos.",
      "CI/CD, deploys, backups, monitoring and secrets.",
    ),
    agents: ["chefe-infraestrutura", "infra-deploy"],
    kpis: [
      { name: t("Uptime ividi.dev / portal", "ividi.dev / portal uptime"), target: "≥ 99.9 %" },
      { name: t("Tempo de recuperação", "Time to recover"), target: "< 1 h" },
    ],
  },
];

export const floorBySlug = (slug: string) => FLOORS.find((f) => f.slug === slug);
