---
id: T-AAAAMMDD-NNN
titulo: ""
origem: portal | email | formulario | interno | agendamento
piso-origem: 00-rececao
piso-destino: ""
prioridade: P2
estado: entrada            # entrada | em-curso | aguarda-aprovacao | concluido
tipo: ""                   # pedido-cliente | lead | bug | conteudo | lancamento | financeiro | juridico | infra | interno
cliente-ref: ""            # só ID (ex.: CLI-0007 ou ID do portal) — nunca dados pessoais (RGPD)
produto: ""                # ex.: iTetris, LiveShot, site-cliente-x (opcional)
requer-aprovacao: false    # true se envolver ação do portão humano (ver CLAUDE.md regra 3)
acao-aprovacao: ""         # descreve a ação exata que o Vidi tem de aprovar
criado: AAAA-MM-DD
atualizado: AAAA-MM-DD
---

# <título do ticket>

## Pedido
<!-- O que foi pedido, em linguagem simples. Sem dados pessoais. -->

## Contexto
<!-- Links, tickets relacionados, ficheiros de referência. -->

## Critérios de conclusão
- [ ] ...

## Trabalho feito
<!-- Cada piso que toca no ticket acrescenta aqui o que fez e onde (caminhos de ficheiros, branches, PRs). -->

## Histórico
| Data | Piso | Ação | Estado |
|------|------|------|--------|
| AAAA-MM-DD | 00-rececao | Ticket criado | entrada |
