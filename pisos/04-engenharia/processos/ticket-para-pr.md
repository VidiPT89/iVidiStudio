# Processo — Do ticket ao PR

**Piso:** Piso 4 · Engenharia

## Passos

1. Ler a spec e confirmar que os critérios de aceitação são claros (se não, devolver ao piso 3).
2. Criar branch `ticket/<id>-<slug>` a partir de `main`.
3. Implementar em commits pequenos (Conventional Commits, PT-PT).
4. Correr testes e build localmente.
5. Abrir PR com `templates/pr.md` e criar ticket para `05-qa`.
6. Nunca fazer merge: o merge vai para `aguarda-aprovacao/`.

## Lembra-te

- Atualiza o `Histórico` do ticket a cada passo.
- Ações do portão humano → `elevador/aguarda-aprovacao/`.
- Sem dados pessoais em texto (RGPD).
