# CampusGigs 🎓

Marketplace de serviços entre universitários — conecta estudantes da **UFRN** que precisam de pequenos serviços (aula particular/monitoria, revisão de texto, programação, design, carona universitária) a colegas que querem oferecê-los dentro do próprio campus, com vínculo institucional verificado.

Projeto desenvolvido para a disciplina **DIM0510 — Processos de Software** (UFRN).

---

## Equipe e Coorte

- **Nome da equipe:** Campus Gigs
- **Coorte de apresentação:** Coorte B (online)

| Nome | Matrícula | Usuário GitHub | Papel |
|---|---|---|---|
| Clóvis Luan Medeiros de Araújo | 20240015041 | [@clovismedaraujo](https://github.com/clovismedaraujo) | Product Owner / Desenvolvedor / Revisor |

---

## Documentação e Links Importantes

- **Proposta de Produto (Sprint 0):** [`docs/proposta.md`](docs/proposta.md)
- **Acordo de Processo (revisado na Sprint 1):** [`acordo-de-processo.md`](acordo-de-processo.md)
- **Retrospectiva da Sprint 1:** [`docs/retrospectiva-01.md`](docs/retrospectiva-01.md)
- **Quadro Kanban (GitHub Projects):** [Project #4](https://github.com/users/clovismedaraujo/projects/4)
- **Vídeo da Sprint 0 (5 min):** [Assistir no YouTube](https://youtu.be/ODNgp3iCyoM)
- **Vídeo da Sprint 1 (5 min):** https://youtu.be/Iey68kA-arU

---

## Stack Tecnológica

- **Backend:** Java 21 + Spring Boot 3.3.4 (Spring Web, Spring Data JPA, Bean Validation, Spring Security Crypto / BCrypt)
- **Banco de Dados:** PostgreSQL 16 (produção/CI) e H2 Database em memória (perfil `dev` e testes automatizados)
- **Frontend:** React 18 + Vite 5
- **Testes Automatizados:** JUnit 5 + MockMvc (Backend) e Vitest + React Testing Library (Frontend)

---

## Incremento Funcional Entregue (Sprint 1)

1. **Cadastro e Autenticação Segura com E-mail Institucional da UFRN:**
   - Validação de domínios institucionais aprovados da UFRN (`@ufrn.edu.br`, `@escolar.ufrn.br`, `@ufrn.br`, `@imd.ufrn.br`, `@dca.ufrn.br`).
   - Política de complexidade de senha (mínimo de 8 caracteres, ao menos 1 letra maiúscula e 1 número) validada no frontend e no backend antes da encriptação com **BCrypt**.
   - Login de estudante verificado (`POST /api/users/login`).
2. **Publicação e Busca de Anúncios de Serviços (`#10`):**
   - Criação de anúncio pelo estudante prestador com validação de campos obrigatórios (**título**, **categoria**, **descrição**, **preço** e **disponibilidade**) via `POST /api/listings`.
   - Exibição imediata do anúncio publicado no **Mural de Busca** (`GET /api/listings`), com busca por palavras-chave e filtro por categoria.

---

## Como Executar o Projeto Localmente

### Pré-requisitos
- **Java 21** (JDK 21)
- **Node.js 20+** e **npm**
- *(Opcional)* **Docker** (apenas se desejar rodar com PostgreSQL em vez do banco H2 em memória)

### 1. Subir o Backend (Spring Boot na porta `8080`)

#### Opção A — Execução rápida em memória (Perfil `dev` com H2, sem precisar instalar banco)
No terminal, a partir da raiz do repositório:

```bash
cd backend
./mvnw package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=dev
```
*(No Windows PowerShell, use `.\mvnw.cmd package -DskipTests`)*

#### Opção B — Execução com PostgreSQL via Docker
Caso prefira subir o PostgreSQL na porta `5432`:

```bash
docker compose up -d
cd backend
./mvnw package -DskipTests
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

O backend ficará disponível em `http://localhost:8080/api` (você pode verificar o status em `http://localhost:8080/api/health`).

### 2. Subir o Frontend (React + Vite na porta `5173`)

Em outro terminal, a partir da raiz do repositório:

```bash
cd frontend
npm install
npm run dev
```

Acesse a aplicação no navegador em: **http://localhost:5173/**

---

## O Que Esperar (Roteiro de Teste Manual)

1. Abra **http://localhost:5173/** no navegador.
2. **Teste de bloqueio de domínio não autorizado:** Na aba **Criar conta**, tente cadastrar um e-mail comum (ex.: `aluno@gmail.com`). O sistema rejeitará o cadastro informando os domínios institucionais aceitos da UFRN.
3. **Teste da política de senha:** Digite uma senha fraca (ex.: `fraca123`) e observe o checklist visual indicar que falta letra maiúscula. Em seguida, informe uma senha forte (ex.: `Campus2026`).
4. **Concluir cadastro e acessar a plataforma:** Cadastre-se com um e-mail institucional da UFRN (ex.: `clovis@ufrn.edu.br`) e senha `Campus2026`. Você será autenticado e direcionado automaticamente ao painel principal do estudante.
5. **Criar anúncio de serviço (`#10`):** No formulário **Criar Anúncio de Serviço**:
   - Clique em **Publicar anúncio** com campos vazios para conferir a validação de campos obrigatórios.
   - Preencha **Título** (ex.: *Monitoria de Cálculo I*), **Categoria** (*Aula Particular / Monitoria*), **Descrição**, **Preço** (*40.00*) e **Disponibilidade** (*Seg e Qua à tarde*) e clique em **Publicar anúncio**.
6. **Conferir na busca:** Veja o anúncio recém-publicado aparecer imediatamente no **Mural do Campus (Serviços Disponíveis na Busca)** logo abaixo, podendo filtrá-lo por categoria ou termo de busca.

---

## Como Executar os Testes Automatizados

### Testes do Backend (JUnit 5 + MockMvc — 31 testes)
```bash
cd backend
./mvnw test
```

### Testes do Frontend (Vitest + Testing Library — 10 testes)
```bash
cd frontend
npm test
```
