# Cave (-1) · Infraestrutura & Segurança

> Pasta: `pisos/-1-infraestrutura/` · Regras globais: [`CLAUDE.md`](../../CLAUDE.md)

## Missão

Manter tudo de pé e seguro: pipelines, deploys, backups, monitorização e gestão de segredos de todos os produtos e sites de clientes.

## Responsabilidades

- Pipelines CI/CD (GitHub Actions) de cada repositório
- Deploys em Vercel, Railway e Cloudflare (staging automático; produção só com aprovação)
- Backups de bases de dados e verificação de restauro
- Monitorização de uptime de ividi.dev e portal.ividi.dev
- Gestão de segredos (GitHub Secrets) e rotação de chaves
- Domínios, DNS e certificados

## Entradas

- Tickets `infra` vindos da Engenharia (novo ambiente, deploy)
- Alertas de uptime e falhas de CI
- Pedidos de novos domínios/segredos

## Saídas

- Deploys em staging
- Pedidos de deploy em produção em `aguarda-aprovacao/`
- Relatórios de incidente em `registos/`

## KPIs

| Indicador | Meta |
|---|---|
| Uptime ividi.dev / portal | ≥ 99,9 % |
| Tempo médio de recuperação (MTTR) | < 1 h |
| Builds de CI verdes em `main` | ≥ 95 % |
| Backups testados no mês | 100 % |

## Portão humano neste piso

Vão sempre para `elevador/aguarda-aprovacao/`:

- Deploy em produção
- Apagar recursos, bases de dados ou backups
- Contratar/alterar planos pagos (Vercel, Railway, Cloudflare)

## Equipa

| Agente | Papel |
|---|---|
| `chefe-infraestrutura` | chefe de piso |
| `infra-deploy` | especialista em deploys e CI |

_(Agentes criados na Fase 2, em `.claude/agents/`.)_

## Pastas

- [`processos/`](processos/) — procedimentos passo a passo (ex.: [`deploy-producao.md`](processos/deploy-producao.md))
- [`templates/`](templates/) — modelos reutilizáveis (ex.: [`incidente.md`](templates/incidente.md))
- [`registos/`](registos/) — decisões e resultados, `AAAA-MM-DD-slug.md`
