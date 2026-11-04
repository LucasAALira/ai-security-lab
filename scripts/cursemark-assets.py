#!/usr/bin/env python3
"""Gera os assets do tema Cursemark a partir das artes originais em `design/cursemark/`.

    python3 scripts/cursemark-assets.py

Entradas (não são publicadas com o site):
  design/cursemark/bosses-folha-original.png   folha 4 × 2 com os chefes (RGBA, fundo transparente)
  design/cursemark/ruinas-original.png         cenário de ruínas góticas em pixel art

Saídas (em public/assets/cursemark/):
  chefes/<forma>.png   um sprite por arquétipo de chefe, recortado rente ao desenho
  ruinas.png           cenário de ruínas, em paleta reduzida (o pixel continua à mostra)
  ruinas-faixa.png     faixa baixa do cenário, para o rodapé e para molduras largas

A ordem da folha segue os arquétipos de `BossShape` (src/components/gothic/BossArt.tsx):
  linha 1: guardia, sombra, cavaleiro, juiza
  linha 2: maquina, gelo, peconha, (vazio)
"""
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "design" / "cursemark"
DESTINO = RAIZ / "public" / "assets" / "cursemark"

FORMAS = ["guardia", "sombra", "cavaleiro", "juiza", "maquina", "gelo", "peconha", None]
COLUNAS, LINHAS = 4, 2
# Alfa mínimo para contar como "desenho" ao calcular o recorte: a névoa fina em volta de alguns
# chefes (o gelo, o vulto) não deve alargar o quadro, mas continua no sprite.
ALFA_RECORTE = 40
MARGEM = 6  # px: tira as linhas de emenda entre as células da folha


def quantizar(img: Image.Image, cores: int) -> Image.Image:
    """Paleta reduzida (com alfa) para o arquivo ficar leve sem perder o aspecto de pixel art."""
    return img.quantize(colors=cores, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE)


def recortar_chefes() -> None:
    folha = Image.open(ORIGEM / "bosses-folha-original.png").convert("RGBA")
    largura, altura = folha.size
    cw, ch = largura / COLUNAS, altura / LINHAS
    saida = DESTINO / "chefes"
    saida.mkdir(parents=True, exist_ok=True)
    for i, forma in enumerate(FORMAS):
        if forma is None:
            continue
        col, lin = i % COLUNAS, i // COLUNAS
        caixa = (
            round(col * cw) + MARGEM,
            round(lin * ch) + MARGEM,
            round((col + 1) * cw) - MARGEM,
            round((lin + 1) * ch) - MARGEM,
        )
        celula = folha.crop(caixa)
        alfa = celula.getchannel("A").point(lambda v: 255 if v >= ALFA_RECORTE else 0)
        bbox = alfa.getbbox()
        if bbox is None:
            raise SystemExit(f"célula vazia: {forma}")
        pad = 4
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(celula.width, bbox[2] + pad), min(celula.height, bbox[3] + pad))
        sprite = celula.crop(bbox)
        # RGB sob alfa 0 vira preto: não vaza cor na quantização nem na borda ao reduzir.
        r, g, b, a = sprite.split()
        preto = Image.new("L", sprite.size, 0)
        mascara = a.point(lambda v: 255 if v > 0 else 0)
        sprite = Image.merge("RGBA", (Image.composite(r, preto, mascara), Image.composite(g, preto, mascara), Image.composite(b, preto, mascara), a))
        quantizar(sprite, 160).save(saida / f"{forma}.png", optimize=True)
        print(f"chefes/{forma}.png  {sprite.width}×{sprite.height}")


def preparar_cenario() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    ruinas = Image.open(ORIGEM / "ruinas-original.png").convert("RGB")
    quantizar(ruinas.convert("RGBA"), 96).save(DESTINO / "ruinas.png", optimize=True)
    print(f"ruinas.png  {ruinas.width}×{ruinas.height}")
    # Faixa baixa: o piso de lajes e os pés das colunas, com as duas tochas.
    faixa = ruinas.crop((0, int(ruinas.height * 0.58), ruinas.width, ruinas.height))
    quantizar(faixa.convert("RGBA"), 64).save(DESTINO / "ruinas-faixa.png", optimize=True)
    print(f"ruinas-faixa.png  {faixa.width}×{faixa.height}")


if __name__ == "__main__":
    recortar_chefes()
    preparar_cenario()
