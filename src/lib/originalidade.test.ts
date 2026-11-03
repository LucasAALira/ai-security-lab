import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

/* Guarda de originalidade. A arte, os textos e os sons do site são feitos aqui: nada de
 * personagens, nomes, logotipos, trilhas ou assets de franquias. Este teste existe porque uma
 * ilustração do santuário já chegou a representar um personagem de Dark Souls II, nomeado no
 * próprio código — a figura foi substituída pelo cavaleiro original (`KnightArt`).
 *
 * A página de referências é a exceção: lá os projetos de estudo são citados pelo nome, com
 * licença e o que foi (ou não) aproveitado, que é justamente o oposto de copiar. */

const RAIZ = resolve(process.cwd(), 'src')
const EXCECOES = ['pages/ReferencesPage.tsx', 'lib/originalidade.test.ts']

/** Nomes que não podem aparecer como conteúdo do site. */
const FRANQUIAS = [
  'dark souls',
  'darksouls',
  'elden ring',
  'eldenring',
  'bloodborne',
  'sekiro',
  'shanalotte',
  'emerald herald',
  'arauto esmeralda',
  'demon\'s souls',
  'castlevania',
  'zelda',
  'skyrim',
  'diablo',
  'witcher',
  'duolingo',
  'habitica',
]

function arquivos(dir: string, achados: string[] = []): string[] {
  for (const entrada of readdirSync(dir, { withFileTypes: true })) {
    const caminho = join(dir, entrada.name)
    if (entrada.isDirectory()) arquivos(caminho, achados)
    else if (/\.(ts|tsx|css)$/.test(entrada.name)) achados.push(caminho)
  }
  return achados
}

describe('originalidade da arte e dos textos', () => {
  const lista = arquivos(RAIZ).filter((c) => !EXCECOES.some((e) => c.endsWith(e.replace('/', '/'))))

  it('nenhum arquivo do site nomeia uma franquia', () => {
    const problemas: string[] = []
    for (const caminho of lista) {
      const texto = readFileSync(caminho, 'utf8').toLowerCase()
      for (const nome of FRANQUIAS) {
        if (texto.includes(nome)) problemas.push(`${caminho.replace(RAIZ, 'src')}: "${nome}"`)
      }
    }
    expect(problemas, problemas.join('\n')).toEqual([])
  })

  it('a varredura cobre o site inteiro e a exceção continua existindo', () => {
    expect(lista.length).toBeGreaterThan(200)
    expect(lista.some((c) => c.endsWith('components/gothic/KnightArt.tsx'))).toBe(true)
    expect(readFileSync(join(RAIZ, 'pages/ReferencesPage.tsx'), 'utf8')).toContain('licens')
  })

  it('nenhuma imagem ou áudio de fora entra no pacote', () => {
    for (const caminho of lista) {
      const texto = readFileSync(caminho, 'utf8')
      // Desenho: um `<image>` do SVG só pode apontar para a arte do próprio projeto.
      for (const trecho of texto.match(/<(?:image|use)[^>]*?(?:href|src)=[^>]*?>/g) ?? []) {
        expect(trecho, `${caminho}: ${trecho}`).not.toMatch(/https?:\/\//)
      }
      // Som: nada de arquivo de áudio embutido; os efeitos são sintetizados e a música é a da pessoa.
      expect(texto, caminho).not.toMatch(/from\s+['"][^'"]+\.(mp3|ogg|wav|m4a)['"]/)
      expect(texto, caminho).not.toMatch(/new Audio\(['"][^'"]*\.(mp3|ogg|wav)/)
    }
  })
})
