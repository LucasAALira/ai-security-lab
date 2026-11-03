# -*- coding: utf-8 -*-
"""Peças de personagem em pixel art, 40 x 56, desenhadas para este projeto.

Índices de cor (a paleta de cada arquétipo decide o que cada um vira):
  k contorno | 1 2 3 traje (escuro, médio, claro) | 4 5 6 metal ou couro | 7 acento
  S s pele | E olhos | w W lâmina | m haste | . transparente

Âncoras do corpo: ombros em y=12, cintura em y=24, mão esquerda em (26, 11), mão direita em (26, 28).
As armas são desenhadas a partir dessas mãos, para nada ficar flutuando.
"""

L, A = 40, 56
MAO_ESQ = (26, 10)
MAO_DIR = (26, 27)

def vazio(): return [['.'] * L for _ in range(A)]

def poe(grade, y, x, bloco):
    for i, linha in enumerate(bloco):
        for j, ch in enumerate(linha):
            if ch == '~': continue
            yy, xx = y + i, x + j
            if 0 <= yy < A and 0 <= xx < L: grade[yy][xx] = ch

def monta(camadas):
    g = vazio()
    for y, x, bloco in camadas: poe(g, y, x, bloco)
    return [''.join(r) for r in g]

# ------------------------------------------------------------------ torsos (silhueta do arquétipo)
TORSOS = {
    # placas: ombros marcados, peito de metal
    'placas': [
     "..kkkkkkkkkk..",
     ".k6655556655k.",
     "k66kk2222kk66k",
     "k6k2222222 k6k",
     "k6k22333322k6k",
     "k6k22333322k6k",
     "k6k2233332 k6k",
     ".k22222222 2k.",
     ".k2222222222k.",
     ".k2266662222k.",
     ".k2222222222k.",
     "..k22222222k..",
     "..k77777777k..",
     "..k76666667k..",
     "..k77777777k..",
    ],
    # túnica longa: silhueta em A, desce sobre o quadril
    'tunica': [
     "...kkkkkkkk...",
     "..k11111111k..",
     ".k1122222211k.",
     ".k1222222221k.",
     ".k1223333221k.",
     "k11223333221 k",
     "k12222222222 k",
     "k12222222222 k",
     "k1222222222 1k",
     "k7777777777 7k",
     "k12222222222 k",
     "k122222222221k",
     "k1222222222 1k",
     "k12222222222 k",
     "kk1222222221kk",
    ],
    # couro pesado: ombros largos, peito nu no meio
    'couro': [
     ".kkkkkkkkkkkk.",
     "k444455554444k",
     "k44k222222k44k",
     "k4k22SSSS22k4k",
     "k4k2SSSSSS2k4k",
     "k4k2SSSSSS2k4k",
     "k4k22SSSS22k4k",
     ".k2222222222k.",
     ".k2244442222k.",
     ".k2222222222k.",
     ".k2222222222k.",
     "..k22222222k..",
     "..k44444444k..",
     "..k47777774k..",
     "..k44444444k..",
    ],
    # manto fechado: silhueta lisa, poucas quebras
    'manto': [
     "...kkkkkkkk...",
     "..k11111111k..",
     ".k1111111111k.",
     ".k1111111111k.",
     "k111112211111k",
     "k111122221111k",
     "k111122221111k",
     "k111112211111k",
     "k111111111111k",
     "k117777777711k",
     "k111111111111k",
     "k111111111111k",
     "k111111111111k",
     "k111111111111k",
     "kk1111111111kk",
    ],
}

# braços: ficam por fora do torso, descendo até as mãos
BRACOS = [
 "k44k..........k44k",
 "k442k........k244k",
 "k442k........k244k",
 "k442k........k244k",
 ".k44k........k44k.",
 ".k442k......k244k.",
 ".k442k......k244k.",
 ".k442k......k244k.",
 ".k44k........k44k.",
 "k5555k......k5555k",
 "k5665k......k5665k",
 "k5555k......k5555k",
 ".kkkk........kkkk.",
]

PERNAS = {
    'botas': [
     "..k222kk222k..",
     "..k122kk221k..",
     "..k122kk221k..",
     ".kk122kk221kk.",
     ".k4222kk2224k.",
     ".k4122kk2214k.",
     ".k4122kk2214k.",
     "..k122kk221k..",
     "..k122kk221k..",
     ".kk122kk221kk.",
     ".k44445k4444k.",
     ".k46665k6664k.",
     "kk44445k44444k",
     "kkkkkkkkkkkkkk",
    ],
    'enfaixadas': [
     "..k222kk222k..",
     "..k122kk221k..",
     "..k525kk525k..",
     "..k122kk221k..",
     "..k525kk525k..",
     "..k122kk221k..",
     "..k525kk525k..",
     "..k122kk221k..",
     "..k525kk525k..",
     "..k122kk221k..",
     ".kk5555k555kk.",
     ".k55555k5555k.",
     "kk55555k55555k",
     "kkkkkkkkkkkkkk",
    ],
}

SOMBRA = ["...ssssssssss...", ".ssssssssssssss.", "...ssssssssss..."]

# ------------------------------------------------------------------ cabeças
CABECAS = {
 'elmo': ["..kkkkk..", ".k66666k.", "k6666666k", "k6444446k", "k6kEEEk6k", "k6644446k", ".k66666k.", "..k555k.."],
 'elmo-aberto': ["..kkkkk..", ".k66666k.", "k6666666k", "k6SSkSS6k", "k6EkkkE6k", "k66SSS66k", ".k6SSS6k.", "..k555k.."],
 'elmo-chifres': ["k6kkkkk6k", "k6k666k6k", "k6666666k", "k6444446k", "k6kEEEk6k", "k6644446k", ".k66666k.", "..k555k.."],
 'capuz': ["..kkkkk..", ".k11111k.", "k1111111k", "k11kkk11k", "k1kEsEk1k", "k11sss11k", ".k11111k.", "..k111k.."],
 'chapeu': [".kkkkkkk.", "k1111111k", "kkkkkkkkk", ".k1kkk1k.", ".kksEskk.", "..ksssk..", "..kSSSk..", "...k5k..."],
 'mascara': ["..kkkkk..", ".k11111k.", "k1166611k", "k1666661k", "k16k6k61k", "k1166611k", ".k11111k.", "..k111k.."],
 'nua': ["..kkkkk..", ".k11111k.", "k1111111k", "kSSSSSSSk", "kSEksEsSk", "kSSsssSSk", ".kSSSSSk.", "..k555k.."],
}

# ------------------------------------------------------------------ capas (desenhadas atrás de tudo)
CAPAS = {
 'nenhuma': None,
 'curta': (11, 9, [
  "kk11111111111111kk",
  "k1111111111111111k",
  "k1111111111111111k",
  "k1111111111111111k",
  "k1111111111111111k",
  "k1111111111111111k",
  ".k11111111111111k.",
  ".k11111111111111k.",
  "..k111111111111k..",
  "...kkkkkkkkkkkk...",
 ]),
 'longa': (11, 8, [
  "kk1111111111111111kk",
  "k111111111111111111k",
  "k111111111111111111k",
  "k111111111111111111k",
  "k111111111111111111k",
  "k111111111111111111k",
  "k111111111111111111k",
  "k111111111111111111k",
  ".k1111111111111111k.",
  ".k1111111111111111k.",
  ".k1111111111111111k.",
  "..k11111111111111k..",
  "..k11111111111111k..",
  "...k111111111111k...",
  "....kkkkkkkkkkkk....",
 ]),
 'esfarrapada': (11, 9, [
  "kk11111111111111kk",
  "k1111111111111111k",
  "k1111111111111111k",
  "k1111111111111111k",
  ".k11111111111111k.",
  ".k1k1111111111k1k.",
  ".k1.k11111111k.1k.",
  ".kk..k1k..k1k..kk.",
  ".....k.k..k.k.....",
 ]),
}

# ------------------------------------------------------------------ armas, ancoradas nas mãos
def _coluna(n, ch='m'): return [f"k{ch}k"] * n

ARMAS = {
 'espada-escudo': lambda: [
   (MAO_DIR[0] - 16, MAO_DIR[1] - 1, ["..k..", ".kwk.", ".kWk.", ".kwk.", ".kwk.", ".kwk.", ".kwk.", ".kwk.", ".kwk.", ".kwk.", ".kwk.", "k777k", ".kmk.", ".kmk.", ".k7k."]),
   (MAO_ESQ[0] - 12, MAO_ESQ[1] - 5, [".kkkkkk.", "k444444k", "k466664k", "k467764k", "k467764k", "k466664k", "k455554k", ".k4554k.", ".k4444k.", "..k44k..", "...kk..."]),
 ],
 'duas-laminas': lambda: [
   (MAO_DIR[0] - 9, MAO_DIR[1] - 1, ["kwk", "kWk", "kwk", "kwk", "kwk", "kwk", "k7k", "kmk", "k7k"]),
   (MAO_ESQ[0] - 9, MAO_ESQ[1] + 1, ["kwk", "kWk", "kwk", "kwk", "kwk", "kwk", "k7k", "kmk", "k7k"]),
 ],
 'machado': lambda: [
   (MAO_DIR[0] - 18, MAO_DIR[1] - 3, [".kkkk..", "k666wk.", "k66wWk.", "k6wwWk.", "k66wWk.", "k666wk.", ".kkkk..", "..kmk..", "..kmk..", "..kmk..", "..kmk..", "..kmk..", "..kmk..", "..k7k..", "..kmk..", "..kmk..", "..kmk..", "..kkk.."]),
 ],
 'adagas': lambda: [
   (MAO_DIR[0] - 6, MAO_DIR[1] - 1, ["kwk", "kWk", "kwk", "k7k", "kmk", "k7k"]),
   (MAO_ESQ[0] - 6, MAO_ESQ[1] + 1, ["kwk", "kWk", "kwk", "k7k", "kmk", "k7k"]),
 ],
 'cajado': lambda: [
   (MAO_DIR[0] - 20, MAO_DIR[1] - 2, [".k7k.", "k7W7k", ".k7k.", ".kmk."] + _coluna(16)),
 ],
 'maca': lambda: [
   (MAO_DIR[0] - 12, MAO_DIR[1] - 2, [".kkk.", "k777k", "k7W7k", "k777k", ".kkk."] + _coluna(7)),
   (MAO_ESQ[0] - 4, MAO_ESQ[1] - 2, ["kk7kk", "k7k7k", "k777k", "kk7kk"]),
 ],
 'espada-longa': lambda: [
   (MAO_DIR[0] - 20, MAO_DIR[1] - 1, ["kwk", "kWk"] + ["kwk"] * 13 + ["k7k"]) ,
   (MAO_DIR[0] - 4, MAO_DIR[1] - 2, ["k777k", ".kmk.", ".kmk.", ".k7k."]),
 ],
 'correntes': lambda: [
   (MAO_DIR[0] - 8, MAO_DIR[1] - 1, ["k7k", "kmk", "k7k", "kmk", "k7k", "kmk", "k7k", "kmk"]),
   (MAO_ESQ[0] - 2, MAO_ESQ[1] - 1, ["k7k", "k7k", "k7k"]),
 ],
 'bordao': lambda: [
   (MAO_DIR[0] - 17, MAO_DIR[1] - 1, _coluna(20, 'm')),
 ],
 'lamina-simples': lambda: [
   (MAO_DIR[0] - 8, MAO_DIR[1] - 1, ["kwk", "kWk", "kwk", "kwk", "kwk", "k7k", "kmk", "k7k"]),
 ],
}

def personagem(cabeca, torso, pernas, capa, arma):
    camadas = []
    if CAPAS[capa]: camadas.append(CAPAS[capa])
    camadas += [
        (12, 11, BRACOS),
        (10, 13, TORSOS[torso]),
        (25, 13, PERNAS[pernas]),
        (2, 15, CABECAS[cabeca]),
        (47, 12, SOMBRA),
    ]
    camadas += ARMAS[arma]()
    return monta(camadas)
