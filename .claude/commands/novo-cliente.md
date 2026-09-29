---
description: Fluxo completo de serviço para um cliente (Receção → Vendas → Jurídico → Finanças → Eng → Sucesso)
argument-hint: <referência do cliente, ex. CLI-0007 + descrição curta>
---

Cliente: **$ARGUMENTS** — só referência/ID, nunca dados pessoais.

Cria um ticket-mãe e um ticket filho por etapa:

| # | Piso | Entregável |
|---|------|-----------|
| 1 | 00-rececao | Pedido limpo e classificado |
| 2 | 01-vendas | Qualificação + proposta (envio aguarda aprovação) |
| 3 | 08-juridico | Contrato de serviços (rascunho, aguarda aprovação) |
| 4 | 07-financas | Plano de faturação por marcos (faturas aguardam aprovação) |
| 5 | 04-engenharia | Projeto: repositório, branches, PRs |
| 6 | 06-sucesso-cliente | Onboarding, acompanhamento, NPS no fim |

Cada etapa só arranca depois de a anterior estar aprovada.
Processa já as etapas 1 e 2 e mostra o plano completo.
