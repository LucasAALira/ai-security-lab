/** Sprites em pixel art, no espírito dos consoles de 16 bits: uma grade pequena, paleta curta e
 *  nenhuma suavização. Cada sprite é escrito como texto — uma letra por pixel —, o que deixa o
 *  desenho legível no próprio código e fácil de ajustar pixel a pixel.
 *
 *  Tudo é desenhado para este projeto. Nenhum sprite, paleta ou personagem de jogo foi copiado:
 *  o estilo (silhueta de 32 × 40, contorno escuro e três tons por material) é de domínio comum. */

/** Cores por letra. `.` é sempre transparente e não entra na paleta. */
export type Palette = Record<string, string>

export interface Sprite {
  id: string
  /** Linhas de mesma largura, uma letra por pixel. */
  rows: string[]
  palette: Palette
}

export interface PixelRun {
  x: number
  y: number
  /** Quantos pixels seguidos da mesma cor — vira um retângulo só. */
  w: number
  color: string
}

export const spriteSize = (sprite: Sprite) => ({ width: sprite.rows[0]?.length ?? 0, height: sprite.rows.length })

/** Agrupa pixels vizinhos de mesma cor em faixas, para o SVG ter dezenas de retângulos em vez de
 *  mais de mil. O desenho é idêntico; só o custo muda. */
export function spriteRuns(sprite: Sprite): PixelRun[] {
  const runs: PixelRun[] = []
  sprite.rows.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const letra = row[x]
      if (letra === '.' || letra === ' ') {
        x += 1
        continue
      }
      let fim = x
      while (fim + 1 < row.length && row[fim + 1] === letra) fim += 1
      const color = sprite.palette[letra]
      if (color) runs.push({ x, y, w: fim - x + 1, color })
      x = fim + 1
    }
  })
  return runs
}

/** Confere que o sprite está bem formado: linhas de mesma largura e só letras conhecidas. */
export function spriteProblems(sprite: Sprite): string[] {
  const problemas: string[] = []
  const largura = sprite.rows[0]?.length ?? 0
  if (!largura) problemas.push('sprite vazio')
  sprite.rows.forEach((row, i) => {
    if (row.length !== largura) problemas.push(`linha ${i}: ${row.length} pixels, esperado ${largura}`)
    for (const letra of row) {
      if (letra === '.' || letra === ' ') continue
      if (!sprite.palette[letra]) problemas.push(`linha ${i}: letra "${letra}" sem cor na paleta`)
    }
  })
  return [...new Set(problemas)]
}
