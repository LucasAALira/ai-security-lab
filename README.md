# 🐉 AI Security Lab

```text
╔══════════════════════════════════════════════════════════════════╗
║        /\   /\             A I   S E C U R I T Y   L A B         ║
║       /  \_/  \                                                  ║
║  .---(  o   o  )---.       AppSec + IA, em português             ║
║ /     \   ^   /     \      offline · sem conta · sem servidor    ║
║ |  ~~~  '--v--'  ~~~  |    aulas, missões, triagem de achados    ║
║  \     __|   |__     /     casos reais e revisões de arquitetura ║
║   '---'  '---'  '---'      `npm run arte` desenha no terminal    ║
╚══════════════════════════════════════════════════════════════════╝
```

**Central de estudos de segurança de aplicações e de inteligência artificial para profissionais de AppSec, Security Champions e desenvolvedores.**

![versão 2.6.0](https://img.shields.io/badge/vers%C3%A3o-2.6.0-ff3333?style=flat-square) ![2.258 testes](https://img.shields.io/badge/testes-2.258-dccb94?style=flat-square) ![português](https://img.shields.io/badge/idioma-portugu%C3%AAs-8a8f98?style=flat-square) ![funciona offline](https://img.shields.io/badge/offline-sim-8a8f98?style=flat-square) ![Android 7+](https://img.shields.io/badge/Android-7.0%2B-8a8f98?style=flat-square)

Um site de aprendizado em português que reúne aulas, missões investigativas, desafios de código, casos reais e revisões de arquitetura. A proposta é conectar os conceitos de segurança Web, de APIs, Mobile, de IA e da cadeia de suprimentos às decisões do dia a dia das empresas. Funciona inteiro no navegador, sem conta e sem servidor. 🔌

### 🧭 Atalhos

| | | |
| --- | --- | --- |
| 🗺️ [O que há no site](#conteudo) | 🧪 [Executar localmente](#executar) | 📱 [App Android](#android) |
| 🎮 [Mecânicas de jogo](#jogo) | 🛠️ [Desenvolvimento](#desenvolvimento) | 🔒 [Progresso e privacidade](#privacidade) |
| 🎨 [Identidade visual](#identidade) | ✍️ [Como adicionar conteúdo](#conteudo-novo) | 📜 [Créditos e licenças](#creditos) |

<a id="conteudo"></a>

## 🗺️ O que há no site

| Parte | Conteúdo |
| --- | --- |
| 📂 **Áreas** (`#/areas`) | 8 áreas (Web, APIs, IA, Mobile, Cadeia de suprimentos, Arquitetura, **Engenharia reversa** e Governança), 42 módulos e 198 submódulos. 189 submódulos têm aula própria (contexto, conceito, exemplo, ilustração quando ajuda, validação, revisão e referências); os outros 9 usam os módulos clássicos da trilha. Cada módulo tem um integrador e um checkpoint. Áreas e módulos recém-publicados levam o selo **Novo**. |
| 🕵️ **Campanhas** (`#/campanhas`) | 8 campanhas com 6 missões cada (48 missões), em empresas fictícias: evidências liberadas por etapas, decisões com consequências, ramificações, sete formatos de atividade e revisão da solução com risco residual. |
| 🔎 **Análise de código** (`#/analise`) | 23 amostras de triagem de achado: ler o trecho, decidir se o alerta **procede**, é **falso positivo** ou está **indeterminado**, apontar os sinais que sustentam o veredito e escolher **o que fazer em seguida**, com a comparação entre a melhor conduta e as que parecem resolver. Sete são falso positivo e três dependem de contexto que falta. Nove amostras são de **segredos** (chave no código, URL assinada, variável em registro de pipeline, credencial em repositório privado, achado reaberto, valor no histórico) e oito trazem, na revisão, o **caso real documentado** que as inspira, com a fonte. |
| 📰 **Casos reais** (`#/casos`) | 19 dossiês que separam fatos com fonte, incertezas, análise educacional e uma simulação fictícia: **15 brasileiros** (STJ, TSE, ConecteSUS, DATASUS/SCPA, Secretaria de Educação do DF, organização social de saúde, primeira multa da ANPD, TikTok, Claro e Serasa, consultas ao DICT, chaves Pix, o ataque de 30 de junho de 2025, Netshoes, Banco Inter e venda de dados pessoais) e 4 de cadeia de suprimentos (XZ Utils, 3CX, SolarWinds Orion e ua-parser-js). |
| 🧬 **Laboratório de código** (`#/desafios`) | 71 desafios: marcar as linhas vulneráveis, escolher a correção e ver o código corrigido e como validar. 55 são das áreas novas (Web, API, Mobile Android e iOS, cadeia de suprimentos, configuração e engenharia reversa), incluindo 6 sobre segredos: chave no pacote, variável de build e source map, camada de imagem, registro de pipeline, resposta ao vazamento e triagem sem executar a amostra. |
| 🏗️ **Modo Arquiteto** (`#/arquiteto`) | 13 projetos (Web, mobile, IA, SaaS, pagamentos, supply chain, Kubernetes, IoT, dados e acesso privilegiado): componentes clicáveis, ameaças STRIDE, controles com custo e complexidade, várias soluções defensáveis, avaliação por critérios e ADR com sete campos e autoavaliação. |
| 🧭 **Cobertura** (`#/cobertura`) | Matriz que liga cada item dos frameworks (OWASP Top 10, API, Mobile, LLM, MASVS, MITRE ATLAS, CWE, SSDF, SLSA) ao conteúdo que o pratica. |
| 🔦 **Explorar** (`#/explorar`) | Busca em aulas, missões, desafios, casos e projetos. |

## 📚 Temas de estudo

- OWASP Top 10 para aplicações com LLMs.
- Injeção de prompt e seus impactos.
- MITRE ATLAS.
- Red teaming em IA.
- NIST AI Risk Management Framework (AI RMF).
- ISO/IEC 42001.
- LGPD aplicada à inteligência artificial.
- Regulamento europeu de inteligência artificial (AI Act).
- **Engenharia reversa para defensores**: a maior área do site, com 6 módulos e 31 submódulos — fundamentos e laboratório, análise estática, caça a segredos em artefatos, aplicativos e clientes, artefatos de IA e análise dinâmica com relatório. O módulo 09 da trilha é a porta de entrada, de [acesso antecipado](#acesso-antecipado); a área fica aberta em [Arquivos](#conteudo).
- Segurança Web e de APIs: autenticação, autorização por objeto, injeções, SSRF, regras de negócio, OWASP Top 10 e API Security Top 10.
- Segurança Mobile (Android e iOS): armazenamento, links, WebViews, TLS, biometria e a divisão entre aplicativo e servidor, com OWASP Mobile Top 10 e MASVS.
- Cadeia de suprimentos de software: dependências, pipelines, segredos, SBOM, assinatura, proveniência e incidentes reais.
- Arquitetura de segurança: modelagem de ameaças, identidade, dados, decisões e ADR.
- Governança: SAMM, SSDF, requisitos, vulnerabilidades, fornecedores, evidências e privacidade.
- Habilidades de agente como artefato, com a OWASP Agentic Skills Top 10 (rascunho do projeto, citada como tal).

As matérias possuem páginas internas: o conteúdo de estudo pode ser lido dentro do próprio site. Cada uma tem três leituras (Compreender, Conectar e Aplicar) com exemplos, tabelas e quadros "Em palavras simples", além de um **resumo em pontos-chave** e um **glossário**. Os módulos regulatórios trazem a data de revisão e avisam quando um prazo ou texto pode ter mudado.

## ⚙️ Funcionalidades

- **Trilhas de aprendizado:** objetivos, pré-requisitos educacionais e tarefas de estudo.
- **Trilha de módulos:** os módulos formam um caminho com etapas, **fogueiras** (pontos de conclusão e revisão) e um **chefe** por módulo. Módulos só abrem quando as fogueiras dos pré-requisitos estão acesas, e o próximo objetivo fica sempre visível.
- **Aulas interativas:** cada módulo tem abas *Conceito, Exemplo, Como corrigir, Revisar, Praticar* e *Quiz*, com o resumo primeiro e o texto completo em "Saiba mais".
- **Laboratório de código:** 60 desafios em que você marca as linhas vulneráveis e escolhe a correção, com dicas, explicação do erro e a opção de repetir.
- **Flashcards** com resposta que se revela, em cada módulo.
- **Conquistas:** 69 conquistas (inclui as 8 do sistema de aprendizado, as das campanhas e do modo Arquiteto, e uma secreta), com brasões em SVG, filtros, progresso real e detalhes. Veja [Aprendizado interativo e conquistas](#conquistas).
- **Em breve:** página com o que está por vir (Engenharia reversa e preparação para a CompTIA SecurityX, entre outros), sem datas inventadas. O módulo de Engenharia reversa já está disponível por **desbloqueio imediato de 5.000 moedas** ou de graça, concluindo os módulos recomendados.
- **XP e níveis:** pontos pelas atividades registradas e pelos exercícios. Repetir uma atividade nunca soma XP de novo.
- **Medalhas e conquistas:** quatro níveis (bronze, prata, ouro e dragão), por leitura, pesquisa, prática, questões, módulos, trilhas, laboratório, cenários, desafios, chefes, dias seguidos, revisões, missões, escudos e recompensas. Cada uma dá XP bônus uma única vez (10, 20, 40 e 100 XP) e as bloqueadas mostram quanto falta.
- **Evolução por trilha:** cada trilha (Fundamentos, Ataques e defesa, Governança e Regulação) mostra XP, módulos e tarefas concluídas, com medalha bronze a partir de 40%, prata a partir de 70% e ouro aos 100%.
- **Pontos de melhoria:** sugestões calculadas pelo progresso: questões ainda não acertadas, módulos quase concluídos, o próximo módulo com pré-requisitos em dia, o laboratório e os cenários pendentes.
- **Missões do dia, moedas, loja e revisão com vidas:** veja [Mecânicas de jogo](#jogo).
- **Quiz:** perguntas de múltipla escolha com correção e explicações.
- **Cenários de remediação:** situações fictícias organizadas por porte de empresa, com alternativas de solução e feedback.
- **⏳ Horas e dias de estudo:** na página inicial, o tempo medido ao todo, o tempo de hoje, os dias com atividade registrada e o recorde de dias seguidos. O relógio soma um minuto por vez, só com a aba à frente e com interação recente, no máximo 10 h por dia — aba esquecida aberta não vira hora de estudo. Tudo fica no navegador e entra no backup.
- **Anotações e progresso:** armazenamento local no navegador.
- **Ferramentas e pentest de LLMs:** material textual com exemplos técnicos e situações do cotidiano.
- **Identidade gótica moderna, "Forja Dracônica" (Dark Tech)**, com onze temas de cor (três gratuitos e oito na loja), interface responsiva e respeito à preferência do sistema por menos movimento. Veja [Identidade visual](#identidade).

> Os cenários são exercícios educacionais de decisão. O projeto não provisiona máquinas virtuais nem executa ataques, ferramentas de pentest ou ambientes vulneráveis.

<a id="conquistas"></a>

## 🏅 Aprendizado interativo e conquistas

A direção visual é a de um gótico moderno em linhas de circuito (veja [Identidade visual](#identidade)), com medalhas em forma de brasão e identidade própria: nenhum nome, imagem, fonte, som ou arte de jogos ou da Steam foi copiado. Os ícones são SVG (Lucide, com crédito, e relíquias desenhadas para o projeto) e os estados nunca dependem só da cor.

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

- XP total: 11.376, sendo 9.566 em atividades (módulos, laboratório, cenários, desafios de código, chefes, missões, dossiês, triagens de análise de código, aulas e projetos do Arquiteto) e 1.810 em conquistas. Níveis de *Iniciante* (0) a *Lenda do AppSec* (2.400).
- Desafio de código: 15 XP ao identificar e 15 ao corrigir, só na primeira vez. Chefe: 60 XP, só na primeira vitória.
- Errar dá explicação e nova tentativa; nunca apaga XP, conquistas nem bloqueia as explicações.
- Conquistas são concedidas uma única vez e registram a data. Não há estatística de raridade nem comparação com outras pessoas.

**Acessibilidade:** tudo funciona pelo teclado, com foco visível; botões de ícone têm nome acessível; estados aparecem também em texto; animações respeitam "reduzir movimento"; o aviso de conquista é discreto (não tira o foco) e o som é opcional, desligado por padrão e com chave para desativar.

Regras, dados salvos e como acrescentar conquistas ou desafios: [docs/APRENDIZADO-E-CONQUISTAS.md](docs/APRENDIZADO-E-CONQUISTAS.md).

<a id="identidade"></a>

## 🎨 Identidade visual: Forja Dracônica

Um gótico moderno, "Dark Tech": uma catedral desenhada em linhas de circuito, com preto absoluto, titânio fosco, vidro fumado, vermelho-brasa e ouro anodizado. Usa linhas de 1 px, cantos chanfrados e títulos nítidos, sem pergaminho nem madeira. A atmosfera lembra os soulslike, mas toda a arte é original, feita em CSS e SVG. Nenhum personagem, logotipo, trilha sonora ou asset de franquias foi usado.

| Elemento | Como funciona |
| --- | --- |
| **Início (Santuário do Conhecimento)** | Primeiro vem a missão atual, com uma ação principal. Atrás dela fica a catedral digital: arcos ogivais em circuito, friso de escamas de dragão e a rosácea-circuito, com a fogueira digital (um prisma com chama geométrica) no altar, abaixo do vitral. |
| **Navegação** | Nomes temáticos com a função escrita ao lado: Jornada, Arquivos, Contratos, Provações, Relicário, Sala de troféus e Mercador (mercado negro). No app Android aparece também Configurações. |
| **Componentes** | Cartões de vidro fumado com borda de 1 px; botões de cantos vivos com chanfro e brilho no hover; medidores de XP em blocos de luz que pulsam quando o XP sobe; molduras cujas linhas pulsam como dados (`dataPulse`). |
| **Fogueiras** | Na trilha, os pontos de controle e os módulos concluídos são prismas flutuantes sobre nós de servidor. Apagados, aparecem tracejados; acesos, mostram a chama. |
| **Fontes** | Cinzel em maiúsculas espaçadas nos títulos (H1 a H3), Inter no texto e nos controles e JetBrains Mono no código e nos dados. A fonte fraktur, pouco legível, saiu. Todas vão empacotadas para uso offline. |
| **Temas** | Forja Dracônica é o padrão gratuito. Código de Sangue (ciano e carmim) e Catedral de Silício (monocromático) custam 90 moedas. Biblioteca dos Condenados e Dragão continuam gratuitos. Temas comprados e escolhidos continuam valendo; só quem nunca escolheu passa ao novo padrão. |
| **Acessibilidade** | Contraste AA conferido com axe em quatro temas, foco âmbar visível, alvos de 44 px no toque, e tudo para com "reduzir movimento". Sem desfoque disponível, ou com "menos transparência", as superfícies ficam sólidas. |

Tokens, componentes e regras de uso: [docs/IDENTIDADE-VISUAL.md](docs/IDENTIDADE-VISUAL.md).

<a id="jogo"></a>

## 🎮 Mecânicas de jogo

Inspiradas em apps de aprendizado como o Duolingo e em Habitica, mas escritas do zero (nenhum código nem arte foi copiado). Tudo funciona no navegador, sem conta e sem servidor.

| Mecânica | Como funciona |
| --- | --- |
| **Moedas** | 1 moeda a cada 5 XP, mais as das missões, do baú e das revisões. Gastar moedas nunca reduz XP, nível ou medalhas. |
| **Missões do dia** | 3 missões por dia, sorteadas entre 7 tipos (só as que ainda são possíveis). Cada uma rende 5 a 8 moedas; cumprir as três abre um baú de 15 moedas. |
| **Revisão com vidas** | Sessão de até 5 questões que você já acertou, com 3 vidas. Erro custa uma vida e a questão volta para o fim da fila. Terminar com vidas conta como dia de estudo e rende moedas (nas 3 primeiras sessões do dia). |
| **Escudo de Silício** | Proteção de sequência: 20 moedas, no máximo 2. Cobre um dia sem estudo e mantém a sequência. |
| **Injetor de Cinzas** | Troca uma missão do dia por outra de recompensa equivalente: 10 moedas, uma vez por dia. |
| **Núcleo de LLM Exilado** | Desbloqueio imediato de módulo restrito (hoje, a Engenharia Reversa): 5.000 moedas. |
| **Temas** | Forja Dracônica (padrão), Biblioteca dos Condenados e Dragão são gratuitos. Ciano e Arcano custam 40 moedas, os da sala de troféus de 60 a 100, e Código de Sangue e Catedral de Silício 90. |
| **Dificuldade** | Soulslike (padrão, valores originais), Difícil (×10), Médio (×20) e Fácil (×30) no XP das conquistas e nas moedas recebidas. No app Android, o modo deus edita esses valores e os preços. Veja [Dificuldade e modo deus](#dificuldade). |
| **Recompensas pessoais** | Prêmios que você cria (um café, uma pausa) e resgata com moedas. O resgate é por conta e confiança. |

Ligas e placares ficaram de fora: exigiriam contas e um servidor.

<a id="dificuldade"></a>

## 💀 Dificuldade e modo deus

O padrão é **Soulslike**: os valores de sempre. No app Android, em **Configurações** (`#/configuracoes`), dá para escolher outra dificuldade:

| Modo | XP de cada conquista | Moedas recebidas |
| --- | --- | --- |
| Soulslike (padrão) | Bronze 10, Prata 20, Ouro 40, Dragão 100 | ×1 |
| Difícil | ×10 | ×10 |
| Médio | ×20 | ×20 |
| Fácil | ×30 | ×30 |

As regras:

- O multiplicador vale para tudo, inclusive o que já foi conquistado, e voltar ao Soulslike restaura os valores originais.
- O XP das tarefas não muda, e as moedas gastas não voltam.
- Trocar de modo não conta como estudo: não soma XP do dia nem cumpre missões.

No **modo deus**, na mesma página, você edita à mão:

- o XP de cada nível de conquista;
- o multiplicador de moedas;
- o preço de cada item da loja (consumíveis, módulos, temas, relíquias e salas).

O que você mudar fica fixo, e o resto acompanha a dificuldade. "Restaurar valores do modo" desfaz os ajustes. Tudo é validado (inteiros com limite).

A escolha fica no progresso deste aparelho e entra no backup. Um estado sem dificuldade salva continua igual ao de antes. No navegador, a página só mostra o modo atual: o editor existe apenas no app.

<a id="acesso-antecipado"></a>

## 🔓 Acesso antecipado e página Em breve

A página **Em breve** (`#/em-breve`) mostra o que está por vir em três situações: *acesso antecipado* (já está no site), *em planejamento* e *ideia em avaliação*. Ela não promete datas, não mostra porcentagem de andamento e não inventa números de usuários. Hoje lista a **Engenharia reversa para defensores** (já disponível em acesso antecipado), a **preparação para a CompTIA SecurityX** (exame CAS-005; conteúdo independente, sem vínculo com a CompTIA), a segurança de agentes e servidores MCP e a resposta a incidentes com IA.

O **módulo 09, Engenharia reversa para defensores**, abre de duas formas:

| Caminho | Como funciona |
| --- | --- |
| **Desbloqueio imediato** | **5.000 moedas**, com confirmação antes de gastar. As moedas gastas não voltam, mas XP, nível e medalhas nunca diminuem. Quem não tem saldo vê quanto falta e como ganhar moedas. |
| **Liberação gratuita** | Acender a fogueira dos módulos 01 (OWASP Top 10) e 04 (Red teaming). Quem já abriu o módulo assim não paga nada. |

Enquanto está fechado, o módulo mostra só uma prévia dos assuntos. Depois de aberto, ele tem as mesmas partes dos demais: aulas em abas, flashcards, três desafios de código, chefe e matéria completa. Estudá-lo rende XP e uma medalha própria, mas **não conta** para as conquistas que exigem terminar os oito módulos principais. Quem tem progresso salvo antes dessa versão não perde nada: o módulo 09 entra vazio.

O conteúdo é defensivo: laboratório isolado, autorização, análise de aplicativos e de arquivos de modelo que você tem direito de examinar, e como corrigir o que se encontra. Não traz instruções para violar proteções de software de terceiros.

```text
   .---------------------.
   | o o o               |     O terminal também tem desenho:
   |---------------------|     `npm run arte` sorteia um a cada vez.
   |  $ npm run dev      |
   |  _                  |
   '---------------------'
```

<a id="executar"></a>

## 🧪 Executar localmente

### 📋 Requisito

Python **3.8 ou superior**. Não é necessário instalar pacotes adicionais nem ter Node.js: a pasta `dist/` já traz o site gerado.

Baixe o pacote, extraia todos os arquivos e abra um terminal na pasta que contém `iniciar.py`.

### 🪟 Windows

```powershell
.\iniciar-windows.bat
```

Ou diretamente com Python:

```powershell
py -3 iniciar.py
```

### 🐧 Linux e macOS

```bash
sh iniciar-linux-mac.sh
```

Ou:

```bash
python3 iniciar.py
```

O servidor escuta em **0.0.0.0:8080** e mostra os endereços IP do computador. O navegador abre um desses endereços (por exemplo, `http://192.168.1.10:8080`). No celular ou em outro computador conectado à **mesma rede Wi-Fi/LAN**, abra o endereço mostrado no terminal. `0.0.0.0` é a interface de escuta, não um endereço para digitar no navegador. Mantenha o terminal aberto enquanto utiliza o site. Para encerrar, pressione **Ctrl+C**.

> Abrir `dist/index.html` com dois cliques (endereço `file://`) não funciona: os navegadores bloqueiam módulos JavaScript fora de um servidor. Use o iniciador.

### 🎛️ Opções

```bash
python3 iniciar.py --porta 8081        # se a porta estiver ocupada
python3 iniciar.py --sem-navegador     # não abre o navegador sozinho
python3 iniciar.py --host 127.0.0.1    # opcional: acesso somente neste computador
```

No Windows, substitua `python3` por `py -3`. O servidor aceita conexões da rede local. No Windows, permita o Python no firewall somente em redes privadas. Use uma rede confiável: não há autenticação e não é necessário abrir portas no roteador. Se o terminal listar IPs de VPN ou adaptadores virtuais, escolha o IPv4 do Wi-Fi/Ethernet (consulte `ipconfig`). Redes de convidados podem bloquear a comunicação entre aparelhos. Depois de instalar Python e baixar os arquivos, tudo funciona sem internet (a fonte e o motor das animações vão junto do site).

```text
   .-------------.
   | ###   ###   |    O mesmo site, empacotado: o conteúdo inteiro
   | ###   ###   |    vai dentro do APK e funciona sem internet.
   |   .-----.   |
   |   | /_\ |   |
   |   '-----'   |
   |      o      |
   '-------------'
```

<a id="android"></a>

## 📱 App Android (APK)

O site também vira um app Android: um WebView em Java puro, sem bibliotecas de terceiros, que leva o site inteiro dentro do APK. Funciona sem internet e guarda o progresso no próprio aparelho. O projeto fica em `android/`.

**Instalar.** Copie o APK para o celular e abra. O Android pede para permitir "instalar apps desconhecidos" para o app que abriu o arquivo (Arquivos, Chrome...). O APK é assinado com uma chave de depuração: serve para uso pessoal e testes, não para a Play Store, que exige uma versão assinada com uma chave sua. Para atualizar, instale o APK novo por cima; se a chave mudar, o Android pede para desinstalar antes (exporte o progresso primeiro).

| No app | Como funciona |
| --- | --- |
| Abertura | Brasão sobre o preto absoluto e, em seguida, a tela de abertura com o nome e a linha de carregamento (2 s no total; um toque pula). |
| Botão Voltar | Fecha o diálogo aberto; senão volta uma página; na página inicial, sai do app. |
| Barras do sistema | Ficam fora da área do app, em preto com ícones claros. |
| Configurações | Dificuldade (Soulslike, Difícil, Médio, Fácil) e modo deus, só no app. |
| Backup | "Exportar progresso" abre o compartilhamento do Android (Drive, Arquivos, e-mail). "Importar progresso" abre o seletor de arquivos. |
| Progresso | Fica no armazenamento do app, separado do navegador. Para levar o progresso do site para o app (ou o contrário), exporte de um lado e importe do outro. |
| Links externos | Abrem no navegador do aparelho; o app só mostra o conteúdo empacotado. |

O APK permanece independente do servidor do computador: o acesso pela rede local é feito pelo navegador. O progresso não sincroniza automaticamente entre aparelhos ou endereços; use exportar/importar para transferir.

**Baixar o APK.** O pacote pronto fica em [`releases/`](releases/), com o resumo SHA-256 e as instruções de instalação. É um pacote de depuração, assinado com chave de teste: ele não vem de loja e não se atualiza sozinho.

**Gerar o APK.**

- Com Android Studio ou Gradle: `npm run build`, depois `cd android && ./gradlew assembleDebug` (a tarefa `copyWeb` copia `dist/` para dentro do app). O APK sai em `android/app/build/outputs/apk/debug/`.
- Sem Gradle: `npm run build && sh scripts/build-apk.sh`, com as variáveis `ANDROID_JAR`, `AAPT2`, `ZIPALIGN`, `D8_JAR`, `APKSIGNER_JAR` e `KEYSTORE` apontando para as ferramentas do Android SDK (veja o cabeçalho do script).

<a id="desenvolvimento"></a>

## 🛠️ Desenvolvimento

Requer **Node.js 20.19+ ou 22.12+**.

```bash
npm install        # dependências
npm run dev        # desenvolvimento com recarga, também na rede local (porta 5173)
npm test           # testes (Vitest): regras de progresso, conquistas, trilha, desafios, componentes e conteúdo
npm run typecheck  # verificação de tipos
npm run build      # verifica os tipos e gera o site em dist/
```

A pasta `dist/` é versionada de propósito, para que `iniciar.py` funcione sem Node. **Depois de alterar o código-fonte, rode `npm run build` e inclua `dist/` no commit.**

### 🎭 Desenho no terminal

`npm run arte` sorteia uma das nove figuras em ASCII — hacker, cadeado, chave, escudo, inseto, terminal, dragão, caveira e fogueira — com uma inscrição curta de cada vez. O mesmo desenho aparece sozinho antes de `npm run dev`, pelo gancho `predev`.

```sh
npm run arte            # sorteia
npm run arte -- chave   # escolhe pelo nome
npm run arte -- --lista # mostra os nomes
```

Tudo é desenho original, com no máximo 46 colunas. A cor sai só quando o terminal aceita: com `NO_COLOR`, `TERM=dumb` ou saída redirecionada, o texto vai puro. O arquivo é `scripts/arte.mjs`, e os testes dele estão em `scripts/arte.test.mjs`.

### 🧱 Pilha

| Peça | Uso |
| --- | --- |
| React 19 + TypeScript + Vite | Aplicação. As rotas usam hash (`#/materias/...`), então o site abre de qualquer pasta ou servidor estático. |
| Tailwind CSS v4 | Estilos e tokens de tema. |
| [shadcn/ui](https://ui.shadcn.com) | Componentes de interface (em `src/components/ui`, copiados e ajustados ao tema, sobre o Radix UI). |
| [daisyUI](https://daisyui.com) | Temas de cor (Forja Dracônica, Biblioteca dos Condenados, Dragão e os da loja) e componentes de estatísticas e progresso radial. As cores do shadcn derivam do mesmo tema. |
| [Motion](https://motion.dev) | Animações de entrada, de medalhas, de moedas e de vidas. Respeita "reduzir movimento". |
| [Rive](https://rive.app) | Dois espaços para animações `.riv` (topo da página inicial e fim da revisão). Sem arquivo, aparece a ilustração padrão. Veja `src/assets/rive/LEIA-ME.md`. |
| [React Bits](https://reactbits.dev) | Dois componentes em `src/components/reactbits`: contador animado e cartão com destaque. |
| [Fontsource](https://fontsource.org) | Cinzel, Inter e JetBrains Mono empacotadas com o site (SIL OFL 1.1), só os subconjuntos latinos. |

### 📁 Estrutura

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

<a id="conteudo-novo"></a>

## ✍️ Como adicionar conteúdo

O passo a passo está em [docs/COMO-ADICIONAR-CONTEUDO.md](docs/COMO-ADICIONAR-CONTEUDO.md). Em resumo:

- **Campanha:** uma pasta `src/data/campaigns/cN/` com seis missões e um `index.ts`, registrada em `src/data/campaigns/index.ts`.
- **Missão:** um `MissionContent` com as doze partes obrigatórias e pelo menos três formatos de atividade (`decide`, `adr`, `multi`, `order`, `assign`, `budget`, `spot`).
- **Formato de desafio:** um `defineChallenge` em `src/data/challenge-packs/<tema>.ts`, com o gabarito escrito no código pelas marcas `⟦v⟧`, `⟦a⟧`, `⟦x⟧` e `⟦n=...⟧`.
- **Como adicionar um caso real:** um `DossierContent` em `src/data/campaigns/dossiers/`, com fontes primárias, datas, incertezas e uma simulação fictícia.
- **Projeto do modo Arquiteto:** um arquivo em `src/data/architect/` com componentes, ameaças, controles, orçamento e ADR.

Os testes conferem a estrutura, os dados sintéticos, as referências a frameworks e se cada missão e projeto tem uma solução possível.

```text
      .-------.
    .'         '.      O progresso é seu e fica no seu aparelho:
   /   .-----.   \     nada sai do navegador, nada vai para servidor.
  |   |       |   |
.-+---+-------+---+-.
|        .---.      |
|        | o |      |
'--------'-|-'------'
```

<a id="privacidade"></a>

## 🔒 Progresso e privacidade

O progresso fica no `localStorage` do navegador. Não há conta de usuário, banco de dados remoto ou sincronização entre dispositivos.

- Use o mesmo navegador, endereço e porta para continuar de onde parou.
- Limpar os dados do site no navegador pode apagar o progresso.
- Alterar entre `localhost` e `127.0.0.1`, ou mudar a porta, utiliza outro armazenamento do navegador.
- O XP reflete atividades registradas na interface; não comprova domínio técnico nem valida pesquisas externas.
- O progresso salvo por versões anteriores continua válido: as medalhas já merecidas são reconhecidas ao abrir o site, e os endereços antigos (`?modulo=2`, `#trilhas`, `materias/x.html`) continuam levando ao lugar certo.
- O XP é calculado a partir do progresso salvo, sem contar duas vezes: repetir uma missão, um desafio ou um projeto não soma XP de novo. O XP máximo é 11.376: 9.566 em atividades e 1.810 em conquistas.
- As ilustrações das aulas são SVG originais, desenhados no mesmo sistema visual do site, com texto alternativo e legenda; a região rolável é focável pelo teclado.
- O progresso das áreas e dos módulos conta só o que é obrigatório (aula lida e desafios aprovados). Submódulos planejados não entram em nenhuma porcentagem, e um módulo sem conteúdo nunca aparece como concluído.
- **Backup:** na página Conquistas, *Exportar progresso* baixa um arquivo JSON e *Importar progresso* o restaura (pede confirmação, porque substitui o progresso atual). É o jeito de levar o progresso a outro navegador ou aparelho.
- **Fuso horário:** os dias de estudo e a sequência usam o fuso do navegador. Viajar ou mudar o fuso do sistema pode mover o limite do dia.
- O progresso, o XP e as conquistas ficam no navegador e podem ser editados por quem tem acesso a ele: servem ao seu acompanhamento, não como prova de aprendizado. Pesquisa e prática são autodeclaradas.

## 🎓 Uso educacional

A seção de pentest exige digitar **"me responsabilizo"** antes de exibir o material. Essa confirmação é apenas uma etapa da interface, não um mecanismo de autenticação ou proteção dos arquivos.

Os exemplos destinam-se ao estudo defensivo e à discussão de mitigação. Qualquer aplicação prática de técnicas deve ocorrer em sistemas próprios ou com autorização explícita e escopo definido.

Os resumos sobre normas, leis e frameworks são materiais de apoio, não substituem os documentos oficiais nem constituem certificação ou parecer jurídico.

## 🤝 Contribuições

Sugestões de melhoria, correções de conteúdo e novos cenários educacionais são bem-vindos por issues e pull requests.

Ao propor uma alteração, descreva o problema, a solução e como verificar o resultado. Use dados fictícios nos exemplos e não inclua credenciais, dados pessoais ou informações internas de empresas.

<a id="creditos"></a>

## 📜 Créditos e licenças

- **Bibliotecas:** shadcn/ui, daisyUI, Motion, Rive, Tailwind CSS, Radix UI, Lucide, Sonner e React Router são MIT/ISC; as fontes Cinzel, Inter e JetBrains Mono são SIL OFL 1.1. A página **Referências** do site lista cada uma com a licença.
- **React Bits** usa MIT + Commons Clause. Os dois componentes copiados estão dentro do app, o que a licença permite; ela **não** permite revender nem redistribuir os componentes isoladamente. O aviso completo está em `src/components/reactbits/LICENSE.md`.
- **Projetos de estudo:** [Lingo — Duolingo Clone](https://github.com/sanidhyy/duolingo-clone) (MIT), [Duolingo Next.js](https://github.com/RikhiSingh/Duolingo-Clone) (MIT) e [Habitica](https://github.com/HabitRPG/habitica) (código GPL v3, arte CC BY-NC-SA 3.0) serviram só de inspiração para as ideias de jogo; nenhum código ou imagem foi copiado, e as mecânicas foram reescritas.
- **Frameworks citados:** as edições e os itens estão em `src/data/frameworks.ts`, cada um com o endereço oficial e a data da conferência. O MITRE ATLAS foi conferido na versão 2026.09 (dados publicados em [mitre-atlas/atlas-data](https://github.com/mitre-atlas/atlas-data)).
- OWASP, MITRE ATLAS, NIST, ISO/IEC e Kali Linux são referências ou marcas de seus respectivos responsáveis. Este é um projeto educacional independente, sem indicação de afiliação ou endosso dessas organizações.

## 🏆 Sala de troféus e relíquias

Acesse `#/sala-de-trofeus` pelo menu Jogo ou pela loja.
- Dez relíquias cosméticas, com compra única, história e prévia. Não concedem XP. As novas são a Espada Negra da IA (90 moedas) e o Montante Envenenado (80 moedas, do tema envenenamento de dados).
- Seis nichos, como pedestais de luz holográfica, para expor relíquias compradas e medalhas conquistadas. Retirar uma peça não a remove da coleção.
- Salão de Pedra incluído; Galeria das Brasas (50 moedas) e Observatório Lunar (70 moedas).
- Quatro temas adicionais: Fortaleza de Cinzas (60), Catedral do Eclipse (80), Arquivo Abissal (80) e Santuário Arcano (100).
- O Injetor de Cinzas: uma troca de missão pendente por dia, por 10 moedas. Só troca se houver alternativa possível de recompensa equivalente; sem alternativa, não há cobrança. Missões concluídas não podem ser trocadas.
- Compras e exposição fazem parte do progresso e do backup. Estados anteriores recebem os campos novos vazios, sem perder o conteúdo existente.
- As figuras das relíquias são arte original em SVG (estilo souls sombrio), geradas por `scripts/make-relics.py`; detalhes em `public/assets/relics/CREDITS.md`. Pedestais, salas, nomes e histórias também são originais. Entre elas, a Espada Negra da IA e o Montante Envenenado (do tema envenenamento de dados).

O progresso de localhost não aparece automaticamente em outro endereço. Exporte em Conquistas e importe no novo endereço para transferi-lo.

## 🔊 Sons do Santuário e fogueira

O painel abaixo do cabeçalho reúne música pessoal e efeitos originais gerados no aparelho, sem downloads externos. **Ativar efeitos** habilita sons de seleção, XP, compras, vitórias e conquistas; **Ouvir fogueira** liga um ambiente suave de lenha. Os volumes são independentes da música. Os efeitos começam desligados na primeira visita; a preferência fica salva. O ambiente nunca começa automaticamente e pausa ao ocultar a página.

Em **Carregar minha música**, importe um áudio local de até 170 MB (MP3 recomendado). O arquivo é validado antes de substituir a faixa anterior e fica no IndexedDB deste aparelho, separado do progresso e dos backups. Nenhuma música acompanha o projeto. A faixa é restaurada pausada, continua entre páginas e pode ser removida pelo player. Se não houver armazenamento disponível, o player avisa e permite ouvir apenas na sessão.

A fogueira da página inicial é um prisma digital com chama geométrica, arte original desenhada no altar, abaixo da rosácea do vitral, sem cobri-la. A animação respeita movimento reduzido e pausa com a página oculta. Em telas intermediárias, em que o texto fica sobre o vitral, ela é ocultada para preservar a leitura. Sons de conquista são emitidos a partir de resultados reais de ações, sem reproduzir conquistas antigas ao carregar um backup. A implementação funciona offline no site empacotado; não oferece áudio em segundo plano. A seleção de arquivos e codecs ainda precisa ser validada em Android físico.

### 🔥 DAS visual e fogueira do santuário

Os 13 projetos do Modo Arquiteto exibem um Desenho de Arquitetura de Segurança na etapa Projeto. Os componentes e fluxos vêm do próprio exercício; zonas tracejadas mostram fronteiras de confiança. Selecione um componente por toque ou teclado para destacar conexões e ler seu contexto. No celular, o mapa pode ser rolado horizontalmente. O DAS representa o cenário a revisar, sem antecipar o gabarito da avaliação.

A fogueira é uma ilustração SVG original, com cavaleiro descansando, Arauto Esmeralda (interpretação vetorial de Dark Souls II), espada, chama translúcida, fumaça e brasas. A veste da Arauto e o escudo reutilizam o mesmo brasão de dragões do site. Funciona offline, pausa ao ocultar a página e respeita a preferência de movimento reduzido.

### 🏛️ Dez novos exercícios de arquitetura

Na página `#/arquiteto`, os novos projetos incluem DAS interativo, seis componentes, três ameaças críticas, duas ameaças residuais e três distratores. Cada caso oferece duas soluções comentadas, orçamento de 12 pontos, limite de complexidade 9, ADR e plano de validação. Os pontos são didáticos.

| Projeto | Foco |
| --- | --- |
| Uma chave para cada empresa | Isolamento SaaS e jobs por tenant |
| O pagamento que chegou duas vezes | Webhooks, preço e idempotência |
| Da contribuição ao artefato confiável | CI/CD e supply chain |
| Um pod não é toda a plataforma | Identidade e rede em Kubernetes |
| A biblioteca que sussurra instruções | RAG, autorização documental e saída |
| O assistente que pode devolver dinheiro | Agentes e autorização transacional |
| A vistoria que volta da estrada | Mobile offline e sincronização |
| Sensores com identidade própria | IoT, MQTT e firmware |
| Análise sem uma cópia de todos os segredos | Minimização e exportação de dados |
| A porta de manutenção temporária | Privilégios temporários e sessões |

### 🌊 Ambiente de foco: fogueira e mar

No player do santuário, abra **Refúgio à beira-mar** e use **Foco: fogueira + mar**. O preset mistura chama baixa e ondas lentas, desliga os efeitos de menus e conquistas e permite ajustar separadamente os volumes de mar e fogueira. O áudio é sintetizado localmente, sem downloads ou trilha do jogo. Tem transições suaves, pausa ao ocultar a página e não retoma automaticamente. Preferências de volume são salvas, mas a reprodução exige ativação. A música importada no player continua independente; pause-a se quiser apenas o ambiente.
