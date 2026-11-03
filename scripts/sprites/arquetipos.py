# -*- coding: utf-8 -*-
"""Dez arquétipos originais: cada um combina peças diferentes e tem paleta própria.
Nomes genéricos de função, sem referência a obra alguma."""

from pecas import personagem

# 1 2 3 traje | 4 5 6 metal/couro | 7 acento | S s pele | E olhos | w W lâmina | m haste | k contorno | s sombra
def paleta(traje, metal, acento, pele=('#c99a73', '#8a6246'), olho='#cfe4ef', lamina=('#9fb0c2', '#dfe9f2'), haste='#4a3a2c'):
    t1, t2, t3 = traje
    m1, m2, m3 = metal
    return {
        'k': '#090b10', '1': t1, '2': t2, '3': t3, '4': m1, '5': m2, '6': m3, '7': acento,
        'S': pele[0], 's': '#05070b', 'E': olho, 'w': lamina[0], 'W': lamina[1], 'm': haste,
    }

ARQUETIPOS = [
    {
        'id': 'cavaleiro-errante', 'nome': 'Cavaleiro errante',
        'desc': 'Armadura média e gasta, espada e escudo que já serviram a outro dono.',
        'pecas': ('elmo', 'placas', 'botas', 'curta', 'espada-escudo'),
        'cores': paleta(('#2d333f', '#434c5c', '#5d6a7d'), ('#4a5464', '#6c7788', '#9aa6b6'), '#8a7340'),
    },
    {
        'id': 'duelista', 'nome': 'Duelista',
        'desc': 'Roupa leve, duas lâminas curtas e peso na ponta dos pés.',
        'pecas': ('nua', 'couro', 'botas', 'nenhuma', 'duas-laminas'),
        'cores': paleta(('#2a2230', '#3d3348', '#564766'), ('#5b4a33', '#7d6545', '#a98a5e'), '#b8562f'),
    },
    {
        'id': 'barbaro', 'nome': 'Bárbaro',
        'desc': 'Couro pesado, ombros largos e um machado que pede as duas mãos.',
        'pecas': ('elmo-chifres', 'couro', 'enfaixadas', 'esfarrapada', 'machado'),
        'cores': paleta(('#3a2a1e', '#51392a', '#6d4e39'), ('#4e4336', '#6e6050', '#968471'), '#9a3b2a'),
    },
    {
        'id': 'ladrao', 'nome': 'Ladrão',
        'desc': 'Capuz baixo, proteção leve, duas adagas e bolsa de ferramentas no cinto.',
        'pecas': ('capuz', 'tunica', 'botas', 'curta', 'adagas'),
        'cores': paleta(('#1f2a24', '#2d3b32', '#3f5245'), ('#4a3c2a', '#66543c', '#8b7352'), '#6f8f5a'),
    },
    {
        'id': 'astrologo', 'nome': 'Astrólogo',
        'desc': 'Manto com pontos de luz discretos e um cajado que não se apaga.',
        'pecas': ('chapeu', 'manto', 'botas', 'longa', 'cajado'),
        'cores': paleta(('#1b2440', '#27345c', '#36487c'), ('#3b4258', '#555f7a', '#7d87a4'), '#7fc8e8'),
    },
    {
        'id': 'clerigo', 'nome': 'Clérigo',
        'desc': 'Túnica reforçada, maça de cerimônia e um símbolo próprio no peito.',
        'pecas': ('elmo-aberto', 'tunica', 'botas', 'curta', 'maca'),
        'cores': paleta(('#49433a', '#645c50', '#847a6a'), ('#5c5244', '#7e7161', '#a89883'), '#c7a94e'),
    },
    {
        'id': 'espadachim', 'nome': 'Espadachim',
        'desc': 'Armadura leve, espada longa e economia de movimento.',
        'pecas': ('elmo-aberto', 'placas', 'botas', 'nenhuma', 'espada-longa'),
        'cores': paleta(('#22303a', '#2f4350', '#415c6d'), ('#54606a', '#78858f', '#a3b0ba'), '#b0bcc6'),
    },
    {
        'id': 'prisioneiro', 'nome': 'Prisioneiro arcano',
        'desc': 'Roupa simples, grilhões que não saíram e uma magia que ainda não obedece.',
        'pecas': ('nua', 'tunica', 'enfaixadas', 'nenhuma', 'correntes'),
        'cores': paleta(('#3b3a36', '#50504a', '#6b6a62'), ('#49535c', '#67737d', '#8f9ba5'), '#7a5bd0'),
    },
    {
        'id': 'penitente', 'nome': 'Penitente',
        'desc': 'Manto escuro, máscara lisa e equipamento sem excesso.',
        'pecas': ('mascara', 'manto', 'botas', 'longa', 'lamina-simples'),
        'cores': paleta(('#16161c', '#24242e', '#343442'), ('#3c3a46', '#58555f', '#7a7682'), '#8d2f3a'),
    },
    {
        'id': 'sobrevivente', 'nome': 'Sobrevivente',
        'desc': 'Roupas improvisadas, remendos por cima de remendos e um bordão de estrada.',
        'pecas': ('capuz', 'tunica', 'enfaixadas', 'esfarrapada', 'bordao'),
        'cores': paleta(('#2e2a24', '#403a31', '#574e42'), ('#4c4034', '#6a5a4a', '#8f7c67'), '#8a6a3a'),
    },
]

for a in ARQUETIPOS:
    a['rows'] = personagem(*a['pecas'])
