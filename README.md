# Portal Acadêmico - Carlos Eduardo Beluzo

Portal estático publicado em GitHub Pages para centralizar disciplinas, materiais de apoio, pesquisa, apresentações e um pequeno acervo histórico.

O ponto de entrada do site é [`index.html`](./index.html).

## Estrutura atual

- `index.html`: página inicial do portal.
- `assets/`: CSS, JavaScript compartilhado e dados estruturados do portal.
- `admin/`: área consolidada de Introdução à Administração, com página da disciplina, formulário e material auxiliar.
- `gestao-ti/`: disciplina Gestão de TI.
- `gestao-projetos/`: disciplina Gestão de Projetos.
- `pesquisa/`: página de pesquisa com busca e filtro por tags.
- `apresentacoes/`: página de apresentações com busca.
- `legacy/`: entrada organizada para materiais históricos preservados no repositório.
## Organização do portal

- Navegação e footer são compartilhados por todas as páginas principais.
- As disciplinas principais são renderizadas a partir de uma fonte única de dados em [`assets/js/portal-data.js`](./assets/js/portal-data.js).
- O comportamento comum do portal fica em [`assets/js/site.js`](./assets/js/site.js).
- O estilo compartilhado fica em [`assets/css/site.css`](./assets/css/site.css).

## Conteúdo legado e auxiliar

Os diretórios abaixo permanecem no repositório como acervo, materiais temáticos ou arquivos auxiliares:

- `DM017/`
- `lp3/`
- `python-101/`
- `pibisfp/`
- `code/`
- `data/`
- `tese.html`

Parte do conteúdo HTML legado foi agrupada na navegação pública em [`legacy/index.html`](./legacy/index.html).

## Tecnologias

- HTML5
- Bootstrap 5
- Bootstrap Icons
- JavaScript vanilla
- Conteúdo estático com links para Gamma, Google Slides e documentos auxiliares

## Como abrir localmente

Como o projeto é estático, você pode:

1. Abrir [`index.html`](./index.html) diretamente no navegador.
2. Ou subir um servidor local simples na raiz do repositório:

```bash
python3 -m http.server 8000
```

Depois, acesse `http://localhost:8000`.

## Publicação

O repositório está organizado para publicação simples em GitHub Pages, com páginas HTML distribuídas por subpastas temáticas.

## Licença

Este projeto está licenciado sob a licença MIT. Veja [`LICENSE`](./LICENSE).
