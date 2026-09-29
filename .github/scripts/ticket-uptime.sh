#!/usr/bin/env bash
# Cria um ticket P0 em elevador/entrada/ quando a verificação de uptime falha.
# Uso: ticket-uptime.sh "https://ividi.dev(503) ..."
set -euo pipefail
falhas="$1"
hoje=$(TZ=Europe/Lisbon date +%F)
compacto=${hoje//-/}
ultimo=$(ls elevador/*/"T-$compacto"-*.md 2>/dev/null | sed -E 's/.*T-[0-9]{8}-([0-9]{3}).*/\1/' | sort -n | tail -1 || true)
id=$(printf "T-%s-%03d" "$compacto" $((10#${ultimo:-0} + 1)))
ficheiro="elevador/entrada/$id-site-em-baixo.md"

cat > "$ficheiro" <<TICKET
---
id: $id
titulo: "Site em baixo: $falhas"
origem: agendamento
piso-origem: -1-infraestrutura
piso-destino: "-1-infraestrutura"
prioridade: P0
estado: entrada
tipo: infra
cliente-ref: ""
produto: ""
requer-aprovacao: false
acao-aprovacao: ""
criado: $hoje
atualizado: $hoje
---

# Site em baixo: $falhas

## Pedido
A verificação diária de uptime falhou para: $falhas

## Histórico
| Data | Piso | Ação | Estado |
|------|------|------|--------|
| $hoje | -1-infraestrutura | Ticket criado pela verificação de uptime | entrada |
TICKET
echo "$ficheiro"
