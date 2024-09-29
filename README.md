
# Supera - Desafio Técnico Fullstack CRUD (Backend)

Esta é uma API backend construída usando Node.js, Express e SQLite. Ela fornece pontos finais para gerenciar usuários.


## Índice

- [Características](#características)
- [Instalação](#instalação)
- [Uso da API](#uso-da-api)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Banco de Dados](#estrutura-do-banco-de-dados)
- [Postman da API](#postman-da-api)
- [Sobre mim](#sobre-mim)

## Características

- API RESTful para gerenciamento de usuários
- Suporte à paginação
- Funcionalidade de busca
- Validação de dados
- Tratamento de erros
## Instalação

Para executar esta API localmente:

- Clone o repositório
- Instale as dependências: `npm install`
- Crie um arquivo `.env` com os detalhes da conexão do banco de dados
- Execute o servidor: `node index.js`
## Uso da API

Faça requisições HTTP para `http://localhost:3003` para interagir com a API.

## Endpoints da API

#### Retorna todos os usuários

```http
  GET /users/all
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `api_key` | `string` | **Obrigatório**. A chave da sua API |

#### Retorna os usuários paginados (5 itens por página)

```http
  GET /users/page=:page
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `page`      | `number`  | **Obrigatório**. Número da página (padrão: 1) |
| `limit`     | `number`  | **Obrigatório**. Número de itens por página (padrão: 5) |

#### Retorna usuários com base no tipo e valor de filtro

```http
  GET /users/search
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `filterType`| `string`  | **Obrigatório**. Campo para filtrar (nome, email, perfil) |
| `filterValue`| `string`  | **Obrigatório**. Valor do filtro |
| `page`      | `number`  | Opcional. Número da página (padrão: 1) |
| `limit`     | `number`  | Opcional. Número de itens por página (padrão: 5) |

#### Retorna um usuário específico de acordo com a ID

```http
  GET /users/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`  | **Obrigatório**. ID único do usuário |

#### Cria um novo usuário

```http
  POST /users
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `nome`      | `string`  | **Obrigatório**. Nome do usuário (Min char: 3 - Max char: 100)|
| `email`     | `string`  | **Obrigatório**. E-mail do usuário |
| `perfil`    | `string`  | **Obrigatório**. Perfil do usuário (ADMIN ou USER) |
| `telefone`  | `string`  | Opcional. Número de telefone |
| `idade`     | `number`  | Opcional. Idade do usuário |

#### Atualiza um usuário existente

```http
  PUT /users/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`        | `number`  | **Obrigatório**. ID único do usuário sendo atualizado |
| `nome`      | `string`  | **Obrigatório**. Novo nome do usuário (Min char: 3 - Max char: 100)|
| `email`     | `string`  | **Obrigatório**. Novo e-mail do usuário |
| `perfil`    | `string`  | **Obrigatório**. Novo perfil do usuário (ADMIN ou USER) |
| `telefone`  | `string`  | Opcional. Novo número de telefone |
| `idade`     | `number`  | Opcional. Nova idade do usuário |

#### Deleta um usuário

```http
  DELETE /users/:id
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `number` | **Obrigatório**. O ID do usuário a ser deletado |


## Estrutura do Banco de Dados

| Nome da Coluna  |        Tipo         |      Descrição      |
|-----------------|---------------------|---------------------|
| id              | **INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL** | Identificador único |
| nome            | **TEXT NOT NULL**       | Nome do usuário     |
| email           | **TEXT NOT NULL**       | E-mail do usuário   |
| perfil          | **TEXT NOT NULL**       | Perfil do usuário (ADMIN ou USER)  |
| telefone        | **TEXT**                | Número de telefone  |
| idade           | **INTEGER**             | Idade               |

## Postman da API

O Postman com a collection da API pode ser encontrado no seguinte link:

[![postman](https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://valverde-lucas-9300.postman.co/workspace/Valverde-Lucas-Workspace~7810308d-311b-45bd-9aa3-c50781b57a80/collection/31306653-93313a69-677b-4260-950b-27512e27322c?action=share&creator=31306653)



## Sobre mim

#### Olá, eu sou o Lucas! 👋

Eu sou uma pessoa desenvolvedora full-stack e possuo conhecimentos em tecnologias de Front End: **React.JS**, **JavaScript**, **HTML** e **CSS**, e tecnologias do Back End, tais como **TypeScript**, **Java** e **Spring Boot**. Também tenho fundamentos no estudo e uso de **APIs RESTFul** e **Banco de Dados** (**Relacionais** e **Não-Relacionais**).

## 🔗 Redes sociais e Links importantes
[![portfolio](https://img.shields.io/badge/portfolio-fd2282?style=for-the-badge&logo=ko-fi&logoColor=white)](https://valverde-lucas-portfolio.vercel.app)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/valverde-lucas/)
[![github](https://img.shields.io/badge/github-000?style=for-the-badge&logo=github&logoColor=yellow)](https://github.com/ValverdeLucas/)
[![gmail](https://img.shields.io/badge/gmail-EDE7E3?style=for-the-badge&logo=gmail&logoColor=db4a39)](mailto:valverdelucas95@gmail.com)

