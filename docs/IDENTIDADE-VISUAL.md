# Identidade visual: Cursemark — pixel art gótica, pedra e brasa

O site veste o visual de um RPG de ação em pixel art: ruínas góticas cobertas de musgo, pedra escura, luz de tocha e molduras de bronze com cantos chanfrados em degraus. **Só a aparência muda**: títulos, textos, rotas, regras de XP e dados continuam os mesmos. O nome "Forja Dracônica" segue como o nome do tema padrão (`draconic`) e dos rótulos do site.

A arte do cenário e dos chefes foi fornecida pelo autor do projeto (veja `public/assets/CREDITS.md`). Nenhum nome de franquia aparece em `src/`: o teste `src/lib/originalidade.test.ts` barra isso.

Arquivos:

- `src/styles/gothic.css`: tokens e componentes (`gx-*`);
- `src/styles/fonts.css`: fontes;
- `src/index.css`: temas (daisyUI), raios zerados, prosa das aulas, sala de troféus;
- `src/components/gothic/`: `BossArt`, `SanctuaryBackdrop`, selos, medalhas;
- `public/assets/cursemark/`: cenário (`ruinas.png`, `ruinas-faixa.png`), marca em pixel (`dragon-lock-pixel.png`) e os sete chefes (`chefes/`);
- `scripts/cursemark-assets.py`: recorta a folha de chefes e reduz o cenário a partir de `design/cursemark/`.

## Regras

1. **O pixel é o desenho.** Nada de cantos arredondados, blur ou degradê suave: cantos chanfrados por `clip-path`, sombras duras (`2px 2px 0`), `image-rendering: pixelated` nas imagens e `shape-rendering: crispEdges` nos SVG.
2. **A leitura vem primeiro.** O cenário fica atrás de um véu com granulado e vinheta; a área de leitura é sólida o bastante para o contraste AA.
3. **Nome temático sempre com a função.** "Provações" vem com "Desafios de código". Termos técnicos nunca são trocados por ficção.
4. **Nada depende só da cor.** Seleção tem linha acesa e `aria-pressed`/`aria-current`; chefe vencido fica em cinza de pedra, mas também diz "vitórias" no texto.
5. **Movimento em passos (`steps()`), curto e opcional.** Com `prefers-reduced-motion`, tudo para.
6. **Nada inventado.** Duração, recompensa e progresso só aparecem quando vêm do conteúdo ou do progresso salvo.

## Paleta (tema padrão `draconic`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--void`, `--color-base-100` | `#0a0e0f` | Fundo: preto-azulado de caverna |
| `--titanium-950` … `--titanium-200` | `#0d1213` … `#cfc7b0` | Pedra: superfícies, bordas e texto de apoio |
| `--ember-red`, `--color-primary` | `#e0773a` | Brasa de tocha: destaque e foco de leitura |
| `--amber` | `#f2b04a` | Ação disponível, foco do teclado, preços |
| `--gold-anodized` | `#d9b866` | Ouro velho: conquistas e medalhas |
| `--moss`, `--fog` | `#9fb04a`, `#8fb0ad` | Sucesso e informação (musgo e névoa) |
| `--heading`, `--spectral` | `#f4ead0`, `#d9d0b9` | Osso nos títulos, pergaminho na leitura |
| `--px`, `--px-lg` | 2 px, 3 px | O "pixel" da interface: controles e molduras grandes |

Os temas da loja continuam sendo recolorações da mesma paleta, escolhidas por `data-theme`; as molduras, os chanfros e as fontes são os mesmos em todos.

## Tipografia

| Papel | Fonte | Ajuste |
| --- | --- | --- |
| `h1`, `gx-display`, `gx-brand`, `gx-inscription`, faixas | Press Start 2P (`--font-pixel`) | Maiúsculas, tamanho controlado (`clamp(16px, 2.1vw, 24px)` no `h1`) |
| Leitura, `h2`/`h3`, botões, rótulos e dados (`--font-sans`, `--font-mono`) | Pixelify Sans | Caixa mista: em maiúsculas o C, o O e o G ficam iguais |
| Código (`font-code`) | JetBrains Mono | Só código: linhas, `<code>`, payloads |

Todas as fontes são SIL OFL 1.1, empacotadas pelo Fontsource (latino e latino estendido). Cinzel e Inter continuam empacotadas só para os temas antigos.

## Componentes

| Classe ou componente | O que é |
| --- | --- |
| `gx-glass`, `gx-panel` | Superfície de pedra: fundo sólido, canto chanfrado, anel interno em sombras `inset` e bisel. |
| `gx-frame` | Moldura de destaque em bronze, com pinos nos quatro cantos. |
| `gx-btn` + `-plate`/`-ember`/`-outline`/`-stone`/`-ghost` | Botões com bisel; ao apertar, descem 2 px. O foco é um contorno de 2 px em degraus, desenhado por sombras (o `clip-path` cortaria um `outline`). |
| `gx-buy` / `gx-denied` | Compra com saldo (âmbar) ou "Acesso negado · saldo insuficiente". |
| `gx-field`, `gx-pop`, `gx-chip` | Campos, menus e etiquetas (`Input`, `Select`, `Tooltip`, `Badge`, `Tabs`…). |
| `gx-gauge` | Medidor em blocos de 10 px, com três faixas de cor. |
| `SanctuaryBackdrop` + `BonfireScene` | As ruínas ao fundo do topo da página inicial, com a fogueira e o personagem no piso; faíscas em passos e luz de tocha que segue o ponteiro. |
| `BossArt`, `BossPortrait` | O chefe de cada módulo, um sprite por arquétipo (`BossShape`): sentinela, sombra, cavaleiro, juíza, máquina, gelo e peçonha. Chefe que ainda não caiu aparece em cores; o vencido fica em cinza de pedra. |
| `BattleGallery` | Cenário das ruínas com o herói e o chefe frente a frente, e o seletor de quadros. |

O fundo da página é uma camada fixa com as ruínas, véu escuro, granulado de 2 × 2 px e vinheta. Em telas de até 767 px o desfoque some e as superfícies ficam mais opacas, para a rolagem ficar leve.

## Como usar em uma tela nova

- Use `Card` e `Button`: já trazem chanfro, bisel e foco.
- Para compras, `BuyButton`; para progresso, `Progress` ou `Gauge`, sempre com o número escrito.
- Para título de seção, `SectionHeading` ou `h2`/`h3` direto: a calibração vem do CSS base.
- Código vai em `font-code`; rótulos e dados em `font-mono` (que agora é a Pixelify Sans).
- Não crie cores fora dos tokens; derive de `--primary`, `--ember-red`, `--gold-anodized` ou `--amber`.
- Não use `rounded-*`, blur nem sombra suave: o CSS zera os raios, mas o desenho deve nascer reto.
