# Referências e licenças

Este documento acompanha a página **Referências** do site. A fonte de verdade é o código em `src/pages/ReferencesPage.tsx`.

## Bibliotecas de design

| Biblioteca | Licença | Onde é usada |
| --- | --- | --- |
| shadcn/ui (sobre Radix UI) | MIT | `src/components/ui`: botões, diálogos, formulários, seletores, abas e avisos. |
| daisyUI | MIT | Temas de cor no `src/index.css` e os componentes `stat` e `radial-progress`. Só esses dois componentes entram no CSS final. |
| Motion | MIT | `Providers.tsx` (`MotionConfig reducedMotion="user"`), `components/motion/*`, transição entre páginas, vidas da revisão. |
| Rive | MIT (runtime) | `components/rive/RiveSlot.tsx`. O motor WebAssembly vai junto do site (funciona offline) e só é baixado quando existe um `.riv`. |
| React Bits | MIT + Commons Clause | `components/reactbits/`: DecryptedText, CountUp, ShinyText e SpotlightCard, copiados do repositório oficial. |

### React Bits e a Commons Clause

A licença permite usar os componentes **como parte de um aplicativo, site ou produto**. Não permite vender, sublicenciar ou redistribuir os componentes em si (sozinhos, em pacote ou portados). Por isso:

- só quatro componentes foram copiados e eles ficam dentro deste app;
- o texto da licença está em `src/components/reactbits/LICENSE.md`;
- se este repositório for ofertado como um "kit de componentes", retire essa pasta.

## Projetos estudados (ideias, não código)

| Projeto | Licença | O que inspirou |
| --- | --- | --- |
| [Lingo — Duolingo Clone](https://github.com/sanidhyy/duolingo-clone) | MIT | Vidas, missões e loja de pontos. |
| [Duolingo Next.js](https://github.com/RikhiSingh/Duolingo-Clone) | MIT | Estrutura da lição curta e confirmação ao sair. |
| [Habitica](https://github.com/HabitRPG/habitica) | Código GPL v3, arte CC BY-NC-SA 3.0 | Recompensas pessoais e sequência. |

Nenhum código, imagem ou texto desses projetos foi copiado. Código GPL e arte CC BY-NC-SA não combinam com a licença deste projeto, então só as ideias foram usadas, reescritas do zero para segurança de IA.

## Fora do escopo

- Ligas e placares: exigem contas e servidor.
- Moedas compradas com dinheiro: não existem; moedas só vêm do estudo.
