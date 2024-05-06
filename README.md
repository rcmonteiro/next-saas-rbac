# Project History

- `pnpm dlx create-turbo@latest`
- criando a pasta config com eslint e typescript
- `pnpm i`
- configurando o ./config/prettier - criando o pacote e instalando as dependências
- /config/prettier: `pnpm i -D prettier prettier-plugin-tailwindcss`
- configurando o ./config/eslint-config
- ./config/eslint-config: `pnpm i -D @rocketseat/eslint-config eslint-plugin-simple-import-sort`
- configurando o ./config/tsconfig
- criando o pacote ./package/auth, que será usado tanto pelo front como pelo back
- `pnpm i @casl/ability`
- criando o app ./apps/api
- ./apps/api `pnpm i -D tsx @types/node`
- configurando as permissões 
- ./package/auth: `pnpn i zod`
- configurando o fastify
- ./apps/api: `pnpm i fastify fastify-type-provider-zod @fastify/cors zod`


### Single Tenant vs Multi Tenant

**Single Tenant**
- Um software utilizado por uma empresa, **_uma única instância_** do software utilizado por uma **_única empresa_**
- Se mais empresas forem usar o software, ele precisa ser instalado manualmente do sistema (ex: Java/Delphi)
- Você tem uma infraestrutura para cada cliente, para cada instância do software

**Multi Tenant**
- Um software que é utilizado por várias empresas compartilhando de uma mesma infraestrutura (rodando na "nuvem")
- Não quer dizer que TEMOS que usar vários subdomínios (empresa1.app.com, empresa2.app.com), isso é mais utilizado para soluções que servem páginas públicas para as empresas que contratam o SaaS.
- A grande maioria dos SaaS que são Multi Tenant **_não usam_** um banco por empresa, isso acaba sendo exigido em situações de negócio e não técnicas, como em casos de b2gov ou em contratos com grandes empresas por conta da **LGPD**
****


### Autorização

**RBAC**
- Role Based Authorization Control
- Role: Admin, Billing, Developer, Member
- A grande maioria das aplicações seguem este padrão
- Controle mais alto nível
- Para a grande maioria, a criação de novas roles não deveria ser uma opção aberta aos usuários
  - Com isso, não precisamos ter as Roles no banco, mas na própria codebase

**ABAC**
- Attribute Based Authorization Control
- Controle mais baixo nível
- Admin: pode editar um projeto
- Membro: pode editar o título de um projeto
- Podemos e acabamos usando um pouco de ambos os padrões, conforme a necessidade do projeto

# PRD - Next.js SaaS + RBAC

This project contains all the necessary boilerplate to setup a multi-tenant SaaS with Next.js including authentication and RBAC authorization.

## Features

### Authentication

- [ ] It should be able to authenticate using e-mail & password;
- [ ] It should be able to authenticate using Github account;
- [ ] It should be able to recover password using e-mail;
- [ ] It should be able to create an account (e-mail, name and password);

### Organizations

- [ ] It should be able to create a new organization;
- [ ] It should be able to get organizations to which the user belongs;
- [ ] It should be able to update an organization;
- [ ] It should be able to shutdown an organization;
- [ ] It should be able to transfer organization ownership;

### Invites

- [ ] It should be able to invite a new member (e-mail, role);
- [ ] It should be able to accept an invite;
- [ ] It should be able to revoke a pending invite;

### Members

- [ ] It should be able to get organization members;
- [ ] It should be able to update a member role;

### Projects

- [ ] It should be able to get projects within a organization;
- [ ] It should be able to create a new project (name, url, description);
- [ ] It should be able to update a project (name, url, description);
- [ ] It should be able to delete a project;

### Billing

- [ ] It should be able to get billing details for organization ($20 per project / $10 per member excluding billing role);

## RBAC

Roles & permissions.

### Roles

- Owner (count as administrator)
- Administrator
- Member
- Billing (one per organization)
- Anonymous

### Permissions table

|                          | Administrator | Member | Billing | Anonymous |
| ------------------------ | ------------- | ------ | ------- | --------- |
| Update organization      | ✅            | ❌     | ❌      | ❌        |
| Delete organization      | ✅            | ❌     | ❌      | ❌        |
| Invite a member          | ✅            | ❌     | ❌      | ❌        |
| Revoke an invite         | ✅            | ❌     | ❌      | ❌        |
| List members             | ✅            | ✅     | ✅      | ❌        |
| Transfer ownership       | ⚠️            | ❌     | ❌      | ❌        |
| Update member role       | ✅            | ❌     | ❌      | ❌        |
| Delete member            | ✅            | ⚠️     | ❌      | ❌        |
| List projects            | ✅            | ✅     | ✅      | ❌        |
| Create a new project     | ✅            | ✅     | ❌      | ❌        |
| Update a project         | ✅            | ⚠️     | ❌      | ❌        |
| Delete a project         | ✅            | ⚠️     | ❌      | ❌        |
| Get billing details      | ✅            | ❌     | ✅      | ❌        |
| Export billing details   | ✅            | ❌     | ✅      | ❌        |

> ✅ = allowed
> ❌ = not allowed
> ⚠️ = allowed w/ conditions

#### Conditions

- Only owners may transfer organization ownership;
- Only administrators and project authors may update/delete the project;
- Members can leave their own organization;