# Cobertura (10) · Direção (CEO)

> Pasta: `pisos/10-direcao/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Ver o edifício inteiro de cima: acompanhar KPIs, decidir o que exige decisão humana e garantir que os pisos trabalham para os mesmos objetivos.

## Responsabilidades

- Painel de KPIs de todos os pisos
- Relatório semanal (segunda 08:00) e resumo diário
- Fila de aprovações (`elevador/aguarda-aprovacao/`)
- Prioridades e objetivos trimestrais
- Resolver conflitos entre pisos
- Alterações ao regulamento (`CLAUDE.md`) e a `empresa/`

## Entradas

- Todos os `registos/` dos pisos
- Tickets escalados
- Fila de aprovações

## Saídas

- Relatórios em `registos/`
- Decisões e prioridades
- Dashboard (Fase 5)

## KPIs

| Indicador | Meta |
|---|---|
| Aprovações pendentes > 48 h | 0 |
| Receita mensal total | — |
| Tickets concluídos / semana | — |
| Objetivos trimestrais no caminho certo | ≥ 70 % |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Todas as decisões finais são do Vidi

## Equipa

| Agente | Papel |
|---|---|
| `chefe-direcao` | consolida KPIs e escreve relatórios |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`relatorio-semanal.md`](processos/relatorio-semanal.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`relatorio-semanal.md`](templates/relatorio-semanal.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
