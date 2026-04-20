# Tutorial completo: aplicação NestJS com formulários HTML e PostgreSQL

## 1. Objetivo da aplicação

Neste projeto, o sistema terá o mesmo comportamento geral da versão anterior:

* uma página inicial;
* um formulário de **cadastro de pessoa**;
* um formulário de **solicitação**;
* uma página de **sucesso** após o envio;
* uma página para **listar registros**;
* uma página para **visualizar um registro específico**.

A diferença é que, agora, os dados não serão mais salvos em arquivos `.txt`. Eles serão persistidos em um banco **PostgreSQL**, por meio de tabelas relacionais. Em aplicações NestJS, essa integração é normalmente feita com `@nestjs/typeorm`, e o TypeORM trabalha com o conceito de **entidade**, isto é, uma classe que representa uma tabela do banco. ([NestJS Docs][1])

---

## 2. Antes do código: como esta aplicação funciona

Antes de programar, o aluno precisa entender o caminho percorrido pelos dados.

Quando o usuário abre a página do formulário, o navegador faz uma requisição HTTP do tipo `GET`. O servidor NestJS recebe essa requisição no **controller** e devolve uma **view** HTML. Quando o usuário preenche e envia o formulário, o navegador faz uma requisição `POST`. O controller recebe os dados, chama o **service**, e o service usa o **repositório** do TypeORM para gravar os dados no PostgreSQL. Depois disso, o controller pode renderizar uma página de sucesso ou redirecionar para outra tela. O mesmo vale para a listagem: o controller pede ao service os registros do banco, e a view os exibe ao usuário. Esse modelo é coerente com a arquitetura MVC/MVT usada em aplicações renderizadas no servidor. ([NestJS Docs][1])

Em termos didáticos, o fluxo é este:

```text
Navegador → rota → controller → service → repositório → PostgreSQL
                                              ↓
                                           resposta
                                              ↓
                                          view HTML
                                              ↓
                                          navegador
```

---

## 3. O que será usado

Neste tutorial, serão usados:

* **Windows** como sistema operacional;
* **Visual Studio Code** como editor;
* **GitHub** para versionamento;
* **GitHub Copilot** como apoio opcional;
* **NestJS** como framework do back-end;
* **Handlebars (hbs)** para renderizar HTML;
* **PostgreSQL** como banco de dados;
* **TypeORM** para mapear classes em tabelas e manipular dados. O TypeORM usa o conceito de `DataSource`, entidades e repositórios para estabelecer a conexão e acessar as tabelas. ([typeorm.io][2])

---

## 4. Pré-requisitos

Instale antes:

* Node.js
* Git
* Visual Studio Code
* PostgreSQL
* Nest CLI

No terminal do Windows, verifique:

```bash
node -v
npm -v
git --version
```

Instale a CLI do NestJS:

```bash
npm install -g @nestjs/cli
```

---

## 5. Criando o projeto

Crie a pasta do projeto e abra no VS Code:

```bash
mkdir projeto-form-postgres
cd projeto-form-postgres
code .
```

Agora crie o projeto NestJS na pasta atual:

```bash
nest new .
```

Escolha o gerenciador de pacotes padrão, normalmente `npm`.

---

## 6. Instalando as dependências do projeto

Agora instale os pacotes necessários para PostgreSQL, TypeORM, renderização HTML e configuração por `.env`.

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config hbs @nestjs/platform-express
```

### O que cada pacote faz

`@nestjs/typeorm` faz a integração entre NestJS e TypeORM. O NestJS recomenda esse pacote para trabalhar com bancos SQL a partir do framework. `typeorm` é o ORM propriamente dito. `pg` é o driver de conexão com PostgreSQL. `@nestjs/config` permite carregar variáveis de ambiente a partir de arquivos como `.env`. `hbs` é o mecanismo de templates Handlebars. `@nestjs/platform-express` é a camada HTTP padrão do NestJS com Express. ([NestJS Docs][1])

---

## 7. Instalando e preparando o PostgreSQL

O PostgreSQL pode ser instalado no Windows pelo instalador oficial. Depois da instalação, você terá acesso ao servidor, ao `psql` e, em muitos casos, também ao pgAdmin. A documentação oficial informa que a criação de banco pode ser feita com `CREATE DATABASE` e a criação de usuário com `CREATE USER`, sendo que para isso é necessário ter privilégios adequados. ([PostgreSQL][3])

Abra o **SQL Shell (psql)** e execute:

```sql
CREATE DATABASE projeto_form;
CREATE USER appuser WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE projeto_form TO appuser;
```

### O que esses comandos fazem

`CREATE DATABASE projeto_form;` cria um novo banco de dados. A documentação oficial do PostgreSQL informa que um servidor PostgreSQL pode gerenciar vários bancos, e normalmente cada projeto usa um banco próprio. `CREATE USER appuser WITH PASSWORD 'senha123';` cria um usuário com login e senha. Depois, `GRANT ALL PRIVILEGES ON DATABASE projeto_form TO appuser;` concede privilégios sobre esse banco ao usuário criado. ([PostgreSQL][3])

---

## 8. Estrutura conceitual da solução

Na versão antiga, o sistema tinha um `FormService` que escrevia dados em arquivos `.txt`. Agora, o armazenamento será substituído por tabelas do PostgreSQL. Para manter a mesma lógica didática da aplicação, criaremos duas tabelas:

* `person_records`
* `request_records`

Cada tabela terá sua própria **entidade**. No TypeORM, uma entidade é uma classe marcada com `@Entity()` e suas propriedades mapeiam colunas do banco. Operações como salvar, buscar e listar registros normalmente são feitas por meio do **repositório** da entidade. ([typeorm.io][4])

---

## 9. Criando a estrutura da funcionalidade

Crie o módulo, o controller e o service:

```bash
nest generate module form
nest generate controller form
nest generate service form
```

Agora crie manualmente a seguinte estrutura dentro de `src/form`:

```text
src/form/
  entities/
    person-record.entity.ts
    request-record.entity.ts
```

---

## 10. Configurando variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=appuser
DB_PASSWORD=senha123
DB_NAME=projeto_form
```

### Por que usar `.env`

A documentação do NestJS recomenda o uso de `ConfigModule` e `ConfigService` para carregar configurações de ambiente, especialmente quando queremos separar dados de conexão do código-fonte. Isso facilita manutenção, segurança e alteração de ambiente. ([NestJS Docs][5])

---

## 11. Configurando o `main.ts`

O arquivo `src/main.ts` será responsável por iniciar a aplicação e apontar para a pasta `views`.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```

### Explicação

`NestFactory.create(AppModule)` cria a aplicação principal. `setBaseViewsDir(...)` informa onde estão os arquivos `.hbs`. `setViewEngine('hbs')` define o Handlebars como mecanismo de renderização. Por fim, `listen(3000)` inicia o servidor na porta 3000.

---

## 12. Configurando o `AppModule`

Agora vamos integrar o PostgreSQL ao projeto pelo `AppModule`.

Substitua `src/app.module.ts` por:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormModule } from './form/form.module';
import { PersonRecord } from './form/entities/person-record.entity';
import { RequestRecord } from './form/entities/request-record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [PersonRecord, RequestRecord],
        synchronize: true,
      }),
    }),

    FormModule,
  ],
})
export class AppModule {}
```

### Explicação conceitual

O `ConfigModule.forRoot({ isGlobal: true })` carrega as variáveis do `.env` para toda a aplicação. O `TypeOrmModule.forRootAsync(...)` cria a conexão com o banco usando essas variáveis. O campo `type: 'postgres'` define o banco como PostgreSQL, e `entities: [...]` informa quais classes devem ser tratadas como tabelas. O parâmetro `synchronize: true` faz o TypeORM criar e atualizar as tabelas automaticamente a partir das entidades durante o desenvolvimento; isso é útil em contexto didático, mas não é recomendado para produção sem cuidado. O NestJS documenta a integração oficial com TypeORM, e o TypeORM documenta que o acesso às tabelas é baseado em entidades. ([NestJS Docs][1])

---

## 13. Criando a entidade de cadastro de pessoa

Crie `src/form/entities/person-record.entity.ts`:

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'person_records' })
export class PersonRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ nullable: true })
  cidade: string;
}
```

### Explicação

`@Entity({ name: 'person_records' })` informa que essa classe corresponde à tabela `person_records`. `@PrimaryGeneratedColumn()` cria a chave primária automática. Cada `@Column()` define uma coluna da tabela. Quando usamos `nullable: true`, permitimos que a coluna fique vazia no banco. O TypeORM define entidade justamente como a classe que mapeia a tabela. ([typeorm.io][4])

---

## 14. Criando a entidade de solicitação

Crie `src/form/entities/request-record.entity.ts`:

```ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'request_records' })
export class RequestRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  assunto: string;

  @Column({ type: 'text', nullable: true })
  descricao: string;

  @Column({ nullable: true })
  data: string;
}
```

### Explicação

Essa entidade representa a tabela de solicitações. A coluna `descricao` foi definida como `text` porque pode armazenar conteúdos maiores. O restante segue a mesma lógica da entidade anterior.

---

## 15. Configurando o `FormModule`

Substitua `src/form/form.module.ts` por:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormController } from './form.controller';
import { FormService } from './form.service';
import { PersonRecord } from './entities/person-record.entity';
import { RequestRecord } from './entities/request-record.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRecord, RequestRecord])],
  controllers: [FormController],
  providers: [FormService],
})
export class FormModule {}
```

### Explicação

`TypeOrmModule.forFeature([PersonRecord, RequestRecord])` registra os repositórios dessas entidades dentro do módulo. Isso é necessário para que possamos injetá-los no service. O TypeORM trabalha justamente com repositórios por entidade para operações como salvar e buscar registros. ([typeorm.io][6])

---

## 16. Pensando antes do `FormService`

Na versão em arquivo, o service criava uma pasta, escrevia texto e listava nomes de arquivos. Agora ele deverá:

* salvar uma pessoa no banco;
* salvar uma solicitação no banco;
* listar pessoas e solicitações;
* buscar um registro específico por tipo e por id.

Para simplificar a navegação, faremos duas listas separadas:

* `/records/person`
* `/records/request`

E também dois detalhes:

* `/records/person/:id`
* `/records/request/:id`

Isso torna o tutorial mais claro para os alunos.

---

## 17. Implementando o `FormService`

Substitua `src/form/form.service.ts` por:

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonRecord } from './entities/person-record.entity';
import { RequestRecord } from './entities/request-record.entity';

@Injectable()
export class FormService {
  constructor(
    @InjectRepository(PersonRecord)
    private readonly personRepository: Repository<PersonRecord>,

    @InjectRepository(RequestRecord)
    private readonly requestRepository: Repository<RequestRecord>,
  ) {}

  async savePersonForm(data: {
    nome: string;
    email: string;
    telefone: string;
    cidade: string;
  }) {
    const person = this.personRepository.create(data);
    return await this.personRepository.save(person);
  }

  async saveRequestForm(data: {
    nome: string;
    assunto: string;
    descricao: string;
    data: string;
  }) {
    const request = this.requestRepository.create(data);
    return await this.requestRepository.save(request);
  }

  async listPersonRecords() {
    return await this.personRepository.find({
      order: { id: 'DESC' },
    });
  }

  async listRequestRecords() {
    return await this.requestRepository.find({
      order: { id: 'DESC' },
    });
  }

  async readPersonRecord(id: number) {
    return await this.personRepository.findOneBy({ id });
  }

  async readRequestRecord(id: number) {
    return await this.requestRepository.findOneBy({ id });
  }
}
```

### Explicação conceitual

`@InjectRepository(...)` injeta o repositório correspondente à entidade. Um repositório é o objeto que executa operações de banco específicas para aquela entidade. O TypeORM documenta esse padrão como o modo usual de acesso aos dados. `create(data)` monta uma instância da entidade a partir dos dados recebidos. `save(...)` persiste o registro no banco. `find(...)` lista registros. `findOneBy(...)` busca um registro por critério, neste caso pelo `id`. ([typeorm.io][6])

---

## 18. Pensando antes do `FormController`

O controller continuará tendo o papel de conversar com o navegador. Ele vai:

* abrir as páginas;
* receber o corpo dos formulários;
* chamar o service;
* renderizar views com os resultados.

Como agora o banco devolve objetos com `id`, o controller pode enviar esse `id` para a página de sucesso.

---

## 19. Implementando o `FormController`

Substitua `src/form/form.controller.ts` por:

```ts
import { Body, Controller, Get, Param, Post, Render } from '@nestjs/common';
import { FormService } from './form.service';

@Controller()
export class FormController {
  constructor(private readonly formService: FormService) {}

  @Get()
  @Render('home')
  home() {
    return {};
  }

  @Get('forms/person')
  @Render('person-form')
  personForm() {
    return {};
  }

  @Post('forms/person')
  @Render('success')
  async submitPersonForm(
    @Body() body: { nome: string; email: string; telefone: string; cidade: string },
  ) {
    const person = await this.formService.savePersonForm(body);

    return {
      mensagem: 'Cadastro de pessoa salvo com sucesso.',
      tipo: 'person',
      id: person.id,
    };
  }

  @Get('forms/request')
  @Render('request-form')
  requestForm() {
    return {};
  }

  @Post('forms/request')
  @Render('success')
  async submitRequestForm(
    @Body() body: { nome: string; assunto: string; descricao: string; data: string },
  ) {
    const request = await this.formService.saveRequestForm(body);

    return {
      mensagem: 'Solicitação salva com sucesso.',
      tipo: 'request',
      id: request.id,
    };
  }

  @Get('records/person')
  @Render('person-records')
  async personRecords() {
    const records = await this.formService.listPersonRecords();
    return { records };
  }

  @Get('records/request')
  @Render('request-records')
  async requestRecords() {
    const records = await this.formService.listRequestRecords();
    return { records };
  }

  @Get('records/person/:id')
  @Render('person-record-detail')
  async personRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readPersonRecord(Number(id));
    return { record };
  }

  @Get('records/request/:id')
  @Render('request-record-detail')
  async requestRecordDetail(@Param('id') id: string) {
    const record = await this.formService.readRequestRecord(Number(id));
    return { record };
  }
}
```

### Explicação

`@Get()` e `@Post()` definem rotas HTTP. `@Render('...')` informa qual view será usada. `@Body()` captura os campos enviados no formulário. `@Param('id')` captura o parâmetro presente na URL. As chamadas ao service agora são assíncronas porque o acesso ao banco ocorre por operações de I/O. O fluxo geral continua simples: controller recebe, service processa, repositório fala com o banco, controller envia os dados à view.

---

## 20. Criando a pasta `views`

Na raiz do projeto, crie a pasta:

```text
views/
```

Agora crie os arquivos abaixo.

---

## 21. `views/home.hbs`

```hbs
<h1>Sistema de Formulários com PostgreSQL</h1>

<ul>
  <li><a href="/forms/person">Cadastro de Pessoa</a></li>
  <li><a href="/forms/request">Nova Solicitação</a></li>
  <li><a href="/records/person">Ver Cadastros de Pessoa</a></li>
  <li><a href="/records/request">Ver Solicitações</a></li>
</ul>
```

### Explicação

Essa página inicial serve como navegação principal do sistema. Ela não recebe dados complexos do controller; apenas apresenta links para as rotas disponíveis.

---

## 22. `views/person-form.hbs`

```hbs
<h2>Cadastro de Pessoa</h2>

<form action="/forms/person" method="post">
  <label>Nome:</label>
  <input type="text" name="nome" required>
  <br><br>

  <label>Email:</label>
  <input type="email" name="email" required>
  <br><br>

  <label>Telefone:</label>
  <input type="text" name="telefone">
  <br><br>

  <label>Cidade:</label>
  <input type="text" name="cidade">
  <br><br>

  <button type="submit">Salvar</button>
</form>

<br>
<a href="/">Voltar</a>
```

### Explicação

O atributo `action="/forms/person"` indica a rota que receberá os dados. O método `post` indica que o formulário enviará dados ao servidor. Cada `name="..."` precisa coincidir com as propriedades esperadas pelo `@Body()` no controller.

---

## 23. `views/request-form.hbs`



```hbs
<h2>Nova Solicitação</h2>

<form action="/forms/request" method="post">
  <label>Nome:</label>
  <input type="text" name="nome" required>
  <br><br>

  <label>Assunto:</label>
  <input type="text" name="assunto" required>
  <br><br>

  <label>Descrição:</label>
  <input type="text" name="descricao" required>
  <br><br>

  <label>Data:</label>
  <input type="date" name="data">
  <br><br>

  <button type="submit">Enviar</button>
</form>

<br>
<a href="/">Voltar</a>
```


### Explicação

A estrutura é semelhante à do formulário de pessoa. A diferença está nos campos ligados à solicitação.

---

## 24. `views/success.hbs`

```hbs
<h2>Operação realizada com sucesso</h2>

<p>{{mensagem}}</p>
<p>Tipo de registro: {{tipo}}</p>
<p>ID gerado no banco: {{id}}</p>

{{#if tipo}}
  <p><a href="/records/{{tipo}}/{{id}}">Ver este registro</a></p>
{{/if}}

<p><a href="/">Voltar para a página inicial</a></p>
```

### Explicação

Aqui o Handlebars insere os valores enviados pelo controller. Em vez de exibir nome de arquivo, agora mostramos o `id` gerado no banco. Isso é mais coerente com persistência relacional.

---

## 25. `views/person-records.hbs`

```hbs
<h2>Cadastros de Pessoa</h2>

<ul>
  {{#each records}}
    <li>
      <a href="/records/person/{{this.id}}">
        {{this.id}} - {{this.nome}} - {{this.email}}
      </a>
    </li>
  {{/each}}
</ul>

<p><a href="/">Voltar</a></p>
```

### Explicação

`{{#each records}}` percorre o vetor enviado pelo controller. `{{this.id}}`, `{{this.nome}}` e `{{this.email}}` exibem propriedades do objeto atual.

---

## 26. `views/request-records.hbs`

```hbs
<h2>Solicitações</h2>

<ul>
  {{#each records}}
    <li>
      <a href="/records/request/{{this.id}}">
        {{this.id}} - {{this.nome}} - {{this.assunto}}
      </a>
    </li>
  {{/each}}
</ul>

<p><a href="/">Voltar</a></p>
```

---

## 27. `views/person-record-detail.hbs`

```hbs
<h2>Detalhe do Cadastro de Pessoa</h2>

{{#if record}}
  <p><strong>ID:</strong> {{record.id}}</p>
  <p><strong>Nome:</strong> {{record.nome}}</p>
  <p><strong>Email:</strong> {{record.email}}</p>
  <p><strong>Telefone:</strong> {{record.telefone}}</p>
  <p><strong>Cidade:</strong> {{record.cidade}}</p>
{{else}}
  <p>Registro não encontrado.</p>
{{/if}}

<p><a href="/records/person">Voltar</a></p>
```

### Explicação

Esse template mostra um único registro. O bloco `{{#if record}}` evita erro visual caso o `id` não exista no banco.

---

## 28. `views/request-record-detail.hbs`

```hbs
<h2>Detalhe da Solicitação</h2>

{{#if record}}
  <p><strong>ID:</strong> {{record.id}}</p>
  <p><strong>Nome:</strong> {{record.nome}}</p>
  <p><strong>Assunto:</strong> {{record.assunto}}</p>
  <p><strong>Descrição:</strong> {{record.descricao}}</p>
  <p><strong>Data:</strong> {{record.data}}</p>
{{else}}
  <p>Registro não encontrado.</p>
{{/if}}

<p><a href="/records/request">Voltar</a></p>
```

---

## 29. Executando a aplicação

Instale as dependências, se ainda não o fez:

```bash
npm install
```

Agora execute:

```bash
npm run start:dev
```

Se a conexão estiver correta, o NestJS iniciará o servidor e o TypeORM criará as tabelas automaticamente por causa de `synchronize: true`.

Abra no navegador:

```text
http://localhost:3000
```

---

## 30. Testando o fluxo completo

### Fluxo 1: cadastro de pessoa

1. Abra `/forms/person`
2. Preencha os dados
3. Envie o formulário
4. Verifique a página de sucesso
5. Abra `/records/person`
6. Veja se o registro aparece
7. Abra o detalhe do registro

### Fluxo 2: solicitação

1. Abra `/forms/request`
2. Preencha os dados
3. Envie o formulário
4. Verifique a página de sucesso
5. Abra `/records/request`
6. Veja se o registro aparece
7. Abra o detalhe do registro

---

## 31. O que mudou em relação à versão com arquivos `.txt`

Na versão antiga, o service manipulava o módulo `fs` do Node.js para criar diretórios, gravar arquivos e ler conteúdo textual. Agora, o service não conhece mais caminhos de pastas nem nomes de arquivo. Ele usa **repositórios** do TypeORM, e esses repositórios executam operações SQL sobre tabelas mapeadas por entidades. Conceitualmente, houve uma troca de persistência em arquivo por persistência relacional, mas o papel do controller e das views permaneceu semelhante. O TypeORM documenta que o repositório é justamente a interface associada a uma entidade para operações de persistência. ([typeorm.io][6])

---

## 32. Erros comuns e como interpretar

### Erro 1: conexão recusada

Se aparecer erro de conexão, normalmente o PostgreSQL não está rodando, ou as credenciais do `.env` estão incorretas. Como a conexão é feita por `host`, `port`, `username`, `password` e `database`, qualquer valor errado impede a inicialização do `DataSource`. O TypeORM depende dessa configuração para abrir a conexão. ([typeorm.io][2])

### Erro 2: banco não existe

Se o banco `projeto_form` não existir, a aplicação não conseguirá conectar. Nesse caso, crie o banco novamente com `CREATE DATABASE`.

### Erro 3: tabela não encontrada

Se `synchronize` estiver desligado e você não tiver criado as tabelas manualmente, o TypeORM não encontrará as tabelas esperadas.

### Erro 4: campos do formulário chegam vazios

Isso normalmente ocorre quando os `name="..."` do HTML não coincidem com os nomes esperados no `@Body()` do controller.

### Erro 5: rota de detalhe não funciona

Verifique se o parâmetro está correto e se o registro realmente existe. O `findOneBy({ id })` devolve `null` quando não encontra correspondência.

---

## 33. Commits sugeridos

```bash
git add .
git commit -m "chore: cria projeto NestJS com views"

git add .
git commit -m "feat: configura PostgreSQL com TypeORM"

git add .
git commit -m "feat: cria entidades person e request"

git add .
git commit -m "feat: implementa service com persistencia no banco"

git add .
git commit -m "feat: implementa controller e views"

git push
```

---

## 34. Síntese final

Ao final deste projeto, o aluno deve conseguir explicar a aplicação desta forma:

O navegador solicita páginas e envia formulários. O controller recebe as requisições. O service executa a lógica de persistência. O TypeORM converte objetos em registros do PostgreSQL por meio de entidades e repositórios. Depois, o controller envia os dados para views Handlebars, que geram o HTML mostrado ao usuário. O NestJS recomenda o uso de `@nestjs/typeorm` para integração com bancos, o TypeORM usa entidades para representar tabelas e repositórios para operações de acesso a dados, e a configuração de ambiente pode ser centralizada via `@nestjs/config`. ([NestJS Docs][1])

---

## 35. Estrutura final esperada do projeto

```text
projeto-form-postgres/
├─ src/
│  ├─ app.module.ts
│  ├─ main.ts
│  └─ form/
│     ├─ form.module.ts
│     ├─ form.controller.ts
│     ├─ form.service.ts
│     └─ entities/
│        ├─ person-record.entity.ts
│        └─ request-record.entity.ts
├─ views/
│  ├─ home.hbs
│  ├─ person-form.hbs
│  ├─ request-form.hbs
│  ├─ success.hbs
│  ├─ person-records.hbs
│  ├─ request-records.hbs
│  ├─ person-record-detail.hbs
│  └─ request-record-detail.hbs
├─ .env
├─ package.json
└─ tsconfig.json
```
