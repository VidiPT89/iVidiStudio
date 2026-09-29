---
description: Fluxo completo de lançamento de uma app (Produto → Eng → QA → Marketing → Jurídico → Finanças)
argument-hint: <nome da app>
---

App: **$ARGUMENTS** (tem de existir em `empresa/catalogo-produtos.md`; se não existir, para e diz ao Vidi).

Cria um ticket-mãe e um ticket filho por etapa, todos ligados em `Contexto`:

| # | Piso | Entregável |
|---|------|-----------|
| 1 | 03-produto | Spec de lançamento: âmbito da versão, critérios de aceitação |
| 2 | 04-engenharia | Build candidata em branch + PR |
| 3 | 05-qa | Revisão, testes, build TestFlight / teste interno Play |
| 4 | 02-marketing | Ficha de loja PT/EN, notas da versão, posts de lançamento |
| 5 | 08-juridico | Política de privacidade e respostas de privacidade das lojas |
| 6 | 07-financas | Preço, impostos das lojas, previsão de receita |

Cada etapa só arranca quando a anterior está em `concluido/` ou `aguarda-aprovacao/`.
Publicar nas lojas é sempre ação do portão humano.

Processa já a etapa 1 com `/piso 3` e mostra o plano completo.
