# -*- coding: utf-8 -*-
"""Recorta os personagens das folhas de arte sem cortar nada deles.

As folhas são as duas imagens que o autor do projeto trouxe: três cartões por folha, cada um
com uma figura grande à esquerda e duas menores empilhadas à direita. O que sai daqui vai para
`public/assets/herois` — a origem está registrada em `public/assets/CREDITS.md`.


A versão anterior fatiava o cartão em frações fixas e a fatia da figura grande terminava em
60% da largura — o escudo do cavaleiro passava disso e saía cortado. Aqui as divisões saem da
própria imagem: acha-se a coluna vazia entre a figura grande e a coluna das duas menores, e a
linha vazia entre elas. E o fundo só é apagado onde é mesmo fundo (quase preto), para o
contorno escuro do desenho não ser comido junto.
"""
import numpy as np
from PIL import Image
from scipy import ndimage

FUNDO = 24        # soma de R+G+B abaixo disso, já sem chuvisco, é fundo de verdade
RUIDO = 0.0015    # pedaço menor que isto (fração do cartão) é sujeira de compressão


def sem_fundo(rgb):
    """Alfa 0 no fundo ligado à borda; o resto fica opaco.

    A folha veio de compressão com perda, então o preto do fundo chega salpicado de pixels
    mais claros. A mediana de 3 × 3 apaga esse salpico sem mexer no desenho — e, de quebra,
    preserva o contorno preto da figura, que é linha fina e não sobrevive à mediana como
    escuro. Era esse contorno que o recorte anterior comia, abrindo buracos no corpo."""
    escuro = ndimage.median_filter(rgb.sum(2), size=3) < FUNDO
    rot, _ = ndimage.label(escuro)
    borda = set(rot[0, :]) | set(rot[-1, :]) | set(rot[:, 0]) | set(rot[:, -1])
    borda.discard(0)
    return ~np.isin(rot, list(borda))


def corredor(perfil, de, ate, folga):
    """Onde cortar entre duas figuras: o meio do maior trecho praticamente vazio da faixa.
    `folga` absorve o chuvisco que a compressão deixa entre as figuras. Quando as figuras
    quase se encostam e não há trecho vazio, vale a coluna mais vazia da faixa."""
    melhor, atual = (0, 0), None
    for i in range(de, ate):
        if perfil[i] <= folga:
            atual = (atual[0], i + 1) if atual else (i, i + 1)
            if atual[1] - atual[0] > melhor[1] - melhor[0]:
                melhor = atual
        else:
            atual = None
    if melhor[1] - melhor[0] >= 3:
        return (melhor[0] + melhor[1]) // 2
    suave = ndimage.uniform_filter1d(perfil.astype(float), 9)
    return de + int(np.argmin(suave[de:ate]))


def sem_sujeira(mask):
    """Tira os respingos soltos: fica só o que tem corpo de desenho."""
    m = mask.copy()
    marcas, n = ndimage.label(ndimage.binary_closing(m, np.ones((5, 5))))
    if n:
        areas = ndimage.sum(np.ones_like(marcas), marcas, index=range(1, n + 1))
        fora = [i + 1 for i, a in enumerate(areas) if a < RUIDO * m.size]
        if fora:
            m[np.isin(marcas, fora)] = False
    return m


def limpa(mask, rgb):
    """Imagem RGBA aparada no conteúdo, sem os pedacinhos de ruído."""
    m = sem_sujeira(mask)
    saida = np.dstack([rgb, np.where(m, 255, 0)]).astype(np.uint8)
    im = Image.fromarray(saida, 'RGBA')
    caixa = im.getbbox()
    return im.crop(caixa) if caixa else im


def sem_moldura(mask):
    """Tira os restos da moldura do cartão.

    Dois sinais, e nenhum deles confunde com gente: o risco comprido e fino que atravessa o
    cartão de lado a lado, e o pedaço pequeno encostado na beirada do recorte. A figura pode
    chegar perto da beirada, então o que é grande fica."""
    m = mask.copy()
    marcas, n = ndimage.label(ndimage.binary_closing(m, np.ones((5, 5))))
    if not n:
        return m
    A, L = m.shape
    beira = set(marcas[0, :]) | set(marcas[-1, :]) | set(marcas[:, 0]) | set(marcas[:, -1])
    beira.discard(0)
    areas = ndimage.sum(np.ones_like(marcas), marcas, index=range(1, n + 1))
    fora = []
    for i, sl in enumerate(ndimage.find_objects(marcas), 1):
        alt, larg = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        risco = (larg > 0.5 * L and alt < 0.05 * A) or (alt > 0.5 * A and larg < 0.05 * L)
        if risco or (i in beira and areas[i - 1] < 0.03 * m.size):
            fora.append(i)
    if fora:
        m[np.isin(marcas, fora)] = False

    # lasca de canto: sem fechamento, para não vir grudada no risco vizinho
    soltas, k = ndimage.label(m)
    if k > 1:
        beira = set(soltas[0, :]) | set(soltas[-1, :]) | set(soltas[:, 0]) | set(soltas[:, -1])
        beira.discard(0)
        areas = ndimage.sum(np.ones_like(soltas), soltas, index=range(1, k + 1))
        lascas = [i for i in beira if areas[i - 1] < 400]
        if lascas:
            m[np.isin(soltas, lascas)] = False
    return m


def cartao(rgb, mask):
    """Devolve as três figuras do cartão: a grande e as duas da coluna da direita."""
    A, L = mask.shape
    util = sem_moldura(sem_sujeira(mask))
    util[int(A * 0.86):, :] = False            # o nome do cartão, no rodapé
    corte = corredor(util.sum(0), int(L * 0.42), int(L * 0.84), A * 0.02)
    direita = util[:, corte:]
    meio = corredor(direita.sum(1), int(A * 0.30), int(A * 0.70), L * 0.02)
    return [
        ('a', util[:, :corte], rgb[:, :corte]),
        ('b', direita[:meio], rgb[:, corte:][:meio]),
        ('c', direita[meio:], rgb[:, corte:][meio:]),
    ]


def folha(caminho, nomes, saida):
    im = Image.open(caminho).convert('RGB')
    cheio = np.array(im)
    L = im.width / len(nomes)
    fora = []
    for i, nome in enumerate(nomes):
        # a moldura clara do cartão fecha o fundo dele: por isso o recorte vem primeiro e só
        # depois se apaga o fundo, a partir da borda já dentro da moldura
        a, b = round(i * L + L * 0.045), round((i + 1) * L - L * 0.045)
        c, d = round(im.height * 0.045), round(im.height * 0.93)
        rgb = cheio[c:d, a:b]
        for papel, m, r in cartao(rgb, sem_fundo(rgb.astype(int))):
            arq = f'{saida}/{nome}-{papel}.png'
            img = limpa(m, r)
            img.save(arq)
            fora.append((f'{nome}-{papel}', img.size))
    return fora


def final(entrada, saida, altura=320, cores=200):
    """Põe todo mundo na mesma altura e grava em PNG de paleta, que é o que vai para o site."""
    from pathlib import Path
    for arq in sorted(Path(entrada).glob('*.png')):
        im = Image.open(arq).convert('RGBA')
        e = altura / im.height
        im = im.resize((max(1, round(im.width * e)), altura), Image.LANCZOS)
        im.putalpha(im.getchannel('A').point(lambda v: 255 if v > 128 else 0))  # pixel art não tem borda macia
        im.quantize(colors=cores, method=Image.FASTOCTREE).save(Path(saida) / arq.name, optimize=True)


if __name__ == '__main__':
    # uso: python3 scripts/recortar-herois.py <folha-1> <folha-2> <pasta de trabalho> <public/assets/herois>
    import sys
    f1, f2, tmp, saida = sys.argv[1:5]
    for s in folha(f1, ['cavaleiro', 'ladrao', 'clerigo'], tmp):
        print(*s)
    for s in folha(f2, ['mago', 'sabio', 'anao'], tmp):
        print(*s)
    final(tmp, saida)
