# AI Security Lab

**Central de estudos de segurança de aplicações e de inteligência artificial para profissionais de AppSec, Security Champions e desenvolvedores.**

Um site de aprendizado em português que reúne aulas, missões investigativas, desafios de código, casos reais e revisões de arquitetura. A proposta é conectar os conceitos de segurança Web, de APIs, Mobile, de IA e da cadeia de suprimentos às decisões do dia a dia das empresas. Funciona inteiro no navegador, sem conta e sem servidor.

## O que há no site

| Parte | Conteúdo |
| --- | --- |
| **Áreas** (`#/areas`) | 7 áreas (Web, APIs, IA, Mobile, Cadeia de suprimentos, Arquitetura e Governança), 36 módulos e 167 submódulos. 158 submódulos têm aula própria (contexto, conceito, exemplo, validação, revisão e referências); os outros 9 usam os módulos clássicos da trilha. Cada módulo tem um integrador e um checkpoint. |
| **Campanhas** (`#/campanhas`) | 7 campanhas com 6 missões cada (42 missões), em empresas fictícias: evidências liberadas por etapas, decisões com consequências, ramificações, sete formatos de atividade e revisão da solução com risco residual. |
| **Casos reais** (`#/casos`) | 4 dossiês (XZ Utils, 3CX, SolarWinds Orion e ua-parser-js) que separam fatos com fonte, incertezas, análise educacional e uma simulação fictícia. |
| **Laboratório de código** (`#/desafios`) | 60 desafios: marcar as linhas vulneráveis, escolher a correção e ver o código corrigido e como validar. 44 são das áreas novas (Web, API, Mobile Android e iOS, cadeia de suprimentos e configuração). |
| **Modo Arquiteto** (`#/arquiteto`) | 3 projetos (loja Web com API, aplicativo com backend e conta multicanal com assistente): componentes clicáveis, ameaças STRIDE, controles com custo e complexidade, várias soluções defensáveis, avaliação por critérios e ADR com sete campos e autoavaliação. |
| **Cobertura** (`#/cobertura`) | Matriz que liga cada item dos frameworks (OWASP Top 10, API, Mobile, LLM, MASVS, MITRE ATLAS, CWE, SSDF, SLSA) ao conteúdo que o pratica. |
| **Explorar** (`#/explorar`) | Busca em aulas, missões, desafios, casos e projetos. |

## Temas de estudo

- OWASP Top 10 para aplicações com LLMs.
- Injeção de prompt e seus impactos.
- MITRE ATLAS.
- Red teaming em IA.
- NIST AI Risk Management Framework (AI RMF).
- ISO/IEC 42001.
- LGPD aplicada à inteligência artificial.
- Regulamento europeu de inteligência artificial (AI Act).
- Engenharia reversa para defensores (módulo 09, de [acesso antecipado](#acesso-antecipado-e-página-em-breve)).
- Segurança Web e de APIs: autenticação, autorização por objeto, injeções, SSRF, regras de negócio, OWASP Top 10 e API Security Top 10.
- Segurança Mobile (Android e iOS): armazenamento, links, WebViews, TLS, biometria e a divisão entre aplicativo e servidor, com OWASP Mobile Top 10 e MASVS.
- Cadeia de suprimentos de software: dependências, pipelines, segredos, SBOM, assinatura, proveniência e incidentes reais.
- Arquitetura de segurança: modelagem de ameaças, identidade, dados, decisões e ADR.
- Governança: SAMM, SSDF, requisitos, vulnerabilidades, fornecedores, evidências e privacidade.

As matérias possuem páginas internas: o conteúdo de estudo pode ser lido dentro do próprio site. Cada uma tem três leituras (Compreender, Conectar e Aplicar) com exemplos, tabelas e quadros "Em palavras simples", além de um **resumo em pontos-chave** e um **glossário**. Os módulos regulatórios trazem a data de revisão e avisam quando um prazo ou texto pode ter mudado.

## Funcionalidades

- **Trilhas de aprendizado:** objetivos, pré-requisitos educacionais e tarefas de estudo.
- **Trilha de módulos:** os módulos formam um caminho com etapas, **fogueiras** (pontos de conclusão e revisão) e um **chefe** por módulo. Módulos só abrem quando as fogueiras dos pré-requisitos estão acesas, e o próximo objetivo fica sempre visível.
- **Aulas interativas:** cada módulo tem abas *Conceito, Exemplo, Como corrigir, Revisar, Praticar* e *Quiz*, com o resumo primeiro e o texto completo em "Saiba mais".
- **Laboratório de código:** 60 desafios em que você marca as linhas vulneráveis e escolhe a correção, com dicas, explicação do erro e a opção de repetir.
- **Flashcards** com resposta que se revela, em cada módulo.
- **Conquistas:** 68 conquistas (inclui as 8 do sistema de aprendizado, as das campanhas e do modo Arquiteto, e uma secreta), com brasões em SVG, filtros, progresso real e detalhes. Veja [Aprendizado interativo e conquistas](#aprendizado-interativo-e-conquistas).
- **Em breve:** página com o que está por vir (Engenharia reversa e preparação para a CompTIA SecurityX, entre outros), sem datas inventadas. O módulo de Engenharia reversa já está disponível por **desbloqueio imediato de 5.000 moedas** ou de graça, concluindo os módulos recomendados.
- **XP e níveis:** pontos pelas atividades registradas e pelos exercícios. Repetir uma atividade nunca soma XP de novo.
- **Medalhas e conquistas:** quatro níveis (bronze, prata, ouro e dragão), por leitura, pesquisa, prática, questões, módulos, trilhas, laboratório, cenários, desafios, chefes, dias seguidos, revisões, missões, escudos e recompensas. Cada uma dá XP bônus uma única vez (10, 20, 40 e 100 XP) e as bloqueadas mostram quanto falta.
- **Evolução por trilha:** cada trilha (Fundamentos, Ataques e defesa, Governança e Regulação) mostra XP, módulos e tarefas concluídas, com medalha bronze a partir de 40%, prata a partir de 70% e ouro aos 100%.
- **Pontos de melhoria:** sugestões calculadas pelo progresso: questões ainda não acertadas, módulos quase concluídos, o próximo módulo com pré-requisitos em dia, o laboratório e os cenários pendentes.
- **Missões do dia, moedas, loja e revisão com vidas:** veja [Mecânicas de jogo](#mecânicas-de-jogo).
- **Quiz:** perguntas de múltipla escolha com correção e explicações.
- **Cenários de remediação:** situações fictícias organizadas por porte de empresa, com alternativas de solução e feedback.
- **Anotações e progresso:** armazenamento local no navegador.
- **Ferramentas e pentest de LLMs:** material textual com exemplos técnicos e situações do cotidiano.
- **Identidade de RPG gótico, "Biblioteca dos Condenados"**, com oito temas de cor (dois gratuitos e seis na loja), interface responsiva e respeito à preferência do sistema por menos movimento. Veja [Identidade visual](#identidade-visual-biblioteca-dos-condenados).

> Os cenários são exercícios educacionais de decisão. O projeto não provisiona máquinas virtuais nem executa ataques, ferramentas de pentest ou ambientes vulneráveis.

## Aprendizado interativo e conquistas

A direção visual é a de um RPG gótico (veja [Identidade visual](#identidade-visual-biblioteca-dos-condenados)), com medalhas em forma de brasão e identidade própria: nenhum nome, imagem, fonte, som ou arte de jogos ou da Steam foi copiado. Os ícones são SVG (Lucide e Game-icons.net, com crédito) e os estados nunca dependem só da cor.

**Onde fica cada coisa**

| Página | O que faz |
| --- | --- |
| **Trilha de módulos** (`#/trilha`) | Caminho dos nove módulos (o 09 é de acesso antecipado), com etapas, fogueiras e chefes. Etapas bloqueadas dizem o que falta. Dá para revisar aulas e repetir chefes. |
| **Em breve** (`#/em-breve`) | O que está por vir, por situação (acesso antecipado, em planejamento, ideia em avaliação), e o cartão de desbloqueio do módulo 09. |
| **Conquistas** (`#/conquistas`) | Resumo (desbloqueadas e progresso geral), filtros *Todas, Desbloqueadas, Pendentes e Secretas*, filtro por categoria, detalhes de cada conquista, atividade recente, som opcional e backup. |
| **Laboratório de código** (`#/desafios`) | Os desafios de identificar a falha e corrigir, com metas das conquistas à vista. |
| **Aula do módulo** (`#/modulo/N`) | Abas Conceito, Exemplo, Como corrigir, Revisar (flashcards), Praticar e Quiz. |

**As oito conquistas iniciais**

| Conquista | Regra (conta atividades distintas) |
| --- | --- |
| Primeira Chama | Concluir a primeira aula: as três etapas (Conceito, Exemplo, Como corrigir) de um módulo. |
| Explorador de Falhas | Identificar as linhas vulneráveis em 5 desafios de código diferentes. |
| Guardião das APIs | Concluir 5 desafios de autorização diferentes (identificar e corrigir). |
| Código Protegido | Escolher a correção certa em 3 desafios diferentes. |
| Sem Ajuda | Concluir um desafio sem usar dicas **naquela tentativa**. |
| Persistência | Estudar 7 dias seguidos (dias reais, no fuso do navegador; escudos da loja não contam). |
| Mestre do Módulo | Concluir as aulas e o desafio final (o chefe) de um módulo. |
| Além do Óbvio | **Secreta.** Achar a falha opcional de um laboratório. Nome e descrição só aparecem depois de desbloqueada. |

**Progressão**

- XP total: 8.452, sendo 6.742 em atividades (módulos, laboratório, cenários, desafios de código, chefes, missões, dossiês, aulas e projetos do Arquiteto) e 1.710 em conquistas. Níveis de *Iniciante* (0) a *Lenda do AppSec* (2.400).
- Desafio de código: 15 XP ao identificar e 15 ao corrigir, só na primeira vez. Chefe: 60 XP, só na primeira vitória.
- Errar dá explicação e nova tentativa; nunca apaga XP, conquistas nem bloqueia as explicações.
- Conquistas são concedidas uma única vez e registram a data. Não há estatística de raridade nem comparação com outras pessoas.

**Acessibilidade:** tudo funciona pelo teclado, com foco visível; botões de ícone têm nome acessível; estados aparecem também em texto; animações respeitam "reduzir movimento"; o aviso de conquista é discreto (não tira o foco) e o som é opcional, desligado por padrão e com chave para desativar.

Regras, dados salvos e como acrescentar conquistas ou desafios: [docs/APRENDIZADO-E-CONQUISTAS.md](docs/APRENDIZADO-E-CONQUISTAS.md).

## Identidade visual: Biblioteca dos Condenados

Um santuário de conhecimento dentro de uma fortaleza em ruínas: pedra escura, metal envelhecido, luz de vela, selos e vitrais, com um toque de tecnologia (a rosácea do vitral é um circuito). A atmosfera é inspirada em RPGs góticos, mas toda a arte é original, feita em CSS e SVG; nenhum personagem, logotipo, trilha sonora ou asset de franquias foi usado.

| Elemento | Como funciona |
| --- | --- |
| **Início (Santuário do Conhecimento)** | Primeiro a missão atual, com uma ação principal ("Continuar jornada"; "Começar jornada" para quem acabou de chegar). Duração e recompensa só aparecem quando vêm do conteúdo. Depois: áreas (Arquivos), contratos do dia e progresso com a última conquista. No celular, a cena encolhe para a ação aparecer na primeira tela. |
| **Navegação** | Nomes temáticos com a função escrita ao lado: Jornada (continuar os estudos), Arquivos (áreas e aulas), Contratos (missões do dia), Provações (desafios de código), Relicário (conquistas), Mercador (loja). As rotas e os links antigos não mudaram. |
| **Componentes** | Botões retangulares com borda dupla; a ação principal é uma placa de metal; seleção com luz âmbar e estado em ARIA; painéis de grimório; bloqueios com selo de cera e o requisito escrito; medidores de XP com o valor sempre visível; conquistas como medalhões em nichos, com a raridade no desenho, no símbolo e no nome. |
| **Animações** | Tela de carregamento com o brasão (menos de meio segundo, sem bloquear cliques), entrada de página, brasas ao receber XP, medalhão revelado ao desbloquear e a faixa "Provação superada" na primeira vitória. Nada repete conquistas antigas, nada toca som sozinho e tudo some com "reduzir movimento". |
| **Fontes** | Cinzel nos títulos, Grenze Gotisch só na marca e em inscrições curtas, Literata no texto e nos controles, JetBrains Mono no código. Empacotadas para uso offline. |
| **Temas** | O novo tema padrão é gratuito. Temas comprados continuam seus; quem escolheu um tema continua com ele. Só quem nunca escolheu (e usava o padrão antigo) passa ao novo padrão, e o Dragão continua gratuito na loja. |

Tokens, componentes e regras de uso: [docs/IDENTIDADE-VISUAL.md](docs/IDENTIDADE-VISUAL.md).

## Mecânicas de jogo

Inspiradas em apps de aprendizado como o Duolingo e em Habitica, mas escritas do zero (nenhum código nem arte foi copiado). Tudo funciona no navegador, sem conta e sem servidor.

| Mecânica | Como funciona |
| --- | --- |
| **Moedas** | 1 moeda a cada 5 XP, mais as das missões, do baú e das revisões. Gastar moedas nunca reduz XP, nível ou medalhas. |
| **Missões do dia** | 3 missões por dia, sorteadas entre 7 tipos (só as que ainda são possíveis). Cada uma rende 5 a 8 moedas; cumprir as três abre um baú de 15 moedas. |
| **Revisão com vidas** | Sessão de até 5 questões que você já acertou, com 3 vidas. Erro custa uma vida e a questão volta para o fim da fila. Terminar com vidas conta como dia de estudo e rende moedas (nas 3 primeiras sessões do dia). |
| **Escudo de sequência** | 20 moedas, no máximo 2. Cobre um dia sem estudo e mantém a sequência. |
| **Temas** | Biblioteca dos Condenados (padrão) e Dragão são gratuitos; Ciano e Arcano custam 40 moedas, e os da sala de troféus de 60 a 100. |
| **Recompensas pessoais** | Prêmios que você cria (um café, uma pausa) e resgata com moedas. O resgate é por conta e confiança. |

Ligas e placares ficaram de fora: exigiriam contas e um servidor.

## Acesso antecipado e página Em breve

A página **Em breve** (`#/em-breve`) mostra o que está por vir em três situações: *acesso antecipado* (já está no site), *em planejamento* e *ideia em avaliação*. Ela não promete datas, não mostra porcentagem de andamento e não inventa números de usuários. Hoje lista a **Engenharia reversa para defensores** (já disponível em acesso antecipado), a **preparação para a CompTIA SecurityX** (exame CAS-005; conteúdo independente, sem vínculo com a CompTIA), a segurança de agentes e servidores MCP e a resposta a incidentes com IA.

O **módulo 09, Engenharia reversa para defensores**, abre de duas formas:

| Caminho | Como funciona |
| --- | --- |
| **Desbloqueio imediato** | **5.000 moedas**, com confirmação antes de gastar. As moedas gastas não voltam, mas XP, nível e medalhas nunca diminuem. Quem não tem saldo vê quanto falta e como ganhar moedas. |
| **Liberação gratuita** | Acender a fogueira dos módulos 01 (OWASP Top 10) e 04 (Red teaming). Quem já abriu o módulo assim não paga nada. |

Enquanto está fechado, o módulo mostra só uma prévia dos assuntos. Depois de aberto, ele tem as mesmas partes dos demais: aulas em abas, flashcards, três desafios de código, chefe e matéria completa. Estudá-lo rende XP e uma medalha própria, mas **não conta** para as conquistas que exigem terminar os oito módulos principais. Quem tem progresso salvo antes dessa versão não perde nada: o módulo 09 entra vazio.

O conteúdo é defensivo: laboratório isolado, autorização, análise de aplicativos e de arquivos de modelo que você tem direito de examinar, e como corrigir o que se encontra. Não traz instruções para violar proteções de software de terceiros.

## Executar localmente

### Requisito

Python **3.8 ou superior**. Não é necessário instalar pacotes adicionais nem ter Node.js: a pasta `dist/` já traz o site gerado.

Baixe o pacote, extraia todos os arquivos e abra um terminal na pasta que contém `iniciar.py`.

### Windows

```powershell
.\iniciar-windows.bat
```

Ou diretamente com Python:

```powershell
py -3 iniciar.py
```

### Linux e macOS

```bash
sh iniciar-linux-mac.sh
```

Ou:

```bash
python3 iniciar.py
```

O navegador abrirá em **http://localhost:8080**. Mantenha o terminal aberto enquanto utiliza o site. Para encerrar, pressione **Ctrl+C**.

> Abrir `dist/index.html` com dois cliques (endereço `file://`) não funciona: os navegadores bloqueiam módulos JavaScript fora de um servidor. Use o iniciador.

### Opções

```bash
python3 iniciar.py --porta 8081        # se a porta estiver ocupada
python3 iniciar.py --sem-navegador     # não abre o navegador sozinho
```

No Windows, substitua `python3` por `py -3`. O servidor escuta apenas em `127.0.0.1`. Depois de instalar Python e baixar os arquivos, tudo funciona sem internet (a fonte e o motor das animações vão junto do site).

## Desenvolvimento

Requer **Node.js 20.19+ ou 22.12+**.

```bash
npm install        # dependências
npm run dev        # servidor de desenvolvimento com recarga (http://localhost:5173)
npm test           # testes (Vitest): regras de progresso, conquistas, trilha, desafios, componentes e conteúdo
npm run typecheck  # verificação de tipos
npm run build      # verifica os tipos e gera o site em dist/
```

A pasta `dist/` é versionada de propósito, para que `iniciar.py` funcione sem Node. **Depois de alterar o código-fonte, rode `npm run build` e inclua `dist/` no commit.**

### Pilha

| Peça | Uso |
| --- | --- |
| React 19 + TypeScript + Vite | Aplicação. As rotas usam hash (`#/materias/...`), então o site abre de qualquer pasta ou servidor estático. |
| Tailwind CSS v4 | Estilos e tokens de tema. |
| [shadcn/ui](https://ui.shadcn.com) | Componentes de interface (em `src/components/ui`, copiados e ajustados ao tema, sobre o Radix UI). |
| [daisyUI](https://daisyui.com) | Temas de cor (Biblioteca dos Condenados, Dragão e os da loja) e componentes de estatísticas e progresso radial. As cores do shadcn derivam do mesmo tema. |
| [Motion](https://motion.dev) | Animações de entrada, de medalhas, de moedas e de vidas. Respeita "reduzir movimento". |
| [Rive](https://rive.app) | Dois espaços para animações `.riv` (topo da página inicial e fim da revisão). Sem arquivo, aparece a ilustração padrão. Veja `src/assets/rive/LEIA-ME.md`. |
| [React Bits](https://reactbits.dev) | Dois componentes em `src/components/reactbits`: contador animado e cartão com destaque. |
| [Fontsource](https://fontsource.org) | Cinzel, Literata, Grenze Gotisch e JetBrains Mono empacotadas com o site (SIL OFL 1.1), só os subconjuntos latinos. |

### Estrutura

| Pasta ou arquivo | Finalidade |
| --- | --- |
| `iniciar.py`, `iniciar-*.sh/.bat` | Servidor local da pasta `dist/` e abertura do navegador. |
| `dist/` | Site gerado, pronto para servir. |
| `src/lib/progress/` | Regras do jogo em TypeScript puro: XP, medalhas, sequência, missões, moedas, revisão e a função única `applyAction`. |
| `src/data/` | Conteúdo: módulos, matérias, cenários e pentest; `curriculum/` (áreas, módulos, submódulos, aulas e integradores), `campaigns/` (campanhas, missões e dossiês), `challenge-packs/` (desafios novos), `architect/` (projetos do modo Arquiteto), `frameworks.ts` (registro verificado) e `glossary.ts`. |
| `src/components/`, `src/pages/` | Interface. `gothic/` (selos, brasões de área, medidor, cena do Santuário, tela de carregamento e faixa de vitória), `gamification/` (brasões, conquistas, XP), `trail/` (trilha, fogueira, chefe), `challenge/` (laboratório de código), `study/` (quiz e flashcards), `lesson/` (aulas em abas). |
| `src/state/` | Armazenamento local e ligação do progresso com o React. |
| `public/materias/` | Páginas de redirecionamento: endereços antigos (`materias/x.html`) levam à matéria nova. |
| `design/` | Arte original da marca, fora do site. |
| `src/styles/` | `gothic.css` (tokens e componentes visuais) e `fonts.css` (fontes empacotadas). |
| `docs/` | Notas de projeto, como [adicionar conteúdo](docs/COMO-ADICIONAR-CONTEUDO.md), a [identidade visual](docs/IDENTIDADE-VISUAL.md) e as [referências](docs/REFERENCIAS.md). |

## Como adicionar conteúdo

O passo a passo está em [docs/COMO-ADICIONAR-CONTEUDO.md](docs/COMO-ADICIONAR-CONTEUDO.md). Em resumo:

- **Campanha:** uma pasta `src/data/campaigns/cN/` com seis missões e um `index.ts`, registrada em `src/data/campaigns/index.ts`.
- **Missão:** um `MissionContent` com as doze partes obrigatórias e pelo menos três formatos de atividade (`decide`, `adr`, `multi`, `order`, `assign`, `budget`, `spot`).
- **Formato de desafio:** um `defineChallenge` em `src/data/challenge-packs/<tema>.ts`, com o gabarito escrito no código pelas marcas `⟦v⟧`, `⟦a⟧`, `⟦x⟧` e `⟦n=...⟧`.
- **Como adicionar um caso real:** um `DossierContent` em `src/data/campaigns/dossiers/`, com fontes primárias, datas, incertezas e uma simulação fictícia.
- **Projeto do modo Arquiteto:** um arquivo em `src/data/architect/` com componentes, ameaças, controles, orçamento e ADR.

Os testes conferem a estrutura, os dados sintéticos, as referências a frameworks e se cada missão e projeto tem uma solução possível.

## Progresso e privacidade

O progresso fica no `localStorage` do navegador. Não há conta de usuário, banco de dados remoto ou sincronização entre dispositivos.

- Use o mesmo navegador, endereço e porta para continuar de onde parou.
- Limpar os dados do site no navegador pode apagar o progresso.
- Alterar entre `localhost` e `127.0.0.1`, ou mudar a porta, utiliza outro armazenamento do navegador.
- O XP reflete atividades registradas na interface; não comprova domínio técnico nem valida pesquisas externas.
- O progresso salvo por versões anteriores continua válido: as medalhas já merecidas são reconhecidas ao abrir o site, e os endereços antigos (`?modulo=2`, `#trilhas`, `materias/x.html`) continuam levando ao lugar certo.
- O XP é calculado a partir do progresso salvo, sem contar duas vezes: repetir uma missão, um desafio ou um projeto não soma XP de novo. O XP máximo é 8.452: 6.742 em atividades e 1.710 em conquistas.
- O progresso das áreas e dos módulos conta só o que é obrigatório (aula lida e desafios aprovados). Submódulos planejados não entram em nenhuma porcentagem, e um módulo sem conteúdo nunca aparece como concluído.
- **Backup:** na página Conquistas, *Exportar progresso* baixa um arquivo JSON e *Importar progresso* o restaura (pede confirmação, porque substitui o progresso atual). É o jeito de levar o progresso a outro navegador ou aparelho.
- **Fuso horário:** os dias de estudo e a sequência usam o fuso do navegador. Viajar ou mudar o fuso do sistema pode mover o limite do dia.
- O progresso, o XP e as conquistas ficam no navegador e podem ser editados por quem tem acesso a ele: servem ao seu acompanhamento, não como prova de aprendizado. Pesquisa e prática são autodeclaradas.

## Uso educacional

A seção de pentest exige digitar **"me responsabilizo"** antes de exibir o material. Essa confirmação é apenas uma etapa da interface, não um mecanismo de autenticação ou proteção dos arquivos.

Os exemplos destinam-se ao estudo defensivo e à discussão de mitigação. Qualquer aplicação prática de técnicas deve ocorrer em sistemas próprios ou com autorização explícita e escopo definido.

Os resumos sobre normas, leis e frameworks são materiais de apoio, não substituem os documentos oficiais nem constituem certificação ou parecer jurídico.

## Contribuições

Sugestões de melhoria, correções de conteúdo e novos cenários educacionais são bem-vindos por issues e pull requests.

Ao propor uma alteração, descreva o problema, a solução e como verificar o resultado. Use dados fictícios nos exemplos e não inclua credenciais, dados pessoais ou informações internas de empresas.

## Créditos e licenças

- **Bibliotecas:** shadcn/ui, daisyUI, Motion, Rive, Tailwind CSS, Radix UI, Lucide, Sonner e React Router são MIT/ISC; as fontes Cinzel, Literata, Grenze Gotisch e JetBrains Mono são SIL OFL 1.1. A página **Referências** do site lista cada uma com a licença.
- **React Bits** usa MIT + Commons Clause. Os dois componentes copiados estão dentro do app, o que a licença permite; ela **não** permite revender nem redistribuir os componentes isoladamente. O aviso completo está em `src/components/reactbits/LICENSE.md`.
- **Projetos de estudo:** [Lingo — Duolingo Clone](https://github.com/sanidhyy/duolingo-clone) (MIT), [Duolingo Next.js](https://github.com/RikhiSingh/Duolingo-Clone) (MIT) e [Habitica](https://github.com/HabitRPG/habitica) (código GPL v3, arte CC BY-NC-SA 3.0) serviram só de inspiração para as ideias de jogo; nenhum código ou imagem foi copiado, e as mecânicas foram reescritas.
- **Frameworks citados:** as edições e os itens estão em `src/data/frameworks.ts`, cada um com o endereço oficial e a data da conferência. O MITRE ATLAS foi conferido na versão 2026.09 (dados publicados em [mitre-atlas/atlas-data](https://github.com/mitre-atlas/atlas-data)).
- OWASP, MITRE ATLAS, NIST, ISO/IEC e Kali Linux são referências ou marcas de seus respectivos responsáveis. Este é um projeto educacional independente, sem indicação de afiliação ou endosso dessas organizações.

## Sala de troféus e relíquias

Acesse `#/sala-de-trofeus` pelo menu Jogo ou pela loja.
- Oito relíquias cosméticas, com compra única, história e prévia. Não concedem XP.
- Seis nichos para expor relíquias compradas e medalhas conquistadas; retirar uma peça não a remove da coleção.
- Salão de Pedra incluído; Galeria das Brasas (50 moedas) e Observatório Lunar (70 moedas).
- Quatro temas adicionais: Fortaleza de Cinzas (60), Catedral do Eclipse (80), Arquivo Abissal (80) e Santuário Arcano (100).
- Uma troca de missão pendente por dia, por 10 moedas. Só troca se houver alternativa possível de recompensa equivalente; sem alternativa, não há cobrança. Missões concluídas não podem ser trocadas.
- Compras e exposição fazem parte do progresso e do backup. Estados anteriores recebem os campos novos vazios, sem perder o conteúdo existente.
- As figuras usam símbolos de Lorc e Delapouite, Game-icons.net, CC BY 3.0; detalhes em `public/assets/relics/CREDITS.md` e na página Referências. Molduras, sala, nomes e histórias são originais.

O progresso de localhost não aparece automaticamente em outro endereço. Exporte em Conquistas e importe no novo endereço para transferi-lo.
