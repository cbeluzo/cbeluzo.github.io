# Capítulo 6
**Fundamentos da Inteligência de Negócios: Banco de Dados e Gestão da Informação**

## Objetivos de Aprendizagem dos Estudantes

1. **Quais são os problemas de gerenciar recursos de dados em um ambiente de arquivos tradicional?**
2. **Quais são as principais capacidades dos sistemas de gerenciamento de banco de dados (DBMS) e por que um DBMS relacional é tão poderoso?**
3. **Quais são as principais ferramentas e tecnologias para acessar informações de bancos de dados para melhorar o desempenho e a tomada de decisões nos negócios?**
4. **Por que a governança de dados e a garantia de qualidade de dados são essenciais para gerenciar os recursos de dados da empresa?**

## Seção 6-1: Problemas de Gerenciar Recursos de Dados em um Ambiente de Arquivos Tradicional

Esta seção introduz termos básicos como campo, registro, arquivo, banco de dados, entidade e atributo. Utilizar uma planilha simples para demonstrar esses termos pode ser útil. A seção aponta as desvantagens e dificuldades que as organizações enfrentam com métodos tradicionais de gerenciamento de arquivos, como crescimento independente dos sistemas sem um plano corporativo, redundância de dados (dados duplicados em vários arquivos) e inconsistência de dados (o mesmo atributo pode ter valores diferentes), dependência de programa-dados, falta de flexibilidade na entrega de informações, má segurança e a falta de compartilhamento de dados e fácil acesso pelos usuários.

**Lista e descreva cada um dos componentes na hierarquia de dados.**

A Figura 6-1 mostra uma hierarquia de dados de exemplo. A hierarquia de dados inclui bits, bytes, campos, registros, arquivos e bancos de dados. Os dados são organizados em uma hierarquia que começa com o bit, que é representado por 0 (desligado) ou 1 (ligado). Bits são agrupados para formar um byte que representa um caractere, número ou símbolo. Bytes são agrupados para formar um campo, como um nome ou data, e campos relacionados são agrupados para formar um registro. Registros relacionados são coletados para formar arquivos, e arquivos relacionados são organizados em um banco de dados.

**Defina e explique a importância de entidades, atributos e campos-chave.**

- **Entidade** é uma pessoa, lugar, coisa ou evento sobre o qual se obtém informações.
- **Atributo** é uma peça de informação que descreve uma entidade específica.
- **Campo-chave** é um campo em um registro que identifica de forma única instâncias desse registro único para que ele possa ser recuperado, atualizado ou classificado. Por exemplo, o nome de uma pessoa não pode ser uma chave porque pode haver outra pessoa com o mesmo nome, enquanto um número de segurança social é único. Além disso, um nome de produto pode não ser único, mas um número de produto pode ser projetado para ser único.

**Liste e descreva os problemas do ambiente de arquivos tradicional.**

Os problemas do ambiente de arquivos tradicional incluem redundância e confusão de dados, dependência de programa-dados, falta de flexibilidade, má segurança e falta de compartilhamento de dados e disponibilidade. A redundância de dados é a presença de dados duplicados em vários arquivos de dados. Nessa situação, a confusão resulta porque os dados podem ter significados diferentes em arquivos diferentes.

A dependência de programa-dados é a relação estreita entre os dados armazenados em arquivos e os programas específicos necessários para atualizar e manter esses arquivos. Essa dependência é muito ineficiente, resultando na necessidade de fazer mudanças em muitos programas quando uma peça comum de dados, como o tamanho do código postal, muda.

A falta de flexibilidade refere-se ao fato de que é muito difícil criar novos relatórios a partir dos dados quando necessário. Relatórios ad-hoc são impossíveis de gerar; um novo relatório pode exigir várias semanas de trabalho de mais de um programador e a criação de arquivos intermediários para combinar dados de arquivos diferentes. A má segurança resulta da falta de controle sobre os dados. O compartilhamento de dados é virtualmente impossível porque eles estão distribuídos em tantos arquivos diferentes na organização.

## Seção 6-2: Capacidades Principais dos DBMS e a Importância dos DBMS Relacionais

Esta seção apresenta aos alunos mais termos e conceitos de organização de arquivos. Um sistema de gerenciamento de banco de dados (DBMS) é composto por três componentes: uma linguagem de definição de dados, dicionário de dados e linguagem de manipulação de dados. Se você tiver acesso a um DBMS relacional durante a aula, pode demonstrar vários dos conceitos apresentados nesta seção. 

Os requisitos de design e gerenciamento de banco de dados são introduzidos. Ajude seus alunos a ver como um design lógico permite analisar e entender os dados de uma perspectiva empresarial, enquanto o design físico mostra como o banco de dados é organizado em dispositivos de armazenamento de acesso direto. Neste ponto, você pode usar o processo de matrícula da sua universidade como exemplo. Peça aos seus alunos que preparem um design lógico para o processo de matrícula. Se houver tempo e como uma atividade de classe, peça aos seus alunos que preparem um diagrama de entidade-relacionamento (usando a Figura 6-11 como guia) e normalizem os dados. Seus alunos precisarão de orientação para completar essa atividade, mas isso os ajudará a ver e entender o processo de design lógico.

Tecnologias de banco de dados em nuvem e Blockchain também são incluídas nesta seção. A Figura 6.12 é um excelente diagrama para explicar como um banco de dados distribuído em blockchain registra transações em uma rede de computadores peer-to-peer. Bancos de dados em blockchain são muito úteis para armazenar e proteger transações financeiras, transações de cadeia de suprimentos, registros médicos e outros tipos de dados.

**Defina um banco de dados e um sistema de gerenciamento de banco de dados.**

Um banco de dados é uma coleção de dados organizada para servir muitas aplicações de forma eficiente, armazenando e gerenciando dados para que pareçam estar em um único local. Ele também minimiza dados redundantes. Um sistema de gerenciamento de banco de dados (DBMS) é um software especial que permite a uma organização centralizar dados, gerenciá-los de forma eficiente e fornecer acesso aos dados armazenados por meio de programas de aplicação.

Um DBMS pode reduzir a complexidade do ambiente dos sistemas de informação, reduzir a redundância e a inconsistência de dados, eliminar a confusão de dados, criar independência de programa-dados, reduzir custos de desenvolvimento e manutenção de programas, aumentar a flexibilidade, permitir a recuperação ad-hoc de informações, melhorar o acesso e a disponibilidade de informações e permitir a gestão centralizada dos dados, seu uso e segurança.

**Nomeie e descreva brevemente as capacidades de um DBMS.**

Um DBMS inclui capacidades e ferramentas para organizar, gerenciar e acessar os dados no banco de dados. As principais capacidades de um DBMS incluem:

- **Linguagem de Definição de Dados**: Especifica a estrutura e o conteúdo do banco de dados.
- **Dicionário de Dados**: É um arquivo automatizado ou manual que armazena informações sobre os dados no banco de dados, incluindo nomes, definições, formatos e descrições de elementos de dados.
- **Linguagem de Manipulação de Dados**: Como SQL, é uma linguagem especializada para acessar e manipular os dados no banco de dados.

**Defina um DBMS relacional e explique como ele organiza os dados.**

O banco de dados relacional é o principal método para organizar e manter dados em sistemas de informação. Ele organiza dados em tabelas bidimensionais com linhas e colunas chamadas relações. Cada tabela contém dados sobre uma entidade e seus atributos. Cada linha representa um registro e cada coluna representa um atributo ou campo. Cada tabela também contém um campo-chave para identificar de forma única cada registro para recuperação ou manipulação.

**Liste e descreva as três operações de um DBMS relacional.**

Em um banco de dados relacional, três operações básicas são usadas para desenvolver conjuntos de dados úteis: seleção, projeção e união.

- **Operação de Seleção**: Cria um subconjunto composto por todos os registros no arquivo que atendem a critérios estabelecidos. Em outras palavras, a seleção cria um subconjunto de linhas que atendem a certos critérios.
- **Operação de União**: Combina tabelas relacionais para fornecer ao usuário mais informações disponíveis em tabelas individuais.
- **Operação de Projeção**: Cria um subconjunto composto por colunas em uma tabela, permitindo ao usuário criar novas tabelas que contêm apenas as informações requeridas.

**Explique por que bancos de dados não relacionais são úteis.**

Existem quatro principais razões para o aumento dos bancos de dados não relacionais: computação em nuvem, volumes de dados sem precedentes, cargas de trabalho massivas para serviços web e a necessidade de armazenar novos tipos de dados. Esses sistemas usam modelos de dados mais flexíveis e são projetados para gerenciar grandes conjuntos de dados em redes de computação distribuída. Eles são fáceis de escalar para cima e para baixo com base nas necessidades de computação.

Eles podem processar dados estruturados e não estruturados capturados de sites, redes sociais e gráficos. Bancos de dados relacionais tradicionais não são capazes de processar dados da maioria dessas fontes. Bancos de dados não relacionais também podem acelerar consultas simples contra grandes volumes de dados estruturados e não estruturados. Não há necessidade de pré-definir uma estrutura de banco de dados formal ou mudar essa definição se novos dados forem adicionados mais tarde.

**Defina e descreva normalização e integridade referencial e explique como contribuem para um banco de dados relacional bem projetado.**

Normalização é o processo de criar pequenas estruturas de dados estáveis a partir de grupos complexos de dados ao projetar um banco de dados relacional. A normalização agiliza o design do banco de dados relacional removendo dados redundantes, como grupos de dados repetitivos. Um banco de dados relacional bem projetado será organizado em torno das necessidades de informação da empresa e provavelmente estará em alguma forma normalizada. Um banco de dados que não é normalizado terá problemas com inserção, exclusão e modificação.

Regras de integridade referencial garantem que os relacionamentos entre tabelas acopladas permaneçam consistentes. Quando uma tabela tem uma chave estrangeira que aponta para outra tabela, você não pode adicionar um registro à tabela com a chave estrangeira a menos que haja um registro correspondente na tabela vinculada.

**Defina e descreva um diagrama de entidade-relacionamento e explique seu papel no design de banco de dados.**

Bancos de dados relacionais organizam dados em tabelas bidimensionais (chamadas relações) com colunas e linhas. Cada tabela contém dados sobre uma entidade e seus atributos. Um diagrama de entidade-relacionamento representa graficamente o relacionamento entre entidades (tabelas) em um banco de dados relacional. Um banco de dados relacional bem projetado não terá relacionamentos muitos-para-muitos, e todos os atributos de uma entidade específica se aplicarão apenas a essa entidade. Diagramas de entidade-relacionamento ajudam a formular um modelo de dados que atenderá bem aos

 negócios. Os diagramas também ajudam a garantir que os dados sejam precisos, completos e fáceis de recuperar.

## Seção 6-3: Ferramentas e Tecnologias para Acesso a Informações de Bancos de Dados

Esta seção foca em como as tecnologias de dados são usadas: data warehouses, data marts e mineração de dados. Também introduz quatro novas tecnologias: big data, Hadoop, computação em memória e plataformas analíticas. Independentemente da escolha de carreira dos alunos, eles provavelmente usarão algumas ou todas essas tecnologias em seus trabalhos. Data warehouses e data marts são críticos para aqueles que querem usar mineração de dados, que por sua vez tem muitos usos na análise gerencial e decisões empresariais. 

Big data refere-se à quantidade de dados capturados e analisados, muitas vezes na faixa de petabytes e exabytes. Sistemas DBMS típicos não são capazes de capturar, armazenar e analisar o volume de dados. Hadoop é uma estrutura de software de código aberto que divide problemas de big data em subproblemas, os distribui para nós de processamento e depois combina os resultados em conjuntos de dados.

Computação em memória elimina gargalos que ocorrem quando os dados são recuperados de e lidos em bancos de dados tradicionais baseados em disco. Todos os dados residem inteiramente na memória e aceleram o desempenho de processamento enquanto reduzem os custos.

Plataformas analíticas usam tecnologia relacional e não-relacional otimizada para grandes conjuntos de dados. Sistemas de hardware e software pré-configurados são especificamente projetados para processamento de consultas e análises. 

A Figura 6-12 é um diagrama importante para ilustrar como todas essas tecnologias funcionam juntas.

Tenha em mente que gerenciar recursos de dados pode ser muito técnico, mas muitos alunos precisam e querem saber os usos empresariais e os valores empresariais. No final, gerenciar dados de forma eficaz é o objetivo. Fazer isso de uma maneira que permita aos seus alunos contribuir para o sucesso de sua organização é a razão pela qual a maioria dos alunos está neste curso.

Mineração de texto e mineração web estão se tornando significativas à medida que mais dados e informações são armazenados em documentos de texto e na web. Mineração web é dividida em três categorias: mineração de conteúdo web, mineração de estrutura web e mineração de uso web. Cada uma fornece informações específicas sobre padrões nos dados web.


**Defina big data e descreva as tecnologias para gerenciá-lo e analisá-lo.**

Bancos de dados tradicionais dependem de conteúdo organizado de forma ordenada em linhas e colunas. Grande parte dos dados coletados atualmente pelas empresas não se enquadra nesse molde.

Big data descreve conjuntos de dados com volumes tão grandes que estão além da capacidade dos sistemas de gerenciamento de banco de dados típicos para capturar, armazenar e analisar. O termo não se refere a uma quantidade específica de dados, mas geralmente é medido na faixa de petabytes e exabytes. Inclui dados estruturados e não estruturados capturados de tráfego web, mensagens de e-mail e conteúdo de redes sociais, como tweets e mensagens de status. Também inclui dados gerados por máquinas a partir de sensores.

Big data contém mais padrões e anomalias interessantes do que conjuntos de dados menores. Isso cria o potencial para determinar novos insights sobre o comportamento do cliente, padrões climáticos, atividade do mercado financeiro e outros fenômenos.

- **Hadoop**: Estrutura de software de código aberto que permite o processamento paralelo distribuído de grandes quantidades de dados em computadores baratos. O software divide problemas grandes em menores, processa cada um em uma rede distribuída de computadores menores e, em seguida, combina os resultados em um conjunto de dados menor que é mais fácil de analisar. Ele usa processamento de banco de dados não-relacional e dados estruturados, semiestruturados e não estruturados.
- **Computação em memória**: Em vez de usar plataformas de software de banco de dados baseadas em disco, essa tecnologia depende principalmente da memória principal de um computador para armazenamento de dados. Ela elimina gargalos que resultam da recuperação e leitura de dados em um banco de dados tradicional e reduz os tempos de resposta de consultas. Avanços na tecnologia de hardware de computador contemporâneo tornam o processamento em memória possível.
- **Plataformas analíticas**: Usam tecnologia relacional e não-relacional otimizada para analisar grandes conjuntos de dados. Elas apresentam sistemas de hardware-software pré-configurados projetados para processamento de consultas e análises.

**Liste e descreva os componentes de uma infraestrutura de tecnologia de inteligência de negócios contemporânea.**

Infraestruturas de inteligência de negócios (BI) incluem uma gama de ferramentas para obter informações úteis de todos os diferentes tipos de dados usados pelas empresas hoje, incluindo big data semiestruturado e não estruturado em grandes quantidades. Data warehouses, data marts, Hadoop, processamento em memória e plataformas analíticas são todos incluídos nas infraestruturas de BI.

Ferramentas poderosas estão disponíveis para analisar e acessar informações que foram capturadas e organizadas em data warehouses e data marts. Essas ferramentas permitem que os usuários analisem os dados para ver novos padrões, relacionamentos e insights úteis para orientar a tomada de decisões. Essas ferramentas para consolidar, analisar e fornecer acesso a grandes quantidades de dados para ajudar os usuários a tomar melhores decisões de negócios são frequentemente chamadas de inteligência de negócios. As principais ferramentas de inteligência de negócios incluem software para consultas de banco de dados e ferramentas de relatórios para análise multidimensional de dados e mineração de dados.

**Descreva as capacidades do processamento analítico online (OLAP).**

Data warehouses suportam análise de dados multidimensional, também conhecida como processamento analítico online (OLAP), que permite aos usuários visualizar os mesmos dados de diferentes maneiras usando múltiplas dimensões. Cada aspecto da informação representa uma dimensão diferente.

OLAP representa relacionamentos entre dados como uma estrutura multidimensional, que pode ser visualizada como cubos de dados e cubos dentro de cubos de dados, permitindo uma análise de dados mais sofisticada. OLAP permite aos usuários obter respostas online para perguntas ad-hoc em um tempo relativamente rápido, mesmo quando os dados estão armazenados em bancos de dados muito grandes. O processamento analítico online e a mineração de dados permitem a manipulação e análise de grandes volumes de dados de muitas perspectivas, por exemplo, vendas por item, por departamento, por loja, por região, para encontrar padrões nos dados. Esses padrões são difíceis de encontrar com métodos normais de banco de dados, por isso um data warehouse e a mineração de dados geralmente fazem parte do OLAP.

**Defina mineração de dados, descrevendo como ela difere do OLAP e os tipos de informações que fornece.**

Mineração de dados fornece insights nos dados corporativos que não podem ser obtidos com OLAP, encontrando padrões ocultos e relacionamentos em grandes bancos de dados e inferindo regras a partir deles para prever comportamentos futuros. Os padrões e regras são usados para orientar a tomada de decisões e prever o efeito dessas decisões. Os tipos de informações obtidas a partir da mineração de dados incluem associações, sequências, classificações, agrupamentos e previsões.

**Explique como a mineração de texto e a mineração web diferem da mineração de dados convencional.**

A mineração de dados convencional foca em dados que foram estruturados em bancos de dados e arquivos. A mineração de texto se concentra em encontrar padrões e tendências em dados não estruturados contidos em arquivos de texto. Os dados podem estar em e-mails, memorandos, transcrições de call center, respostas de pesquisas, casos legais, descrições de patentes e relatórios de serviço. Ferramentas de mineração de texto extraem elementos-chave de grandes conjuntos de dados não estruturados, descobrem padrões e relacionamentos e resumem as informações.

A mineração web ajuda as empresas a entender o comportamento do cliente, avaliar a eficácia de um site específico ou quantificar o sucesso de uma campanha de marketing. A mineração web procura padrões em dados por meio de:

- **Mineração de conteúdo web**: Extração de conhecimento do conteúdo das páginas web.
- **Mineração de estrutura web**: Exame dos dados relacionados à estrutura de um site específico.
- **Mineração de uso web**: Exame dos dados de interação do usuário registrados por um servidor web sempre que solicitações para recursos de um site são recebidas.

**Descreva como os usuários podem acessar informações dos bancos de dados internos de uma empresa através da web.**

Bancos de dados convencionais podem ser vinculados via middleware à web ou a uma interface web para facilitar o acesso do usuário aos dados internos de uma organização. O software de navegador web em um PC cliente é usado para acessar um site corporativo pela Internet. O software do navegador web solicita dados do banco de dados da organização, usando comandos HTML para se comunicar com o servidor web. Como muitos bancos de dados de back-end não podem interpretar comandos escritos em HTML, o servidor web passa essas solicitações de dados para um software middleware especial que então traduz comandos HTML em SQL para que possam ser processados pelo DBMS que trabalha com o banco de dados. O DBMS recebe as solicitações SQL e fornece os dados necessários. O middleware transfere informações do banco de dados interno da organização de volta para o servidor web para entrega na forma de uma página web ao usuário. O software que trabalha entre o servidor web e o DBMS pode ser um servidor de aplicações, um programa personalizado ou uma série de scripts de software.


## Seção 6-4: Governança de Dados e Garantia de Qualidade de Dados

Governança de dados envolve políticas e procedimentos através dos quais os dados podem ser gerenciados como um recurso organizacional. Estabelece as regras da organização para compartilhar, disseminar, adquirir, padronizar, classificar e inventariar informações. Isso inclui identificar quais usuários e unidades organizacionais podem compartilhar informações, onde as informações podem ser distribuídas, quem é responsável por atualizar e manter as informações e como os recursos de dados devem ser protegidos.

**Defina governança de dados e explique como ela ajuda as organizações a gerenciar seus dados.**

A governança de dados abrange políticas e procedimentos pelos quais os dados podem ser gerenciados como um recurso organizacional. Estabelece as regras da organização para compartilhar, disseminar, adquirir, padronizar, classificar e inventariar informações. Isso inclui identificar quais usuários e unidades organizacionais podem compartilhar informações, onde as informações podem ser distribuídas, quem é responsável por atualizar e manter as informações e como os recursos de dados devem ser protegidos.

**Liste e descreva os problemas mais importantes de qualidade de dados.**

A maioria dos problemas de dados é devido ao uso de códigos ou descrições diferentes em vários sistemas. Também é bastante comum ter erros de usuário na entrada de dados, resultando em nomes digitados incorretamente, números transpostos ou códigos incorretos ou ausentes.

**Liste e descreva as ferramentas e técnicas mais importantes para garantir a qualidade dos dados.**

Antes de um novo banco de dados estar em operação, as organizações precisam identificar e corrigir seus dados defeituosos e estabelecer melhores rotinas para editar dados uma vez que seu banco de dados esteja em operação. A análise da qualidade dos dados geralmente começa com uma auditoria de qualidade dos dados, que é uma pesquisa estruturada da precisão e nível de completude dos dados em um sistema de informações.

A limpeza de dados não só corrige erros, mas também impõe consistência entre diferentes conjuntos de dados que se originaram em sistemas de informações separados. Software especializado de limpeza de dados está disponível para automaticamente verificar arquivos de dados, corrigir erros nos dados e integrar os dados em um formato consistente em toda a empresa.


---

## Dicionário de Termos

- **Analytic platform (Plataforma analítica)**: Sistema integrado de hardware e software especialmente projetado para a análise e processamento de grandes volumes de dados. Essas plataformas são otimizadas para realizar consultas complexas e análise de dados em tempo real, facilitando a tomada de decisões empresariais com base em insights derivados dos dados.

- **Entity (Entidade)**: Qualquer objeto ou conceito significativo para um negócio ou sistema de informação, sobre o qual se obtêm informações. Exemplos incluem clientes, produtos, funcionários e pedidos. Cada entidade é representada por um conjunto de atributos que descrevem suas características.

- **Attribute (Atributo)**: Uma característica ou propriedade específica de uma entidade. Por exemplo, em uma entidade "Cliente", os atributos podem incluir nome, endereço, telefone e email. Atributos fornecem informações detalhadas sobre uma entidade.

- **Entity-relationship diagram (Diagrama de entidade-relacionamento)**: Representação gráfica das entidades de um banco de dados e dos relacionamentos entre elas. Esses diagramas ajudam a modelar a estrutura lógica do banco de dados, facilitando a compreensão das interações entre diferentes entidades.

- **Big data (Big data)**: Conjuntos de dados extremamente grandes e complexos que não podem ser gerenciados por sistemas tradicionais de banco de dados. Big data inclui uma variedade de fontes de dados estruturados e não estruturados, como redes sociais, transações financeiras, sensores e dispositivos IoT. Técnicas avançadas são usadas para analisar esses dados e extrair insights valiosos.

- **Field (Campo)**: Unidade básica de dados em um banco de dados, representando uma única peça de informação. Por exemplo, um campo pode conter um nome, uma data de nascimento ou um código postal. Campos são organizados em registros.

- **Bit (Bit)**: A menor unidade de informação em um computador, representando um valor binário de 0 ou 1. Bits são os blocos de construção fundamentais para todos os tipos de dados digitais.

- **File (Arquivo)**: Coleção de registros relacionados armazenados juntos em um sistema de computador. Arquivos são usados para organizar e armazenar dados de forma estruturada, facilitando o acesso e a manipulação dos dados.

- **Blockchain (Blockchain)**: Tecnologia de banco de dados distribuído que registra transações de forma segura, transparente e imutável em uma rede de computadores peer-to-peer. Cada bloco de dados contém um registro de transações e está ligado ao bloco anterior, formando uma cadeia. Usada principalmente em criptomoedas, blockchain tem aplicações em várias outras áreas, como rastreamento de cadeias de suprimentos e registros médicos.

- **Foreign key (Chave estrangeira)**: Campo em uma tabela que estabelece um vínculo com a chave primária de outra tabela, criando um relacionamento entre as duas tabelas. Isso ajuda a manter a integridade referencial no banco de dados, garantindo que as relações entre as tabelas sejam consistentes.

- **Byte (Byte)**: Grupo de oito bits que representa um caractere, número ou símbolo. Bytes são as unidades básicas de armazenamento de dados em computadores, usados para medir a quantidade de informação digital.

- **Hadoop (Hadoop)**: Estrutura de software de código aberto que permite o processamento paralelo distribuído de grandes volumes de dados em clusters de computadores comuns. Hadoop usa o modelo de programação MapReduce e o sistema de arquivos Hadoop Distributed File System (HDFS) para gerenciar e processar big data de forma eficiente.

- **Data cleansing (Limpeza de dados)**: Processo de detectar e corrigir (ou remover) dados incorretos, incompletos, duplicados ou inconsistentes em um conjunto de dados. A limpeza de dados melhora a qualidade dos dados e a confiabilidade das análises realizadas com eles.

- **In-memory computing (Computação em memória)**: Tecnologia que armazena todos os dados na memória principal (RAM) de um computador em vez de discos rígidos tradicionais. Isso acelera o processamento de dados, pois a memória RAM é muito mais rápida que o armazenamento em disco, permitindo análises e consultas quase em tempo real.

- **Data definition (Definição de dados)**: Conjunto de regras e especificações que definem a estrutura, o formato e o conteúdo dos dados em um banco de dados. Inclui a definição de tabelas, campos, tipos de dados e restrições.

- **Key field (Campo-chave)**: Campo em um registro que identifica de forma única instâncias desse registro. Campos-chave são essenciais para garantir que cada registro em uma tabela seja único, facilitando a busca e a manipulação dos dados.

- **Data dictionary (Dicionário de dados)**: Repositório centralizado que armazena informações sobre os dados contidos em um banco de dados, incluindo nomes, definições, formatos e descrições dos elementos de dados. O dicionário de dados ajuda a padronizar a terminologia e facilita a compreensão dos dados por todos os usuários.

- **Nonrelational database management systems (Sistemas de gerenciamento de banco de dados não-relacionais)**: Sistemas de banco de dados que usam modelos de dados mais flexíveis, como documentos, grafos e colunas, em vez do modelo relacional tradicional. Esses sistemas são projetados para gerenciar grandes volumes de dados não estruturados e semi-estruturados, oferecendo escalabilidade e desempenho em ambientes distribuídos.

- **Data governance (Governança de dados)**: Conjunto de políticas, processos e padrões que garantem a gestão eficaz e segura dos dados como um ativo organizacional. Governança de dados abrange aspectos como qualidade, segurança, privacidade, conformidade e uso dos dados.

- **Normalization (Normalização)**: Processo de organizar os dados em um banco de dados para reduzir a redundância e melhorar a integridade dos dados. A normalização divide grandes tabelas em tabelas menores e estabelece relacionamentos entre elas, minimizando a duplicação de dados.

- **Data inconsistency (Inconsistência de dados)**: Ocorrência de valores diferentes para o mesmo atributo em diferentes arquivos ou tabelas. A inconsistência de dados pode causar problemas na precisão das análises e relatórios gerados a partir dos dados.

- **Online analytical processing (OLAP) (Processamento analítico online (OLAP))**: Ferramenta que permite a visualização e análise de dados de diferentes maneiras usando múltiplas dimensões. OLAP facilita a exploração interativa de grandes volumes de dados, permitindo a criação de relatórios e análises ad-hoc rapidamente.

- **Data lake (Lago de dados)**: Repositório de armazenamento que mantém uma quantidade enorme de dados brutos em seu formato nativo até que sejam necessários para análise. Data lakes são usados para armazenar big data, incluindo dados estruturados, semi-estruturados e não estruturados, oferecendo flexibilidade e escalabilidade.

- **Primary key (Chave primária)**: Campo ou conjunto de campos em um registro que identifica de forma única esse registro dentro de uma tabela. Chaves primárias são usadas para garantir a unicidade dos registros e estabelecer relacionamentos com outras tabelas.

- **Data manipulation language (Linguagem de manipulação de dados)**: Linguagem especializada, como SQL, usada para acessar, manipular e gerenciar dados em um banco de dados. Inclui comandos para inserir, atualizar, excluir e consultar dados.

- **Program-data dependence (Dependência de programa-dados)**: Relação estreita entre os dados armazenados em arquivos e os programas necessários para atualizar e manter esses arquivos. Essa dependência pode levar a problemas de manutenção e flexibilidade, pois mudanças nos dados podem exigir alterações nos programas associados.

- **Data mart (Data mart)**: Subconjunto de um data warehouse voltado para um departamento ou área específica da empresa. Data marts são usados para fornecer dados específicos e relevantes de forma rápida e eficiente para análises departamentais.

- **Query (Consulta)**: Solicitação de dados específicos de um banco de dados usando uma linguagem de consulta, como SQL. Consultas são usadas para recuperar, filtrar, ordenar e apresentar dados de acordo com critérios definidos pelo usuário.

- **Data mining (Mineração de dados)**: Processo de encontrar padrões ocultos, tendências e relacionamentos em grandes conjuntos de dados para prever comportamentos futuros e apoiar a tomada de decisões. Mineração de dados usa técnicas de estatística, aprendizado de máquina e inteligência artificial para descobrir insights valiosos.

- **Record (Registro)**: Conjunto de campos relacionados que descrevem uma entidade específica em uma tabela de banco de dados. Cada registro contém todas as informações sobre uma instância particular da entidade.

- **Data quality audit (Auditoria de qualidade de dados)**: Pesquisa estruturada da precisão e nível de completude dos dados em um sistema de informações. Auditorias de qualidade de dados identificam problemas e inconsistências nos dados, ajudando a melhorar sua confiabilidade e usabilidade.

- **Referential integrity (Integridade referencial)**: Conjunto de regras que garantem que os relacionamentos entre tabelas em um banco de dados permaneçam consistentes. Por exemplo, uma chave estrangeira em uma tabela deve corresponder a um valor válido na tabela referenciada.

- **Data redundancy (Redundância de dados)**: Presença de dados duplicados em vários arquivos ou tabelas. A redundância de dados pode levar a inconsistências e aumento dos custos de armazenamento e manutenção.

- **Relational DBMS (SGBD relacional)**: Sistema de gerenciamento de banco de dados que organiza dados em tabelas bidimensionais (relações) com linhas e colunas. SGBDs relacionais usam SQL para manipular dados e suportam integridade referencial e normalização.

- **Data warehouse (Armazém de dados)**: Banco de dados centralizado que armazena grandes volumes de dados consolidados de várias fontes para análise e relatórios. Data warehouses são projetados para suportar consultas complexas e análises de negócios.

- **Sentiment analysis (Análise de sentimento)**: Técnica de mineração de dados usada para identificar e extrair informações subjetivas em fontes de texto, como opiniões e sentimentos expressos em redes sociais, avaliações de produtos e comentários de clientes.

- **Database (Banco de dados)**: Coleção organizada de dados armazenados e gerenciados para servir muitas aplicações de forma eficiente. Bancos de dados permitem o armazenamento, recuperação e manipulação de grandes volumes de informações.

- **Structured Query Language (SQL) (Linguagem de Consulta Estruturada (SQL))**: Linguagem padrão usada para gerenciar e manipular dados em sistemas de banco de dados relacionais. SQL inclui comandos para criação, alteração e exclusão de tabelas, bem como para inserção, atualização e consulta de dados.

- **Database management system (DBMS) (Sistema de gerenciamento de banco de dados (DBMS))**: Software que permite a centralização, gestão eficiente e acesso aos dados armazenados. Um DBMS fornece ferramentas para definir, criar, manter e controlar o acesso ao banco de dados, garantindo a integridade e segurança dos dados.

- **Text mining (Mineração de texto)**: Processo de analisar grandes conjuntos de dados de texto para descobrir padrões e relacionamentos. A mineração de texto utiliza técnicas de processamento de linguagem natural para extrair informações valiosas de fontes textuais, como documentos, e-mails e postagens em redes sociais.

- **Database server (Servidor de banco de dados)**: Computador que hospeda um banco de dados e responde a solicitações de acesso de outros computadores na rede. O servidor de banco de dados gerencia as operações de banco de dados, incluindo consultas, atualizações e backups, e garante a disponibilidade e desempenho dos dados.

- **Tuple (Tupla)**: Linha ou registro em uma tabela de um banco de dados relacional. Cada tupla representa uma instância única de uma entidade, composta por um conjunto de valores para os atributos definidos na tabela.

- **Distributed database (Banco de dados distribuído)**: Banco de dados cujos dados são armazenados em vários locais físicos diferentes. Bancos de dados distribuídos permitem que os dados sejam armazenados e acessados em várias máquinas conectadas em rede, oferecendo maior disponibilidade e resiliência.

- **Web mining (Mineração web)**: Processo de usar técnicas de mineração de dados para descobrir padrões a partir de dados web. A mineração web pode ser dividida em três categorias principais: mineração de conteúdo web, mineração de estrutura web e mineração de uso web. Essas técnicas ajudam as empresas a entender o comportamento dos usuários, otimizar sites e medir a eficácia de campanhas de marketing.
