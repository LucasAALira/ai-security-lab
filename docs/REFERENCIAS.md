# Referências e licenças

Este documento acompanha a página **Referências** do site. A fonte de verdade é o código em `src/pages/ReferencesPage.tsx`.

## Bibliotecas de design

| Biblioteca | Licença | Onde é usada |
| --- | --- | --- |
| shadcn/ui (sobre Radix UI) | MIT | `src/components/ui`: botões, diálogos, formulários, seletores, abas e avisos. |
| daisyUI | MIT | Temas de cor no `src/index.css` e os componentes `stat` e `radial-progress`. Só esses dois componentes entram no CSS final. |
| Motion | MIT | `Providers.tsx` (`MotionConfig reducedMotion="user"`), `components/motion/*`, vidas da revisão e a detecção de "reduzir movimento" nas animações da identidade gótica. A transição entre páginas é CSS (`gx-page-enter`). |
| Rive | MIT (runtime) | `components/rive/RiveSlot.tsx`. O motor WebAssembly vai junto do site (funciona offline) e só é baixado quando existe um `.riv`. |
| React Bits | MIT + Commons Clause | `components/reactbits/`: CountUp e SpotlightCard, copiados do repositório oficial. (DecryptedText e ShinyText saíram com o novo início.) |
| Relíquias (arte própria) | do projeto | `public/assets/relics/`: SVG originais gerados por `scripts/make-relics.py`. Até a versão anterior eram símbolos de Game-icons.net (CC BY 3.0), todos substituídos. |
| Cinzel, Inter, JetBrains Mono (Fontsource) | SIL OFL 1.1 | `src/styles/fonts.css`: só os subconjuntos latino e latino estendido, empacotados (sem internet). Acentos do português conferidos nos arquivos. |

### React Bits e a Commons Clause

A licença permite usar os componentes **como parte de um aplicativo, site ou produto**. Não permite vender, sublicenciar ou redistribuir os componentes em si (sozinhos, em pacote ou portados). Por isso:

- só dois componentes foram copiados e eles ficam dentro deste app;
- o texto da licença está em `src/components/reactbits/LICENSE.md`;
- se este repositório for ofertado como um "kit de componentes", retire essa pasta.

## Projetos estudados (ideias, não código)

| Projeto | Licença | O que inspirou |
| --- | --- | --- |
| [Lingo — Duolingo Clone](https://github.com/sanidhyy/duolingo-clone) | MIT | Vidas, missões e loja de pontos. |
| [Duolingo Next.js](https://github.com/RikhiSingh/Duolingo-Clone) | MIT | Estrutura da lição curta e confirmação ao sair. |
| [Habitica](https://github.com/HabitRPG/habitica) | Código GPL v3, arte CC BY-NC-SA 3.0 | Recompensas pessoais e sequência. |

Nenhum código, imagem ou texto desses projetos foi copiado. Código GPL e arte CC BY-NC-SA não combinam com a licença deste projeto, então só as ideias foram usadas, reescritas do zero para segurança de IA.

## Referências da identidade visual (examinadas, nada copiado)

Conferidas em 17/10/2026, com clone dos repositórios e leitura dos arquivos de licença.

| Projeto | Licença | O que foi aproveitado |
| --- | --- | --- |
| [RPGUI](https://github.com/RonenNess/RPGUI) | Código zlib; arte padrão em domínio público | A ideia de molduras com borda dupla, variantes douradas e barras de progresso. O estilo pixelado não combina com o gótico, então nenhum arquivo foi usado. |
| [DarkSoulsNotification](https://github.com/rmarchet/DarkSoulsNotification) | Código MIT; o arquivo de som é do jogo | A composição da faixa central com máscara em degradê e o "eco" do texto. Reescrita em `gx-banner`, sem som e sem bloquear a página. |
| [projeto-darksouls](https://github.com/Gatapericles/projeto-darksouls) | Sem licença; imagens e fonte do jogo | Só observado: página de entrada com um chamado em destaque. |
| [CastlevaniaJS](https://github.com/Viet281101/CastlevaniaJS) | Código MIT; gráficos CC BY-NC-SA 4.0 e sprites de terceiros | Ambientação (castelo, vitrais, biblioteca). A cena do Santuário é SVG próprio. |
| [rpgui (ApiO)](https://github.com/ApiO/rpgui) | MIT | Organização de barras de status sempre visíveis → cabeçalho compacto. |

## Fora do escopo

- Ligas e placares: exigem contas e servidor.
- Moedas compradas com dinheiro: não existem; moedas só vêm do estudo.
