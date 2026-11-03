# -*- coding: utf-8 -*-
"""Gera o módulo TypeScript das peças a partir das mesmas matrizes usadas na prévia,
para o desenho não virar duas verdades diferentes."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pecas

def bloco(nome, valor, ind=2):
    e = ' ' * ind
    linhas = ',\n'.join(f"{e}  '{l}'" for l in valor)
    return f"{e}{nome}: [\n{linhas},\n{e}],"

out = ["/* Peças dos personagens em pixel art, 40 × 56. ARQUIVO GERADO — não edite à mão:",
       " * o desenho vive em `scripts/sprites/` e é convertido para cá, para a prévia e o site",
       " * mostrarem exatamente o mesmo sprite. Veja docs/COMO-ADICIONAR-CONTEUDO.md.",
       " *",
       " * Índices de cor: k contorno | 1 2 3 traje | 4 5 6 metal ou couro | 7 acento",
       " * S s pele | E olhos | w W lâmina | m haste | s sombra | . transparente",
       " * Tudo desenhado para este projeto: nenhum sprite, paleta ou personagem de jogo foi copiado. */",
       "",
       "export const SPRITE = { width: 40, height: 56 } as const",
       "",
       "/** Onde cada mão fica, para as armas nascerem presas a elas. */",
       f"export const MAO_ESQ = [{pecas.MAO_ESQ[0]}, {pecas.MAO_ESQ[1]}] as const",
       f"export const MAO_DIR = [{pecas.MAO_DIR[0]}, {pecas.MAO_DIR[1]}] as const",
       ""]

out.append("export const TORSOS: Record<string, string[]> = {")
for k, v in pecas.TORSOS.items(): out.append(bloco(f"'{k}'", v))
out.append("}\n")

out.append("export const PERNAS: Record<string, string[]> = {")
for k, v in pecas.PERNAS.items(): out.append(bloco(f"'{k}'", v))
out.append("}\n")

out.append("export const CABECAS: Record<string, string[]> = {")
for k, v in pecas.CABECAS.items(): out.append(bloco(f"'{k}'", v))
out.append("}\n")

out.append("export const BRACOS: string[] = [")
out.extend(f"  '{l}'," for l in pecas.BRACOS)
out.append("]\n")

out.append("export const SOMBRA: string[] = [")
out.extend(f"  '{l}'," for l in pecas.SOMBRA)
out.append("]\n")

out.append("/** Capa: posição e desenho, ou `null` quando o arquétipo não usa capa. */")
out.append("export const CAPAS: Record<string, { y: number; x: number; rows: string[] } | null> = {")
for k, v in pecas.CAPAS.items():
    if v is None:
        out.append(f"  '{k}': null,")
    else:
        y, x, rows = v
        linhas = ',\n'.join(f"      '{l}'" for l in rows)
        out.append(f"  '{k}': {{ y: {y}, x: {x}, rows: [\n{linhas},\n  ] }},")
out.append("}\n")

out.append("/** Cada arma é uma lista de blocos já ancorados nas mãos. */")
out.append("export const ARMAS: Record<string, { y: number; x: number; rows: string[] }[]> = {")
for k, fn in pecas.ARMAS.items():
    out.append(f"  '{k}': [")
    for y, x, rows in fn():
        linhas = ', '.join(f"'{l}'" for l in rows)
        out.append(f"    {{ y: {y}, x: {x}, rows: [{linhas}] }},")
    out.append("  ],")
out.append("}")

open('pecas.ts.gerado', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print('ok', len('\n'.join(out)))
