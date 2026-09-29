---
description: Cria um ticket novo em elevador/entrada/ a partir de texto livre
argument-hint: <descrição do pedido>
---

Usa o agente `chefe-rececao` para criar um ticket novo com este pedido:

$ARGUMENTS

1. Copia `elevador/TEMPLATE.md` para `elevador/entrada/T-<AAAAMMDD>-<NNN>-<slug>.md` (NNN = próximo número livre do dia, a contar todos os estados do elevador).
2. Preenche `titulo`, `origem: interno` (ou a origem indicada), `criado`, `atualizado` e a secção `Pedido`.
3. Remove dados pessoais: usa apenas `cliente-ref`.
4. Não definas `piso-destino`: isso é trabalho do `/triagem`.
5. Commit: `feat(elevador): novo pedido T-...`.

Mostra o caminho do ticket criado.
