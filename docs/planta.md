# iVidi HQ — Planta do Edifício

A estrutura operacional da **iVidi Studio** ([ividi.dev](https://ividi.dev) · [Client Portal](https://portal.ividi.dev)),
organizada como um edifício de 12 pisos. Cada piso é um departamento com a sua equipa de agentes
Claude Code, processos e registos. O trabalho circula pelo **elevador**: tickets em ficheiros Markdown.

Regras globais: [`CLAUDE.md`](../CLAUDE.md) · Identidade: [`empresa/`](../empresa/) · Painel: [`dashboard/`](../dashboard/)

## Os pisos

```mermaid
flowchart TB
    P10["🏙️ 10 · Direção (CEO)<br/>KPIs · relatório semanal · aprovações"]
    P9["9 · Pessoas & Parcerias"]
    P8["8 · Jurídico & Compliance"]
    P7["7 · Finanças"]
    P6["6 · Sucesso do Cliente"]
    P5["5 · QA & Testes"]
    P4["4 · Engenharia"]
    P3["3 · Produto & Design"]
    P2["2 · Marketing & Conteúdos"]
    P1["1 · Vendas"]
    P0["🚪 R/C · Receção & Triagem"]
    PM1["🔧 -1 · Infraestrutura & Segurança"]
    P10 --- P9 --- P8 --- P7 --- P6 --- P5 --- P4 --- P3 --- P2 --- P1 --- P0 --- PM1
```

| Piso | Pasta | Departamento | Missão |
|------|-------|--------------|--------|
| -1 | [`pisos/-1-infraestrutura`](../pisos/-1-infraestrutura/) | Infraestrutura & Segurança | CI/CD, deploys (Vercel/Railway/Cloudflare), backups, monitorização, segredos |
| 0 | [`pisos/00-rececao`](../pisos/00-rececao/) | Receção & Triagem | Recebe pedidos (portal, email, formulários), classifica e encaminha |
| 1 | [`pisos/01-vendas`](../pisos/01-vendas/) | Vendas | Leads, qualificação, propostas e orçamentos |
| 2 | [`pisos/02-marketing`](../pisos/02-marketing/) | Marketing & Conteúdos | SEO, blog, redes sociais, fichas das lojas, newsletter |
| 3 | [`pisos/03-produto`](../pisos/03-produto/) | Produto & Design | Roadmaps, specs, UX, design system |
| 4 | [`pisos/04-engenharia`](../pisos/04-engenharia/) | Engenharia | Web, iOS, Android — implementa specs em branches e abre PRs |
| 5 | [`pisos/05-qa`](../pisos/05-qa/) | QA & Testes | Testes automáticos, revisão de PRs, bugs, TestFlight |
| 6 | [`pisos/06-sucesso-cliente`](../pisos/06-sucesso-cliente/) | Sucesso do Cliente | Suporte, onboarding, FAQs, reviews, NPS |
| 7 | [`pisos/07-financas`](../pisos/07-financas/) | Finanças | Orçamentos, faturação certificada, IVA, tesouraria, subscrições |
| 8 | [`pisos/08-juridico`](../pisos/08-juridico/) | Jurídico & Compliance | RGPD, privacidade, termos, contratos, licenças |
| 9 | [`pisos/09-pessoas`](../pisos/09-pessoas/) | Pessoas & Parcerias | Freelancers, parceiros, onboarding |
| 10 | [`pisos/10-direcao`](../pisos/10-direcao/) | Direção (CEO) | KPIs, relatório semanal, decisões humanas |

## O elevador

```mermaid
flowchart LR
    subgraph Fora["Mundo exterior"]
        Portal["Client Portal"]
        Email["Email"]
        Form["Formulários ividi.dev"]
        Agenda["Agendamentos (GitHub Actions)"]
    end

    Portal & Email & Form & Agenda --> E["📥 elevador/entrada/"]
    E -->|"porteiro (R/C) define piso-destino"| C["⚙️ elevador/em-curso/"]
    C -->|"chefe de piso trabalha"| D{"Ação do<br/>portão humano?"}
    D -->|não| F["✅ elevador/concluido/"]
    D -->|sim| A["✋ elevador/aguarda-aprovacao/"]
    A -->|"Vidi aprova (/aprovacoes)"| F
    A -->|"Vidi devolve com comentário"| C
    C -->|"precisa de outro piso"| E
```

**Portão humano** — nunca automático: emails/mensagens a clientes, publicações (redes e lojas),
merge em `main`, deploy em produção, faturas, contratos, gastos, apagar dados.

## Estrutura do repositório

```
ividi-hq/
  CLAUDE.md            regulamento do edifício
  README.md            apresentação do projeto (EN)
  docs/planta.md       esta planta
  elevador/            entrada/ em-curso/ aguarda-aprovacao/ concluido/ + TEMPLATE.md
  pisos/<piso>/        README.md · processos/ · templates/ · registos/
  empresa/             missão, visão, valores, marca, preços, catálogo
  .claude/             agents/ (20) · commands/ (8) · hooks/ · settings.json
  .github/             workflows/ (triagem, ronda, relatório, uptime, CI) · actions/piso
  dashboard/           Painel da Cobertura (Next.js)
```

## Estado da construção

- [x] Fase 1 — Fundações
- [x] Fase 2 — A equipa (20 agentes em `.claude/agents/`)
- [x] Fase 3 — Comandos (8 botões do elevador em `.claude/commands/`)
- [x] Fase 4 — Automação 24/7 (workflows, hooks, webhook do portal) — desligada até `IVIDI_AUTOMACAO=ligada`
- [x] Fase 5 — Painel da Cobertura (`dashboard/`)

## Ligar as automações

1. No terminal: `claude setup-token` → copia o token.
2. GitHub → Settings → Secrets and variables → Actions:
   - Secret `CLAUDE_CODE_OAUTH_TOKEN` = o token (usa a subscrição, sem API paga).
   - Variable `IVIDI_AUTOMACAO` = `ligada` (interruptor geral; qualquer outro valor desliga tudo).
3. O uptime diário e o CI não precisam de nada disto.

## Visita guiada

O ticket [`T-20260922-001`](../elevador/aguarda-aprovacao/T-20260922-001-site-restaurante-cascais.md) é um pedido de um restaurante em Cascais
que entrou pelo Client Portal e passou por Receção → Vendas → Jurídico → Finanças → Direção. Os registos de cada piso estão ligados
na secção "Trabalho feito" do ticket, e a aprovação final espera por ti no painel e em `/aprovacoes`.
