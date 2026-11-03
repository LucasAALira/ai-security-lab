import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from variacoes import PERSONAGENS

NOMES_PECA = {'elmo': 'elmo fechado', 'elmo-aberto': 'elmo aberto', 'elmo-chifres': 'elmo com pontas',
 'capuz': 'capuz', 'chapeu': 'chapéu de abas', 'mascara': 'máscara lisa', 'nua': 'cabeça descoberta',
 'placas': 'peitoral de placas', 'tunica': 'túnica longa', 'couro': 'couro pesado', 'manto': 'manto fechado',
 'botas': 'botas', 'enfaixadas': 'pernas enfaixadas', 'nenhuma': 'sem capa', 'curta': 'capa curta',
 'longa': 'capa longa', 'esfarrapada': 'capa esfarrapada', 'espada-escudo': 'espada e escudo',
 'duas-laminas': 'duas lâminas', 'machado': 'machado grande', 'adagas': 'duas adagas', 'cajado': 'cajado arcano',
 'maca': 'maça e símbolo', 'espada-longa': 'espada longa', 'correntes': 'grilhões', 'bordao': 'bordão',
 'lamina-simples': 'lâmina simples'}

saida = []
for p in PERSONAGENS:
    cabeca, torso, pernas, capa, arma = p['pecas']
    saida.append({
        'id': p['id'], 'nome': p['nome'], 'desc': p['desc'],
        'ficha': [['Cabeça', NOMES_PECA[cabeca]], ['Corpo', NOMES_PECA[torso]], ['Pernas', NOMES_PECA[pernas]],
                  ['Capa', NOMES_PECA[capa]], ['Arma', NOMES_PECA[arma]]],
        'trajes': [{'nome': t['nome'], 'rows': t['rows'], 'pal': t['cores']} for t in p['trajes']],
    })
open('dados.json', 'w', encoding='utf-8').write(json.dumps(saida, ensure_ascii=False, separators=(',', ':')))
print('bytes:', os.path.getsize('dados.json'))
