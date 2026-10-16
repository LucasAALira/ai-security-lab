# Animações Rive

O site tem dois espaços prontos para animações do [Rive](https://rive.app). Sem nenhum arquivo aqui,
tudo funciona com a ilustração padrão. Para usar uma animação sua, salve o arquivo `.riv` nesta pasta
(`src/assets/rive/`) com o nome da tabela e gere o site de novo com `npm run build`:

| Arquivo        | Onde aparece                                  | Máquina de estados (opcional) |
| -------------- | --------------------------------------------- | ----------------------------- |
| `hero.riv`     | Ilustração do topo da página inicial          | `Hero`                        |
| `celebrate.riv`| Fim de uma revisão concluída com vidas        | `Celebrate`                   |

- O nome do arquivo precisa ser exatamente o da tabela.
- Se o arquivo não existir, não abrir ou a pessoa usar "reduzir movimento" no sistema, aparece a ilustração padrão.
- A biblioteca do Rive só é baixada quando há um `.riv`; o motor (WebAssembly) vem junto do site e funciona offline.
- Use apenas animações próprias ou com licença que permita o uso. O repositório não traz nenhum `.riv`.
