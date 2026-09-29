# R/C (0) · Receção & Triagem

> Pasta: `pisos/00-rececao/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Ser a porta única da empresa: receber todos os pedidos, transformá-los em tickets limpos e encaminhá-los para o piso certo.

## Responsabilidades

- Receber pedidos do Client Portal, email e formulários do ividi.dev
- Criar tickets a partir do `elevador/TEMPLATE.md`
- Anonimizar: substituir dados pessoais por referências (`CLI-NNNN`)
- Classificar tipo e prioridade (P0–P3)
- Definir `piso-destino` e encaminhar
- Detetar duplicados e spam

## Entradas

- Webhook do Client Portal
- Emails para ividi.dev@gmail.com (resumidos, sem dados pessoais)
- Formulário de contacto do ividi.dev
- Tickets devolvidos por outros pisos a pedir reencaminhamento

## Saídas

- Tickets classificados em `elevador/entrada/` ou `em-curso/` com `piso-destino` definido

## KPIs

| Indicador | Meta |
|---|---|
| Tempo até triagem | < 1 h (agendamento de hora a hora) |
| Tickets mal encaminhados | < 5 % |
| Tickets com dados pessoais em texto | 0 |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Responder diretamente a um cliente (a resposta é preparada, não enviada)

## Equipa

| Agente | Papel |
|---|---|
| `porteiro` | lê cada ticket novo e decide o piso-destino |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`triagem.md`](processos/triagem.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`encaminhamento.md`](templates/encaminhamento.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
