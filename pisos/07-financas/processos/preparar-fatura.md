# Processo — Preparar uma fatura

**Piso:** Piso 7 · Finanças

## Passos

1. Confirmar marco concluído e valor acordado na proposta.
2. Preencher `templates/dados-fatura.md` (apenas referências — NIF e dados reais vivem no software certificado).
3. Mover para `aguarda-aprovacao/` com `acao-aprovacao: emitir fatura <valor> para CLI-NNNN`.
4. Após aprovação: emissão no software certificado (via API quando ligada; manual pelo Vidi até lá).
5. Registar número da fatura (não o PDF) no ticket.

## Lembra-te

- Atualiza o `Histórico` do ticket a cada passo.
- Ações do portão humano → `elevador/aguarda-aprovacao/`.
- Sem dados pessoais em texto (RGPD).
