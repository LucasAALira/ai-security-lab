# Como adicionar conteúdo

Guia para quem vai escrever campanhas, missões, desafios de código, casos reais, projetos do modo Arquiteto e aulas. Tudo é conteúdo em TypeScript dentro de `src/data/`; a interface só desenha o que está lá, e o gabarito que o motor de progresso usa é extraído do próprio conteúdo (texto e correção não têm como divergir).

Regras que valem para tudo:

- **Dados sintéticos.** Domínios terminam em `.example`; IPs vêm das faixas de documentação (`192.0.2.x`, `198.51.100.x`, `203.0.113.x`). Empresas, pessoas e números das histórias são inventados. Há testes que recusam endereços fora disso.
- **Sem números inventados.** Estatísticas, versões, CVEs, vítimas e perdas só entram com fonte, e só nos dossiês de casos reais.
- **Frameworks verificados.** Toda referência `{ framework, id }` precisa existir em `src/data/frameworks.ts`, onde cada item foi conferido na fonte oficial. Para citar algo novo, confira na fonte e acrescente o item lá (com a data da revisão). ASVS, WSTG e MASTG não têm itens no registro: cite-os com `label` e `url`.
- **Glossário.** No texto, `{{id|rótulo}}` liga um termo ao glossário (`src/data/glossary.ts`). O id precisa existir.
- **Formato leve do texto.** `**negrito**` e `` `código` `` funcionam nos parágrafos.
- **Depois de mudar o conteúdo:** `npm test`, `npm run typecheck` e `npm run build` (a pasta `dist/` é versionada).

## Campanha

Uma campanha é uma história com seis missões numa empresa fictícia. Fica em `src/data/campaigns/cN/`.

1. Crie a pasta `cN/` com um arquivo por missão (`m1-....ts` a `m6-....ts`) e um `index.ts`:

   ```ts
   export const campaign8: CampaignContent = {
     id: 'id-da-campanha',          // minúsculas e hífens
     title: 'Título',
     company: 'Empresa Fictícia',
     tagline: 'Uma frase.',
     summary: 'O que a campanha ensina.',
     area: 'web',                   // web | api | ia | mobile | supply | arq | gov
     requires: [],                  // ids de campanhas recomendadas antes (só recomendam)
     missions: [m1, m2, m3, m4, m5, m6],
   }
   ```

2. Registre em `src/data/campaigns/index.ts` (`campaigns = [..., campaign8]`).
3. Se a campanha tiver uma conquista própria, acrescente-a a `CAMPAIGN_MEDALS` em `src/lib/progress/medals.ts`.

Os testes de `campaigns.test.ts` conferem a numeração, os ids, a ausência de ciclos em `requires` e tudo o que está abaixo.

## Missão

Cada missão (`MissionContent`, em `src/data/campaigns/types.ts`) tem doze partes obrigatórias: título, nível (`Básico`, `Intermediário`, `Avançado`), duração, pré-requisitos em linguagem simples, objetivo, contexto, critérios de avaliação, evidências, atividades, fechamento, revisão da solução (com risco residual e validação) e referências.

**Evidências** (`evidence`) são o que o aluno examina: código, tabela, texto ou diagrama com componentes clicáveis. `from` diz a partir de qual atividade ela aparece; `when` a mostra só em uma ramificação (marcas deixadas por decisões anteriores). Uma evidência nunca dá a resposta: `note` só orienta o olhar.

**Atividades** (`activities`): use pelo menos três formatos por missão. Toda atividade tem enunciado, três dicas (da mais leve à mais direta) e explicação.

| Formato | Para quê | Gabarito |
| --- | --- | --- |
| `decide` | Escolher um caminho com consequências | `quality` por opção (`best`, `good`, `partial`, `poor`), `feedback` e `consequence` específicos; `flags` deixam marcas para ramificações |
| `adr` | Decisão arquitetural registrada | Opções como em `decide`, mais `fields` (campos a escrever), `rubric` (autoavaliação) e `model` (resposta comentada). Não há correção por palavras-chave |
| `multi` | Marcar várias (`multi`), comparar (`compare`) ou inspecionar (`inspect`) | `correct`: índices certos |
| `order` | Pôr passos em ordem | `before: [a, b]`: o item `a` precisa vir antes do `b` (só as restrições que importam) |
| `assign` | Classificar (`classify`) ou relacionar (`match`) | `accept[i]`: lista das respostas aceitas para a linha `i` |
| `budget` | Escolher controles com orçamento | `critical`: índices de riscos que precisam ser cobertos; `mandatory`: índices de controles obrigatórios. Um controle que não cobre nada novo rebaixa a nota |
| `spot` | Usar um desafio de código dentro da missão | `challenge`: id do desafio; dicas e gabarito vêm dele |

**Ramificações e fechamento.** `closing` é uma lista de textos com `when` (marcas); aparece o primeiro cujas marcas estão todas presentes, então o texto sem `when` vai por último. `clean` define uma tentativa "limpa" (por exemplo, contenção sem destruir evidências) e libera a conquista `contencao-precisa`.

**Conquistas.** `medals` lista os ids mostrados no fim; todos precisam existir em `medalDefinitions`.

Os testes conferem que o melhor caminho conclui a missão, que as outras ramificações também têm saída, que toda marca usada existe em alguma decisão e que toda decisão tem uma opção melhor.

> Nos textos das missões, evite identificadores com ponto (`req.params.id`): o teste de dados sintéticos os confunde com endereços. Use pseudocódigo ou ponha o código numa evidência do tipo `code`.

## Desafio de código

Os desafios novos ficam em `src/data/challenge-packs/<tema>.ts` (`web`, `api`, `mobile`, `supply`, `general`), dentro de `defineChallenge({...})`. O gabarito é escrito no próprio código, com marcas no fim da linha:

| Marca | Significado |
| --- | --- |
| `⟦v⟧` | Linha da falha principal (todas precisam ser escolhidas) |
| `⟦a⟧` | Linha relacionada, aceita mas não obrigatória |
| `⟦x⟧` | Falha opcional, fora do enunciado (libera a conquista secreta) |
| `⟦n=texto⟧` | Linha parecida com a falha, mas que não é o problema; o texto explica por quê |

Campos de um desafio novo: `id`, `kind` (`vuln` ou `auth`; `auth` conta para a conquista de autorização), `submodule` (um submódulo do currículo da mesma área), `tags`, `level`, `title`, `scenario`, `purpose` (o que se aprende), `boundary` (a fronteira de confiança envolvida), `file`, `language`, `code`, `why`, `fixes` (cada alternativa com `feedback` dizendo por que serve ou não basta), `fix` (índice da correção), `fixedCode`, `validation` (como testar), `frameworks` e três `hints`. Os desafios de API também trazem o comportamento esperado, o vulnerável e o corrigido.

Os testes de `challenge-library.test.ts` conferem esses campos, que `fixedCode` difere do código vulnerável e que nenhum texto apresenta ofuscação, detecção de root ou fixação de certificado como solução universal.

## Caso real (dossiê)

Um dossiê (`DossierContent`) separa três camadas, rotuladas na interface: **fatos documentados** (com fonte), **análise educacional** (interpretação nossa) e uma **simulação fictícia** inspirada no caso.

1. Crie `src/data/campaigns/dossiers/<caso>.ts` e registre em `dossiers/index.ts`.
2. Preencha as datas do incidente, da divulgação e da revisão do dossiê.
3. `sources`: fontes primárias (avisos do mantenedor, da empresa ou de órgãos públicos) antes das secundárias, todas `https`. Cada fato do `summary` e cada linha de `timeline` cita o número da fonte.
4. `uncertainties`: o que as fontes não confirmam. Não preencha lacunas com suposições.
5. Só cite IA se o incidente envolveu IA; caso contrário, use `notice` para dizer isso.
6. `exercise` roda no mesmo motor das missões: pelo menos três formatos de atividade, empresa inventada, endereços `.example`.

## Projeto do modo Arquiteto

Os projetos ficam em `src/data/architect/<projeto>.ts` (tipos em `types.ts`) e são registrados em `src/data/architect/index.ts`.

Cada projeto tem requisitos funcionais e não funcionais, perfis de acesso, serviços externos, restrições, orçamento (`budget`) e complexidade máxima (`complexity`), componentes clicáveis com ameaças, fluxos de dados, controles, soluções comentadas e uma ADR com os sete campos (`ADR_FIELDS` em `adr.ts`).

- **Ameaças** de cada componente: `real` (se aplica) ou distrator, `critical` (precisa de controle), categorias STRIDE, explicação e referências. Ameaças reais não críticas podem ser aceitas como risco residual.
- **Controles**: componentes onde funcionam (`places`), ameaças que tratam (`mitigates`), se são `mandatory`, custo e complexidade, e o efeito nos critérios (segurança, privacidade, disponibilidade, experiência).
- Os testes exigem: toda ameaça crítica com ao menos um controle; ameaças críticas com mais de uma alternativa (há escolha de contexto); mais de uma solução defensável; aplicar tudo estoura o orçamento ou a complexidade; só os obrigatórios não bastam. O motor (`solveArchitect`) procura uma solução de menor custo para conferir que o projeto tem saída.

## Aula de submódulo

A hierarquia Área → Módulo → Submódulo fica em `src/data/curriculum/tree.ts`. As aulas ficam em `src/data/curriculum/lessons-<área>.ts` e são reunidas em `lessons.ts`.

```ts
'id-do-submodulo': {
  context: 'Situação curta que motiva a aula.',
  concept: ['Dois ou mais parágrafos.', '...'],
  deeper: ['Opcional: aprofundamento.'],
  example: { title, language, code: [...], caption },   // opcional
  validation: 'Como verificar que o controle funciona.',
  review: [{ front: 'Pergunta', back: 'Resposta' }],    // vira flashcard
  refs: [{ framework: 'owasp-top10', id: 'A01' }],
  links: [{ label: 'Fonte oficial', url: 'https://...' }],
},
```

Um submódulo sem aula nem desafio aparece como **planejado** e não entra em nenhuma porcentagem. O **integrador** de cada módulo (missão, desafio ou projeto do Arquiteto) fica em `src/data/curriculum/integrators.ts`; um teste confere que ele existe.
