# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start (file-based routing), React 19, shadcn/ui (new-york style, zinc base, tema primário teal), Tailwind CSS 4, TypeScript, Vite 8, Vitest.

## Users

Estudantes de estatística, ensino médio e ensino superior, que precisam montar uma tabela de frequências e calcular medidas de tendência central e dispersão para um trabalho escolar.

## Product Purpose

Apresentar, de forma visual e interativa, a construção da tabela de frequências para dados agrupados em classes e o cálculo das medidas estatísticas. O usuário edita os dados brutos e vê a tabela completa e os resultados atualizados ao vivo.

## Positioning

Ferramenta que transforma dados brutos em tabela de frequências completa e medidas estatísticas em um clique, com fórmulas documentadas, em vez de cálculo manual em caderno.

## Operating Context

- Estudante abre o site → vê o campo de alturas pré-preenchido
- Edita os dados (separados por espaço, vírgula ou quebra de linha) → resultados recalculam ao vivo
- Vê cards com média, moda, mediana, variância e desvio padrão
- Consulta a página "Documentação" para revisar as fórmulas

## Capabilities and Constraints

- Editor de dados brutos com validação
- Agrupamento em classes pela regra de Sturges
- Tabela de frequências completa: fi, fr, fr%, Fi, Fi%, xi, xi·fi, totais
- Média, moda (Czuber), mediana, variância (populacional e amostral) e desvio padrão
- Lógica de cálculo em arquivos separados em `src/utils/`
- Somente web, sem backend

## Brand Commitments

Projeto educacional, sem marca definida. Nome do projeto: statistics-frequency-table.

## Evidence on Hand

README com estrutura, stack definida, lógica de cálculo em `src/utils/`, testes Vitest.

## Product Principles

1. Transparência no cálculo - fórmulas documentadas na página Método
2. Resultado imediato - edição ao vivo, sem botão de "calcular"
3. Código didático - um arquivo por medida, fácil de ler e apresentar