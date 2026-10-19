# Identidade visual: Forja Dracônica (Dark Tech)

Uma catedral gótica desenhada em linhas de circuito. É um "gótico moderno" (cyber-gothic, soulslike digital): preto absoluto, titânio fosco, vidro fumado, vermelho-brasa e ouro anodizado, com linhas de 1 px, cantos chanfrados e tipografia nítida. Não há pergaminho, madeira ou pedra. Toda a arte é original e feita em CSS e SVG.

Ela sucede a "Biblioteca dos Condenados", que continua disponível como tema gratuito.

Arquivos:

- `src/styles/gothic.css`: tokens e componentes;
- `src/styles/fonts.css`: fontes;
- `src/components/gothic/`: componentes React;
- `src/index.css`: temas, sala de troféus e pedestais;
- `scripts/make-relics.py`: arte das relíquias.

## Regras

1. **A leitura vem primeiro.** Vidro e circuitos ficam atrás. A área de leitura é sempre sólida o bastante para o contraste AA.
2. **Nome temático sempre com a função.** Por exemplo, "Provações" vem com "Desafios de código". Termos técnicos nunca são trocados por ficção.
3. **Nada depende só da cor.** Seleção tem linha acesa, brilho e `aria-pressed`/`aria-current`. Raridade aparece no desenho, no símbolo e no nome.
4. **Bloqueio tem selo e requisito.** Sem saldo, o botão de compra diz "Acesso negado · saldo insuficiente" e quanto falta.
5. **Animação curta ou discreta, e opcional.** Nada bloqueia nem toca som sozinho. Com "reduzir movimento", tudo para.
6. **Nada inventado.** Duração, recompensa e progresso só aparecem quando vêm do conteúdo ou do progresso salvo.

## Paleta (tema padrão `draconic`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--void`, `--color-base-100` | `#050505` | Fundo, preto absoluto |
| `--titanium-900` … `--titanium-200`, `--color-base-200/300` | `#0e0f11` … `#a9aeb8` | Superfícies, bordas e titânio fosco |
| `--ember-red`, `--color-primary` | `#ff3333` | Destaque: fogo de dragão e alerta crítico |
| `--gold-anodized`, `--color-success` | `#dccb94` | Medalhas, conquistas e sucesso |
| `--amber` | `#ffb340` | Compra disponível, foco do teclado, preços |
| `--heading` | `#ffffff` | Títulos (21:1 sobre o fundo) |
| `--spectral`, `--color-base-content` | `#c9ccd4` | Texto de leitura |
| `--muted-foreground` | texto 68% sobre a superfície | Texto secundário (≥ 5,5:1) |
| `--line`, `--line-strong`, `--line-hot` | derivados | Linhas de 1 px (11%, 22% e a cor do tema) |
| `--glass`, `--glass-strong`, `--blur` | 74%, 92%, 12 px | Vidro fumado |
| `--glow`, `--monitor` | derivados | Brilho e cor dos circuitos de fundo |
| `--cut`, `--cut-sm` | 8 px, 5 px | Chanfro dos botões |
| `--space-1` … `--space-7` | 4 a 48 px | Espaçamento |

Os nomes antigos (`--bronze`, `--candle`, `--ember`, `--ivory`) continuam valendo e apontam para os novos.

### Temas

- **Forja Dracônica** (padrão): preto absoluto e vermelho-brasa.
- **Código de Sangue** (90 moedas): ciano neon sobre preto puro, com linhas horizontais de monitoramento carmim.
- **Catedral de Silício** (90 moedas): monocromático em branco espectral e titânio, com varredura vertical discreta.
- **Outros temas:** Biblioteca dos Condenados e Dragão (gratuitos), Ciano, Arcano e os quatro da sala de troféus. Todos usam as mesmas linhas, vidro e chanfros na cor de cada um.

Quem nunca escolheu um tema e estava num padrão anterior (Biblioteca ou Dragão) passa à Forja Dracônica. Compras e escolhas feitas de propósito continuam valendo.

## Tipografia

O problema antigo era a fonte fraktur nos títulos principais e o Cinzel em caixa mista (as minúsculas viram versaletes miúdos). Agora:

| Papel | Fonte | Ajuste |
| --- | --- | --- |
| Títulos `h1`–`h3`, `gx-h1`/`gx-h2`/`gx-h3`, `gx-title`, `gx-display`, `gx-brand` | Cinzel | Maiúsculas, `letter-spacing` de .05–.1em, `line-height` de 1,2–1,28, peso 600–700, branco puro |
| Leitura e controles | Inter | 15 px, entrelinha 1,65 |
| Código, preços, rótulos e dados | JetBrains Mono | Sem ligaduras |

Os títulos internos das aulas (`.study-prose`, `.pentest-prose`) e `.gx-plain-heading` ficam em Inter, sem caixa alta.

Todas as fontes são SIL OFL 1.1, empacotadas pelo Fontsource (subconjuntos latino e latino estendido).

## Componentes

| Classe ou componente | O que é |
| --- | --- |
| `gx-glass` | Vidro fumado: preto translúcido, desfoque e borda de 1 px. |
| `gx-panel` | O `Card`: vidro com um brilho fino no alto. |
| `gx-frame` | Moldura de destaque com cantoneiras de HUD. As linhas pulsam (`dataPulse`) e um pacote de dados corre pela borda de cima (`dataRun`). |
| `gx-pulse` | Adiciona o pacote de dados à borda de qualquer elemento. |
| `gx-btn` | Botão de cantos vivos com chanfro. A linha é o `::before` e o preenchimento o `::after`, no mesmo polígono. O brilho é um `drop-shadow` que acende no hover. |
| `gx-btn-plate`, `gx-btn-ember`, `gx-btn-outline`, `gx-btn-stone`, `gx-btn-ghost` | Variantes. |
| `gx-buy` / `gx-denied`, `BuyButton` | Compra com saldo (brilho âmbar) ou "Acesso negado · saldo insuficiente" (carmim apagado, legível). |
| `gx-gauge` + `gx-gauge-fill`, `Gauge`, `Progress` | Medidor em blocos de luz. Quando o valor sobe (`useRise`), o preenchimento ganha `is-charging`: uma onda de brasa corre pelos blocos. |
| `PrismFlame` | Fogueira digital: um prisma de 1 px sobre um nó de servidor, que acende uma chama geométrica. Aparece nos pontos de controle e nos marcadores da trilha. |
| `SanctuaryScene` + `Bonfire` | Catedral digital: arcos ogivais, colunas-trilha, piso em grade, friso de escamas e a rosácea-circuito, com a fogueira no altar. |
| `RelicArt`, `HoloPedestal` | Relíquia flutuando sobre um pedestal de luz holográfica (projetor, feixe e anéis em SVG). |
| `gx-niche`, `.trophy-niche` | Nichos de vidro do relicário e da sala de troféus. |
| `gx-counter` | Terminal do mercador: vidro com linhas de varredura e linha de brasa. |
| `gx-inscription`, `gx-rule` | Rótulo em mono entre marcadores; divisor de 1 px. |
| `Seal`, `SealMark`, `Crest` | Selo de bloqueio e brasão de área. |

O fundo da página é uma camada fixa com as escamas em circuito (`--circuit-scales`, mascarada na cor `--monitor`), a brasa no alto e uma vinheta. A sala de troféus usa os arcos ogivais em circuito (`--circuit-arches`).

**Desempenho.** Em telas de até 767 px (celular e app Android), cartões, nichos e o terminal trocam o desfoque por vidro mais opaco, para a rolagem ficar leve. Sem suporte a `backdrop-filter`, ou com `prefers-reduced-transparency`, as superfícies ficam sólidas.

## Animações

| Efeito | Quando | Duração |
| --- | --- | --- |
| `dataPulse` | Linhas das molduras, botão principal em hover e botão de compra | 1,8–3,6 s, contínuo e discreto |
| `dataRun` | Pacote de dados na borda das molduras | 4,8 s |
| Carga do medidor (`gx-charge`, `gx-sweep`) | O XP ou o progresso subiu | 1,2 s, uma vez |
| Prisma da fogueira | Flutua, a chama cintila e soltam-se faíscas | Contínuo; pausa com a página oculta |
| Relíquia flutuando | Sobre o pedestal | 4,5 s |
| Tela de carregamento, entrada da página, brasas, medalhão e "Provação superada" | Como antes | 720 ms, 420 ms, < 1 s, 700 ms, 2,6 s |

Com `prefers-reduced-motion: reduce`, nada disso se move.

## Como usar em uma tela nova

- Use `Card` (já é vidro) e `Button` (já tem chanfro e brilho).
- Para compras, use `BuyButton`.
- Para um título de seção, use `SectionHeading`, ou `h2`/`h3` direto: a calibração já vem no CSS base.
- Para progresso, use `Progress` ou `Gauge`, sempre com o número escrito.
- Não crie cores novas fora dos tokens. Derive de `--primary`, `--ember-red`, `--gold-anodized` ou `--amber`.
