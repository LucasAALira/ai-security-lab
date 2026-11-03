# -*- coding: utf-8 -*-
"""Desenha o fundo do Santuário do Conhecimento em pixel art, para casar com a arte dos heróis.

Tudo aqui é original e sai de geometria: a nave é uma parede de fundo com três vãos de arco
ogival, pilares entre eles, uma cornija e o piso de lajes em perspectiva. A luz é fria pelas
janelas e quente no chão, do lado em que a fogueira fica.

Pixel art quer poucas cores e degradê por trama, não por mistura: as rampas abaixo têm seis
tons cada e o meio-tom entre dois vizinhos sai de uma matriz de Bayer 4 × 4.

    python3 scripts/cena-santuario.py public/assets/santuario.png
"""
import sys

import numpy as np
from PIL import Image

L, A = 480, 168
CHAO = 112                      # linha onde a parede do fundo encontra o piso
FUGA_X = 408                    # ponto de fuga do piso: do lado da fogueira

PEDRA = ['#05070c', '#0a0e18', '#111726', '#1a2234', '#273047', '#38435e']
BRASA = ['#0b0a0d', '#1d140f', '#3a2314', '#5e3618', '#8a4d1d', '#b96a24']
VIDRO = ['#0c111d', '#16233a', '#223150', '#2f4a74', '#3d5f93', '#5076ad']

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0
Y, X = np.mgrid[0:A, 0:L]


def rampa(cores):
    return np.array([[int(c[i:i + 2], 16) for i in (1, 3, 5)] for c in cores], dtype=np.uint8)


def trama(valor):
    """Índice de rampa com meio-tom: o Bayer decide quem sobe para o tom seguinte."""
    limiar = np.tile(BAYER, (A // 4 + 1, L // 4 + 1))[:A, :L]
    return np.clip(np.floor(np.clip(valor, 0, 5.999) + limiar), 0, 5).astype(int)


def pinta(img, onde, valor, cores):
    cor = rampa(cores)[trama(valor if np.ndim(valor) else np.full((A, L), float(valor)))]
    img[onde] = cor[onde]


def ogiva(cx, larg, nascenca, base):
    """Vão de arco ogival equilátero: os dois arcos têm raio igual à largura e centro no pé
    oposto, então se encontram em ponta a 0,87 largura acima da nascença."""
    meia = larg / 2
    faixa = np.abs(X - cx) <= meia
    corpo = faixa & (Y >= nascenca) & (Y <= base)
    esq = np.hypot(X - (cx - meia), Y - nascenca) <= larg
    dir = np.hypot(X - (cx + meia), Y - nascenca) <= larg
    return corpo | (faixa & (Y < nascenca) & esq & dir)


def cena():
    img = np.zeros((A, L, 3), dtype=np.uint8)

    # parede do fundo, clareando de baixo para cima, com as fiadas de pedra aparecendo de leve
    parede = Y < CHAO
    valor = 3.2 - (Y / CHAO) * 2.0
    fiada = (Y % 9 == 0).astype(float) * 0.55
    junta = (((X + (Y // 9) * 11) % 22) < 1).astype(float) * 0.45
    pinta(img, parede, valor - fiada - junta, PEDRA)

    # três vãos; o do meio nasce mais alto
    for cx, larg, nasc in ((96, 56, 60), (240, 64, 52), (384, 56, 60)):
        vao = ogiva(cx, larg, nasc, CHAO - 8)
        moldura = ogiva(cx, larg + 8, nasc - 4, CHAO - 4)
        pinta(img, moldura & ~vao, 4.4, PEDRA)
        # luz fria: mais forte no alto do vão e caindo para as beiradas
        luz = 5.4 - np.abs(X - cx) / (larg * 0.5) - np.clip((Y - nasc + larg * 0.87) / 64, 0, 2.6)
        pinta(img, vao, luz, VIDRO)
        # caixilho: montantes e travessa
        montante = np.abs(((X - cx + larg / 2) % 13) - 0.5) < 1.1
        travessa = np.abs(Y - (nasc + 16)) < 1.1
        pinta(img, vao & (montante | travessa), 1.2, PEDRA)

    # pilares com capitel e base; a face voltada para a fogueira pega a luz
    for cx in (24, 168, 312, 456):
        fuste = (np.abs(X - cx) <= 8) & (Y < CHAO)
        claro = np.where(X > cx, 5.0, 2.4) - np.abs(X - cx) / 9
        pinta(img, fuste, claro, PEDRA)
        capitel = (np.abs(X - cx) <= 11) & (np.abs(Y - 44) <= 3)
        base = (np.abs(X - cx) <= 11) & (Y >= CHAO - 10) & (Y < CHAO)
        pinta(img, capitel | base, 5.0, PEDRA)

    # cornija: duas linhas atravessando a nave no alto
    pinta(img, (np.abs(Y - 26) < 1.2) | (np.abs(Y - 30) < 0.9), 4.6, PEDRA)

    # piso: as lajes encolhem na direção do fundo
    chao = Y >= CHAO
    t = np.clip((Y - CHAO) / (A - CHAO), 1e-3, 1)          # 0 no horizonte, 1 na frente
    pinta(img, chao, 0.9 + t * 2.0, PEDRA)
    for n in range(-7, 8):                                  # juntas que convergem para o ponto de fuga
        pinta(img, chao & (np.abs(X - (FUGA_X + n * 96 * t)) < 0.6 + t * 0.9), 3.6 + t * 1.6, PEDRA)
    for k in range(1, 8):                                   # fiadas, mais juntas lá no fundo
        y = CHAO + (A - CHAO) * (k / 7) ** 1.8
        pinta(img, chao & (np.abs(Y - y) < 1.0), 3.4 + t * 1.4, PEDRA)

    # brasa no chão, do lado da fogueira
    calor = np.clip(4.2 - np.hypot((X - FUGA_X) / 62, (Y - 138) / 22), 0, None)
    quente = calor > 0.3
    peso = np.clip(calor / 5.0, 0, 0.9)[..., None]
    brasa = rampa(BRASA)[trama(calor)]
    img[quente] = (img[quente] * (1 - peso[quente]) + brasa[quente] * peso[quente]).astype(np.uint8)

    # vinheta: as beiradas somem no escuro e o lado do texto fica mais fundo ainda
    canto = np.clip(1.18 - np.hypot((X - L * 0.62) / (L * 0.72), (Y - A / 2) / (A * 0.86)), 0, 1)
    img = (img * canto[..., None]).astype(np.uint8)

    # poeira de brasa subindo
    rng = np.random.default_rng(11)
    for _ in range(22):
        x, y = int(rng.normal(FUGA_X, 38)), int(rng.normal(108, 22))
        if 0 <= x < L and 0 <= y < A:
            img[y, x] = (0x8a, 0x4d, 0x1d)
    return Image.fromarray(img, 'RGB')


if __name__ == '__main__':
    im = cena()
    im.quantize(colors=48, method=Image.MAXCOVERAGE).save(sys.argv[1], optimize=True)
    print(sys.argv[1], im.size)
