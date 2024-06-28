# Capítulo 6 - Fundamentos da Inteligência de Negócios: Banco de Dados e Gestão da Informação

## Sumário
1. Problemas de gerenciar recursos de dados em um ambiente de arquivos tradicional
2. Capacidades dos sistemas de gerenciamento de banco de dados (DBMS) e a importância de um DBMS relacional
3. Ferramentas e tecnologias para acessar informações de bancos de dados para melhorar o desempenho e a tomada de decisões nos negócios
4. Governança de dados e garantia de qualidade de dados na gestão dos recursos de dados

## Objetivos de Aprendizagem dos Estudantes
1. Problemas de gerenciar recursos de dados em um ambiente de arquivos tradicional.
2. Capacidades dos sistemas de gerenciamento de banco de dados (DBMS) e a importância de um DBMS relacional.
3. Ferramentas e tecnologias para acessar informações de bancos de dados.
4. Governança de dados e garantia de qualidade de dados na gestão dos recursos de dados.

# Seção 6-1: Problemas de Gerenciar Recursos de Dados em um Ambiente de Arquivos Tradicional
Problemas de Gerenciar Recursos de Dados em um Ambiente de Arquivos Tradicional
- Termos básicos: campo, registro, arquivo, banco de dados, entidade e atributo.
- Demonstração com planilhas simples.
- Crescimento independente dos sistemas sem plano corporativo.
- Redundância e inconsistência de dados.
- Dependência de programa-dados.

## Termos Básicos
- Campo: Unidade básica de dados, como um nome ou data.
- Registro: Conjunto de campos relacionados que descrevem uma entidade.
- Arquivo: Coleção de registros armazenados juntos.
- Banco de Dados: Coleção organizada de dados para múltiplas aplicações.
- Entidade: Pessoa, lugar, coisa ou evento sobre o qual se obtêm informações.
- Atributo: Informação que descreve uma entidade específica.

## Hierarquia de Dados
- Bit: Representado por 0 ou 1.
- Byte: Grupo de bits representando um caractere.
- Campo: Nome, data, etc.
- Registro: Conjunto de campos.
- Arquivo: Conjunto de registros.
- Banco de Dados: Conjunto de arquivos.

## Importância de Entidades, Atributos e Campos-Chave
- Entidade: Pessoa, lugar, coisa ou evento.
- Atributo: Informação descrevendo uma entidade.
- Campo-Chave: Identifica unicamente instâncias de um registro.

## Problemas do Ambiente de Arquivos Tradicional
- Redundância de dados: Dados duplicados em vários arquivos.
- Confusão de dados: Significados diferentes em arquivos diferentes.
- Dependência de programa-dados: Relação estreita entre dados e programas.
- Falta de flexibilidade: Dificuldade em criar novos relatórios.
- Má segurança: Falta de controle sobre os dados.
- Falta de compartilhamento de dados: Dados distribuídos em vários arquivos.

# Seção 6-2: Capacidades Principais dos DBMS e a Importância dos DBMS Relacionais

## Introdução aos DBMS
- Termos e conceitos de organização de arquivos.
- Componentes de um DBMS: linguagem de definição de dados, dicionário de dados, linguagem de manipulação de dados.

## Design e Gerenciamento de Banco de Dados
- Importância do design lógico e físico de um banco de dados.
- Exemplo prático: processo de matrícula universitária.
- Atividade de classe: criação de um diagrama de entidade-relacionamento e normalização de dados.

## Tecnologias Modernas
- Bancos de dados em nuvem.
- Blockchain para bancos de dados distribuídos.
- Uso em transações financeiras, cadeia de suprimentos, registros médicos.

## Definição de Banco de Dados e DBMS
- **Banco de Dados**: Coleção organizada de dados, minimiza redundância.
- **DBMS**: Software que centraliza, gerencia e fornece acesso eficiente aos dados.

## Capacidades de um DBMS
- **Linguagem de Definição de Dados**: Estrutura e conteúdo do banco de dados.
- **Dicionário de Dados**: Informação sobre dados (nomes, definições, formatos).
- **Linguagem de Manipulação de Dados (SQL)**: Acesso e manipulação de dados.

## DBMS Relacional
- Organização de dados em tabelas bidimensionais (relações).
- Tabelas com linhas (registros) e colunas (atributos).
- Campo-chave para identificação única de registros.

## Operações de um DBMS Relacional
- **Seleção**: Criação de subconjunto de registros que atendem a critérios.
- **União**: Combinação de tabelas relacionais.
- **Projeção**: Criação de novas tabelas com informações selecionadas.

## Utilidade dos Bancos de Dados Não-Relacionais
- Motivos para o aumento dos bancos de dados não relacionais: computação em nuvem, grandes volumes de dados, cargas massivas, novos tipos de dados.
- Processamento de dados estruturados e não estruturados.
- Escalabilidade e flexibilidade.

## Normalização e Integridade Referencial
- **Normalização**: Criação de estruturas de dados estáveis, remoção de redundâncias.
- **Integridade Referencial**: Manutenção de consistência entre tabelas relacionadas.

## Diagrama de Entidade-Relacionamento (ERD)
- Representação gráfica de relacionamentos entre entidades.
- Papel no design de banco de dados: precisão, completude e facilidade de recuperação dos dados.

# Seção 6-3: Ferramentas e Tecnologias para Acesso a Informações de Bancos de Dados

## Tecnologias de Dados
- **Data Warehouses**: Armazenamento de grandes volumes de dados.
- **Data Marts**: Subconjunto de um data warehouse para áreas específicas.
- **Mineração de Dados**: Descoberta de padrões e insights em grandes volumes de dados.

## Novas Tecnologias
- **Big Data**: Grandes volumes de dados (petabytes e exabytes).
- **Hadoop**: Estrutura de software de código aberto para processamento distribuído de big data.
- **Computação em Memória**: Dados residem inteiramente na memória para acelerar o processamento.
- **Plataformas Analíticas**: Sistemas de hardware-software para processamento de consultas e análises.

## Definição e Tecnologias para Big Data
- **Big Data**: Conjuntos de dados grandes demais para sistemas DBMS típicos.
- **Hadoop**: Processamento paralelo distribuído de grandes quantidades de dados.
- **Computação em Memória**: Elimina gargalos de leitura/escrita de dados.
- **Plataformas Analíticas**: Otimizadas para grandes conjuntos de dados.

## Infraestrutura de Tecnologia de Inteligência de Negócios (BI)
- **Componentes**:
  - Data Warehouses
  - Data Marts
  - Hadoop
  - Computação em Memória
  - Plataformas Analíticas
- **Ferramentas BI**: Análise de dados, consulta de banco de dados, relatórios, mineração de dados.

## Processamento Analítico Online (OLAP)
- **Capacidades**:
  - Análise de dados multidimensional.
  - Visualização de dados em múltiplas dimensões (cubos de dados).
  - Respostas rápidas a perguntas ad-hoc.
  - Integração com data warehouses e mineração de dados.

## Mineração de Dados
- **Diferenças do OLAP**:
  - Encontra padrões ocultos e relacionamentos.
  - Previsão de comportamentos futuros.
- **Tipos de Informações**:
  - Associações
  - Sequências
  - Classificações
  - Agrupamentos
  - Previsões

## Mineração de Texto e Mineração Web
- **Mineração de Texto**:
  - Padrões e tendências em dados não estruturados (e-mails, memorandos, etc.).
- **Mineração Web**:
  - **Mineração de Conteúdo Web**: Extração de conhecimento de páginas web.
  - **Mineração de Estrutura Web**: Exame de dados da estrutura de um site.
  - **Mineração de Uso Web**: Exame de dados de interação do usuário.

## Acesso a Bancos de Dados Internos via Web
- **Processo**:
  - Navegador web solicita dados do banco de dados da organização.
  - Comandos HTML são traduzidos em SQL por middleware.
  - DBMS processa solicitações SQL e fornece os dados.
  - Middleware entrega dados ao navegador na forma de uma página web.
  - Software intermediário pode ser um servidor de aplicações, programa personalizado ou scripts.


# Seção 6-4: Governança de Dados e Garantia de Qualidade de Dados

## Governança de Dados
- **Definição**: Políticas e procedimentos para gerenciar dados como um recurso organizacional.
- **Objetivos**: Compartilhar, disseminar, adquirir, padronizar, classificar e inventariar informações.
- **Componentes**:
  - Identificar usuários e unidades organizacionais que podem compartilhar informações.
  - Determinar onde as informações podem ser distribuídas.
  - Responsabilizar-se pela atualização e manutenção das informações.
  - Proteger os recursos de dados.

## Definição e Importância da Governança de Dados
- **Governança de Dados**: Conjunto de políticas e procedimentos para gerenciar dados.
- **Ajuda às Organizações**:
  - Estabelecimento de regras claras para o uso de dados.
  - Melhoria na eficiência e na segurança da informação.
  - Garantia de que os dados sejam precisos, consistentes e confiáveis.

## Problemas de Qualidade de Dados
- **Códigos e Descrições Diferentes**:
  - Utilização de diferentes códigos ou descrições em vários sistemas.
- **Erros de Usuário na Entrada de Dados**:
  - Nomes digitados incorretamente.
  - Números transpostos.
  - Códigos incorretos ou ausentes.

## Ferramentas e Técnicas para Garantia de Qualidade de Dados
- **Antes de Operar um Novo Banco de Dados**:
  - Identificação e correção de dados defeituosos.
  - Estabelecimento de rotinas para edição de dados.
- **Análise da Qualidade dos Dados**:
  - Auditoria de Qualidade dos Dados: Pesquisa estruturada da precisão e completude dos dados.
- **Limpeza de Dados**:
  - Correção de erros e imposição de consistência entre diferentes conjuntos de dados.
  - Software especializado para verificação automática de arquivos de dados.
  - Correção e integração dos dados em um formato consistente em toda a empresa.

