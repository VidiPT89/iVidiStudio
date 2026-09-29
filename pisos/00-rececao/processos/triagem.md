# Processo — Triagem de um pedido

**Piso:** R/C (0) · Receção & Triagem

## Passos

1. Ler o pedido e remover qualquer dado pessoal (substituir por `cliente-ref`).
2. Classificar `tipo` (ver TEMPLATE) e `prioridade` (ver CLAUDE.md).
3. Escolher o piso com a tabela de encaminhamento abaixo.
4. Preencher `piso-destino`, acrescentar linha ao Histórico.
5. Se o destino for óbvio, mover para `em-curso/`; se houver dúvida, deixar em `entrada/` com nota para a Direção.

## Lembra-te

- Atualiza o `Histórico` do ticket a cada passo.
- Ações do portão humano → `elevador/aguarda-aprovacao/`.
- Sem dados pessoais em texto (RGPD).
