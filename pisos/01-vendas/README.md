# Piso 1 · Vendas

> Pasta: `pisos/01-vendas/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Transformar contactos em projetos pagos: qualificar leads, perceber a necessidade real e preparar propostas claras e justas.

## Responsabilidades

- Qualificar leads (orçamento, prazo, encaixe com a iVidi)
- Preparar propostas e orçamentos a partir de `empresa/precos.md`
- Manter o pipeline de oportunidades
- Passar projetos ganhos para o fluxo `/novo-cliente`

## Entradas

- Tickets `lead` da Receção
- Pedidos de orçamento do Client Portal

## Saídas

- Propostas (rascunho) em `registos/`
- Pedido de envio de proposta em `aguarda-aprovacao/`
- Tickets para Jurídico (contrato) e Finanças (orçamento) quando a proposta é aceite

## KPIs

| Indicador | Meta |
|---|---|
| Leads qualificadas / mês | — |
| Taxa de conversão proposta → projeto | ≥ 30 % |
| Tempo até enviar proposta | < 3 dias úteis |
| Valor do pipeline | — |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Enviar proposta ou qualquer mensagem ao cliente
- Conceder descontos fora da tabela de preços

## Equipa

| Agente | Papel |
|---|---|
| `chefe-vendas` | chefe de piso |
| `vendas-propostas` | redige propostas e orçamentos |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`qualificacao-lead.md`](processos/qualificacao-lead.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`proposta.md`](templates/proposta.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
