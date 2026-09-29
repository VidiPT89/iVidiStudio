---
description: O chefe de um piso processa os tickets que lhe pertencem
argument-hint: <-1 | 0 … 10>
---

Piso pedido: **$ARGUMENTS**

Mapa piso → pasta → agente:

| Piso | Pasta | Agente |
|------|-------|--------|
| -1 | `pisos/-1-infraestrutura` | `chefe-infraestrutura` |
| 0 | `pisos/00-rececao` | `chefe-rececao` |
| 1 | `pisos/01-vendas` | `chefe-vendas` |
| 2 | `pisos/02-marketing` | `chefe-marketing` |
| 3 | `pisos/03-produto` | `chefe-produto` |
| 4 | `pisos/04-engenharia` | `chefe-engenharia` |
| 5 | `pisos/05-qa` | `chefe-qa` |
| 6 | `pisos/06-sucesso-cliente` | `chefe-sucesso-cliente` |
| 7 | `pisos/07-financas` | `chefe-financas` |
| 8 | `pisos/08-juridico` | `chefe-juridico` |
| 9 | `pisos/09-pessoas` | `chefe-pessoas` |
| 10 | `pisos/10-direcao` | `chefe-direcao` |

Se o piso não existir, diz quais são válidos e para.

Usa o agente desse piso para tratar todos os tickets em `elevador/em-curso/` cujo `piso-destino` é a pasta desse piso (máx. 10 por execução, por prioridade):
- faz o trabalho seguindo os `processos/` do piso;
- se precisar de outro piso, muda `piso-destino` e devolve o ticket a `elevador/entrada/`;
- se envolver ação do portão humano, move para `elevador/aguarda-aprovacao/`;
- se estiver terminado sem ação humana, move para `elevador/concluido/`.

Commit por ticket: `feat(<piso>): <resumo> (T-...)`. No fim, mostra o que foi feito.
