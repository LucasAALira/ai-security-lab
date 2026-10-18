# Identidade visual: Biblioteca dos Condenados

Um santuário de conhecimento dentro de uma fortaleza em ruínas. A interface lembra o menu de um RPG gótico (pedra, metal envelhecido, velas, selos e vitrais) sem perder a clareza de uma plataforma de estudos. Toda a arte é original e feita em CSS e SVG.

Arquivos: `src/styles/gothic.css` (tokens e componentes), `src/styles/fonts.css` (fontes), `src/components/gothic/` (componentes React) e os temas em `src/index.css`.

## Regras

1. **A leitura vem primeiro.** Texturas, cantoneiras e cenas ficam em molduras e cenários. Aulas, código e formulários ficam em superfícies lisas.
2. **Nome temático sempre com a função.** "Provações" vem com "Desafios de código". Termos técnicos nunca são trocados por ficção.
3. **Nada depende só da cor.** Seleção tem luz âmbar, linha de ornamento e `aria-pressed`/`aria-current`. Raridade aparece no desenho do medalhão, no símbolo (◆, ◆◆, ♛, ✦✦✦) e no nome.
4. **Bloqueio tem selo e requisito.** O selo de cera (`Seal`, `SealMark`) nunca aparece sem o texto do que falta.
5. **Animação curta e opcional.** Nada bloqueia, nada repete conquista antiga, nada toca som sozinho; com "reduzir movimento", some.
6. **Nada inventado.** Duração, recompensa e progresso só aparecem quando vêm do conteúdo ou do progresso salvo.

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--color-base-100` (tema `library`) | `#141110` carvão | Fundo |
| `--color-base-200` | `#1e1915` marrom profundo | Superfícies e painéis |
| `--color-base-300` | `#4a3a2b` bronze queimado | Bordas |
| `--color-base-content` | `#ece3cf` marfim | Texto |
| `--color-primary` | `#d9a54e` ouro envelhecido | Destaques, ação principal |
| `--ember` / `--ember-deep` | `#e0653f` / `#8f3218` | Ações importantes, selos, brasas |
| `--violet` | `#a493cf` | Elementos misteriosos (discreto) |
| `--bronze` / `--candle` | `#b48a57` / `#f2c46d` | Metal das molduras, luz de vela, foco |
| `--muted-foreground` | marfim 68% sobre a superfície | Texto secundário (≥ 5,5:1 sobre o painel) |
| `--ornament`, `--ornament-soft` | derivados do tema | Linhas de moldura em qualquer tema |
| `--space-1` … `--space-7` | 4, 8, 12, 16, 24, 32, 48 px | Espaçamento |
| `--radius-frame` | 3 px | Cantos quase retos |
| `--dur-fast`, `--dur`, `--dur-slow` | 140, 220, 420 ms | Transições |
| `--ease-solemn`, `--ease-out` | curvas | Entradas e celebrações |

Os outros temas (Dragão, Ciano, Arcano e os quatro da sala de troféus) usam as mesmas molduras: `--ornament`, `--plate-*` e `--glow` são derivados do `--primary` de cada tema.

## Tipografia

| Papel | Fonte | Onde |
| --- | --- | --- |
| Títulos | Cinzel | `h1`, `h2`, inscrições (`gx-inscription`), títulos de diálogo |
| Inscrições curtas e marca | Grenze Gotisch (`gx-gothic`) | Marca, "Santuário do Conhecimento". Nunca em parágrafos, formulários ou código. |
| Conteúdo e controles | Literata | Corpo, aulas, botões, formulários |
| Código | JetBrains Mono | Desafios, exemplos, evidências |

Todas SIL OFL 1.1, empacotadas pelo Fontsource (subconjuntos latino e latino estendido), com acentos do português conferidos.

## Componentes

| Classe ou componente | O que é |
| --- | --- |
| `gx-panel` | Painel de grimório: borda dupla discreta. É o visual do `Card`. |
| `gx-frame` | Moldura com cantoneiras de metal. Para destaques e diálogos. |
| `gx-btn-plate` | Ação principal: placa de metal envelhecido (`Button` padrão). |
| `gx-btn-ember` | Ação importante ou irreversível (`variant="destructive"`). |
| `gx-btn-outline`, `gx-btn-stone`, `gx-btn-ghost` | Secundárias. |
| `gx-gauge` + `gx-gauge-fill`, `Gauge` | Medidor de RPG com marcas a cada 10%; o valor fica escrito ao lado. |
| `Seal`, `SealMark` | Selo de cera de bloqueio, sempre com o requisito. |
| `Crest` | Brasão de área: janela ogival com a "tintura" da área. |
| `gx-niche` | Nicho do relicário para medalhões. |
| `gx-inscription`, `gx-rule` | Inscrição entre losangos; divisor ornamentado. |
| `gx-candle` | Luz de vela ao passar, focar ou selecionar. |
| `SanctuaryScene` | Cena da biblioteca em SVG (substituível por `src/assets/rive/hero.riv`). |

## Animações

| Efeito | Quando | Duração | Componente |
| --- | --- | --- | --- |
| Tela de carregamento com o brasão | Troca de página; código da página chegando | 720 ms, sem bloquear cliques | `PageVeil`, `LoadingSigil` |
| Entrada da página | Troca de página | 420 ms | `gx-page-enter` |
| Brasas | O XP aumentou | < 1 s, uma vez | `EmberBurst` |
| Medalhão revelado | Conquista nova (aviso) | 700 ms | `gx-reveal` em `MedalToast` |
| "Provação superada" | Primeira vitória num desafio, chefe, missão ou revisão de arquitetura (só quando rende XP) | 2,6 s, `aria-hidden`, sem bloquear | `TrialBanner` |

Com `prefers-reduced-motion: reduce`, a tela de carregamento e as brasas não aparecem, nada se move e a faixa aparece parada por um instante.

## Como usar em uma tela nova

- Use `Card` (já é `gx-panel`) e `Button` (já tem as variantes góticas).
- Para um título de seção, use `SectionHeading` com `eyebrow` (vira inscrição).
- Para algo bloqueado, use `Seal` com o requisito em texto.
- Para progresso, use `Progress` ou `Gauge`, sempre com o número escrito.
- Não crie cores novas fora dos tokens; derive de `--primary`, `--ember` ou `--bronze`.
