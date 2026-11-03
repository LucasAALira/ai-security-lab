import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from arquetipos import ARQUETIPOS

def svg(rows, pal, scale=4):
    h, w = len(rows), len(rows[0])
    out = [f'<svg width="{w*scale}" height="{h*scale}" viewBox="0 0 {w} {h}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">']
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            ch = row[x]
            if ch == '.':
                x += 1; continue
            end = x
            while end + 1 < len(row) and row[end+1] == ch: end += 1
            cor = pal.get(ch)
            if cor: out.append(f'<rect x="{x}" y="{y}" width="{end-x+1}" height="1" fill="{cor}"/>')
            x = end + 1
    out.append('</svg>')
    return ''.join(out)

cartoes = []
for a in ARQUETIPOS:
    cartoes.append(
        f'<figure style="margin:0;padding:10px 6px;background:#0d0f14;border:1px solid #1b1f28;text-align:center">'
        f'{svg(a["rows"], a["cores"], 4)}'
        f'<figcaption style="color:#c6ccd6;font:12px system-ui;padding-top:8px">{a["nome"]}</figcaption></figure>')
html = ('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#07080b;padding:16px">'
        '<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">' + ''.join(cartoes) + '</div></body>')
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'folha.html'), 'w').write(html)
print('ok')
