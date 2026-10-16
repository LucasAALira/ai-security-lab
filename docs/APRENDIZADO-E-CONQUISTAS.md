# Aprendizado interativo e conquistas

Notas técnicas do sistema de aprendizado, trilha e conquistas. Para o uso, veja o [README](../README.md).

## Decisões de interpretação

O pedido original deixou alguns termos abertos. Estas são as leituras adotadas (todas cobertas por testes):

- **Aula** = as três etapas *Conceito, Exemplo e Como corrigir* de um módulo (as três leituras que já existiam). **Primeira Chama** exige as três.
- **Explorador de Falhas** conta desafios de código em que a **identificação** das linhas vulneráveis foi acertada (5 desafios distintos). Corrigir não é necessário.
- **Guardião das APIs** conta desafios de **autorização** concluídos por inteiro (identificar e corrigir), 5 distintos.
- **Código Protegido** conta desafios distintos em que a correção certa foi escolhida (3).
- **Sem Ajuda:** uma tentativa sem nenhuma dica. A dica fica registrada na tentativa em andamento; "Repetir desafio" abre uma tentativa nova, sem dicas.
- **Persistência:** 7 dias reais de estudo seguidos, no fuso do navegador. A sequência da loja (com escudos) continua existindo, mas **não** conta aqui.
- **Mestre do Módulo:** aulas concluídas e o **chefe** do módulo derrotado. O chefe só abre com a fogueira acesa (módulo concluído).
- **Além do Óbvio (secreta):** marcar, junto das linhas pedidas, a falha opcional prevista em um desafio. Hoje isso existe em um desafio (`chave-no-navegador`); um teste garante que as oito conquistas são alcançáveis com o conteúdo atual.

## Modelo de dados

Uma única chave do `localStorage` (`ai-security-study-v2`, a mesma das versões anteriores) guarda o estado versão 3, definido em `src/lib/progress/types.ts`:

| Campo | Conteúdo |
| --- | --- |
| `learner` | Identificador local do aluno e data da primeira ação. Não sai do navegador. |
| `modules` | Por módulo: leituras, pesquisa, prática, questões, erros, notas. |
| `challenges` | Por desafio: fases já feitas, `helpless`, `extra`, tentativas, erros, dicas, dia da conclusão e a **tentativa em andamento** (`run`). |
| `bosses`, `fires` | Cenários do chefe, erros, vitórias, perfeição; dia em que cada fogueira foi acesa. |
| `cards` | Flashcards marcados como sabidos. |
| `study` | Dias reais de estudo: último dia, sequência atual e melhor. |
| `events` | Histórico dos 300 eventos mais recentes (aula, desafio, dica, chefe, conquista...). |
| `badges` | Conquista -> dia em que foi obtida. Cada uma é concedida uma única vez. |
| `prefs` | Som de conquista (desligado por padrão). |
| `streak`, `coins`, `shop`, `daily`, `quests`, `lifetime`, `bestDayXp` | Mecânicas de jogo que já existiam, preservadas. |

`cleanState` lê qualquer versão anterior (v1, v2), migra e **sanea** tudo: tipos, tamanhos e limites. O progresso e as conquistas de quem já usava o site são mantidos. Quem já tinha começado um módulo continua com acesso a ele, mesmo que os pré-requisitos novos não estejam cumpridos.

## Regras centralizadas

Todo o jogo está em TypeScript puro, em `src/lib/progress/`, sem React:

- `constants.ts`: XP, níveis, limites, dicas por fase, `STUDY_GOAL`.
- `actions.ts`: `applyAction(estado, ação, contexto, agora)`, o **único ponto** que muda o progresso. Devolve o novo estado, os eventos para a interface e, se for o caso, o motivo da recusa. Registra os eventos, concede conquistas uma vez e repete o ciclo "conquista -> XP -> missão -> conquista" até estabilizar.
- `challenges.ts`: correção (`gradeLines`, `gradeFix`, `gradeBoss`) e consultas. A interface usa as mesmas funções do motor, então o feedback e o resultado nunca divergem.
- `trail.ts`: etapas, fogueiras, chefes, pré-requisitos e o **próximo objetivo**.
- `medals.ts`: definição de cada conquista (id estável, nome, descrição, ícone, categoria, nível, condição e meta), estatísticas e progresso real.
- `streak.ts`: sequência da loja e dias reais de estudo (`dayKey` usa o fuso local).
- `backup.ts`: exportação e importação.

A interface só lê estes resultados (`useProgress()`), sem regra própria.

### Trilha e pré-requisitos

| Módulo | Requer (fogueira acesa) |
| --- | --- |
| 01 OWASP Top 10 para LLM | nenhum |
| 02 Injeção de prompt | 01 |
| 03 MITRE ATLAS | 01, 02 |
| 04 Red teaming em IA | 02, 03 |
| 05 NIST AI RMF | nenhum |
| 06 ISO/IEC 42001 | 05 |
| 07 LGPD aplicada à IA | nenhum |
| 08 EU AI Act | 05 |

Etapas, desafios e chefe de um módulo bloqueado ficam indisponíveis para pontuar. As **explicações, matérias e flashcards nunca são bloqueados.**

## Como acrescentar

- **Conquista:** inclua um item em `medalDefinitions` (`src/lib/progress/medals.ts`) com `id` estável, `category`, `tier`, `icon` (um dos ícones de `medal-icons.ts`) e `goal`. Se precisar de um contador novo, acrescente-o em `ProgressStats`. Para torná-la secreta, use `secret: true` e `hint`.
- **Desafio de código:** inclua em `src/data/challenges.ts`. O gabarito vai nas marcas no fim da linha (`⟦v⟧` falha principal, `⟦a⟧` também aceita, `⟦x⟧` falha opcional, `⟦n=texto⟧` linha parecida que não é o problema); nenhum número de linha é contado à mão. Nunca renomeie o `id` de um desafio publicado. O teste de conteúdo valida a forma e as respostas.
- **Flashcards e chefes:** `src/data/flashcards.ts` e `src/data/bosses.ts` (o id `m{módulo}-c{n}` dos cartões é salvo no progresso).

## Testes

`npm test` roda as regras (progresso, trilha, desafios, conquistas, migração, backup, fuso e sequência), a validação de todo o conteúdo e os componentes (quiz, flashcard, galeria de conquistas, desafio de código e avisos). Além disso, os fluxos foram percorridos em um navegador real (desktop e 390 px, teclado, movimento reduzido) com verificação de acessibilidade (axe).

## Limitações reais

- **Só local:** o progresso fica no `localStorage`. **Não há sincronização entre dispositivos**; use exportar e importar. Limpar os dados do site apaga o progresso (exporte antes).
- **Sem servidor, sem confiança:** como tudo roda no navegador, quem usa pode editar o progresso e ver as respostas no código. O XP e as conquistas servem ao acompanhamento pessoal, não à certificação.
- **Pesquisa e prática são autodeclaradas:** o site confere o tamanho do texto, não a qualidade.
- **Fuso do navegador:** os dias de estudo seguem o fuso do navegador; mudá-lo pode mover o limite do dia.
- **Histórico curto:** só os 300 eventos mais recentes ficam guardados (o progresso em si não depende deles).
- **Sem raridade:** não há porcentagem de quem tem cada conquista, porque não há onde comparar.
- **Som:** é gerado pelo navegador (Web Audio), pode ser bloqueado até haver uma interação com a página e fica desligado por padrão.
- **Conteúdo:** há uma falha opcional (conquista secreta) em um desafio; novos desafios podem acrescentar outras.
