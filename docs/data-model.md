# Modelo de dados

Estrutura das tabelas do Gefina. A fonte das decisões a respeito do produto é a
especificação; este documento registra como essas decisões se traduzem em tabelas.

## Relações

```
users ──< sessions
  │
  └──< customers ──< invoices
```

Todas as relações são de um para muitos. A chave estrangeira fica na tabela do
lado do muitos.

| Relação | Cardinalidade |
|---|---|
| Usuário e sessão | Um usuário mantém zero ou mais sessões |
| Usuário e cliente | Um usuário detém zero ou mais clientes |
| Cliente e fatura | Um cliente possui zero ou mais faturas |

## users

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `SERIAL` | Chave primária | Identificador |
| `name` | `TEXT` | `NOT NULL` | Nome apresentado na interface |
| `email` | `TEXT` | `NOT NULL`, `UNIQUE` | Credencial de acesso |
| `password_hash` | `TEXT` | `NOT NULL` | Sal e resultado da derivação da senha |
| `role` | `TEXT` | `NOT NULL`, padrão `user` | Papel do usuário |
| `created_at` | `TIMESTAMP` | `NOT NULL`, padrão instante corrente | Momento do cadastro |

A coluna `role` admite `user` e `admin`.

A coluna `password_hash` não guarda a senha.

## sessions

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `TEXT` | Chave primária | Identificador gerado aleatoriamente |
| `user_id` | `INTEGER` | `NOT NULL`, referencia `users(id)` | Usuário titular |
| `expires_at` | `TIMESTAMP` | `NOT NULL` | Instante de expiração |
| `created_at` | `TIMESTAMP` | `NOT NULL`, padrão instante corrente | Momento da criação |

O identificador não deriva de dado do usuário e não carrega informação.

A remoção de um usuário remove suas sessões em cascata.

## customers

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `SERIAL` | Chave primária | Identificador |
| `user_id` | `INTEGER` | `NOT NULL`, referencia `users(id)` | Usuário detentor |
| `name` | `TEXT` | `NOT NULL` | Nome do cliente |
| `email` | `TEXT` | `NOT NULL`, `UNIQUE` | Endereço de correio eletrônico |
| `image_url` | `TEXT` | — | Endereço da imagem de identificação |
| `created_at` | `TIMESTAMP` | `NOT NULL`, padrão instante corrente | Momento do cadastro |

A unicidade de `email` é global, e não restrita ao usuário detentor.

A coluna `image_url` admite ausência de valor.

## invoices

| Coluna | Tipo | Restrições | Descrição |
|---|---|---|---|
| `id` | `SERIAL` | Chave primária | Identificador |
| `customer_id` | `INTEGER` | `NOT NULL`, referencia `customers(id)` | Cliente contra o qual a fatura foi emitida |
| `amount` | `INTEGER` | `NOT NULL` | Valor em centavos |
| `status` | `TEXT` | `NOT NULL`, padrão `pending` | Situação quanto ao recebimento |
| `issue_date` | `DATE` | `NOT NULL` | Data de emissão |
| `due_date` | `DATE` | `NOT NULL` | Data de vencimento |
| `created_at` | `TIMESTAMP` | `NOT NULL`, padrão instante corrente | Momento do registro |

A coluna `status` admite `pending` e `paid`.

## Decisões registradas

**Valor em centavos.** Números com casas decimais são guardados em base dois, e
frações como um décimo não têm representação exata nessa base. O erro é mínimo em
um cálculo e se acumula em muitos. Centavos em número inteiro eliminam a fração: a
divisão por cem acontece só na apresentação.

**A fatura não guarda o dono.** A emissão é restrita aos clientes do próprio
usuário, então o dono da fatura é sempre o dono do cliente. O dado é obtido
seguindo a referência, e guardá-lo na fatura seria duplicar informação que pode
divergir.

**Remoção recusada quando há dependentes.** Remover cliente com faturas, ou
usuário com clientes, é recusado. A remoção em cascata apagaria registros
financeiros como efeito colateral de outra operação. A recusa obriga a decisão
explícita sobre os dependentes.

**Remoção de sessões em cascata.** A sessão só serve para identificar quem
acessa, e não tem valor em si. A sessão de um usuário que não existe mais não
significa nada.

**`created_at` separado de `issue_date`.** O primeiro registra quando o dado
entrou no sistema; o segundo, a data que o documento declara. Os dois podem
divergir, e a ordenação por registro recente usa `created_at`.
