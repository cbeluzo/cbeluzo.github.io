# Tutorial corrigido: login, senha, PostgreSQL e JWT em NestJS

## 1. Objetivo do tutorial

Este tutorial apresenta a implementação completa de um mecanismo de autenticação em uma API desenvolvida com **NestJS**, utilizando **PostgreSQL** para armazenar usuários, **bcryptjs** para gerar hash de senhas e **JWT** para autenticar requisições em rotas protegidas.

O material foi escrito para estudantes iniciantes. Por isso, cada etapa apresenta primeiro a explicação conceitual e, em seguida, o código correspondente. A proposta é construir uma API simples, porém organizada, com cadastro, login e acesso a uma rota privada.

Ao final, a aplicação terá o seguinte fluxo:

```text
1. O usuário se cadastra informando nome, e-mail e senha.
2. A senha não é salva diretamente no banco.
3. A aplicação gera um hash da senha e salva esse hash no PostgreSQL.
4. O usuário faz login informando e-mail e senha.
5. A aplicação compara a senha digitada com o hash salvo.
6. Se as credenciais estiverem corretas, a aplicação gera um token JWT.
7. O cliente usa esse token para acessar rotas protegidas.
```

---

## 2. Tecnologias utilizadas

Neste tutorial serão utilizadas as seguintes tecnologias:

```text
Node.js
NestJS
TypeScript
PostgreSQL
TypeORM
JWT
Passport JWT
bcryptjs
class-validator
Thunder Client, Postman ou Insomnia
VS Code
```

A escolha do `bcryptjs` foi feita por ser uma biblioteca mais simples para uso em laboratório, especialmente em computadores Windows, pois não exige compilação nativa. Em projetos profissionais, também é comum utilizar `bcrypt` nativo ou `argon2`, dependendo dos requisitos de segurança e desempenho.

---

## 3. Conceitos básicos antes da implementação

### 3.1. O que é autenticação?

Autenticação é o processo de verificar a identidade de um usuário. Em sistemas web, isso normalmente ocorre por meio de e-mail e senha.

Exemplo conceitual:

```text
Usuário informa:
E-mail: ana@ifsp.edu.br
Senha: Senha@123

Sistema verifica:
Existe um usuário com esse e-mail?
A senha informada corresponde à senha cadastrada?
```

Se as duas verificações forem verdadeiras, o usuário é considerado autenticado.

---

### 3.2. O que é autorização?

Autenticação e autorização não são a mesma coisa. A autenticação verifica quem é o usuário. A autorização verifica o que esse usuário pode acessar.

Neste tutorial, será implementada uma autorização simples: apenas usuários autenticados poderão acessar a rota `/auth/profile`.

---

### 3.3. O que é JWT?

JWT significa **JSON Web Token**. Ele é um token assinado digitalmente pelo servidor. Depois que o usuário faz login, o servidor entrega um token ao cliente. Nas próximas requisições, o cliente envia esse token no cabeçalho HTTP.

O cabeçalho usado é:

```http
Authorization: Bearer TOKEN_AQUI
```

O JWT normalmente contém informações mínimas, como o identificador do usuário e o e-mail. Ele não deve armazenar senha, dados sensíveis ou informações desnecessárias.

Exemplo conceitual do conteúdo interno de um JWT:

```json
{
  "sub": "id-do-usuario",
  "email": "ana@ifsp.edu.br",
  "iat": 1710000000,
  "exp": 1710003600
}
```

O campo `sub` é uma convenção usada para representar o identificador principal do usuário autenticado.

---

### 3.4. JWT é uma sessão?

Em aplicações tradicionais, o servidor costuma armazenar uma sessão. Com JWT, o servidor normalmente não armazena a sessão em memória. O token assinado funciona como uma prova temporária de autenticação.

Por isso, dizemos que JWT é uma forma de autenticação **stateless**, ou seja, sem estado de sessão armazenado no servidor.

Neste tutorial, a expressão “controle de sessão” significa que o cliente manterá temporariamente um token JWT e o enviará nas requisições protegidas.

---

### 3.5. Por que a senha não pode ser salva diretamente?

Nunca se deve salvar senhas em texto puro no banco de dados.

Forma incorreta:

```text
email: ana@ifsp.edu.br
senha: Senha@123
```

Forma correta:

```text
email: ana@ifsp.edu.br
password_hash: $2a$10$...
```

O hash é um resultado matemático gerado a partir da senha. Na autenticação, a aplicação não descriptografa o hash. Ela compara a senha digitada com o hash armazenado.

Fluxo correto:

```text
Cadastro:
senha digitada -> hash -> banco de dados

Login:
senha digitada + hash salvo -> comparação -> verdadeiro ou falso
```

---

## 4. Arquitetura da aplicação

A aplicação será organizada em dois módulos principais.

```text
src/
├── app.module.ts
├── main.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── user.entity.ts
│   ├── users.module.ts
│   └── users.service.ts
└── auth/
    ├── decorators/
    │   └── current-user.decorator.ts
    ├── dto/
    │   └── login.dto.ts
    ├── guards/
    │   └── jwt-auth.guard.ts
    ├── strategies/
    │   └── jwt.strategy.ts
    ├── types/
    │   └── jwt-user.type.ts
    ├── auth.controller.ts
    ├── auth.module.ts
    └── auth.service.ts
```

Responsabilidades principais:

```text
users/
Responsável pela entidade User, cadastro de usuários e consultas ao banco.

auth/
Responsável por login, geração de JWT, validação do token e rotas protegidas.

PostgreSQL
Responsável por armazenar os usuários.

bcryptjs
Responsável por gerar e comparar hashes de senha.

JWT
Responsável por transportar a identidade autenticada entre cliente e servidor.
```

---

## 5. Pré-requisitos

Antes de iniciar, o aluno deve ter instalado:

```text
Node.js LTS
VS Code
PostgreSQL
Git
Thunder Client, Postman ou Insomnia
NestJS CLI
```

Para instalar o NestJS CLI:

```bash
npm install -g @nestjs/cli
```

Para conferir a instalação:

```bash
nest --version
node --version
npm --version
```

---

## 6. Criando o projeto NestJS

Abra o terminal na pasta onde deseja criar o projeto e execute:

```bash
nest new auth-postgres-jwt
```

Quando o NestJS perguntar qual gerenciador de pacotes deseja usar, selecione `npm`, caso a turma ainda esteja começando.

Entre na pasta do projeto:

```bash
cd auth-postgres-jwt
```

Abra no VS Code:

```bash
code .
```

Execute a aplicação inicial:

```bash
npm run start:dev
```

Acesse no navegador:

```text
http://localhost:3000
```

Se aparecer a mensagem `Hello World!`, a aplicação base foi criada corretamente.

---

## 7. Instalando as dependências

Pare a aplicação, se ela estiver em execução, pressionando `CTRL + C` no terminal.

Instale as dependências principais:

```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg @nestjs/jwt @nestjs/passport passport passport-jwt bcryptjs class-validator class-transformer
```

Instale também a definição de tipos da estratégia JWT do Passport:

```bash
npm install -D @types/passport-jwt
```

Função de cada pacote:

```text
@nestjs/config
Permite carregar variáveis do arquivo .env.

@nestjs/typeorm
Integra o NestJS com o TypeORM.

typeorm
ORM usado para mapear classes TypeScript para tabelas do banco.

pg
Driver usado para conectar Node.js ao PostgreSQL.

@nestjs/jwt
Permite gerar e assinar tokens JWT.

@nestjs/passport e passport
Integram o Passport ao NestJS.

passport-jwt
Estratégia do Passport para autenticação com JWT.

bcryptjs
Gera e compara hashes de senha.

class-validator e class-transformer
Permitem validar os dados recebidos nas requisições.
```

---

## 8. Criando o banco de dados PostgreSQL

Abra o pgAdmin ou o terminal `psql` usando um usuário administrador, por exemplo `postgres`.

Execute os comandos abaixo:

```sql
CREATE DATABASE auth_aula;

CREATE USER auth_user WITH PASSWORD 'auth123';

GRANT ALL PRIVILEGES ON DATABASE auth_aula TO auth_user;
```

Depois conecte-se ao banco criado:

```sql
\c auth_aula
```

Conceda permissão de uso e criação no schema `public`:

```sql
GRANT USAGE, CREATE ON SCHEMA public TO auth_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO auth_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO auth_user;
```

Essas permissões são adequadas para ambiente didático. Em produção, o ideal é aplicar o princípio do menor privilégio e separar usuários administrativos de usuários da aplicação.

---

## 9. Criando o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`.

Conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth123
DB_DATABASE=auth_aula

JWT_SECRET=troque_esta_chave_por_uma_chave_grande_aleatoria_e_segura
JWT_EXPIRES_IN_SECONDS=3600
```

Explicação:

```text
DB_HOST
Servidor onde o PostgreSQL está rodando.

DB_PORT
Porta do PostgreSQL. O padrão é 5432.

DB_USERNAME
Usuário do banco usado pela aplicação.

DB_PASSWORD
Senha do usuário do banco.

DB_DATABASE
Nome do banco de dados.

JWT_SECRET
Chave secreta usada para assinar e validar tokens JWT.

JWT_EXPIRES_IN_SECONDS
Tempo de validade do token em segundos. 3600 segundos equivalem a 1 hora.
```

Verifique se o arquivo `.gitignore` possui a linha abaixo:

```text
.env
```

O arquivo `.env` não deve ser enviado ao GitHub, pois contém dados sensíveis.

---

## 10. Configurando a validação global

Abra o arquivo:

```text
src/main.ts
```

Substitua o conteúdo por:

```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
```

Explicação:

```text
ValidationPipe
Ativa a validação automática dos DTOs.

whitelist: true
Remove campos que não foram declarados no DTO.

forbidNonWhitelisted: true
Rejeita requisições com campos desconhecidos.

transform: true
Converte dados recebidos para os tipos esperados quando possível.
```

---

## 11. Criando o módulo de usuários

No terminal, execute:

```bash
nest g module users
nest g service users
```

Esses comandos criam:

```text
src/users/users.module.ts
src/users/users.service.ts
```

O módulo `users` será responsável por operações relacionadas aos usuários, como cadastro e consulta por e-mail.

---

## 12. Criando a entidade User

Crie o arquivo:

```text
src/users/user.entity.ts
```

Conteúdo:

```typescript
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 120 })
  name!: string;

  @Column({ unique: true, length: 160 })
  email!: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
```

Explicação:

```text
@Entity('users')
Indica que essa classe representa a tabela users.

@PrimaryGeneratedColumn('uuid')
Cria uma chave primária automática no formato UUID.

@Column({ unique: true })
Impede que dois usuários tenham o mesmo e-mail.

@Column({ name: 'password_hash', select: false })
Cria a coluna password_hash e evita que ela seja carregada automaticamente nas consultas.

@CreateDateColumn
Cria automaticamente a data de criação.

@UpdateDateColumn
Atualiza automaticamente a data de alteração.
```

O símbolo `!` informa ao TypeScript que esses campos serão preenchidos pelo TypeORM. Sem isso, o compilador pode reclamar que as propriedades não foram inicializadas no construtor.

---

## 13. Criando o DTO de cadastro

DTO significa **Data Transfer Object**. Ele define quais dados a API aceita em determinada requisição.

Crie a pasta:

```text
src/users/dto
```

Crie o arquivo:

```text
src/users/dto/create-user.dto.ts
```

Conteúdo:

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
```

Explicação:

```text
@IsString()
Verifica se o campo é texto.

@IsNotEmpty()
Verifica se o campo não está vazio.

@IsEmail()
Verifica se o campo possui formato de e-mail.

@MinLength(6)
Exige senha com pelo menos 6 caracteres.
```

Para fins didáticos, será exigido mínimo de 6 caracteres. Em aplicações reais, recomenda-se adotar políticas de senha mais robustas e mecanismos adicionais de proteção contra ataques de força bruta.

---

## 14. Configurando o UsersModule

Abra:

```text
src/users/users.module.ts
```

Substitua por:

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

Explicação:

```text
TypeOrmModule.forFeature([User])
Disponibiliza o repositório da entidade User dentro do módulo users.

providers: [UsersService]
Registra o serviço de usuários.

exports: [UsersService]
Permite que outro módulo, como AuthModule, use o UsersService.
```

---

## 15. Implementando o UsersService

Abra:

```text
src/users/users.service.ts
```

Substitua por:

```typescript
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

export type PublicUser = Omit<User, 'passwordHash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      name: createUserDto.name.trim(),
      email,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toPublicUser(savedUser);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: email.trim().toLowerCase() })
      .getOne();
  }

  private toPublicUser(user: User): PublicUser {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }
}
```

Explicação:

```text
@InjectRepository(User)
Injeta o repositório TypeORM da entidade User.

findOne()
Busca um usuário no banco.

ConflictException
Retorna erro HTTP 409 quando o e-mail já está cadastrado.

bcrypt.hash()
Gera o hash da senha.

saltRounds = 10
Define o custo computacional usado pelo bcrypt.

create()
Cria um objeto User em memória.

save()
Salva o usuário no PostgreSQL.

findByEmailWithPassword()
Busca o usuário e inclui explicitamente o passwordHash, pois esse campo usa select: false.

toPublicUser()
Remove o passwordHash antes de retornar dados ao cliente.
```

---

## 16. Criando o módulo de autenticação

No terminal, execute:

```bash
nest g module auth
nest g service auth
nest g controller auth
```

O módulo `auth` será responsável por:

```text
Receber o cadastro.
Receber o login.
Validar a senha.
Gerar o JWT.
Validar o JWT em rotas protegidas.
```

---

## 17. Criando o DTO de login

Crie a pasta:

```text
src/auth/dto
```

Crie o arquivo:

```text
src/auth/dto/login.dto.ts
```

Conteúdo:

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
```

Esse DTO informa que a rota de login aceitará apenas dois campos:

```text
email
password
```

---

## 18. Criando o tipo do usuário autenticado

Crie a pasta:

```text
src/auth/types
```

Crie o arquivo:

```text
src/auth/types/jwt-user.type.ts
```

Conteúdo:

```typescript
export interface JwtUser {
  id: string;
  email: string;
}
```

Esse tipo representa os dados que estarão disponíveis dentro da aplicação depois que o JWT for validado.

---

## 19. Criando o decorator CurrentUser

Um decorator facilita a recuperação do usuário autenticado dentro de uma rota protegida.

Crie a pasta:

```text
src/auth/decorators
```

Crie o arquivo:

```text
src/auth/decorators/current-user.decorator.ts
```

Conteúdo:

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUser } from '../types/jwt-user.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtUser => {
    const request = context.switchToHttp().getRequest<{ user: JwtUser }>();
    return request.user;
  },
);
```

Explicação:

```text
createParamDecorator
Permite criar um decorator customizado para parâmetros de métodos.

ExecutionContext
Permite acessar a requisição HTTP atual.

request.user
Será preenchido automaticamente pelo Passport quando o JWT for válido.
```

Com esse decorator, evitamos usar `request: any` no controller e deixamos o código mais limpo.

---

## 20. Criando a estratégia JWT

A estratégia JWT informa ao Passport como o token deve ser extraído e validado.

Crie a pasta:

```text
src/auth/strategies
```

Crie o arquivo:

```text
src/auth/strategies/jwt.strategy.ts
```

Conteúdo:

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtUser } from '../types/jwt-user.type';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
```

Explicação:

```text
PassportStrategy(Strategy, 'jwt')
Cria uma estratégia chamada jwt.

ExtractJwt.fromAuthHeaderAsBearerToken()
Extrai o token do cabeçalho Authorization: Bearer TOKEN.

ignoreExpiration: false
Faz a aplicação rejeitar tokens expirados.

secretOrKey
Chave usada para validar se o token foi realmente assinado pela aplicação.

validate()
É executado quando o token é válido. O retorno desse método será colocado em request.user.
```

---

## 21. Criando o Guard JWT

Um guard funciona como um filtro de acesso. Antes de executar uma rota, ele verifica se a requisição tem permissão para continuar.

Crie a pasta:

```text
src/auth/guards
```

Crie o arquivo:

```text
src/auth/guards/jwt-auth.guard.ts
```

Conteúdo:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Explicação:

```text
AuthGuard('jwt')
Usa a estratégia jwt criada no arquivo jwt.strategy.ts.

JwtAuthGuard
Será usado nas rotas que exigem autenticação.
```

---

## 22. Configurando o AuthModule

Abra:

```text
src/auth/auth.module.ts
```

Substitua por:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            configService.getOrThrow<string>('JWT_EXPIRES_IN_SECONDS'),
          ),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
```

Explicação:

```text
UsersModule
Permite que AuthService use UsersService.

PassportModule
Integra o Passport ao NestJS.

JwtModule
Permite gerar tokens JWT.

JwtModule.registerAsync()
Configura o JWT usando dados do arquivo .env.

JwtStrategy
Valida o token recebido nas requisições protegidas.
```

Observe que o tempo de expiração foi configurado em segundos. Isso evita problemas de tipagem em algumas versões recentes das bibliotecas JWT.

---

## 23. Implementando o AuthService

Abra:

```text
src/auth/auth.service.ts
```

Substitua por:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { PublicUser, UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<PublicUser> {
    return this.usersService.create(createUserDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresInSeconds: Number(
        this.configService.getOrThrow<string>('JWT_EXPIRES_IN_SECONDS'),
      ),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
```

Explicação:

```text
register()
Encaminha o cadastro para o UsersService.

login()
Executa o processo de autenticação.

findByEmailWithPassword()
Busca o usuário e seu hash de senha.

UnauthorizedException
Retorna erro HTTP 401 quando o login falha.

bcrypt.compare()
Compara a senha digitada com o hash salvo.

payload
Objeto que será colocado dentro do JWT.

sub
Campo usado para guardar o ID do usuário.

jwtService.signAsync()
Gera o token JWT assinado.
```

O erro retornado é o mesmo tanto para e-mail inexistente quanto para senha incorreta. Isso evita revelar se determinado e-mail está cadastrado no sistema.

---

## 24. Implementando o AuthController

Abra:

```text
src/auth/auth.controller.ts
```

Substitua por:

```typescript
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtUser } from './types/jwt-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: JwtUser) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  dashboard(@CurrentUser() user: JwtUser) {
    return {
      message: 'Você acessou uma área protegida.',
      user,
    };
  }
}
```

Explicação:

```text
@Controller('auth')
Define que as rotas começam com /auth.

@Post('register')
Cria a rota POST /auth/register.

@Post('login')
Cria a rota POST /auth/login.

@HttpCode(HttpStatus.OK)
Faz o login retornar HTTP 200, e não 201.

@UseGuards(JwtAuthGuard)
Exige JWT válido para acessar a rota.

@CurrentUser()
Recupera o usuário autenticado a partir do token validado.
```

A rota `/auth/dashboard` foi incluída como exemplo adicional de rota protegida.

---

## 25. Configurando o AppModule

Abra:

```text
src/app.module.ts
```

Substitua por:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.getOrThrow<string>('DB_PORT')),
        username: configService.getOrThrow<string>('DB_USERNAME'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
```

Explicação:

```text
ConfigModule.forRoot({ isGlobal: true })
Carrega o .env e permite usar ConfigService em toda a aplicação.

TypeOrmModule.forRootAsync()
Configura a conexão com o PostgreSQL usando variáveis de ambiente.

getOrThrow()
Gera erro se uma variável obrigatória não estiver definida.

autoLoadEntities: true
Carrega automaticamente as entidades registradas nos módulos.

synchronize: true
Cria ou atualiza tabelas automaticamente em ambiente de desenvolvimento.
```

Atenção: `synchronize: true` é útil em aulas e protótipos, mas não deve ser usado em produção. Em produção, use migrations.

---

## 26. Executando a aplicação

No terminal, execute:

```bash
npm run start:dev
```

Se tudo estiver correto, a aplicação ficará disponível em:

```text
http://localhost:3000
```

Ao iniciar a aplicação, o TypeORM deve criar automaticamente a tabela `users` no PostgreSQL.

---

## 27. Testando o cadastro

Use Thunder Client, Postman ou Insomnia.

Método:

```text
POST
```

URL:

```text
http://localhost:3000/auth/register
```

Body em JSON:

```json
{
  "name": "Ana Silva",
  "email": "ana@ifsp.edu.br",
  "password": "Senha@123"
}
```

Resposta esperada:

```json
{
  "id": "uuid-gerado",
  "name": "Ana Silva",
  "email": "ana@ifsp.edu.br",
  "createdAt": "2026-05-11T...",
  "updatedAt": "2026-05-11T..."
}
```

A senha e o `passwordHash` não devem aparecer na resposta.

---

## 28. Verificando o banco de dados

No PostgreSQL, execute:

```sql
SELECT id, name, email, password_hash, created_at, updated_at
FROM users;
```

Resultado esperado:

```text
id                                   | name      | email           | password_hash
------------------------------------ | --------- | --------------- | -----------------------------
uuid                                 | Ana Silva | ana@ifsp.edu.br | $2a$10$...
```

O campo `password_hash` deve conter um hash, não a senha original.

---

## 29. Testando login

Método:

```text
POST
```

URL:

```text
http://localhost:3000/auth/login
```

Body em JSON:

```json
{
  "email": "ana@ifsp.edu.br",
  "password": "Senha@123"
}
```

Resposta esperada:

```json
{
  "accessToken": "token-jwt-gerado",
  "tokenType": "Bearer",
  "expiresInSeconds": 3600,
  "user": {
    "id": "uuid-do-usuario",
    "name": "Ana Silva",
    "email": "ana@ifsp.edu.br"
  }
}
```

O campo principal da resposta é `accessToken`. Ele será usado para acessar rotas protegidas.

---

## 30. Testando rota protegida sem token

Método:

```text
GET
```

URL:

```text
http://localhost:3000/auth/profile
```

Sem enviar token, a resposta esperada é:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

Esse resultado mostra que a rota está protegida.

---

## 31. Testando rota protegida com token

Copie o valor de `accessToken` retornado no login.

Método:

```text
GET
```

URL:

```text
http://localhost:3000/auth/profile
```

Header:

```http
Authorization: Bearer COLE_O_TOKEN_AQUI
```

Resposta esperada:

```json
{
  "id": "uuid-do-usuario",
  "email": "ana@ifsp.edu.br"
}
```

Agora teste também:

```text
GET http://localhost:3000/auth/dashboard
```

Com o mesmo header:

```http
Authorization: Bearer COLE_O_TOKEN_AQUI
```

Resposta esperada:

```json
{
  "message": "Você acessou uma área protegida.",
  "user": {
    "id": "uuid-do-usuario",
    "email": "ana@ifsp.edu.br"
  }
}
```

---

## 32. Testando pelo PowerShell no Windows

### 32.1. Cadastro

```powershell
$body = @{
  name = "Ana Silva"
  email = "ana@ifsp.edu.br"
  password = "Senha@123"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/auth/register" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 32.2. Login

```powershell
$login = @{
  email = "ana@ifsp.edu.br"
  password = "Senha@123"
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "http://localhost:3000/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body $login

$response
```

### 32.3. Guardando o token

```powershell
$token = $response.accessToken
```

### 32.4. Acessando rota protegida

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/auth/profile" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 33. Fluxo completo implementado

O sistema final executa o seguinte fluxo:

```text
1. POST /auth/register recebe nome, e-mail e senha.
2. UsersService verifica se o e-mail já existe.
3. UsersService gera o hash da senha com bcryptjs.
4. UsersService salva nome, e-mail e hash no PostgreSQL.
5. POST /auth/login recebe e-mail e senha.
6. AuthService busca o usuário pelo e-mail.
7. AuthService compara a senha digitada com o hash salvo.
8. AuthService gera um JWT com sub e email.
9. O cliente recebe accessToken.
10. O cliente envia Authorization: Bearer TOKEN nas rotas privadas.
11. JwtAuthGuard chama JwtStrategy.
12. JwtStrategy valida o token.
13. CurrentUser recupera o usuário autenticado na rota.
```

---

## 34. Problemas comuns e soluções

### 34.1. Erro: password authentication failed for user

Esse erro indica que usuário ou senha do PostgreSQL estão incorretos.

Verifique no `.env`:

```env
DB_USERNAME=auth_user
DB_PASSWORD=auth123
```

Confirme também se o usuário foi criado corretamente no PostgreSQL.

---

### 34.2. Erro: database "auth_aula" does not exist

O banco não foi criado ou o nome no `.env` está diferente.

Execute novamente:

```sql
CREATE DATABASE auth_aula;
```

---

### 34.3. Erro: permission denied for schema public

O usuário da aplicação não tem permissão para criar tabelas.

Conectado ao banco `auth_aula`, execute:

```sql
GRANT USAGE, CREATE ON SCHEMA public TO auth_user;
```

---

### 34.4. Erro: relation "users" does not exist

A tabela `users` não foi criada.

Verifique se no `app.module.ts` existe:

```typescript
synchronize: true
```

Depois reinicie a aplicação:

```bash
npm run start:dev
```

---

### 34.5. Erro 401 no login

Possíveis causas:

```text
E-mail não cadastrado.
Senha incorreta.
Senha digitada com diferença de maiúsculas/minúsculas.
Usuário cadastrado em outro banco de dados.
```

Cadastre um novo usuário e tente novamente.

---

### 34.6. Erro 401 na rota protegida

Possíveis causas:

```text
Token não foi enviado.
Token foi enviado sem a palavra Bearer.
Token expirou.
JWT_SECRET foi alterado depois do login.
Aplicação foi reiniciada com outro .env.
```

Header correto:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### 34.7. Erro: Nest can't resolve dependencies

Esse erro geralmente ocorre quando um serviço não foi exportado ou o módulo correto não foi importado.

Verifique se `UsersModule` possui:

```typescript
exports: [UsersService]
```

Verifique também se `AuthModule` possui:

```typescript
imports: [UsersModule]
```

---

## 35. Segurança: o que este tutorial faz e o que ainda falta

Este tutorial implementa uma autenticação adequada para aprendizado e protótipos acadêmicos:

```text
Senha armazenada como hash.
Login com comparação segura de senha.
JWT assinado.
Rotas protegidas por guard.
Arquivo .env fora do GitHub.
```

Entretanto, uma aplicação real exigiria recursos adicionais:

```text
HTTPS obrigatório em produção.
Rate limiting para reduzir força bruta.
Refresh tokens com rotação.
Logout com revogação de refresh token.
Recuperação de senha por token temporário.
Confirmação de e-mail.
Migrations em vez de synchronize: true.
Logs de auditoria.
Política de senha mais robusta.
Proteção contra enumeração de usuários.
Monitoramento de tentativas de login.
```

---

## 36. Exercícios para os alunos

### Exercício 1 — Cadastro inválido

Tente cadastrar um usuário sem e-mail:

```json
{
  "name": "João",
  "password": "123456"
}
```

Observe a resposta da API.

---

### Exercício 2 — E-mail duplicado

Cadastre o mesmo e-mail duas vezes e observe o erro HTTP 409.

---

### Exercício 3 — Login incorreto

Tente fazer login com uma senha errada e observe o erro HTTP 401.

---

### Exercício 4 — Rota protegida sem token

Acesse `/auth/profile` sem enviar o header `Authorization`.

---

### Exercício 5 — Rota protegida com token

Faça login, copie o token e acesse `/auth/profile`.

---

### Exercício 6 — Token expirado

Altere no `.env`:

```env
JWT_EXPIRES_IN_SECONDS=30
```

Reinicie a aplicação, faça login e tente acessar a rota protegida depois de 30 segundos.

---

## 37. Desafio adicional: adicionar campo role

Como desafio, adicione um campo `role` ao usuário.

Exemplo de valores:

```text
admin
student
teacher
```

Depois, inclua a role no payload do JWT:

```typescript
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};
```

Esse desafio prepara a turma para o próximo tema: autorização baseada em papéis, conhecida como RBAC.

---

## 38. Resumo final

Neste tutorial foi implementado um mecanismo completo de autenticação com NestJS, PostgreSQL e JWT.

A aplicação permite:

```text
Cadastrar usuários.
Salvar senha apenas como hash.
Validar login com e-mail e senha.
Gerar token JWT.
Proteger rotas privadas.
Recuperar o usuário autenticado a partir do token.
```

O ponto central é que a senha original nunca é armazenada no banco. O banco armazena apenas o hash. O JWT, por sua vez, permite que o cliente prove sua autenticação em cada requisição protegida.

---

## 39. Checklist final de arquivos

Ao final, a estrutura deve estar semelhante a esta:

```text
auth-postgres-jwt/
├── .env
├── package.json
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── users/
│   │   ├── dto/
│   │   │   └── create-user.dto.ts
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   └── auth/
│       ├── decorators/
│       │   └── current-user.decorator.ts
│       ├── dto/
│       │   └── login.dto.ts
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       ├── strategies/
│       │   └── jwt.strategy.ts
│       ├── types/
│       │   └── jwt-user.type.ts
│       ├── auth.controller.ts
│       ├── auth.module.ts
│       └── auth.service.ts
```

---

## 40. Referências oficiais

- NestJS — Authentication: https://docs.nestjs.com/security/authentication
- NestJS — Passport: https://docs.nestjs.com/recipes/passport
- NestJS — Database / TypeORM: https://docs.nestjs.com/techniques/database
- NestJS — Validation: https://docs.nestjs.com/techniques/validation
- NestJS — Configuration: https://docs.nestjs.com/techniques/configuration
- Passport JWT: https://www.passportjs.org/packages/passport-jwt/
- TypeORM: https://typeorm.io/
- PostgreSQL: https://www.postgresql.org/
- bcryptjs: https://www.npmjs.com/package/bcryptjs
