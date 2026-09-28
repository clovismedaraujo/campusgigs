# CampusGigs — Acordo de Processo (revisão 1, Sprint 1)


## 1. Cadência
- Sprint 1: 14/09 a 02/10 


## 2. Cerimônias
- **Planning** (15 min): escolher itens do backlog, quebrar em cartões de até 3 dias, mover para Sprint Backlog.
- **Review** (10 min): conferir o entregue contra os critérios de aceitação de cada cartão.
- **Retrospectiva** (30 min, por escrito em `docs/retrospectiva-NN.md`): fatos, causas (5 Porquês) e até 3 ações com responsável e prazo. Começa revisando as ações da retrospectiva anterior. **(alterado)**

## 3. Definição de Pronto (alterado)
Um cartão só vai para Done quando:
1. Existe um PR ligado ao cartão (`Closes #N` na descrição).
2. O CI está verde.
3. Os testes do que foi feito existem e passam.
4. A autorrevisão do checklist do PR foi feita (sem erros no console, testado manualmente, diff lido linha a linha).
5. O PR foi integrado na `main`.
6. Os critérios de aceitação do cartão foram atendidos.

**Regra mecânica (novo):** a `main` é protegida. Não há commit direto: todo trabalho entra por PR, com CI verde.

## 4. Papéis
Clóvis acumula Product Owner, desenvolvedor e revisor. Como não há segunda pessoa, a autorrevisão do PR é feita em um momento separado da escrita do código (por exemplo, depois de uma pausa, com o diff aberto).

## 5. Ferramentas
GitHub (repositório, Issues, PRs, Actions), GitHub Projects (Project #4), IntelliJ, `gh` para coletar métricas.

## 6. Quadro e políticas de coluna (novo)

| Coluna | Limite | Entra quando | Sai quando |
|---|---|---|---|
| Backlog | — | Issue criada e priorizada (P1, P2, P3) | Escolhida no planning |
| Sprint Backlog | 3 | Cartão pequeno (≤ 3 dias), com critérios de aceitação | Começo o trabalho nele |
| In Progress | **1** | Sprint Backlog abaixo do limite, campo "Início" preenchido, branch criada | PR aberto, CI verde, descrição do PR diz como testar |
| In Review | 1 | PR aberto para o cartão | Autorrevisão feita e PR integrado |
| Done | — | Atende a Definição de Pronto, campo "Fim" preenchido | — |

- **WIP de In Progress 1 (alterado):** com uma pessoa só, 2 itens em andamento já é troca de tarefa. Se eu precisar de mais, registro o motivo na retrospectiva.
- Cartão bloqueado recebe o label `blocked` e o motivo no comentário.
- O GitHub só mostra o limite, não o impõe. Quem impõe sou eu: com o limite atingido, termino antes de começar.

## 7. Métricas
- Contagem em **dias corridos**, sempre a mesma.
- **Lead time:** da data em que o item foi adicionado ao projeto até "Fim".
- **Cycle time:** do campo "Início" até "Fim".
- **Throughput:** cartões em Done por semana.
- **WIP:** cartões em In Progress mais In Review.
- **Idade do item:** dias desde "Início" para cartões abertos; acima de 3 dias, agir na hora.
- **CFD:** contagem diária de cartões por coluna, registrada em planilha.
- Verificação cruzada pelo repositório: `gh pr list --state all --json createdAt,mergedAt` e `gh issue list --state all --json createdAt,closedAt`.

## 8. Prática de XP (novo)
- **Integração contínua:** o CI roda em todo PR e branches são curtas (integradas em até 2 dias).
- **TDD:** em cartões de lógica, o commit do teste vem antes do commit da implementação.
