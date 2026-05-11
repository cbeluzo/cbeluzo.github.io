# Tutorial: login, senha, PostgreSQL e JWT em NestJS

## 1. Objetivo da atividade

Este tutorial apresenta, passo a passo, a implementação de um mecanismo básico de autenticação em uma aplicação **NestJS**, utilizando **PostgreSQL** como banco de dados, **bcrypt** para armazenar senhas de forma segura e **JWT** para autenticação e controle de sessão em rotas protegidas.

A atividade foi escrita para estudantes iniciantes. Portanto, antes de cada trecho de código há uma explicação conceitual sobre o que será feito, por que será feito e qual é o papel de cada arquivo dentro da aplicação.

Ao final, a aplicação terá três funcionalidades principais:

1. Cadastro de usuário com nome, e-mail e senha.
2. Login com verificação de e-mail e senha.
3. Acesso a uma rota protegida usando um token JWT.

---

## 2. O que o aluno precisa entender antes de programar

Antes de iniciar a implementação, é importante compreender alguns conceitos básicos.

### 2.1. O que é autenticação?

Autenticação é o processo de verificar se uma pessoa realmente é quem afirma ser. Em uma aplicação web, isso normalmente ocorre quando o usuário informa um e-mail e uma senha.

Exemplo:

```text
Usuário informa:
E-mail: ana@ifsp.edu.br
Senha: Senha@123

Sistema verifica:
Existe um usuário com esse e-mail?
A senha informada corresponde à senha cadastrada?
```

Se as informações estiverem corretas, o sistema autentica o usuário.

---

### 2.2. O que é autorização?

Autorização é diferente de autenticação.

A autenticação responde à pergunta:

```text
Quem é você?
```

A autorização responde à pergunta:

```text
O que você pode acessar?
```

Neste tutorial, implementaremos apenas uma autorização simples: algumas rotas só poderão ser acessadas por usuários autenticados.

---

### 2.3. O que é uma sessão?

Em aplicações tradicionais, uma sessão é uma forma de lembrar que um usuário já fez login. Em muitos sistemas antigos, o servidor guardava uma sessão em memória ou em banco de dados.

Com JWT, a lógica é diferente. O servidor gera um token assinado e entrega esse token ao cliente. Nas próximas requisições, o cliente envia o token de volta. Se o token for válido, o servidor considera o usuário autenticado.

Portanto, neste tutorial, o controle de sessão será feito por meio de um token JWT.

---

### 2.4. Por que não se deve salvar a senha diretamente no banco?

Nunca se deve armazenar senhas em texto puro.

Errado:

```text
email: ana@ifsp.edu.br
senha: Senha@123
```

Se alguém tiver acesso indevido ao banco de dados, todas as senhas dos usuários serão expostas.

O correto é armazenar um **hash** da senha.

Exemplo conceitual:

```text
Senha original:
Senha@123

Valor armazenado no banco:
$2b$10$9sxD3XlV0wQwYgRk...
```

O hash não deve ser convertido de volta para a senha original. No login, o sistema compara a senha digitada com o hash armazenado.

---

### 2.5. O que é bcrypt?

`bcrypt` é uma biblioteca usada para gerar hashes de senhas. Ela aplica um algoritmo próprio para dificultar ataques de força bruta.

Neste tutorial, o fluxo será:

```text
Cadastro:
senha digitada -> bcrypt.hash() -> hash salvo no banco

Login:
senha digitada + hash salvo -> bcrypt.compare() -> verdadeiro ou falso
```

---

### 2.6. O que é JWT?

JWT significa **JSON Web Token**. É um token composto por três partes:

```text
HEADER.PAYLOAD.SIGNATURE
```

O JWT contém informações mínimas sobre o usuário, como seu identificador e e-mail. Ele também possui uma assinatura, que permite ao servidor verificar se o token é válido.

Exemplo de payload interno de um JWT:

```json
{
  "sub": "id-do-usuario",
  "email": "ana@ifsp.edu.br",
  "iat": 1710000000,
  "exp": 1710003600
}
```

O campo `sub` normalmente representa o identificador do usuário autenticado.

---

## 3. Visão geral da arquitetura

A aplicação será organizada em módulos. Essa organização é importante porque o NestJS trabalha com uma arquitetura modular.

A estrutura principal será:

```text
src/
├── app.module.ts
├── main.ts
├── users/
│   ├── user.entity.ts
│   ├── users.module.ts
│   ├── users.service.ts
│   └── dto/
│       └── create-user.dto.ts
└── auth/
    ├── auth.controller.ts
    ├── auth.module.ts
    ├── auth.service.ts
    ├── dto/
    │   └── login.dto.ts
    ├── guards/
    │   └── jwt-auth.guard.ts
    └── strategies/
        └── jwt.strategy.ts
```

Cada parte terá uma responsabilidade:

```text
users/
Responsável pelos dados dos usuários e pela comunicação com a tabela users.

auth/
Responsável por cadastro, login, geração do JWT e proteção das rotas.

PostgreSQL/
Responsável por armazenar os usuários.

bcrypt/
Responsável por transformar senhas em hashes seguros.

JWT/
Responsável por identificar usuários autenticados nas requisições.
```

---

## 4. Pré-requisitos

Antes de começar, o aluno deve ter instalado:

1. Node.js LTS.
2. VS Code.
3. PostgreSQL.
4. Postman, Insomnia ou extensão Thunder Client no VS Code.
5. Git.
6. NestJS CLI.

Para instalar o NestJS CLI, abra o terminal:

```bash
npm install -g @nestjs/cli
```

Para verificar se o NestJS CLI foi instalado corretamente:

```bash
nest --version
```

---

## 5. Criando o projeto NestJS

Abra o terminal na pasta onde deseja criar o projeto e execute:

```bash
nest new auth-postgres-jwt
```

Entre na pasta criada:

```bash
cd auth-postgres-jwt
```

Abra o projeto no VS Code:

```bash
code .
```

Inicie a aplicação para testar se está funcionando:

```bash
npm run start:dev
```

Acesse no navegador:

```text
http://localhost:3000
```

Se aparecer uma mensagem como `Hello World!`, o projeto foi criado corretamente.

---

## 6. Instalando as dependências

Vamos instalar as bibliotecas necessárias para banco de dados, autenticação, JWT, validação de dados e criptografia de senha.

Execute o comando:

```bash
npm install @nestjs/typeorm typeorm pg @nestjs/config bcrypt @nestjs/passport passport passport-jwt @nestjs/jwt class-validator class-transformer
```

Agora instale os tipos TypeScript das bibliotecas que precisam de definição de tipos:

```bash
npm install -D @types/bcrypt @types/passport-jwt
```

Explicação das principais dependências:

```text
@nestjs/typeorm
Integra o NestJS com o TypeORM.

typeorm
Biblioteca ORM usada para mapear classes TypeScript para tabelas do banco.

pg
Driver necessário para conectar Node.js ao PostgreSQL.

@nestjs/config
Permite ler variáveis do arquivo .env.

bcrypt
Usado para gerar hash das senhas.

@nestjs/passport
Integra o NestJS com o Passport.

passport
Biblioteca de autenticação.

passport-jwt
Estratégia do Passport para validar tokens JWT.

@nestjs/jwt
Usado para gerar e assinar tokens JWT.

class-validator e class-transformer
Usados para validar os dados enviados pelo cliente.
```

---

## 7. Criando o banco de dados no PostgreSQL

Abra o terminal do PostgreSQL, o pgAdmin ou outro cliente de banco de dados.

A seguir está uma forma simples de criar o banco e um usuário específico para a aplicação.

```sql
CREATE DATABASE auth_aula;

CREATE USER auth_user WITH PASSWORD 'auth123';

GRANT ALL PRIVILEGES ON DATABASE auth_aula TO auth_user;
```

Depois, conecte-se ao banco criado:

```sql
\c auth_aula
```

Execute:

```sql
GRANT ALL ON SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO auth_user;
```

Em ambiente didático, usaremos essas permissões para simplificar a prática. Em ambiente real, as permissões devem ser definidas com mais cuidado.

---

## 8. Criando o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`.

Conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth123
DB_DATABASE=auth_aula

JWT_SECRET=troque_esta_chave_por_uma_chave_grande_e_segura
JWT_EXPIRES_IN=1h
```

Explicação:

```text
DB_HOST
Endereço do servidor PostgreSQL. Como o banco está na máquina local, usamos localhost.

DB_PORT
Porta padrão do PostgreSQL. Normalmente é 5432.

DB_USERNAME
Usuário do banco de dados.

DB_PASSWORD
Senha do usuário do banco.

DB_DATABASE
Nome do banco de dados.

JWT_SECRET
Chave secreta usada para assinar os tokens JWT.

JWT_EXPIRES_IN
Tempo de validade do token.
```

Importante: o arquivo `.env` não deve ser enviado para o GitHub em projetos reais.

Verifique se o arquivo `.gitignore` contém:

```text
.env
```

---

## 9. Configurando o TypeORM no NestJS

Abra o arquivo:

```text
src/app.module.ts
```

Substitua o conteúdo por:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
})
export class AppModule {}
```

Explicação:

```text
ConfigModule.forRoot()
Permite que a aplicação leia o arquivo .env.

isGlobal: true
Permite usar as configurações em qualquer módulo da aplicação.

TypeOrmModule.forRootAsync()
Configura a conexão com o banco usando valores carregados do .env.

autoLoadEntities: true
Permite que o TypeORM carregue automaticamente as entidades registradas nos módulos.

synchronize: true
Faz o TypeORM criar ou atualizar tabelas automaticamente durante o desenvolvimento.
```

Atenção: `synchronize: true` é útil em aula e desenvolvimento inicial, mas não deve ser usado em produção. Em produção, o correto é usar migrations.

---

## 10. Criando o módulo de usuários

No terminal, execute:

```bash
nest g module users
nest g service users
```

Esses comandos criam o módulo e o serviço de usuários.

O módulo `users` será responsável por:

```text
Cadastrar usuários.
Buscar usuários pelo e-mail.
Salvar o hash da senha no banco.
Retornar dados públicos do usuário sem expor a senha.
```

---

## 11. Criando a entidade User

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
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column({ unique: true, length: 160 })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
```

Explicação linha a linha:

```text
@Entity('users')
Informa ao TypeORM que essa classe representa a tabela users.

@PrimaryGeneratedColumn('uuid')
Cria uma chave primária automática usando UUID.

@Column({ length: 120 })
Cria uma coluna de texto com tamanho máximo de 120 caracteres.

@Column({ unique: true })
Garante que não existam dois usuários com o mesmo e-mail.

@Column({ name: 'password_hash', select: false })
Cria a coluna password_hash, mas evita que ela seja retornada automaticamente nas consultas.

@CreateDateColumn()
Cria automaticamente a data de criação do registro.

@UpdateDateColumn()
Atualiza automaticamente a data da última alteração.
```

---

## 12. Criando o DTO de cadastro

DTO significa **Data Transfer Object**. É uma classe usada para definir quais dados o cliente pode enviar para a API.

Crie a pasta:

```text
src/users/dto
```

Dentro dela, crie o arquivo:

```text
src/users/dto/create-user.dto.ts
```

Conteúdo:

```typescript
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

Explicação:

```text
@IsString()
Verifica se o campo recebido é texto.

@IsNotEmpty()
Verifica se o campo não está vazio.

@IsEmail()
Verifica se o valor possui formato de e-mail.

@MinLength(6)
Exige que a senha tenha pelo menos 6 caracteres.
```

Em projetos reais, a regra de senha deve ser mais rigorosa. Para fins didáticos, usaremos no mínimo 6 caracteres.

---

## 13. Ativando a validação global

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
Rejeita requisições que enviam campos não permitidos.

transform: true
Permite converter os dados recebidos para os tipos esperados.
```

---

## 14. Configurando o UsersModule

Abra o arquivo:

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
Permite usar o repositório da entidade User dentro do módulo users.

providers: [UsersService]
Registra o serviço de usuários.

exports: [UsersService]
Permite que outros módulos, como AuthModule, usem o UsersService.
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
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Já existe um usuário com este e-mail.');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(createUserDto.password, saltRounds);

    const user = this.usersRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      passwordHash,
    });

    const savedUser = await this.usersRepository.save(user);

    return this.toPublicUser(savedUser);
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  private toPublicUser(user: User) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
```

Explicação das partes principais:

```text
@InjectRepository(User)
Permite injetar o repositório da entidade User.

usersRepository.findOne()
Busca um usuário no banco.

ConflictException
Retorna erro HTTP 409 quando o e-mail já existe.

bcrypt.hash()
Transforma a senha digitada em um hash seguro.

saltRounds = 10
Define o custo computacional do bcrypt. Quanto maior, mais lento e mais seguro.

usersRepository.create()
Cria um objeto User em memória.

usersRepository.save()
Salva o usuário no banco de dados.

findByEmailWithPassword()
Busca o usuário pelo e-mail incluindo o passwordHash, que normalmente fica oculto.

toPublicUser()
Remove o passwordHash antes de retornar os dados do usuário.
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
Receber dados de cadastro.
Receber dados de login.
Validar a senha.
Gerar o JWT.
Proteger rotas privadas.
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
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

Esse DTO define que o login exige:

```text
email
password
```

---

## 18. Configurando o AuthModule

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
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') ?? '1h',
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
Permite que AuthService use UsersService para buscar usuários.

PassportModule
Integra o Passport ao NestJS.

JwtModule
Permite gerar tokens JWT.

secret
Chave secreta usada para assinar o token.

expiresIn
Tempo de validade do token.

JwtStrategy
Classe que validará os tokens enviados nas requisições.
```

---

## 19. Registrando os módulos no AppModule

Agora precisamos importar os módulos `UsersModule` e `AuthModule` no módulo principal.

Abra:

```text
src/app.module.ts
```

Deixe o arquivo assim:

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
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
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

Neste momento, a aplicação já conhece:

```text
O banco de dados.
O módulo de usuários.
O módulo de autenticação.
```

---

## 20. Implementando o AuthService

Abra:

```text
src/auth/auth.service.ts
```

Substitua por:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') ?? '1h',
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
usersService.findByEmailWithPassword()
Busca o usuário pelo e-mail, incluindo o hash da senha.

UnauthorizedException
Retorna erro HTTP 401 quando login ou senha estão incorretos.

bcrypt.compare()
Compara a senha digitada com o hash salvo no banco.

payload
Dados que serão colocados dentro do JWT.

sub
Campo usado para guardar o ID do usuário.

jwtService.signAsync()
Gera o token JWT.

tokenType: 'Bearer'
Indica que o token deve ser enviado no cabeçalho Authorization como Bearer Token.
```

---

## 21. Criando a estratégia JWT

A estratégia JWT define como o sistema irá extrair e validar o token enviado pelo cliente.

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

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ??
        'chave_temporaria_apenas_para_desenvolvimento',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
```

Explicação:

```text
PassportStrategy(Strategy)
Define uma estratégia de autenticação baseada em JWT.

ExtractJwt.fromAuthHeaderAsBearerToken()
Indica que o token será lido do cabeçalho Authorization.

ignoreExpiration: false
Faz o sistema rejeitar tokens expirados.

secretOrKey
Chave usada para verificar se o token foi assinado corretamente.

validate()
É executado quando o token é válido.

return { id, email }
Define quais dados ficarão disponíveis em req.user nas rotas protegidas.
```

---

## 22. Criando o Guard de autenticação

Um **Guard** no NestJS funciona como um porteiro. Antes de uma rota ser executada, o guard verifica se a requisição pode continuar.

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
Usa a estratégia JWT criada anteriormente.

JwtAuthGuard
Será usado nas rotas que exigem autenticação.
```

---

## 23. Implementando o AuthController

Abra:

```text
src/auth/auth.controller.ts
```

Substitua por:

```typescript
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() request: Request) {
    return request.user;
  }
}
```

Explicação:

```text
@Controller('auth')
Define que todas as rotas deste controller começam com /auth.

@Post('register')
Cria a rota POST /auth/register.

@Post('login')
Cria a rota POST /auth/login.

@UseGuards(JwtAuthGuard)
Protege a rota usando autenticação JWT.

@Get('profile')
Cria a rota GET /auth/profile.

request.user
Contém os dados retornados pelo método validate() da JwtStrategy.
```

Observação: se o TypeScript reclamar do campo `request.user`, isso ocorre porque o tipo padrão de `Request` nem sempre conhece essa propriedade. Em contexto didático, a aplicação continuará funcionando. Se quiser evitar o aviso, substitua o método por:

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async profile(@Req() request: any) {
  return request.user;
}
```

---

## 24. Executando a aplicação

No terminal:

```bash
npm run start:dev
```

Se tudo estiver correto, a aplicação ficará disponível em:

```text
http://localhost:3000
```

---

## 25. Testando o cadastro

### 25.1. Usando Postman, Insomnia ou Thunder Client

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
  "name": "Ana Silva",
  "email": "ana@ifsp.edu.br",
  "id": "uuid-gerado-pelo-banco",
  "createdAt": "data-de-criacao",
  "updatedAt": "data-de-atualizacao"
}
```

Observe que a senha não aparece na resposta.

---

### 25.2. Usando PowerShell no Windows

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

---

## 26. Verificando o usuário no PostgreSQL

No PostgreSQL, execute:

```sql
SELECT id, name, email, password_hash, created_at, updated_at
FROM users;
```

Você deverá ver algo semelhante a:

```text
id                                   | name      | email             | password_hash
------------------------------------ | --------- | ----------------- | -------------------------------
uuid                                 | Ana Silva | ana@ifsp.edu.br   | $2b$10$...
```

O campo `password_hash` não deve conter a senha original.

---

## 27. Testando o login

### 27.1. Usando Postman, Insomnia ou Thunder Client

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
  "expiresIn": "1h",
  "user": {
    "id": "uuid-do-usuario",
    "name": "Ana Silva",
    "email": "ana@ifsp.edu.br"
  }
}
```

O campo mais importante é:

```text
accessToken
```

Esse token será usado para acessar rotas protegidas.

---

### 27.2. Usando PowerShell no Windows

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

Para guardar o token em uma variável:

```powershell
$token = $response.accessToken
```

---

## 28. Testando uma rota protegida

A rota protegida será:

```text
GET /auth/profile
```

Ela só deve funcionar se o usuário enviar o token JWT.

### 28.1. Sem token

Acesse:

```text
http://localhost:3000/auth/profile
```

Resposta esperada:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

Isso significa que a rota está protegida.

---

### 28.2. Com token no Postman, Insomnia ou Thunder Client

Método:

```text
GET
```

URL:

```text
http://localhost:3000/auth/profile
```

Header:

```text
Authorization: Bearer SEU_TOKEN_AQUI
```

Resposta esperada:

```json
{
  "id": "uuid-do-usuario",
  "email": "ana@ifsp.edu.br"
}
```

---

### 28.3. Com token no PowerShell

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:3000/auth/profile" `
  -Method Get `
  -Headers @{ Authorization = "Bearer $token" }
```

---

## 29. Fluxo completo da autenticação

O fluxo final da aplicação é:

```text
1. Usuário envia nome, e-mail e senha para /auth/register.
2. A aplicação verifica se o e-mail já existe.
3. A aplicação gera um hash da senha com bcrypt.
4. A aplicação salva nome, e-mail e hash no PostgreSQL.
5. Usuário envia e-mail e senha para /auth/login.
6. A aplicação busca o usuário pelo e-mail.
7. A aplicação compara a senha digitada com o hash armazenado.
8. Se estiver correto, a aplicação gera um JWT.
9. O cliente guarda temporariamente esse JWT.
10. O cliente envia o JWT no cabeçalho Authorization.
11. O JwtAuthGuard valida o token.
12. Se o token for válido, a rota protegida é executada.
```

---

## 30. Como o token deve ser enviado pelo cliente

O token deve ser enviado no cabeçalho HTTP:

```http
Authorization: Bearer token_jwt_aqui
```

A palavra `Bearer` indica que o cliente está apresentando um token de acesso.

Exemplo:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 31. O que acontece quando o token expira?

Como configuramos:

```env
JWT_EXPIRES_IN=1h
```

O token deixará de ser válido após uma hora.

Depois disso, ao tentar acessar uma rota protegida, a aplicação retornará:

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

Para acessar novamente, o usuário deverá fazer login outra vez.

Em sistemas mais completos, é comum implementar também `refresh tokens`, mas isso está fora do escopo deste primeiro tutorial.

---

## 32. O que significa logout em sistemas com JWT?

Em uma aplicação simples baseada em JWT, o logout normalmente é feito no cliente, apagando o token armazenado.

Exemplo conceitual:

```text
Login:
cliente recebe token e guarda temporariamente.

Logout:
cliente apaga o token.

Resultado:
sem token, o cliente não consegue acessar rotas protegidas.
```

Em aplicações mais avançadas, o servidor pode manter uma lista de tokens revogados ou usar refresh tokens com rotação.

---

## 33. Conferindo a estrutura final dos arquivos

A estrutura final deve ficar próxima de:

```text
auth-postgres-jwt/
├── .env
├── package.json
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── users/
│   │   ├── user.entity.ts
│   │   ├── users.module.ts
│   │   ├── users.service.ts
│   │   └── dto/
│   │       └── create-user.dto.ts
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.module.ts
│       ├── auth.service.ts
│       ├── dto/
│       │   └── login.dto.ts
│       ├── guards/
│       │   └── jwt-auth.guard.ts
│       └── strategies/
│           └── jwt.strategy.ts
```

---

## 34. Problemas comuns e soluções

### 34.1. Erro de conexão com PostgreSQL

Possíveis causas:

```text
PostgreSQL não está iniciado.
A porta está incorreta.
O usuário ou senha estão incorretos.
O banco auth_aula não foi criado.
```

Verifique o arquivo `.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=auth_user
DB_PASSWORD=auth123
DB_DATABASE=auth_aula
```

---

### 34.2. Erro: relation "users" does not exist

Isso significa que a tabela `users` não foi criada.

Verifique se no `app.module.ts` está:

```typescript
synchronize: true
```

Depois reinicie a aplicação:

```bash
npm run start:dev
```

---

### 34.3. Erro: usuário sem permissão no schema public

Execute no PostgreSQL:

```sql
\c auth_aula

GRANT ALL ON SCHEMA public TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO auth_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO auth_user;
```

---

### 34.4. Erro 401 no login

Possíveis causas:

```text
E-mail não cadastrado.
Senha incorreta.
A senha foi cadastrada com outro valor.
```

Faça um novo cadastro e tente login novamente.

---

### 34.5. Erro 401 na rota protegida

Possíveis causas:

```text
Token não foi enviado.
Token foi enviado sem a palavra Bearer.
Token expirou.
JWT_SECRET foi alterado depois da geração do token.
```

O cabeçalho correto é:

```http
Authorization: Bearer SEU_TOKEN
```

---

### 34.6. Erro ao instalar bcrypt no Windows

Em versões atuais, normalmente o `bcrypt` instala corretamente. Se houver erro de compilação em laboratório, uma alternativa didática é usar `bcryptjs`.

Instalação alternativa:

```bash
npm uninstall bcrypt @types/bcrypt
npm install bcryptjs
npm install -D @types/bcryptjs
```

E trocar os imports:

```typescript
import * as bcrypt from 'bcryptjs';
```

Essa alternativa é útil para laboratório, mas o uso de `bcrypt` ou `argon2` continua sendo mais comum em aplicações de produção.

---

## 35. Boas práticas de segurança

Esta implementação é adequada para fins didáticos, mas aplicações reais exigem cuidados adicionais.

Principais recomendações:

```text
Nunca salvar senha em texto puro.
Nunca retornar passwordHash nas respostas da API.
Nunca publicar o arquivo .env no GitHub.
Usar JWT_SECRET longo, aleatório e seguro.
Usar HTTPS em produção.
Reduzir o tempo de validade dos tokens conforme o risco da aplicação.
Implementar refresh token em sistemas maiores.
Implementar rate limit para reduzir ataques de força bruta.
Implementar recuperação de senha com token temporário.
Implementar confirmação de e-mail, se necessário.
Usar migrations em vez de synchronize: true em produção.
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

Cadastre duas vezes o mesmo e-mail e observe o erro retornado.

---

### Exercício 3 — Login incorreto

Tente fazer login com senha errada.

---

### Exercício 4 — Rota protegida sem token

Acesse `/auth/profile` sem enviar o cabeçalho `Authorization`.

---

### Exercício 5 — Rota protegida com token

Faça login, copie o token e acesse `/auth/profile`.

---

### Exercício 6 — Reduzindo a validade do token

Altere no `.env`:

```env
JWT_EXPIRES_IN=30s
```

Reinicie a aplicação, faça login e teste o acesso à rota protegida depois de 30 segundos.

---

## 37. Atividade prática sugerida

Implemente uma nova rota protegida chamada:

```text
GET /auth/dashboard
```

Ela deve retornar:

```json
{
  "message": "Você acessou uma área protegida.",
  "user": {
    "id": "id-do-usuario",
    "email": "email-do-usuario"
  }
}
```

Dica: essa rota deve usar o mesmo `JwtAuthGuard`.

Exemplo de implementação no `AuthController`:

```typescript
@UseGuards(JwtAuthGuard)
@Get('dashboard')
async dashboard(@Req() request: any) {
  return {
    message: 'Você acessou uma área protegida.',
    user: request.user,
  };
}
```

---

## 38. Desafio adicional: campo role

Como desafio, acrescente um campo `role` ao usuário.

Exemplo:

```text
admin
student
teacher
```

Depois, modifique o payload do JWT para incluir a role:

```typescript
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};
```

Esse desafio prepara o aluno para o próximo tema: autorização baseada em papéis, também conhecida como RBAC.

---

## 39. Resumo final

Neste tutorial, foi implementado um mecanismo básico de autenticação com NestJS, PostgreSQL, bcrypt e JWT.

O sistema desenvolvido permite:

```text
Cadastrar usuários.
Armazenar senhas como hash.
Realizar login.
Gerar token JWT.
Proteger rotas com AuthGuard.
Controlar a sessão de forma stateless usando JWT.
```

O ponto mais importante é compreender que a senha original nunca deve ser armazenada no banco de dados. O banco armazena apenas o hash. O JWT, por sua vez, permite que o cliente prove, a cada requisição, que já realizou login.

---

## 40. Referências oficiais consultadas

- [NestJS — Authentication](https://docs.nestjs.com/security/authentication)
- [NestJS — Passport](https://docs.nestjs.com/recipes/passport)
- [NestJS — Database / TypeORM](https://docs.nestjs.com/techniques/database)
- [NestJS — Encryption and Hashing](https://docs.nestjs.com/security/encryption-and-hashing)
- [NestJS — Authorization](https://docs.nestjs.com/security/authorization)
- [TypeORM — Getting Started](https://typeorm.io/docs/getting-started/)
- [PostgreSQL — Official Website](https://www.postgresql.org/)
- [node.bcrypt.js — GitHub repository](https://github.com/kelektiv/node.bcrypt.js/)
