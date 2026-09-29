# Piso 7 · Finanças

> Pasta: `pisos/07-financas/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Manter a empresa saudável e cumpridora: orçamentos corretos, faturação certificada, IVA em dia e tesouraria sob controlo.

## Responsabilidades

- Validar orçamentos das propostas
- Preparar dados de faturação para software certificado pela AT (InvoiceXpress/Moloni) — integração desligada até configuração
- Controlo de IVA e prazos fiscais
- Fluxo de caixa e previsões
- Subscrições (ferramentas, lojas, cloud)
- Receitas das apps (App Store, Play Store)

## Entradas

- Propostas aceites (piso 1)
- Marcos de projeto concluídos
- Faturas de fornecedores

## Saídas

- Pedidos de emissão de fatura em `aguarda-aprovacao/`
- Relatório mensal de tesouraria em `registos/`

## KPIs

| Indicador | Meta |
|---|---|
| Receita mensal (serviços / apps) | — |
| Dias médios de recebimento | < 30 |
| Obrigações fiscais em atraso | 0 |
| Custos fixos mensais | — |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Emitir faturas
- Pagamentos e qualquer gasto
- Submissões fiscais

## Equipa

| Agente | Papel |
|---|---|
| `chefe-financas` | chefe de piso, orçamentos e tesouraria |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`preparar-fatura.md`](processos/preparar-fatura.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`dados-fatura.md`](templates/dados-fatura.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
