# Colisão Elástica em Simulação de Física

## Visão Geral

Este projeto implementa um sistema de colisão elástica entre múltiplas bolas. Em uma colisão elástica, tanto o momento linear quanto a energia cinética são conservados.

## Como Funciona a Colisão Elástica

Quando duas bolas colidem, o sistema:

1. Detecta a sobreposição e ajusta as posições para evitar penetração
2. Calcula a velocidade relativa ao longo da linha normal de colisão
3. Aplica impulsos baseados na conservação de momento, respeitando as diferentes massas
4. Utiliza um coeficiente de restituição de 1.0 para colisões perfeitamente elásticas
5. Implementa um impulso mínimo para prevenir que bolas fiquem "grudadas"

![Demonstração da colisão elástica](example.gif)

## Implementação

O código usa vetores para calcular com precisão os impulsos de colisão, resultando em um comportamento físico realista. As direções e velocidades das bolas após a colisão dependem de:

- Massas relativas das bolas
- Velocidades no momento do impacto
- Ângulo de colisão

As trajetórias resultantes simulam o comportamento esperado na física do mundo real.
