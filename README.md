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