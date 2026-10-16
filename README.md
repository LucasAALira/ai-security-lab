# AI Security Lab

**Central de estudos sobre segurança de inteligência artificial para profissionais de AppSec, Security Champions e desenvolvedores.**

Um site de aprendizado em português que reúne matérias, tarefas, perguntas de múltipla escolha e cenários de correção de vulnerabilidades. A proposta é conectar conceitos de segurança de IA com decisões do dia a dia das empresas.

## Temas de estudo

- OWASP Top 10 para aplicações com LLMs.
- Injeção de prompt e seus impactos.
- MITRE ATLAS.
- Red teaming em IA.
- NIST AI Risk Management Framework (AI RMF).
- ISO/IEC 42001.
- LGPD aplicada à inteligência artificial.
- Regulamento europeu de inteligência artificial (AI Act).

As matérias possuem páginas internas: o conteúdo de estudo pode ser lido dentro do próprio site.

## Funcionalidades

- **Trilhas de aprendizado:** objetivos, pré-requisitos educacionais e tarefas de estudo.
- **Trilha de módulos:** os módulos formam um caminho com etapas, **fogueiras** (pontos de conclusão e revisão) e um **chefe** por módulo. Módulos só abrem quando as fogueiras dos pré-requisitos estão acesas, e o próximo objetivo fica sempre visível.
- **Aulas interativas:** cada módulo tem abas *Conceito, Exemplo, Como corrigir, Revisar, Praticar* e *Quiz*, com o resumo primeiro e o texto completo em "Saiba mais".
- **Laboratório de código:** 13 desafios em que você marca as linhas vulneráveis e escolhe a correção, com dicas, explicação do erro e a opção de repetir.
- **Flashcards** com resposta que se revela, em cada módulo.
- **Conquistas:** 42 conquistas (inclui as 8 do sistema de aprendizado e uma secreta), com brasões em SVG, filtros, progresso real e detalhes. Veja [Aprendizado interativo e conquistas](#aprendizado-interativo-e-conquistas).
- **XP e níveis:** pontos pelas atividades registradas e pelos exercícios. Repetir uma atividade nunca soma XP de novo.
- **Medalhas e conquistas:** quatro níveis (bronze, prata, ouro e dragão), por leitura, pesquisa, prática, questões, módulos, trilhas, laboratório, cenários, desafios, chefes, dias seguidos, revisões, missões, escudos e recompensas. Cada uma dá XP bônus uma única vez (10, 20, 40 e 100 XP) e as bloqueadas mostram quanto falta.
- **Evolução por trilha:** cada trilha (Fundamentos, Ataques e defesa, Governança e Regulação) mostra XP, módulos e tarefas concluídas, com medalha bronze a partir de 40%, prata a partir de 70% e ouro aos 100%.
- **Pontos de melhoria:** sugestões calculadas pelo progresso: questões ainda não acertadas, módulos quase concluídos, o próximo módulo com pré-requisitos em dia, o laboratório e os cenários pendentes.
- **Missões do dia, moedas, loja e revisão com vidas:** veja [Mecânicas de jogo](#mecânicas-de-jogo).
- **Quiz:** perguntas de múltipla escolha com correção e explicações.
- **Cenários de remediação:** situações fictícias organizadas por porte de empresa, com alternativas de solução e feedback.
- **Anotações e progresso:** armazenamento local no navegador.
- **Ferramentas e pentest de LLMs:** material textual com exemplos técnicos e situações do cotidiano.
- **Três temas de cor** (Dragão, Ciano e Arcano) e interface responsiva, com respeito à preferência do sistema por menos movimento.

> Os cenários são exercícios educacionais de decisão. O projeto não provisiona máquinas virtuais nem executa ataques, ferramentas de pentest ou ambientes vulneráveis.

## Aprendizado interativo e conquistas

A direção visual é escura, com detalhes em vermelho e medalhas em forma de brasão, e identidade própria: nenhum nome, imagem ou arte de jogos ou da Steam foi copiado. Os ícones são SVG (Lucide) e os estados nunca dependem só da cor.

**Onde fica cada coisa**

| Página | O que faz |
| --- | --- |
| **Trilha de módulos** (`#/trilha`) | Caminho dos oito módulos, com etapas, fogueiras e chefes. Etapas bloqueadas dizem o que falta. Dá para revisar aulas e repetir chefes. |
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

- XP total: 2.860, sendo 1.940 em tarefas (módulos 800, laboratório 30, cenários 240, desafios de código 390 e chefes 480) e 920 em conquistas. Níveis de *Iniciante* (0) a *Lenda do AppSec* (2.400).
- Desafio de código: 15 XP ao identificar e 15 ao corrigir, só na primeira vez. Chefe: 60 XP, só na primeira vitória.
- Errar dá explicação e nova tentativa; nunca apaga XP, conquistas nem bloqueia as explicações.
- Conquistas são concedidas uma única vez e registram a data. Não há estatística de raridade nem comparação com outras pessoas.

**Acessibilidade:** tudo funciona pelo teclado, com foco visível; botões de ícone têm nome acessível; estados aparecem também em texto; animações respeitam "reduzir movimento"; o aviso de conquista é discreto (não tira o foco) e o som é opcional, desligado por padrão e com chave para desativar.

Regras, dados salvos e como acrescentar conquistas ou desafios: [docs/APRENDIZADO-E-CONQUISTAS.md](docs/APRENDIZADO-E-CONQUISTAS.md).

## Mecânicas de jogo

Inspiradas em apps de aprendizado como o Duolingo e em Habitica, mas escritas do zero (nenhum código nem arte foi copiado). Tudo funciona no navegador, sem conta e sem servidor.

| Mecânica | Como funciona |
| --- | --- |
| **Moedas** | 1 moeda a cada 5 XP, mais as das missões, do baú e das revisões. Gastar moedas nunca reduz XP, nível ou medalhas. |
| **Missões do dia** | 3 missões por dia, sorteadas entre 7 tipos (só as que ainda são possíveis). Cada uma rende 5 a 8 moedas; cumprir as três abre um baú de 15 moedas. |
| **Revisão com vidas** | Sessão de até 5 questões que você já acertou, com 3 vidas. Erro custa uma vida e a questão volta para o fim da fila. Terminar com vidas conta como dia de estudo e rende moedas (nas 3 primeiras sessões do dia). |
| **Escudo de sequência** | 20 moedas, no máximo 2. Cobre um dia sem estudo e mantém a sequência. |
| **Temas** | Ciano e Arcano, 40 moedas cada. |
| **Recompensas pessoais** | Prêmios que você cria (um café, uma pausa) e resgata com moedas. O resgate é por conta e confiança. |

Ligas e placares ficaram de fora: exigiriam contas e um servidor.

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
| [daisyUI](https://daisyui.com) | Temas de cor (Dragão, Ciano, Arcano) e componentes de estatísticas e progresso radial. As cores do shadcn derivam do mesmo tema. |
| [Motion](https://motion.dev) | Animações de entrada, de medalhas, de moedas e de vidas. Respeita "reduzir movimento". |
| [Rive](https://rive.app) | Dois espaços para animações `.riv` (topo da página inicial e fim da revisão). Sem arquivo, aparece a ilustração padrão. Veja `src/assets/rive/LEIA-ME.md`. |
| [React Bits](https://reactbits.dev) | Quatro componentes em `src/components/reactbits`: texto decifrando, contador animado, brilho em texto e cartão com destaque. |

### Estrutura

| Pasta ou arquivo | Finalidade |
| --- | --- |
| `iniciar.py`, `iniciar-*.sh/.bat` | Servidor local da pasta `dist/` e abertura do navegador. |
| `dist/` | Site gerado, pronto para servir. |
| `src/lib/progress/` | Regras do jogo em TypeScript puro: XP, medalhas, sequência, missões, moedas, revisão e a função única `applyAction`. |
| `src/data/` | Conteúdo: módulos, matérias, cenários de correção e material de pentest. |
| `src/components/`, `src/pages/` | Interface. `gamification/` (brasões, conquistas, XP), `trail/` (trilha, fogueira, chefe), `challenge/` (laboratório de código), `study/` (quiz e flashcards), `lesson/` (aulas em abas). |
| `src/state/` | Armazenamento local e ligação do progresso com o React. |
| `public/materias/` | Páginas de redirecionamento: endereços antigos (`materias/x.html`) levam à matéria nova. |
| `design/` | Arte original da marca, fora do site. |
| `docs/` | Notas de projeto. |

## Progresso e privacidade

O progresso fica no `localStorage` do navegador. Não há conta de usuário, banco de dados remoto ou sincronização entre dispositivos.

- Use o mesmo navegador, endereço e porta para continuar de onde parou.
- Limpar os dados do site no navegador pode apagar o progresso.
- Alterar entre `localhost` e `127.0.0.1`, ou mudar a porta, utiliza outro armazenamento do navegador.
- O XP reflete atividades registradas na interface; não comprova domínio técnico nem valida pesquisas externas.
- O progresso salvo por versões anteriores continua válido: as medalhas já merecidas são reconhecidas ao abrir o site, e os endereços antigos (`?modulo=2`, `#trilhas`, `materias/x.html`) continuam levando ao lugar certo.
- O XP bônus das conquistas é calculado a partir do progresso salvo, sem contar duas vezes. O XP máximo é 2.860: 1.940 em tarefas e 920 em conquistas.
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

- **Bibliotecas:** shadcn/ui, daisyUI, Motion, Rive, Tailwind CSS, Radix UI, Lucide, Sonner e React Router são MIT/ISC; a fonte Inter é SIL OFL 1.1. A página **Referências** do site lista cada uma com a licença.
- **React Bits** usa MIT + Commons Clause. Os quatro componentes copiados estão dentro do app, o que a licença permite; ela **não** permite revender nem redistribuir os componentes isoladamente. O aviso completo está em `src/components/reactbits/LICENSE.md`.
- **Projetos de estudo:** [Lingo — Duolingo Clone](https://github.com/sanidhyy/duolingo-clone) (MIT), [Duolingo Next.js](https://github.com/RikhiSingh/Duolingo-Clone) (MIT) e [Habitica](https://github.com/HabitRPG/habitica) (código GPL v3, arte CC BY-NC-SA 3.0) serviram só de inspiração para as ideias de jogo; nenhum código ou imagem foi copiado, e as mecânicas foram reescritas.
- OWASP, MITRE ATLAS, NIST, ISO/IEC e Kali Linux são referências ou marcas de seus respectivos responsáveis. Este é um projeto educacional independente, sem indicação de afiliação ou endosso dessas organizações.
