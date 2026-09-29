---
description: O porteiro distribui todos os tickets da entrada pelos pisos
---

Usa o agente `porteiro` para processar **todos** os ficheiros `T-*.md` em `elevador/entrada/`.

Limites de segurança: no máximo 25 tickets por execução; se houver mais, trata os de prioridade mais alta e reporta o resto.

No fim:
- Commit: `chore(elevador): triagem de <n> tickets`.
- Mostra uma tabela: ticket | tipo | prioridade | piso-destino | estado.
