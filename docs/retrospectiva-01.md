# Retrospectiva — Sprint 1 (CampusGigs)

- **Período da Sprint 1:** 14/09/2026 a 16/10/2026 (prazo ajustado no cronograma da disciplina)
- **Integrante (Product Owner / Desenvolvedor / Revisor):** Clóvis Luan Medeiros de Araújo (`@clovismedaraujo`)
- **Quadro Kanban:** [GitHub Projects #4](https://github.com/users/clovismedaraujo/projects/4)

---

## 1. Fatos e Dados da Sprint 1

### 1.1. Incremento Funcional Entregue (Fatia Vertical Completa)
Na Sprint 1 foram entregues e integradas na `main` (via Pull Requests com CI verde e testes automatizados) duas histórias de usuário ponta a ponta (Backend Spring Boot + Frontend React):

1. **Cadastro e acesso seguro com e-mail institucional da UFRN (Issue Principal + 2 Sub-issues):**
   - **Sub-issue 1 (PR #18):** Validação de domínio institucional aprovado da UFRN (`@ufrn.edu.br`, `@escolar.ufrn.br`, `@ufrn.br`, `@imd.ufrn.br`, `@dca.ufrn.br`) no backend e no frontend, rejeitando domínios externos.
   - **Sub-issue 2 + Fluxo Completo (PR #19):** Política de complexidade de senha (mínimo de 8 caracteres, ao menos 1 letra maiúscula e 1 número) validada antes da encriptação com **BCrypt** (`spring-security-crypto`), além de tela de Login e acesso ao painel autenticado do estudante.
2. **Criação de anúncio de serviço e exibição na busca (Issue #10 — PR #20):**
   - Formulário e endpoint `POST /api/listings` com validação de todos os campos obrigatórios (título, categoria, descrição, preço $\ge 0$ e disponibilidade).
   - Mural e endpoint `GET /api/listings` com busca por texto e filtro por categoria, exibindo o anúncio imediatamente após a publicação.

### 1.2. Métricas de Fluxo da Sprint 1

| Item / Cartão | PR Vinculado | Entrada no Backlog | Início (In Progress) | Fim (Done / Merge) | Lead Time (dias corridos) | Cycle Time (dias corridos) |
|---|---|---|---|---|---|---|
| Sub-issue 1: Validação de domínio institucional UFRN | PR #18 | 16/09/2026 | 15/10/2026 | 15/10/2026 | 29 dias | 1 dia |
| Sub-issue 2 + Issue Principal: Política de senha, BCrypt e acesso do estudante | PR #19 | 16/09/2026 | 15/10/2026 | 16/10/2026 | 30 dias | 1 dia |
| Issue #10: Criar anúncio com categoria, descrição, preço e disponibilidade + busca | PR #20 | 16/09/2026 | 16/10/2026 | 16/10/2026 | 30 dias | 1 dia |

- **Lead Time médio:** $29{,}7\text{ dias corridos}$ (os cartões foram criados no início da sprint em 16/09 e concluídos entre 15/10 e 16/10).
- **Cycle Time médio:** $1\text{ dia corrido}$ por cartão (cada cartão foi puxado individualmente para `In Progress`, implementado em fatia vertical com TDD, revisado e integrado antes de iniciar o próximo).
- **Throughput (Vazão):** $3\text{ cartões concluídos}$ na última semana da sprint (média de $0{,}75\text{ cartões/semana}$ considerando as 4 semanas totais do período).
- **WIP (Trabalho em Andamento):** Respeitado o limite máximo de **1 cartão em `In Progress`** e **1 cartão em `In Review`** por vez.
- **Relação com a Lei de Little ($\text{Lead Time} = \frac{\text{WIP}}{\text{Throughput}}$):** Manter o limite de $\text{WIP} = 1$ em `In Progress` evitou troca de contexto (especialmente crítico em equipe de 1 pessoa) e garantiu um *Cycle Time* curto (menos de 1 dia por cartão assim que o trabalho foi iniciado). O *Lead Time* alto ($29{,}7$ dias) deveu-se ao tempo de espera na fila (`Backlog` / `Sprint Backlog`) antes do início da execução.

### 1.3. Outros Fatos Observados
- **Cartões parados e trabalho invisível fora do quadro Kanban:** Os cartões das funcionalidades ficaram parados por bastante tempo no quadro porque boa parte da sprint foi dedicada a estudar e decidir quais conceitos e práticas de XP (como TDD e Integração Contínua) seriam aplicados no projeto, além de realizar a estruturação inicial do backend e a implementação do pipeline de CI (`.github/workflows/ci.yml`). Foi um **erro de gestão visual não ter criado cartões específicos no quadro Kanban para essas tarefas de estruturação e implementação do CI**, o que deixou esse esforço invisível nas métricas e fez parecer que o quadro estava sem movimentação.
- **Incidente no CI (GitHub Actions):** Na primeira execução do workflow de backend, o job falhou com `Driver org.h2.Driver claims to not accept jdbcUrl, jdbc:postgresql://localhost:5432/campusgigs_test` porque o `application-test.yml` fixava `driver-class-name: org.h2.Driver`, conflitando com a variável de ambiente `SPRING_DATASOURCE_URL` injetada pelo CI.
- **Execução local do Backend:** Ao rodar o backend localmente sem um servidor PostgreSQL ativo na porta `5432`, ocorria `Connection to localhost:5432 refused`. Foi criado o perfil `dev` (`application-dev.yml`) com banco H2 em memória e um `docker-compose.yml` para PostgreSQL.
- **Isolamento de testes JPA:** Ao adicionar o `ServiceListingControllerTest`, o teste subsequente (`UserControllerTest`) falhou inicialmente por restrição de chave estrangeira (`service_listings.provider_id -> users.id`), resolvido adicionando limpeza em `@AfterEach`.

---

## 2. Práticas de XP Evidenciadas

1. **TDD (Test-Driven Development):**
   - **Evidência no repositório:** Em todos os PRs de funcionalidades (#18, #19 e #20), o commit contendo os testes automatizados (`test: ...`) foi realizado **antes** do commit da implementação (`feat: ...`):
     - `4ca0eb6` (`test: adiciona testes de validacao de dominio institucional da UFRN no cadastro`) $\rightarrow$ `25fd558` (`feat: implementa validacao de dominio institucional da UFRN no backend e frontend`)
     - `8c4edb1` (`test: adiciona testes de politica de complexidade de senha, encriptacao e login`) $\rightarrow$ `b436a74` (`feat: implementa validacao de senha, encriptacao BCrypt e fluxo completo de acesso do estudante`)
     - `8755264` (`test: adiciona testes de criacao de anuncio e exibicao na busca (#10)`) $\rightarrow$ `6c4d384` (`feat: implementa criacao de anuncio de servico com validacao e exibicao na busca (#10)`)
   - **O que funcionou:** Escrever os testes primeiro definiu claramente os contratos dos endpoints REST (`/api/users/register`, `/api/users/login`, `/api/listings`) e dos componentes React, além de detectar imediatamente o problema de chave estrangeira entre `ServiceListing` e `User`.
   - **O que não funcionou de primeira:** No teste de componente `ServiceListingForm.test.jsx`, o `vi.mock('../services/listingService')` sobrescreveu a constante `DEFAULT_CATEGORIES`, exigindo `importOriginal()` no mock do Vitest.
2. **Integração Contínua (CI):**
   - **Evidência no repositório:** Workflow `.github/workflows/ci.yml` rodando `mvn -B verify` (com container de serviço PostgreSQL 16) e `npm ci && npm test && npm run build` em todo Pull Request e push na `main`.
   - **O que funcionou:** Impediu que o conflito de driver JDBC passasse despercebido e garantiu que os 31 testes de backend e 10 testes de frontend passassem antes do merge.

---

## 3. Causas dos Problemas Principais (5 Porquês)

### Problema A: Quebra do CI por conflito entre H2 e PostgreSQL e falha na execução local sem banco
1. **Por que o CI quebrou ao rodar os testes do backend?**
   Porque o HikariCP tentou conectar na URL `jdbc:postgresql://localhost:5432/campusgigs_test` usando a classe `org.h2.Driver`.
2. **Por que o HikariCP usou `org.h2.Driver` se o CI passava a URL do PostgreSQL?**
   Porque o arquivo `application-test.yml` definia explicitamente `spring.datasource.driver-class-name: org.h2.Driver`, e o `ci.yml` sobrescrevia apenas `SPRING_DATASOURCE_URL`, `USERNAME` e `PASSWORD`.
3. **Por que o `driver-class-name` foi fixado manualmente nos arquivos `.yml`?**
   Porque na configuração inicial do esqueleto do projeto assumiu-se que os testes rodariam sempre apenas em H2, sem considerar que o workflow do GitHub Actions subiria um serviço real do PostgreSQL.
4. **Por que essa divergência não foi percebida localmente antes do push?**
   Porque localmente a variável `SPRING_DATASOURCE_URL` não estava definida, fazendo os testes usarem a URL do H2 sem conflito, enquanto a aplicação principal exigia PostgreSQL na porta `5432`.
5. **Por que não havia um perfil local padronizado documentado desde o início?**
   Porque na criação inicial do backend não foi incluído um `docker-compose.yml` nem um perfil `dev` em memória para execução imediata sem dependências externas.

### Problema B: Cartões de histórias parados por muito tempo (Lead Time elevado) e trabalho invisível fora do quadro
1. **Por que os cartões das histórias ficaram parados por tanto tempo desde 16/09 e só foram concluídos em 15–16/10?**
   Porque antes de codificar as histórias de usuário foi necessário estudar e decidir quais práticas de XP seriam adotadas no projeto, além de estruturar o repositório e configurar o pipeline de Integração Contínua (CI).
2. **Por que esse período de estudo, estruturação do projeto e implementação do CI fez o quadro parecer parado?**
   Porque **foi um erro não ter registrado essas tarefas técnicas (estruturação do backend e implementação do CI) como cartões no quadro Kanban**.
3. **Por que as tarefas de estruturação e CI não foram criadas como cartões no quadro?**
   Porque inicialmente enxergou-se o quadro apenas como repositório de histórias de usuário finais do produto, tratando a configuração de arquitetura, CI e definição das práticas de XP como "pré-trabalho" fora do fluxo.
4. **Por que tratar esse esforço fora do quadro prejudicou as métricas de fluxo da sprint?**
   Porque gerou "trabalho invisível": o tempo real gasto preparando o ambiente e o CI somou-se ao tempo de espera das histórias já abertas, inflando o *Lead Time* para ~30 dias e concentrando os merges visíveis nos últimos dias.
5. **Por que a decisão sobre quais conceitos de XP aplicar demorou para se converter em execução prática?**
   Porque, trabalhando individualmente, faltou transformar o estudo de XP e a montagem do CI em entregáveis pequenos e rastreáveis no próprio quadro logo na primeira semana da sprint.

---

## 4. Plano de Ações para a Sprint 2

| # | Ação Concreta e Verificável | Responsável | Prazo | Como será verificada na Sprint 2 |
|---|---|---|---|---|
| 1 | Disponibilizar perfil `dev` (H2 em memória), `docker-compose.yml` (PostgreSQL) e instruções completas de execução no `README.md` | Clóvis Araújo (`@clovismedaraujo`) | **16/10/2026** (concluída no fechamento da Sprint 1) | Qualquer avaliador ou desenvolvedor consegue subir backend + frontend seguindo apenas o `README.md` sem erro de conexão JDBC |
| 2 | **Eliminar trabalho invisível:** registrar qualquer tarefa de infraestrutura/arquitetura como cartão no Kanban e concluir o **primeiro PR na `main` até o fim da 1ª semana da Sprint 2** | Clóvis Araújo (`@clovismedaraujo`) | **23/10/2026** | Quadro Kanban refletindo 100% do trabalho realizado e histórico de PRs (`gh pr list --state merged`) com entrega já na 1ª semana |
| 3 | Garantir limpeza de dados em `@AfterEach` na ordem correta de integridade referencial em todos os novos testes de integração de controllers | Clóvis Araújo (`@clovismedaraujo`) | **30/10/2026** (contínuo em todo PR da Sprint 2) | Suíte `mvn verify` passando sem erros de `DataIntegrityViolationException` no CI em 100% dos PRs da Sprint 2 |

---

## 5. Revisão do Acordo de Processo (Sprint 0 $\rightarrow$ Sprint 1)

Conforme formalizado em [`acordo-de-processo.md`](../acordo-de-processo.md), as seguintes melhorias foram incorporadas ao processo a partir da experiência da Sprint 1:
- **Redução do limite de WIP em `In Progress` de 2 para 1:** Com equipe de 1 integrante, ter 2 itens em progresso simultaneamente gera troca de tarefa sem ganho de vazão.
- **Proteção mecânica da branch `main`:** Nenhum commit direto na `main`; todo trabalho entra exclusivamente via Pull Request vinculado à issue (`Closes #N`) e com CI verde.
- **Políticas explícitas de entrada e saída por coluna:** Documentadas para `Backlog`, `Sprint Backlog` (limite 3), `In Progress` (limite 1), `In Review` (limite 1) e `Done`.
- **TDD e CI obrigatórios:** Em cartões de lógica e funcionalidades, o commit de teste antecede o commit de implementação no histórico do PR.
