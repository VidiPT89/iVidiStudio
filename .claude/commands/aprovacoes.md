---
description: Lista tudo o que aguarda aprovação humana e aplica as decisões do Vidi
argument-hint: [aprovar|rejeitar <id> "<comentário>"]
---

Argumentos: $ARGUMENTS

**Sem argumentos:** lista cada ficheiro em `elevador/aguarda-aprovacao/` numa tabela:
id | título | piso | prioridade | ação a aprovar (`acao-aprovacao`) | há quantos dias espera.
Ordena por prioridade e depois por antiguidade. Destaca os que esperam há mais de 48 h.

**`aprovar <id>`:** acrescenta ao Histórico "Aprovado pelo Vidi", `estado: concluido`, `git mv` para `elevador/concluido/`.
Não executes a ação externa aqui: diz exatamente o que o Vidi tem de fazer (ou que integração a executaria quando estiver ligada).

**`rejeitar <id> "<comentário>"`:** acrescenta o comentário ao Histórico, `estado: em-curso`, `git mv` para `elevador/em-curso/` para o piso refazer.

Nunca aproves nada por iniciativa própria.
