#!/usr/bin/env node
/* Desenho de abertura do terminal: sorteia uma figura e uma inscrição a cada execução.
 *
 * Uso:  node scripts/arte.mjs            (sorteia)
 *       node scripts/arte.mjs cadeado    (escolhe pelo nome)
 *       node scripts/arte.mjs --lista    (mostra os nomes disponíveis)
 *
 * Tudo é desenho original em ASCII, com no máximo 46 colunas, para caber em terminal estreito.
 * A cor sai só quando o terminal aceita: sem TTY, com NO_COLOR ou TERM=dumb, imprime texto puro. */

/** Paleta do projeto, em códigos ANSI: brasa, ouro anodizado e titânio. */
const CORES = { brasa: '\u001B[38;5;203m', ouro: '\u001B[38;5;180m', titanio: '\u001B[38;5;245m', fim: '\u001B[0m' }

export const DESENHOS = [
  {
    nome: 'hacker',
    cor: 'brasa',
    inscricao: 'Todo dado que vem de fora é entrada não confiável.',
    linhas: [
      '         ,--------.',
      "       ,'  ,----.  `.",
      '      /   /      \\   \\',
      '     |   |  o  o  |   |',
      '     |   |   __   |   |',
      "      \\   \\ `--' /   /",
      "       `.  `----'  ,'",
      "     ____`--------'____",
      '    /  [#][#][#][#][#]  \\',
      "   '---------------------'",
    ],
  },
  {
    nome: 'cadeado',
    cor: 'ouro',
    inscricao: 'Autenticado não é o mesmo que autorizado.',
    linhas: [
      '         .-------.',
      '       .\'         \'.',
      '      /   .-----.   \\',
      '     |   |       |   |',
      '   .-+---+-------+---+-.',
      '   |                   |',
      '   |        .---.      |',
      '   |        | o |      |',
      "   |        '-|-'      |",
      '   |          |        |',
      "   '-------------------'",
    ],
  },
  {
    nome: 'chave',
    cor: 'ouro',
    inscricao: 'Segredo no código acompanha cada cópia do repositório.',
    linhas: [
      '      .-""-.',
      "     /  .-. \\",
      '    |  ( o )  |',
      "     \\  '-'  /",
      "      '-..-'",
      '        ||',
      '        ||',
      '        |+--.',
      '        ||  |',
      "        '+--'",
    ],
  },
  {
    nome: 'escudo',
    cor: 'brasa',
    inscricao: 'Uma camada só sempre deixa uma brecha.',
    linhas: [
      '    .-----------------.',
      '    |  \\           /  |',
      '    |   \\  /\\ /\\  /   |',
      '     \\   \\/  V  \\/   /',
      '      \\   \\  |  /   /',
      '       \\   \\ | /   /',
      '        \\   \\|/   /',
      '         \\       /',
      '          \\     /',
      "           '---'",
    ],
  },
  {
    nome: 'bug',
    cor: 'titanio',
    inscricao: 'A falha que ninguém reproduz continua lá.',
    linhas: [
      '     \\         /',
      '      \\  ___  /',
      '       .-\'   \'-.',
      '    --|  o   o  |--',
      '      |  .---.  |',
      '    --|  |   |  |--',
      "      '-.     .-'",
      '    --/  \\___/  \\--',
      '      /         \\',
    ],
  },
  {
    nome: 'terminal',
    cor: 'titanio',
    inscricao: 'Registro sem retenção não responde à pergunta do dia seguinte.',
    linhas: [
      '   .---------------------.',
      '   | o o o               |',
      '   |---------------------|',
      '   |  $ grep -r segredo  |',
      '   |  src/config.ts:12   |',
      '   |  _                  |',
      "   '---------------------'",
      '      \\_______________/',
    ],
  },
  {
    nome: 'dragao',
    cor: 'brasa',
    inscricao: 'O chefe do módulo espera a fogueira acesa.',
    linhas: [
      '           /\\   /\\',
      '          /  \\_/  \\',
      '     .---(  o   o  )---.',
      '    /     \\   ^   /     \\',
      "   |  ~~~  '--v--'  ~~~  |",
      '    \\     __|   |__     /',
      "     '---'  '---'  '---'",
      '        ~  ~   ~  ~',
    ],
  },
  {
    nome: 'caveira',
    cor: 'titanio',
    inscricao: 'Falso positivo fechado sem justificativa sempre volta.',
    linhas: [
      '       .-"""""-.',
      "      /  _   _  \\",
      '     |  (o) (o)  |',
      '     |     ^     |',
      '      \\  \\___/  /',
      "       '-.___.-'",
      '      |_|_|_|_|_|',
    ],
  },
  {
    nome: 'fogueira',
    cor: 'brasa',
    inscricao: 'Backup que nunca foi restaurado é hipótese, não controle.',
    linhas: [
      '         (  .      )',
      '     )           (     )',
      '           .  \u0027  .',
      '    (    (    ,     )   )',
      '      )   .  (   .    )',
      '       ( ,  )  (  ,  )',
      '        ;  )   (   ;',
      '   _____\\_|_____|_/_____',
      '  /______|_______|______\\',
    ],
  },
]

export const NOMES = DESENHOS.map((d) => d.nome)

/** Escolhe um desenho: pelo nome, ou pelo sorteio (`aleatorio` entre 0 e 1). */
export function escolher(nome, aleatorio = Math.random()) {
  if (nome) return DESENHOS.find((d) => d.nome === nome)
  const i = Math.min(DESENHOS.length - 1, Math.max(0, Math.floor(aleatorio * DESENHOS.length)))
  return DESENHOS[i]
}

/** O terminal aceita cor? Sem TTY, com NO_COLOR ou TERM=dumb, não. */
export function aceitaCor(env = process.env, tty = Boolean(process.stdout?.isTTY)) {
  if (env.NO_COLOR !== undefined && env.NO_COLOR !== '') return false
  if (env.TERM === 'dumb') return false
  if (env.FORCE_COLOR !== undefined && env.FORCE_COLOR !== '') return true
  return tty
}

/** Monta o bloco pronto para imprimir: moldura, desenho, inscrição e rodapé. */
export function montar(desenho, { cor = true, versao = '' } = {}) {
  const pinta = (texto, nome) => (cor ? `${CORES[nome]}${texto}${CORES.fim}` : texto)
  const titulo = 'AI SECURITY LAB'
  const rodape = versao ? `versão ${versao} · estudo de AppSec e IA, em português` : 'estudo de AppSec e IA, em português'
  return [
    '',
    pinta(`  ${titulo}`, 'ouro'),
    pinta(`  ${'-'.repeat(titulo.length)}`, 'titanio'),
    '',
    ...desenho.linhas.map((l) => pinta(l, desenho.cor)),
    '',
    pinta(`  "${desenho.inscricao}"`, 'ouro'),
    pinta(`  ${rodape}`, 'titanio'),
    '',
  ].join('\n')
}

function principal(argv, env) {
  const arg = argv.find((a) => !a.startsWith('-'))
  if (argv.includes('--lista')) return NOMES.join('\n')
  if (arg && !NOMES.includes(arg)) return `Desenho desconhecido: ${arg}\nDisponíveis: ${NOMES.join(', ')}`
  const desenho = escolher(arg)
  return montar(desenho, { cor: aceitaCor(env), versao: env.npm_package_version ?? '' })
}

// Só imprime quando chamado direto (`node scripts/arte.mjs`), nunca ao ser importado.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  console.log(principal(process.argv.slice(2), process.env))
}

export { principal }
