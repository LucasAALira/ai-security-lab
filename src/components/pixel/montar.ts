/** Montagem de um personagem a partir das peças: capa atrás, braços, torso, pernas, cabeça e arma.
 *  O resultado é uma matriz de letras que o `PixelSprite` desenha. */

import { ARMAS, BRACOS, CABECAS, CAPAS, PERNAS, SOMBRA, SPRITE, TORSOS } from './pecas'
import type { Sprite, Palette } from './sprite'

export interface Pecas {
  cabeca: string
  torso: string
  pernas: string
  capa: string
  arma: string
}

const vazio = () => Array.from({ length: SPRITE.height }, () => Array.from({ length: SPRITE.width }, () => '.'))

function poe(grade: string[][], y: number, x: number, rows: string[]) {
  rows.forEach((linha, i) => {
    for (let j = 0; j < linha.length; j++) {
      const ch = linha[j]
      if (ch === '~') continue
      const yy = y + i
      const xx = x + j
      if (yy >= 0 && yy < SPRITE.height && xx >= 0 && xx < SPRITE.width) grade[yy][xx] = ch
    }
  })
}

/** Monta o sprite. Lança se alguma peça não existir, para o erro aparecer no teste e não na tela. */
export function montarPersonagem(id: string, pecas: Pecas, palette: Palette): Sprite {
  const grade = vazio()
  const capa = CAPAS[pecas.capa]
  if (capa === undefined) throw new Error(`capa desconhecida: ${pecas.capa}`)
  if (capa) poe(grade, capa.y, capa.x, capa.rows)

  const torso = TORSOS[pecas.torso]
  const pernas = PERNAS[pecas.pernas]
  const cabeca = CABECAS[pecas.cabeca]
  const arma = ARMAS[pecas.arma]
  if (!torso) throw new Error(`torso desconhecido: ${pecas.torso}`)
  if (!pernas) throw new Error(`pernas desconhecidas: ${pecas.pernas}`)
  if (!cabeca) throw new Error(`cabeça desconhecida: ${pecas.cabeca}`)
  if (!arma) throw new Error(`arma desconhecida: ${pecas.arma}`)

  poe(grade, 12, 11, BRACOS)
  poe(grade, 10, 13, torso)
  poe(grade, 25, 13, pernas)
  poe(grade, 2, 15, cabeca)
  poe(grade, 47, 12, SOMBRA)
  for (const parte of arma) poe(grade, parte.y, parte.x, parte.rows)

  return { id, rows: grade.map((r) => r.join('')), palette }
}
