# Piso 4 · Engenharia

> Pasta: `pisos/04-engenharia/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Transformar specs em software que funciona: código limpo, em branches, com testes e PRs prontos para revisão.

## Responsabilidades

- Web: Next.js / React / Node.js
- iOS e macOS: Swift / SwiftUI
- Android: Kotlin
- Salesforce (projetos de clientes)
- Criar branch por ticket, implementar, testar e abrir PR

## Entradas

- Tickets com spec do piso 3
- Bugs confirmados pelo piso 5

## Saídas

- Branches `ticket/T-AAAAMMDD-NNN-slug` e PRs
- Tickets para QA (revisão) e Infraestrutura (deploy)

## KPIs

| Indicador | Meta |
|---|---|
| Lead time ticket → PR | < 5 dias úteis |
| PRs aprovados à primeira | ≥ 70 % |
| Cobertura de testes nos projetos novos | ≥ 70 % |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Merge em `main`
- Adicionar dependências pagas

## Equipa

| Agente | Papel |
|---|---|
| `chefe-engenharia` | chefe de piso |
| `engenharia-web` | Next.js/React/Node |
| `engenharia-ios` | Swift/SwiftUI (iOS e macOS) |
| `engenharia-android` | Kotlin |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`ticket-para-pr.md`](processos/ticket-para-pr.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`pr.md`](templates/pr.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
