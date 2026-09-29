# Piso 5 · QA & Testes

> Pasta: `pisos/05-qa/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Garantir que nada chega aos clientes sem ter sido testado: rever PRs, automatizar testes e reportar bugs com clareza.

## Responsabilidades

- Revisão de PRs (correção, segurança, critérios de aceitação)
- Testes automáticos (unitários, integração, E2E)
- Relatórios de bugs reproduzíveis
- Builds de teste (TestFlight, testes internos Play)

## Entradas

- Tickets de revisão da Engenharia
- Bugs reportados pelo piso 6

## Saídas

- PR aprovado → ticket de merge em `aguarda-aprovacao/`
- Bugs → tickets para a Engenharia

## KPIs

| Indicador | Meta |
|---|---|
| Bugs em produção / mês | ↓ |
| Tempo de revisão de PR | < 24 h |
| Bugs reabertos | < 10 % |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Distribuir builds a testers externos

## Equipa

| Agente | Papel |
|---|---|
| `chefe-qa` | chefe de piso e revisão de PRs |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`revisao-pr.md`](processos/revisao-pr.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`bug.md`](templates/bug.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
