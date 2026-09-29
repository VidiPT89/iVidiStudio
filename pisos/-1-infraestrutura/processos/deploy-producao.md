# Processo — Deploy em produção

**Piso:** Cave (-1) · Infraestrutura & Segurança

## Passos

1. Confirmar que o ticket tem PR aprovado pelo piso 5 (QA).
2. Verificar que o deploy de staging está verde e testado.
3. Preparar notas: versão, commits incluídos, plano de rollback.
4. Mover o ticket para `elevador/aguarda-aprovacao/` com `acao-aprovacao: deploy produção <projeto> <versão>`.
5. Após aprovação do Vidi: executar o deploy, verificar uptime durante 15 min.
6. Registar em `registos/` e mover o ticket para `concluido/`.

## Lembra-te

- Atualiza o `Histórico` do ticket a cada passo.
- Ações do portão humano → `elevador/aguarda-aprovacao/`.
- Sem dados pessoais em texto (RGPD).
