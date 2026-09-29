---
description: Percorre todos os pisos por ordem e processa o que houver
---

Faz a ronda do edifício:

1. Corre `/triagem`.
2. Para cada piso por esta ordem: -1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 — se houver tickets em `elevador/em-curso/` para esse piso, processa-os como em `/piso <n>`.
3. Se algum ticket voltou para `entrada/` durante a ronda, corre `/triagem` mais uma vez (só uma, para evitar ciclos).
4. No fim, o agente `chefe-direcao` escreve `pisos/10-direcao/registos/AAAA-MM-DD-resumo-diario.md` com: tickets movidos por piso, novos em `aguarda-aprovacao/`, riscos.

Commit final: `chore(direcao): resumo diário AAAA-MM-DD`.
