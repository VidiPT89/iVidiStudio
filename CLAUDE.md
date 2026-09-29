# Regulamento do Edifício — iVidi HQ

> Regras globais para todos os agentes e para qualquer sessão do Claude Code neste repositório.
> Em caso de conflito entre este ficheiro e o README de um piso, **este ficheiro ganha**.

## Contexto

A **iVidi Studio** é o estúdio de software de David Arsénio Martins ("Vidi"), em Cascais.
Site: https://ividi.dev · Client Portal: https://portal.ividi.dev
Três fontes de receita: **produtos próprios** (apps e jogos), **serviços** (desenvolvimento à medida)
e **conteúdo** (fotografia + tecnologia — a história "fotógrafo → developer").

A empresa está organizada como um edifício: cada piso em `pisos/` é um departamento.
O trabalho circula entre pisos através do **elevador** (`elevador/`), um sistema de tickets em ficheiros.
Identidade da empresa em `empresa/`. Planta com diagramas em `docs/planta.md`. Painel em `dashboard/`.

## As 8 regras

1. **Idioma.** Português europeu (PT-PT) em tudo o que é interno. Conteúdo público em PT-PT **e** EN.
   Nada de "você", "pra", "cara", "arquivo", "tela" — usa "tu/o cliente", "para", "ficheiro", "ecrã".
2. **Tudo passa pelo elevador.** Nenhum trabalho sem ticket. Se não há ticket, cria-se um em
   `elevador/entrada/` a partir de `elevador/TEMPLATE.md`.
3. **Portão humano obrigatório.** Estas ações **nunca** são automáticas — o ticket vai para
   `elevador/aguarda-aprovacao/` e espera pelo Vidi:
   - enviar emails ou mensagens a clientes
   - publicar em redes sociais ou lojas (App Store, Play Store)
   - fazer merge em `main`
   - deploy em produção
   - emitir faturas
   - assinar ou enviar contratos
   - gastar dinheiro
   - apagar dados
4. **Faturação certificada.** Em Portugal as faturas têm de ser emitidas em software certificado pela AT.
   O piso 7 prepara os dados e integra via API com um programa certificado (ex.: InvoiceXpress, Moloni).
   **Nunca** se geram faturas "à mão". A integração fica preparada mas **desligada** até o Vidi a configurar.
5. **Jurídico é rascunho.** Tudo o que o piso 8 produzir leva no topo:
   `> ⚠️ RASCUNHO — REVER COM ADVOGADO/CONTABILISTA`.
6. **RGPD.** Dados pessoais de clientes (nomes, emails, telefones, NIF, moradas) **nunca** em texto
   no repositório. Usa apenas referências/IDs (ex.: `CLI-0007`, ID do portal). Os dados reais vivem
   no Client Portal ou noutro sistema externo.
7. **Decisões registadas.** Cada decisão importante fica em `pisos/<piso>/registos/` com data,
   decisão e motivo (formato em "Registos", abaixo).
8. **Commits.** Pequenos, em PT-PT, formato Conventional Commits.
   Ex.: `feat(vendas): adiciona template de proposta`, `chore(elevador): move T-20260929-001 para em-curso`.

## Fronteiras entre pisos

- Cada agente **só escreve dentro do seu piso e no elevador**. Nunca no piso dos outros.
- Ler outros pisos é permitido (para contexto); escrever não.
- Precisas de algo de outro piso? Cria um ticket com `piso-destino` desse piso.
- `CLAUDE.md`, `README.md`, `docs/`, `empresa/`, `dashboard/`, `.claude/` e `.github/` só mudam com ticket da Direção (piso 10)
  aprovado pelo Vidi.

## O elevador (ciclo de vida de um ticket)

```
entrada/  →  em-curso/  →  aguarda-aprovacao/  →  concluido/
   ↑ Receção     ↑ chefe de piso    ↑ só se houver ação do portão humano
```

- Um ticket é **um ficheiro** `T-AAAAMMDD-NNN-slug.md` baseado em `elevador/TEMPLATE.md`.
- Mudar de estado = mover o ficheiro de pasta (`git mv`) **e** atualizar o campo `estado`
  **e** acrescentar uma linha ao `Histórico`.
- Passar para outro piso = alterar `piso-destino`, acrescentar linha ao histórico e voltar a pôr em `entrada/`
  (a Receção volta a encaminhar) — ou diretamente em `em-curso/` se o destino for óbvio.
- Só o Vidi move tickets de `aguarda-aprovacao/` para `concluido/` (ou devolve-os com comentário).

## Registos

Ficheiro por decisão: `pisos/<piso>/registos/AAAA-MM-DD-slug.md`

```markdown
# <Decisão em uma linha>
- **Data:** AAAA-MM-DD
- **Ticket:** T-AAAAMMDD-NNN
- **Decisão:** ...
- **Motivo:** ...
- **Alternativas consideradas:** ...
```

## Prioridades

| Código | Significado | Prazo de reação |
|--------|-------------|-----------------|
| P0 | Produção em baixo, cliente bloqueado, risco legal | imediato |
| P1 | Afeta receita ou cliente ativo | 24 h |
| P2 | Trabalho normal planeado | semana |
| P3 | Ideias, melhorias, "um dia" | sem prazo |

## Segurança

- Nunca ler, criar ou fazer commit de `.env` reais. Só `.env.example`.
- Segredos apenas via GitHub Secrets.
- Nenhuma chave, token ou password em ficheiros do repositório.
