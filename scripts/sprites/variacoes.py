# -*- coding: utf-8 -*-
"""Três trajes por arquétipo: mesma função, roupa diferente.
Cada traje troca cabeça, capa, pernas e dois tons da paleta — sem mexer na silhueta de base."""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from arquetipos import ARQUETIPOS
from pecas import personagem

def clareia(cor, f):
    cor = cor.lstrip('#')
    r, g, b = (int(cor[i:i+2], 16) for i in (0, 2, 4))
    m = lambda v: max(0, min(255, round(v * f)))
    return f'#{m(r):02x}{m(g):02x}{m(b):02x}'

def variar(cores, matiz):
    """Dá outro tom ao traje e ao acento, mantendo o contorno e a pele."""
    nova = dict(cores)
    for k, f in (('1', matiz[0]), ('2', matiz[0]), ('3', matiz[0]), ('4', matiz[1]), ('5', matiz[1]), ('6', matiz[1])):
        nova[k] = clareia(cores[k], f)
    nova['7'] = matiz[2]
    return nova

# (nome do traje, troca de cabeça, troca de capa, troca de pernas, fatores de cor)
TRAJES = [
    ('I',   None,          None,            None,          (1.0, 1.0, None)),
    ('II',  'alternativa', 'nenhuma',       'enfaixadas',  (0.78, 1.18, '#b8a06a')),
    ('III', 'coberta',     'longa',         'botas',       (1.22, 0.8,  '#6f8fa8')),
]

ALTERNATIVA = {'elmo': 'elmo-aberto', 'elmo-aberto': 'elmo', 'elmo-chifres': 'elmo', 'capuz': 'mascara',
               'chapeu': 'capuz', 'mascara': 'capuz', 'nua': 'capuz'}
COBERTA = {'elmo': 'elmo-chifres', 'elmo-aberto': 'elmo', 'elmo-chifres': 'mascara', 'capuz': 'chapeu',
           'chapeu': 'mascara', 'mascara': 'elmo', 'nua': 'elmo-aberto'}

def trajes_de(a):
    cabeca, torso, pernas, capa, arma = a['pecas']
    saida = []
    for nome, troca, nova_capa, novas_pernas, matiz in TRAJES:
        c = cabeca if troca is None else (ALTERNATIVA if troca == 'alternativa' else COBERTA)[cabeca]
        saida.append({
            'nome': f'Traje {nome}',
            'rows': personagem(c, torso, novas_pernas or pernas, nova_capa or capa, arma),
            'cores': a['cores'] if matiz[2] is None else variar(a['cores'], matiz),
        })
    return saida

PERSONAGENS = [{**a, 'trajes': trajes_de(a)} for a in ARQUETIPOS]
