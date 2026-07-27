# Order Flow

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30-C21325?logo=jest&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?logo=githubactions&logoColor=white)

Painel de gerenciamento de pedidos desenvolvido com Next.js, React e TypeScript.

O projeto simula o fluxo de pedidos de uma loja, permitindo visualizar indicadores, filtrar registros e atualizar o status de cada pedido por meio de uma interface responsiva e acessível.

A aplicação foi construída como projeto de portfólio, com foco em arquitetura front-end, componentização, testes automatizados, Backend for Frontend, cobertura de código, mutation testing e integração contínua.

## Demonstração

Aplicação publicada:

```text
https://order-flow-inky.vercel.app/
```


## Funcionalidades

- Visualização dos principais indicadores de pedidos
- Listagem completa dos pedidos
- Filtro por nome do cliente
- Filtro por status
- Filtro por data inicial e final
- Combinação de múltiplos filtros
- Atualização do status de um pedido
- Atualização automática da tabela e do dashboard
- Estados de carregamento, erro e lista vazia
- Mensagens de sucesso e erro
- Atualização silenciosa após alteração de status
- Interface responsiva
- Componentes com semântica acessível

## Indicadores do dashboard

O dashboard apresenta:

- total de pedidos;
- pedidos pendentes;
- pedidos em preparação;
- pedidos concluídos;
- valor total dos pedidos válidos.

Pedidos cancelados continuam sendo contabilizados no total de pedidos, mas não são incluídos no valor total.

## Tecnologias

### Front-end

- Next.js 16.2.12
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4

### Testes e qualidade

- Jest
- React Testing Library
- Testing Library User Event
- Jest Coverage
- StrykerJS
- ESLint

### Automação e ferramentas

- GitHub Actions
- npm
- Git e GitHub
- Vercel

## Arquitetura

O projeto está organizado por funcionalidade, mantendo os elementos relacionados ao domínio de pedidos dentro de uma mesma feature.

```text
src/
├── app/
│   ├── api/
│   │   └── orders/
│   │       ├── route.ts
│   │       ├── stats/
│   │       │   └── route.ts
│   │       └── [id]/
│   │           └── status/
│   │               └── route.ts
│   ├── layout.tsx
│   └── page.tsx
│
├── features/
│   └── orders/
│       ├── components/
│       │   ├── ui/
│       │   ├── dashboard-card.tsx
│       │   ├── order-dashboard.tsx
│       │   ├── order-filters.tsx
│       │   ├── order-table.tsx
│       │   ├── orders-overview.tsx
│       │   ├── status-badge.tsx
│       │   └── status-select.tsx
│       ├── data/
│       ├── hooks/
│       ├── server/
│       ├── services/
│       ├── types/
│       └── utils/
│
└── lib/
    └── http/
```

### Responsabilidades das camadas

```text
components
→ renderização e interação da interface

hooks
→ controle de estado e coordenação das ações

services
→ comunicação HTTP com o BFF

server
→ armazenamento e operações executadas no servidor

utils
→ regras de negócio e funções puras

types
→ contratos TypeScript do domínio

app/api
→ endpoints do BFF
```

## Fluxo de dados

A interface não acessa diretamente os dados simulados.

```text
Componente React
        ↓
Hook customizado
        ↓
Serviço HTTP
        ↓
Route Handler do Next.js
        ↓
Armazenamento em memória
```

Essa separação reduz o acoplamento entre a interface e a fonte de dados, facilita os testes e permite substituir futuramente o armazenamento em memória por uma API ou banco de dados.

## Backend for Frontend

A aplicação utiliza o padrão **Backend for Frontend**, ou BFF, por meio dos Route Handlers do Next.js.

O BFF atua como uma camada de servidor criada especificamente para atender às necessidades da interface.

Ele é responsável por:

- acessar os dados;
- validar as requisições;
- aplicar regras de negócio;
- tratar erros;
- padronizar as respostas;
- proteger o front-end de detalhes da fonte de dados.

Mesmo sem um backend externo ou banco de dados, os Route Handlers representam uma fronteira real entre a interface e o domínio executado no servidor.

## Endpoints

### Listar pedidos

```http
GET /api/orders
```

Exemplo de resposta:

```json
{
  "success": true,
  "data": {
    "orders": [],
    "total": 0
  }
}
```

### Consultar estatísticas

```http
GET /api/orders/stats
```

Exemplo de resposta:

```json
{
  "success": true,
  "data": {
    "totalOrders": 0,
    "pendingOrders": 0,
    "preparingOrders": 0,
    "completedOrders": 0,
    "totalValue": 0
  }
}
```

### Atualizar status

```http
PATCH /api/orders/:id/status
```

Corpo da requisição:

```json
{
  "status": "completed"
}
```

Status permitidos:

```text
pending
preparing
completed
cancelled
```

### Respostas padronizadas

As respostas de sucesso seguem o formato:

```json
{
  "success": true,
  "data": {}
}
```

As respostas de erro seguem o formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem de erro"
  }
}
```

## Armazenamento dos dados

Os pedidos são mantidos em memória durante a execução da aplicação.

Isso significa que:

- não existe banco de dados;
- atualizações persistem apenas enquanto a instância estiver ativa;
- os dados podem ser reiniciados após uma nova execução;
- diferentes instâncias serverless podem não compartilhar o mesmo estado.

Essa escolha mantém o projeto focado em arquitetura front-end, BFF, testes e qualidade de código.

## Executando o projeto localmente

### Requisitos

Para executar o projeto, é necessário ter instalado:

- Node.js 22
- npm 10
- Git

Versões utilizadas durante o desenvolvimento e na integração contínua:

```text
Node.js 22.19.0
npm 10.9.3
```

### Clonando o repositório

```bash
git clone https://github.com/DiogoRocha07/order-flow.git
cd order-flow
```

### Instalando as dependências

```bash
npm ci
```

O projeto utiliza `npm ci` para instalar exatamente as versões registradas no `package-lock.json`.

### Iniciando o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera o build de produção |
| `npm run start` | Executa o build de produção |
| `npm run lint` | Analisa o código com ESLint |
| `npm test` | Executa todos os testes |
| `npm run test:watch` | Executa os testes em modo de observação |
| `npm run test:coverage` | Executa os testes e gera a cobertura |
| `npm run test:mutation` | Executa o mutation testing com StrykerJS |

## Testes automatizados

A aplicação possui testes unitários, testes de componentes, hooks, serviços, Route Handlers e integração.

A suíte cobre:

- cálculo das estatísticas;
- filtragem dos pedidos;
- formatação de moeda;
- formatação de datas;
- validação dos status;
- tradução dos status;
- armazenamento em memória;
- proteção contra mutações externas;
- serviços HTTP;
- respostas do BFF;
- hooks assíncronos;
- estados de carregamento e erro;
- componentes reutilizáveis;
- filtros da interface;
- tabela de pedidos;
- atualização de status;
- integração do painel.

Os testes utilizam:

- Jest;
- React Testing Library;
- Testing Library User Event;
- ambiente `jsdom` para componentes e hooks;
- ambiente Node para Route Handlers e código de servidor.

### Executando os testes

```bash
npm test
```

## Cobertura de código

Para gerar o relatório:

```bash
npm run test:coverage
```

O projeto possui limites mínimos globais configurados no Jest:

```text
Statements: 90%
Branches:   90%
Functions:  90%
Lines:      90%
```

Resultado atual:

```text
20 suítes de testes
113 testes automatizados

Statements: 99,56%
Branches:   97,84%
Functions:  100%
Lines:      99,56%
```

A pasta `coverage` é gerada localmente e não é versionada.

## Mutation testing

O projeto utiliza StrykerJS para avaliar a capacidade dos testes de detectar alterações incorretas no código.

Enquanto a cobertura tradicional verifica se uma linha foi executada, o mutation testing modifica temporariamente o comportamento da implementação e verifica se algum teste falha.

Exemplo:

```ts
total + order.total;
```

Pode ser temporariamente alterado para:

```ts
total - order.total;
```

Uma condição como:

```ts
order.status === "completed";
```

Pode ser alterada para:

```ts
order.status !== "completed";
```

Quando os testes detectam a alteração, o mutante é considerado eliminado.

O Stryker está configurado para as principais regras puras do domínio:

```text
calculate-order-stats.ts
filter-orders.ts
order-status.ts
```

Para executar:

```bash
npm run test:mutation
```

Resultado atual:

```text
Mutation score: 92,96%

66 mutantes eliminados
5 mutantes sobreviventes analisados como equivalentes ou redundantes
0 mutantes sem cobertura
0 timeouts
```

O comando falha caso o mutation score fique abaixo de 90%.

## Integração contínua

O projeto utiliza GitHub Actions para validar automaticamente Pull Requests e atualizações enviadas para a branch `main`.

O workflow está localizado em:

```text
.github/workflows/ci.yml
```

A pipeline possui dois jobs.

### Quality

Executa:

```text
npm ci
npm run lint
npm run test:coverage
npm run build
```

### Mutation testing

Executa:

```text
npm ci
npm run test:mutation
```

O mutation testing é iniciado somente depois que lint, testes, cobertura e build são concluídos com sucesso.

O workflow também utiliza controle de concorrência para cancelar execuções antigas quando novos commits são enviados para a mesma branch.

## Decisões técnicas

### Organização por feature

Os arquivos relacionados ao domínio de pedidos ficam agrupados em:

```text
src/features/orders
```

Essa organização mantém componentes, hooks, serviços, tipos e regras de negócio próximos entre si.

### Hooks customizados

As responsabilidades de estado foram separadas em hooks específicos:

```text
useOrders
→ carregamento de pedidos e estatísticas

useOrderFilters
→ estado e aplicação dos filtros

useUpdateOrderStatus
→ atualização do status e feedback da operação
```

Essa separação reduz a complexidade dos componentes e facilita testes isolados.

### Funções puras

Cálculos, filtros e formatações foram isolados em funções sem dependência da interface.

Exemplos:

```text
calculateOrderStats
filterOrders
formatCurrency
formatOrderDate
isOrderStatus
getOrderStatusLabel
```

Funções puras são mais simples de testar, reutilizar e validar com mutation testing.

### Atualização silenciosa

Depois de alterar o status de um pedido, a tabela e o dashboard são recarregados sem substituir toda a interface pelo estado de carregamento.

Enquanto a requisição está em andamento, os dados anteriores continuam visíveis.

### Operações paralelas

Pedidos e estatísticas são carregados em paralelo utilizando `Promise.all`.

Isso evita esperar uma requisição terminar para iniciar a seguinte.

### Proteção contra atualizações após desmontagem

O hook responsável pelo carregamento evita atualizações de estado quando o componente já foi desmontado.

Essa proteção reduz o risco de atualizações assíncronas desnecessárias após a saída da tela.

### Cópias defensivas no armazenamento

O armazenamento em memória retorna cópias dos pedidos.

Assim, consumidores externos não conseguem alterar o estado interno diretamente sem utilizar as funções oficiais do domínio.

### Acessibilidade

A interface utiliza elementos semânticos e atributos de acessibilidade, incluindo:

- labels associados aos campos;
- consultas por nome acessível;
- `role="status"` para carregamento e sucesso;
- `role="alert"` para erros;
- captions em tabelas;
- headings para organização da página;
- botões com textos descritivos.

## Limitações

- Os dados são mantidos apenas em memória
- Não existe autenticação
- Não existe paginação
- Não existe banco de dados
- Atualizações podem ser perdidas após reinicialização
- O estado em memória não é compartilhado entre múltiplas instâncias serverless
- O projeto utiliza dados simulados

Essas limitações são intencionais e mantêm o escopo focado em front-end, arquitetura, testes e integração contínua.

## Melhorias futuras

- Adicionar persistência com banco de dados
- Implementar autenticação e autorização
- Adicionar paginação
- Adicionar ordenação da tabela
- Criar busca com debounce
- Adicionar testes end-to-end
- Publicar relatórios de cobertura como artefatos da CI
- Adicionar observabilidade e logs estruturados
- Melhorar o tratamento de concorrência nas atualizações
- Adicionar modo escuro

## Autor

Desenvolvido por **Diogo Rocha**.

- GitHub: `https://github.com/DiogoRocha07`
- LinkedIn: `https://www.linkedin.com/in/diogo-rocha07/`

## Status do projeto

Projeto funcional e em evolução.

As funcionalidades principais, testes automatizados, cobertura, mutation testing e integração contínua estão implementados.