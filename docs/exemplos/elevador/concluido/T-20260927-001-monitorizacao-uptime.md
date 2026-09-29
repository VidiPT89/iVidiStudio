---
id: T-20260927-001
titulo: "Monitorização de uptime do ividi.dev e do portal"
origem: agendamento
piso-origem: 00-rececao
piso-destino: "-1-infraestrutura"
prioridade: P1
estado: concluido
tipo: "infra"
cliente-ref: ""
produto: ""
requer-aprovacao: false
acao-aprovacao: ""
criado: 2026-09-27
atualizado: 2026-09-27
---

# Monitorização de uptime do ividi.dev e do portal

## Pedido
Verificação diária automática dos dois sites, com ticket P0 se algum falhar.

## Contexto
Exemplo de funcionamento do edifício.

## Critérios de conclusão
- [x] Workflow agendado
- [x] Alerta cria ticket

## Trabalho feito
- Workflow `.github/workflows/uptime.yml`; decisão → `pisos/-1-infraestrutura/registos/2026-09-27-uptime-diario.md`

## Histórico
| Data | Piso | Ação | Estado |
|------|------|------|--------|
| 2026-09-27 | 00-rececao | Ticket criado | entrada |
| 2026-09-27 | -1-infraestrutura | Workflow criado e testado | em-curso |
| 2026-09-27 | -1-infraestrutura | Concluído | concluido |
