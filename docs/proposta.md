# CampusGigs — Proposta de Produto (Sprint 0)

## 1. Visão do produto

**Para** estudantes universitários que precisam de pequenos serviços (aula particular, revisão de texto, carona, ajuda com tarefas) e para colegas que querem ganhar uma renda extra oferecendo essas habilidades,
**que** hoje não têm um canal centralizado e confiável para encontrar ou oferecer esses serviços dentro do próprio campus, dependendo de grupos de WhatsApp desorganizados e sem histórico de confiança,
**o CampusGigs é** um marketplace de serviços entre universitários
**que** conecta quem precisa de um serviço rápido a colegas da mesma instituição, com perfil, avaliação e agendamento simples,
**diferente de** grupos de WhatsApp/Discord ou murais físicos, o CampusGigs oferece busca por categoria, histórico de avaliações e confirmação de agendamento dentro do próprio app.


## 2. Definição do MVP

**Dentro do escopo:**
- Cadastro com e-mail institucional
- Criar anúncio de serviço (categoria, descrição, preço, disponibilidade)
- Buscar/filtrar anúncios por categoria
- Solicitar agendamento de um serviço
- Avaliar o prestador após conclusão

**Fora do escopo (explicitamente):**
- Pagamento dentro do app (combinado fora do app)
- Chat em tempo real (contato via WhatsApp/e-mail no MVP)
- Notificações push
- App mobile nativo (web responsivo apenas)

**Hipótese de valor:** Acreditamos que estudantes universitários vão publicar e contratar pequenos serviços entre si através do CampusGigs porque isso reduz o tempo e a incerteza de encontrar alguém confiável dentro do próprio campus.

**Critérios de "pronto" do MVP:** um estudante consegue se cadastrar, publicar OU buscar um serviço, solicitar um agendamento e, ao final, avaliar a experiência — de ponta a ponta, sem intervenção manual da equipe.

## 3. Backlog inicial

Repositório: https://github.com/clovismedaraujo/campusgigs
Quadro no GitHub Projects: https://github.com/users/clovismedaraujo/projects/4



## 4. Stack tecnológica e justificativa

- **Frontend:** React — grande ecossistema, muita documentação e exemplos de integração com APIs REST, facilita dividir o trabalho em componentes entre os integrantes
- **Backend:** Spring (Spring Boot) — framework robusto e maduro em Java, com suporte nativo a REST, segurança e integração com banco de dados relacional
- **Banco de dados:** PostgreSQL — banco relacional open-source, confiável e com boa integração via Spring Data JPA
- **Hospedagem:** a definir (não obrigatório nesta etapa; será decidido conforme o progresso do desenvolvimento)

## 5. Acordo de processo

- **Cadência:** sprints de 15 dias; planning na segunda de manhã, review + retrospectiva pessoal na sexta à tarde
- **Cerimônias:**
  - Planning (15 min, início da sprint) — revisão do backlog e seleção dos itens da sprint
  - Review (10 min, fim da sprint) — conferência do que foi entregue contra os critérios de aceitação
  - Retrospectiva (10 min, logo após a review) — registrada por escrito (ex.: em um `docs/retrospectivas.md`) para manter histórico, já que não há outro integrante para discutir junto
- **Definição de Pronto (DoD):** autorrevisão do código com checklist (sem erros no console, testado manualmente, código lido linha a linha antes do commit), merge feito na `main`, critérios de aceitação da história atendidos
- **Papéis:** Clóvis acumula todos os papéis — Product Owner, desenvolvedor e responsável pela revisão 
- **Ferramentas:** GitHub, GitHub Projects, Intellij
- **WIP limits:** "Sprint Backlog": 3 itens por vez. "Em progresso": 2 itens por vez(Uma issue e possivel sub-issue)· "Em revisão": 1 no total

## 6. Equipe

| Nome | Matrícula | Usuário GitHub | Papel |
|---|---|---|---|
| Clóvis Luan Medeiros de Araújo | 20240015041 | clovismedaraujo | Product Owner / Desenvolvedor único |

*Equipe composta por 1 integrante, conforme permitido pelo enunciado (1 a 4 integrantes).*

## 7. Coorte / Integração

**Coorte de apresentação:** Coorte B — online

---
**Link do vídeo (5 min):** 
