# Créditos dos arquivos em `public/assets`

| Arquivo | O que é | Origem e licença |
| --- | --- | --- |
| `dragon-lock.png` | Brasão de dois dragões em volta de um cadeado — a marca do site. | Arte do próprio projeto. |
| `fogueira.png` | Fogueira em pixel art com a espada fincada, usada na cena do santuário. | **Fornecida pelo autor do projeto** (Lucas), que respondeu pela origem. O arquivo aqui foi só recortado, teve o fundo branco tornado transparente e foi reduzido para 73 × 144 px, recortado rente ao desenho para a base da lenha encostar na mesma linha de chão dos pés do personagem. Antes de publicar o site fora do uso pessoal, confirme a licença de origem e registre-a nesta linha. |
| `herois/` | Os seis caminhos do santuário (Cavaleiro, Ladrão, Clérigo, Mago, Sábio, Anão), três trajes cada: 18 arquivos. | **Fornecidas pelo autor do projeto** (Lucas), que respondeu pela origem. Aqui cada personagem foi só recortado da folha original (as divisões saem da própria imagem, para não cortar escudo nem capa), teve o preto do fundo tornado transparente e foi reduzido para 320 px de altura em PNG de 200 cores. Antes de publicar o site fora do uso pessoal, confirme a licença de origem e registre-a nesta linha. |
| `santuario.png` | A nave do santuário em pixel art, fundo do topo da página inicial. | Arte do próprio projeto: gerada por `scripts/cena-santuario.py`, só com geometria e uma paleta de 18 cores. |
| `cursemark/` | O tema pixel art do site: `chefes/` (sete sprites de chefe), `ruinas.png` e `ruinas-faixa.png` (cenário de ruínas góticas) e `dragon-lock-pixel.png` (a marca em 56 × 56 px, usada como máscara). | **Fornecidas pelo autor do projeto** (Lucas), que respondeu pela origem: a folha de chefes e o cenário. Aqui os chefes foram só recortados da folha, rente ao desenho, e o cenário reduzido a uma paleta menor, por `scripts/cursemark-assets.py`; os originais estão em `design/cursemark/`. A marca em pixel é derivada de `dragon-lock.png`. Antes de publicar o site fora do uso pessoal, confirme a licença de origem e registre-a nesta linha. |
| `relics/` | Figuras das relíquias. | Geradas por `scripts/make-relics.py`; detalhes em `relics/CREDITS.md`. |

O cavaleiro do topo da página é outra coisa: é desenho vetorial feito neste projeto
(`src/components/gothic/KnightArt.tsx`), que vai se equipando conforme o progresso.
