# Hostlix API

API REST para a plataforma Hostlix, voltada à divulgação e consulta de hospedagens. O projeto organiza os dados de hóspedes, anfitriões e acomodações, permitindo criar, consultar, atualizar e remover usuários e anúncios de hospedagem.

## Integrantes
- Gabriel Sena
- Luiz Hey
- Luiz Angelo
- Lucas Antonetti.

## Tecnologias

- Node.js;
- TypeScript;
- Express 5;
- Supabase;
- Vitest;
- Bruno;
- Git.

## Entidades e relacionamentos

### Usuario

- `id`: UUID, chave primária;
- `nome`: nome da pessoa;
- `email`: endereço de e-mail;
- `senha`: credencial da conta;
- `telefone`: telefone, opcional;
- `tipo`: perfil da conta, por exemplo `ANFITRIAO` ou `HOSPEDE`;
- `foto_url`: URL da foto, opcional;
- `data_nascimento`: data de nascimento, opcional;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

### Hospedagem

- `id`: UUID, chave primária;
- `anfitriao_id`: UUID do usuário anfitrião;
- `titulo`, `descricao` e `tipo`: identificação e descrição do anúncio;
- `preco_diaria`: preço por diária;
- `capacidade`, `quartos`, `camas` e `banheiros`: características da acomodação;
- `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade` e `estado`: endereço;
- `latitude` e `longitude`: coordenadas geográficas;
- `status`: estado do anúncio;
- `criado_em` e `atualizado_em`: datas de criação e atualização.

Um usuário do tipo anfitrião pode cadastrar várias hospedagens. Cada hospedagem pertence a um único usuário, por meio da chave estrangeira `hospedagem.anfitriao_id` referenciando `usuario.id`. A criação da hospedagem valida que o usuário informado é anfitrião.

## Estrutura do projeto

```text
src/
├── config/          # Configuração do Supabase e variáveis de ambiente
├── controllers/     # Tratamento das requisições e respostas HTTP
├── models/          # Consultas e operações sobre as entidades
├── routes/          # Rotas Express de usuários e hospedagens
├── app.ts           # Configuração da aplicação Express
└── server.ts        # Inicialização do servidor HTTP
test/
├── controllers/     # Testes unitários dos controllers
└── models/          # Testes de integração dos models
bruno/               # Coleção de requisições HTTP
```

## Requisitos

- Node.js compatível com as dependências do projeto;
- npm;
- Um projeto Supabase com as tabelas descritas em [Banco de dados](#banco-de-dados).

## Configuração e execução

1. Clone o repositório:

   ```sh
   git clone https://github.com/gsena-arch/aps_api_backend.git
   cd aps_api_backend
   ```

2. Instale as dependências:

   ```sh
   npm install
   ```

3. Copie `.env.example` para `src/config/.env` e preencha os valores do seu projeto Supabase. No PowerShell:

   ```powershell
   Copy-Item .env.example src/config/.env
   ```

4. Crie as tabelas no Supabase conforme o SQL da próxima seção.

5. Inicie o servidor em modo de desenvolvimento:

   ```sh
   npm run dev
   ```

Por padrão, a API fica disponível em `http://localhost:3000`. Para gerar a versão compilada e iniciá-la, use `npm run build` e depois `npm start`. A porta pode ser alterada pela variável `PORT`.

## Variáveis de ambiente

A aplicação carrega `src/config/.env`. O arquivo `.env.example` contém somente nomes e valores ilustrativos; substitua-os localmente e nunca versione credenciais reais.

| Variável              | Finalidade                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `SUPABASE_URL`        | URL do projeto Supabase                                                                        |
| `SUPABASE_SECRET_KEY` | Chave secreta do Supabase usada pelo backend; não compartilhar nem usar em aplicações frontend |
| `PORT`                | Porta HTTP; opcional, padrão `3000`                                                            |

O `.gitignore` exclui `src/config/.env` e `.env` da raiz.

## Banco de dados

O backend consulta as tabelas `public.usuario` e `public.hospedagem` no PostgreSQL do Supabase. Para reproduzir a estrutura em um projeto vazio, execute no SQL Editor do Supabase:

```sql
CREATE TABLE IF NOT EXISTS public.usuario (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		nome VARCHAR(150) NOT NULL,
		email VARCHAR(255) NOT NULL,
		senha VARCHAR(255) NOT NULL,
		telefone VARCHAR(20),
		tipo VARCHAR(20),
		foto_url TEXT,
		data_nascimento DATE,
		criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS public.hospedagem (
		id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
		anfitriao_id UUID NOT NULL REFERENCES public.usuario(id),
		titulo VARCHAR(150) NOT NULL,
		descricao TEXT,
		tipo VARCHAR(30),
		preco_diaria DECIMAL(10, 2),
		capacidade INTEGER,
		quartos INTEGER,
		camas INTEGER,
		banheiros INTEGER,
		cep VARCHAR(9),
		logradouro VARCHAR(150),
		numero VARCHAR(20),
		complemento VARCHAR(100),
		bairro VARCHAR(100),
		cidade VARCHAR(100),
		estado CHAR(2),
		latitude DECIMAL(9, 6),
		longitude DECIMAL(9, 6),
		status VARCHAR(20),
		criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Endpoints

Todas as rotas recebem e retornam JSON. A rota raiz serve como verificação simples da API.

| Método   | Endpoint                      | Finalidade                        | Dados necessários                                                                         |
| -------- | ----------------------------- | --------------------------------- | ----------------------------------------------------------------------------------------- |
| `GET`    | `/`                           | Verifica se a API está disponível | Nenhum                                                                                    |
| `GET`    | `/users/`                     | Lista usuários                    | Nenhum                                                                                    |
| `GET`    | `/users/:id`                  | Consulta usuário pelo UUID        | UUID na rota                                                                              |
| `GET`    | `/users/name/:keyword`        | Busca usuários por trecho do nome | Palavra na rota                                                                           |
| `POST`   | `/users/`                     | Cria usuário                      | JSON com `nome`, `email`, `senha` e `tipo`                                                |
| `PUT`    | `/users/:id`                  | Atualiza usuário                  | JSON com `id`, `nome`, `email`, `senha` e `tipo`                                          |
| `DELETE` | `/users/:id`                  | Remove usuário                    | UUID na rota                                                                              |
| `GET`    | `/hospedagem/`                | Lista hospedagens                 | Nenhum                                                                                    |
| `GET`    | `/hospedagem/:id`             | Consulta hospedagem pelo UUID     | UUID na rota                                                                              |
| `GET`    | `/hospedagem/cidade/:keyword` | Busca hospedagens por cidade      | Trecho do nome da cidade na rota                                                          |
| `POST`   | `/hospedagem/`                | Cria hospedagem                   | JSON com `anfitriao_id` e `titulo`; o UUID do anfitrião deve existir e ter tipo anfitrião |
| `PUT`    | `/hospedagem/:id`             | Atualiza hospedagem               | UUID na rota e campos da hospedagem em JSON                                               |
| `DELETE` | `/hospedagem/:id`             | Remove hospedagem                 | UUID na rota                                                                              |

Na rota de atualização de usuário, o controller atualmente lê o `id` do corpo JSON; por isso, inclua-o no payload além de informar o UUID na URL.

## Exemplos de requisições

### Criar usuário

`POST /users/`

```json
{
  "nome": "Ana Souza",
  "email": "ana@example.com",
  "senha": "substitua-por-uma-senha",
  "telefone": "41999999999",
  "tipo": "ANFITRIAO",
  "foto_url": "https://example.com/ana.jpg",
  "data_nascimento": "1990-05-20"
}
```

### Atualizar usuário

`PUT /users/<UUID_DO_USUARIO>`

```json
{
  "id": "<UUID_DO_USUARIO>",
  "nome": "Ana Souza Atualizada",
  "email": "ana@example.com",
  "senha": "substitua-por-uma-senha",
  "telefone": "41988888888",
  "tipo": "ANFITRIAO",
  "foto_url": "https://example.com/ana.jpg",
  "data_nascimento": "1990-05-20"
}
```

### Criar hospedagem

`POST /hospedagem/`

```json
{
  "anfitriao_id": "<UUID_DE_UM_USUARIO_ANFITRIAO>",
  "titulo": "Casa acolhedora em Curitiba",
  "descricao": "Casa completa perto do centro.",
  "tipo": "casa",
  "preco_diaria": 280,
  "capacidade": 5,
  "quartos": 2,
  "camas": 3,
  "banheiros": 1,
  "cep": "80010-000",
  "logradouro": "Rua das Flores",
  "numero": "120",
  "bairro": "Centro",
  "cidade": "Curitiba",
  "estado": "PR",
  "latitude": -25.4284,
  "longitude": -49.2733,
  "status": "ATIVA"
}
```

### Atualizar hospedagem

`PUT /hospedagem/<UUID_DA_HOSPEDAGEM>`

```json
{
  "anfitriao_id": "<UUID_DE_UM_USUARIO_ANFITRIAO>",
  "titulo": "Casa acolhedora atualizada",
  "descricao": "Casa completa perto do centro.",
  "tipo": "casa",
  "preco_diaria": 300,
  "capacidade": 5,
  "quartos": 2,
  "camas": 3,
  "banheiros": 1,
  "cep": "80010-000",
  "logradouro": "Rua das Flores",
  "numero": "120",
  "bairro": "Centro",
  "cidade": "Curitiba",
  "estado": "PR",
  "latitude": -25.4284,
  "longitude": -49.2733,
  "status": "ATIVA"
}
```

## Testes

Execute todos os testes com:

```sh
npm run test:run
```

Os testes dos models usam o Supabase configurado em `src/config/.env`; configure um projeto de teste antes de executá-los. Os testes de controller usam mocks e não precisam acessar o banco.
