# Portal Acadêmico - Carlos Eduardo Beluzo

Repositório do portal estático publicado em GitHub Pages para centralizar disciplinas, materiais de apoio, pesquisa e apresentações do Prof. Carlos Eduardo Beluzo.

O ponto de entrada do site é o arquivo [`index.html`](./index.html), que direciona para as páginas principais do portal.

## Estrutura principal

- `index.html`: página inicial do portal.
- `admin/`: página de Introdução à Administração e materiais relacionados.
- `gestao-ti/`: página da disciplina Gestão de TI, com links para materiais, atividades e arquivos de apoio.
- `gestao-projetos/`: página da disciplina Gestão de Projetos, organizada por módulos e pronta para receber materiais em Gamma.
- `pesquisa/`: página com conteúdos e referências de pesquisa.
- `apresentacoes/`: página com apresentações e links para slides.
- `intro-adm/`: materiais auxiliares de Introdução à Administração.
- `code/` e `data/`: notebooks e bases de dados usados em análises e estudos.
- `python-101/`, `DM017/`, `lp3/`, `pibisfp/`: páginas e materiais históricos ou temáticos do repositório.

## Tecnologias

- HTML5
- Bootstrap 5
- Bootstrap Icons
- Conteúdo estático com links externos para Gamma, Google Slides e documentos de apoio

## Como abrir localmente

Como o projeto é estático, você pode:

1. Abrir o [`index.html`](./index.html) diretamente no navegador.
2. Ou subir um servidor local simples na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Publicação

Este repositório está organizado para publicação simples em GitHub Pages, com os arquivos HTML distribuídos na raiz e em subpastas temáticas.

## Licença

Este projeto está licenciado sob a licença MIT. Veja [`LICENSE`](./LICENSE).
