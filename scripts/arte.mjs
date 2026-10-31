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


// ---------------------------------------------------------------------------
// Versões para o terminal sem Node: `scripts/arte.sh` (shell) e `scripts/arte.bat` (CMD).
// Os dois arquivos são gerados daqui por `npm run arte:gerar` e conferidos pelos testes,
// para que o desenho não vire duas verdades diferentes.
// ---------------------------------------------------------------------------

/** Texto dentro de aspas simples do shell: a única fuga possível é fechar e reabrir as aspas. */
export const escaparSh = (texto) => `'${texto.replaceAll("'", `'\\''`)}'`

/** Texto literal para `echo` do CMD: o interpretador come estes caracteres se não forem escapados. */
export function escaparBat(texto) {
  return texto
    .replaceAll('^', '^^')
    .replaceAll('&', '^&')
    .replaceAll('<', '^<')
    .replaceAll('>', '^>')
    .replaceAll('|', '^|')
    .replaceAll('%', '%%')
}

const AVISO = 'Gerado por `npm run arte:gerar` a partir de scripts/arte.mjs. Não edite à mão.'

/** O script de shell equivalente ao desenho, para `.bashrc`, `.zshrc` ou execução direta. */
export function gerarSh() {
  const nomes = NOMES.join(' ')
  const figuras = DESENHOS.map(
    (d, i) => [
      `figura_${i}() {`,
      `  INSCRICAO=${escaparSh(d.inscricao)}`,
      `  COR="$COR_${d.cor.toUpperCase()}"`,
      `  cat <<'DESENHO'`,
      ...d.linhas,
      `DESENHO`,
      `}`,
    ].join('\n'),
  )
  return [
    '#!/bin/sh',
    `# Desenho de abertura do AI Security Lab. ${AVISO}`,
    '#',
    '# Uso:  sh scripts/arte.sh            (sorteia)',
    '#       sh scripts/arte.sh cadeado    (escolhe pelo nome)',
    '#       sh scripts/arte.sh --lista    (mostra os nomes)',
    '#',
    '# Para ver o desenho ao abrir o terminal, acrescente ao ~/.bashrc ou ~/.zshrc:',
    '#   [ -t 1 ] && sh "$HOME/ai-security-lab/scripts/arte.sh"',
    '',
    'NOMES=' + escaparSh(nomes),
    '',
    'if [ "$1" = "--lista" ]; then',
    '  for n in $NOMES; do echo "$n"; done',
    '  exit 0',
    'fi',
    '',
    '# Cor só quando o terminal aceita: sem TTY, com NO_COLOR ou TERM=dumb, texto puro.',
    '# FORCE_COLOR força a cor mesmo sem TTY, como no `arte.mjs`.',
    'COR_BRASA=""; COR_OURO=""; COR_TITANIO=""; COR_FIM=""',
    'if { [ -t 1 ] || [ -n "$FORCE_COLOR" ]; } && [ -z "$NO_COLOR" ] && [ "$TERM" != "dumb" ]; then',
    `  COR_BRASA=$(printf '\\033[38;5;203m')`,
    `  COR_OURO=$(printf '\\033[38;5;180m')`,
    `  COR_TITANIO=$(printf '\\033[38;5;245m')`,
    `  COR_FIM=$(printf '\\033[0m')`,
    'fi',
    '',
    ...figuras,
    '',
    '# Sorteio portátil: o número do processo muda a cada execução, mesmo sem $RANDOM.',
    `TOTAL=${DESENHOS.length}`,
    'ESCOLHA=""',
    'INDICE=0',
    'if [ -n "$1" ]; then',
    '  for n in $NOMES; do',
    '    if [ "$n" = "$1" ]; then ESCOLHA=$INDICE; fi',
    '    INDICE=$((INDICE + 1))',
    '  done',
    '  if [ -z "$ESCOLHA" ]; then',
    '    echo "Desenho desconhecido: $1" >&2',
    '    echo "Disponíveis: $NOMES" >&2',
    '    exit 1',
    '  fi',
    'else',
    '  ESCOLHA=$(( ($$ + $(date +%s)) % TOTAL ))',
    'fi',
    '',
    'echo',
    'printf \'%s  AI SECURITY LAB%s\\n\' "$COR_OURO" "$COR_FIM"',
    'printf \'%s  ---------------%s\\n\' "$COR_TITANIO" "$COR_FIM"',
    'echo',
    'printf \'%s\' "$COR_BRASA"',
    'eval "figura_$ESCOLHA"',
    'printf \'%s\' "$COR_FIM"',
    'echo',
    'printf \'%s  "%s"%s\\n\' "$COR_OURO" "$INSCRICAO" "$COR_FIM"',
    'printf \'%s  estudo de AppSec e IA, em português%s\\n\' "$COR_TITANIO" "$COR_FIM"',
    'echo',
    '',
  ].join('\n')
}

/** O mesmo desenho no Prompt de Comando do Windows.
 *  Sem blocos entre parênteses: dentro deles o CMD trata `|`, `&` e `%` de outro jeito,
 *  e o truque que descobre o caractere de escape ANSI deixa de funcionar. */
export function gerarBat() {
  const figuras = DESENHOS.flatMap((d, i) => [
    `:figura_${i}`,
    `set "COR=%COR_${d.cor.toUpperCase()}%"`,
    `set "INSCRICAO=${escaparBat(d.inscricao)}"`,
    'goto :eof',
    '',
  ])
  const linhas = DESENHOS.flatMap((d, i) => [
    `:desenho_${i}`,
    ...d.linhas.map((l) => `echo(%COR%${escaparBat(l)}%COR_FIM%`),
    'goto :eof',
    '',
  ])
  return [
    '@echo off',
    `rem Desenho de abertura do AI Security Lab. ${AVISO}`,
    'rem',
    'rem Uso:  scripts\\arte.bat            (sorteia)',
    'rem       scripts\\arte.bat cadeado    (escolhe pelo nome)',
    'rem       scripts\\arte.bat --lista    (mostra os nomes)',
    'rem',
    'rem Para ver o desenho ao abrir o Prompt de Comando, aponte o AutoRun para este arquivo:',
    'rem   reg add "HKCU\\Software\\Microsoft\\Command Processor" /v AutoRun /d "C:\\caminho\\scripts\\arte.bat" /f',
    'rem Para o PowerShell, acrescente ao $PROFILE:  cmd /c "C:\\caminho\\scripts\\arte.bat"',
    'setlocal',
    `set "NOMES=${NOMES.join(' ')}"`,
    `set "TOTAL=${DESENHOS.length}"`,
    '',
    'rem O arquivo está em UTF-8: sem a página de código 65001 os acentos saem trocados.',
    'rem A página anterior volta no fim, para não mudar o terminal de quem chamou.',
    `for /f "tokens=2 delims=:. " %%a in ('chcp') do set "PAGINA=%%a"`,
    'chcp 65001 >nul',
    '',
    'if not "%~1"=="--lista" goto :escolher',
    ...NOMES.map((n) => `echo(${n}`),
    'goto :fim',
    '',
    ':escolher',
    'rem Cor só quando NO_COLOR não está definida; o truque abaixo descobre o caractere de escape.',
    'set "COR_BRASA="',
    'set "COR_OURO="',
    'set "COR_TITANIO="',
    'set "COR_FIM="',
    'if defined NO_COLOR goto :sem_cor',
    `for /f %%a in ('echo prompt $E^| cmd') do set "ESC=%%a"`,
    'set "COR_BRASA=%ESC%[38;5;203m"',
    'set "COR_OURO=%ESC%[38;5;180m"',
    'set "COR_TITANIO=%ESC%[38;5;245m"',
    'set "COR_FIM=%ESC%[0m"',
    ':sem_cor',
    '',
    'set "ESCOLHA="',
    'if "%~1"=="" goto :sortear',
    'call :procurar %*',
    'if defined ESCOLHA goto :desenhar',
    'echo(Desenho desconhecido: %~1 1>&2',
    'echo(Disponíveis: %NOMES% 1>&2',
    'chcp %PAGINA% >nul',
    'endlocal',
    'exit /b 1',
    '',
    ':sortear',
    'set /a ESCOLHA=%RANDOM% %% TOTAL',
    '',
    ':desenhar',
    'call :figura_%ESCOLHA%',
    'echo(',
    'echo(%COR_OURO%  AI SECURITY LAB%COR_FIM%',
    'echo(%COR_TITANIO%  ---------------%COR_FIM%',
    'echo(',
    'call :desenho_%ESCOLHA%',
    'echo(',
    'echo(%COR_OURO%  "%INSCRICAO%"%COR_FIM%',
    'echo(%COR_TITANIO%  estudo de AppSec e IA, em português%COR_FIM%',
    'echo(',
    'goto :fim',
    '',
    ':procurar',
    ...NOMES.map((n, i) => `if /i "%~1"=="${n}" set "ESCOLHA=${i}"`),
    'goto :eof',
    '',
    ...figuras,
    ...linhas,
    ':fim',
    'chcp %PAGINA% >nul',
    'endlocal',
    '',
  ].join('\r\n')
}

function principal(argv, env) {
  const arg = argv.find((a) => !a.startsWith('-'))
  if (argv.includes('--sh')) return gerarSh()
  if (argv.includes('--bat')) return gerarBat()
  if (argv.includes('--lista')) return NOMES.join('\n')
  if (arg && !NOMES.includes(arg)) return `Desenho desconhecido: ${arg}\nDisponíveis: ${NOMES.join(', ')}`
  const desenho = escolher(arg)
  return montar(desenho, { cor: aceitaCor(env), versao: env.npm_package_version ?? '' })
}

// Só imprime quando chamado direto (`node scripts/arte.mjs`), nunca ao ser importado.
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  const saida = principal(process.argv.slice(2), process.env)
  // Os arquivos gerados já terminam com a própria quebra de linha; o desenho ganha a do `console.log`.
  if (process.argv.includes('--sh') || process.argv.includes('--bat')) process.stdout.write(saida)
  else console.log(saida)
}

export { principal }
