# Spec: desafio diário no Sudoku

- **Produto:** Sudoku · **Plataformas:** iOS
- **Problema:** jogadores abrem a app sem objetivo; retenção baixa ao 7.º dia.
- **Métrica de sucesso:** retenção D7 +20 %.

**Critérios de aceitação**
- Dado um dia D, quando qualquer jogador abre o desafio, então recebe o mesmo puzzle.
- Dado que completei o desafio ontem, quando completo o de hoje, então a série aumenta 1.
- Dado que falhei um dia, quando completo o de hoje, então a série volta a 1.
- Dado o modo avião, quando abro o desafio, então funciona sem rede.

**Fora de âmbito:** rankings online.
