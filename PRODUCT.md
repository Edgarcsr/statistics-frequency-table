# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

TanStack Start (file-based routing), React 19, shadcn/ui (new-york style, zinc base), Tailwind CSS 4, driver.js, TypeScript, Vite 8.

## Users

Estudantes de pesquisa operacional, administração, engenharia, ou cursos correlatos que precisam aprender o método Simplex de programação linear.

## Product Purpose

Ensinar o método Simplex de forma interativa e visual. O usuário visualiza um problema de otimização, vê os dados sendo extraídos passo a passo, monta a tabela Simplex guiado, e calcula a solução. O aprendizado é construído sob demanda, não apenas assistido.

## Positioning

Tutorial interativo que decompõe o problema Simplex em etapas visuais com driver.js, em vez de explicar teoria em texto estático. A tabela é o centro da experiência.

## Operating Context

- Estudante abre o site → vê problema descrito + tabela Simplex centralizada
- Tutorial driver.js guia: extrair dados do problema → preencher tabela → iterar → encontrar solução
- Cada passo mostra o que mudou e por quê

## Capabilities and Constraints

- Tabela Simplex centralizada na tela inicial
- Tutorial com driver.js (spotlight + tooltip)
- Extração de dados do problema para a tabela
- Cálculo iterativo da solução (pivot, ratio test, entering/leaving variables)
- shadcn/ui para componentes (Table, Button, Card, Dialog)
- Somente web, sem backend

## Brand Commitments

Projeto educacional, sem marca definida. Nome do projeto: simplex-resolver.

## Evidence on Hand

README com estrutura proposta, stack definida, componentes shadcn já configurados.

## Product Principles

1. Aprender fazendo - cada passo é interativo, não passivo
2. Tabela é o foco visual - tudo gira em torno da matriz Simplex
3. Transparência no cálculo - mostrar pivot, razão, variáveis entrando/saindo
