# Piso 6 · Sucesso do Cliente

> Pasta: `pisos/06-sucesso-cliente/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Fazer com que cada cliente e utilizador se sinta acompanhado: suporte rápido, onboarding claro e feedback que volta para o produto.

## Responsabilidades

- Suporte a clientes de serviços (via Client Portal)
- Suporte a utilizadores das apps
- Onboarding de novos clientes
- FAQs e base de conhecimento
- Responder a reviews das lojas
- Inquéritos NPS

## Entradas

- Tickets `pedido-cliente` de suporte
- Reviews das lojas
- Projetos entregues (fluxo `/novo-cliente`)

## Saídas

- Respostas preparadas em `aguarda-aprovacao/`
- Bugs para QA, ideias para Produto
- FAQs atualizadas

## KPIs

| Indicador | Meta |
|---|---|
| Tempo de primeira resposta | < 24 h |
| NPS | ≥ 50 |
| Reviews respondidas | 100 % |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Enviar qualquer resposta a cliente ou publicar resposta a review

## Equipa

| Agente | Papel |
|---|---|
| `chefe-sucesso-cliente` | chefe de piso, suporte e onboarding |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`pedido-suporte.md`](processos/pedido-suporte.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`resposta-suporte.md`](templates/resposta-suporte.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
