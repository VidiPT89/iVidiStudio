# Processo — Revisão de um PR

**Piso:** Piso 5 · QA & Testes

## Passos

1. Ler a spec e os critérios de aceitação.
2. Rever o diff: correção, segurança, segredos, dados pessoais.
3. Correr testes e verificar CI verde.
4. Validar cada critério de aceitação.
5. Aprovar → mover ticket para `aguarda-aprovacao/` com `acao-aprovacao: merge PR #N em main`.
6. Rejeitar → devolver à Engenharia com lista objetiva do que falta.

## Lembra-te

- Atualiza o `Histórico` do ticket a cada passo.
- Ações do portão humano → `elevador/aguarda-aprovacao/`.
- Sem dados pessoais em texto (RGPD).
