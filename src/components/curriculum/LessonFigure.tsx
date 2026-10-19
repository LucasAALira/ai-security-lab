import { cn } from '@/lib/utils'

/* Ilustrações das aulas de engenharia reversa. Desenho original em SVG, feito com as linhas de 1 px
   e as cores do tema (nada de imagem externa, nada de arte de terceiros). Cada figura tem um texto
   alternativo que diz o mesmo que o desenho, para quem usa leitor de tela, e uma legenda visível. */

export type FigureKey = 'triagem' | 'artefato' | 'segredo' | 'laboratorio' | 'modelo' | 'cliente-servidor'

const line = { fill: 'none', stroke: 'currentColor', strokeWidth: 1, vectorEffect: 'non-scaling-stroke' } as const

/** Caixa com título e subtítulo, no estilo das molduras do site. */
function Box({ x, y, w = 128, h = 54, title, sub, hot = false }: { x: number; y: number; w?: number; h?: number; title: string; sub?: string; hot?: boolean }) {
  const cut = 8
  const points = `${x + cut},${y} ${x + w},${y} ${x + w},${y + h - cut} ${x + w - cut},${y + h} ${x},${y + h} ${x},${y + cut}`
  return (
    <g>
      <polygon points={points} fill={hot ? 'color-mix(in oklab, var(--primary) 14%, transparent)' : 'color-mix(in oklab, var(--foreground) 4%, transparent)'} stroke={hot ? 'var(--primary)' : 'currentColor'} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text x={x + 12} y={y + 22} className="fill-[var(--heading)] text-[12px] font-semibold">
        {title}
      </text>
      {sub ? (
        <text x={x + 12} y={y + 39} className="fill-current text-[10.5px] opacity-70">
          {sub}
        </text>
      ) : null}
    </g>
  )
}

/** Seta entre caixas, com rótulo opcional. */
function Arrow({ x1, y1, x2, y2, label }: { x1: number; y1: number; x2: number; y2: number; label?: string }) {
  return (
    <g>
      <path d={`M${x1} ${y1} L${x2 - 7} ${y2}`} {...line} />
      <path d={`M${x2 - 7} ${y2 - 3.5} L${x2} ${y2} L${x2 - 7} ${y2 + 3.5} Z`} fill="currentColor" />
      {label ? (
        <text x={(x1 + x2) / 2} y={y1 - 7} textAnchor="middle" className="fill-current text-[10px] opacity-70">
          {label}
        </text>
      ) : null}
    </g>
  )
}

interface Figure {
  /** Nome curto da ilustração (rótulo da região rolável). */
  title: string
  alt: string
  caption: string
  width: number
  height: number
  draw: () => React.ReactNode
}

export const figures: Record<FigureKey, Figure> = {
  triagem: {
    title: 'Triagem em camadas',
    alt: 'Quatro etapas em sequência: identificar (tipo, hash e tamanho), ler (textos, configuração e bibliotecas), mapear (rotas, permissões e segredos) e observar (execução isolada). Abaixo de cada etapa, a pergunta que ela responde. Uma seta de retorno mostra que o que se observa pode mandar voltar a ler.',
    caption: 'Os quatro passos da triagem. Cada um responde a uma pergunta e alimenta o seguinte; nenhum deles exige executar o artefato, exceto o último.',
    width: 640,
    height: 190,
    draw: () => (
      <>
        {[
          ['1 · Identificar', 'tipo, hash, tamanho', 'O que é isto?'],
          ['2 · Ler', 'textos e config', 'O que ele diz de si?'],
          ['3 · Mapear', 'rotas e permissões', 'Com o que ele fala?'],
          ['4 · Observar', 'execução isolada', 'O que ele faz mesmo?'],
        ].map(([t, s, q], i) => (
          <g key={t}>
            <Box x={8 + i * 158} y={40} w={132} title={t} sub={s} hot={i === 3} />
            <text x={8 + i * 158 + 12} y={118} className="fill-current text-[10.5px] italic opacity-65">
              {q}
            </text>
            {i < 3 ? <Arrow x1={140 + i * 158} y1={67} x2={166 + i * 158} y2={67} /> : null}
          </g>
        ))}
        <path d="M600 100 V150 H74 V100" {...line} strokeDasharray="3 3" />
        <path d="M70.5 107 L74 100 L77.5 107 Z" fill="currentColor" />
        <text x={337} y={166} textAnchor="middle" className="fill-current text-[10px] opacity-65">
          o que você observa manda voltar a ler
        </text>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          Triagem em camadas
        </text>
      </>
    ),
  },

  artefato: {
    title: 'Anatomia de um pacote',
    alt: 'Um pacote de aplicativo aberto em cinco camadas: manifesto e permissões, recursos e configuração, código do aplicativo, bibliotecas de terceiros e assinatura. À direita de cada camada, o que ela costuma revelar a quem analisa.',
    caption: 'Um pacote é um arquivo compactado com camadas. Cada camada responde a uma pergunta diferente, e as três primeiras costumam bastar para os achados mais comuns.',
    width: 640,
    height: 250,
    draw: () => (
      <>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          Anatomia de um pacote
        </text>
        <rect x={8} y={34} width={236} height={204} {...line} />
        {[
          ['Manifesto e permissões', 'o que o app pede e expõe'],
          ['Recursos e configuração', 'endereços, chaves, textos'],
          ['Código do aplicativo', 'regras que moram no cliente'],
          ['Bibliotecas de terceiros', 'o que entrou sem revisão'],
          ['Assinatura', 'quem publicou este pacote'],
        ].map(([t, r], i) => (
          <g key={t}>
            <rect x={20} y={46 + i * 38} width={212} height={30} fill={i < 3 ? 'color-mix(in oklab, var(--primary) 10%, transparent)' : 'color-mix(in oklab, var(--foreground) 4%, transparent)'} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <text x={30} y={66 + i * 38} className="fill-[var(--heading)] text-[11px]">
              {t}
            </text>
            <Arrow x1={244} y1={61 + i * 38} x2={300} y2={61 + i * 38} />
            <text x={308} y={65 + i * 38} className="fill-current text-[11px] opacity-75">
              {r}
            </text>
          </g>
        ))}
      </>
    ),
  },

  segredo: {
    title: 'Por onde o segredo escapa',
    alt: 'O caminho de um segredo: do arquivo de ambiente para a variável de build, dela para o pacote publicado e daí para o aparelho de quem instala, onde fica legível. Uma seta separada mostra a alternativa correta: o cliente chama o seu servidor, e só o servidor guarda o segredo.',
    caption: 'Toda variável embutida na build vira texto no pacote. O segredo só deixa de vazar quando a chamada passa por um servidor seu, que guarda a credencial e aplica limites.',
    width: 640,
    height: 248,
    draw: () => (
      <>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          Por onde o segredo escapa
        </text>
        <Box x={8} y={44} w={116} title=".env do time" sub="valor real" />
        <Arrow x1={124} y1={71} x2={172} y2={71} label="build" />
        <Box x={172} y={44} w={126} title="Variável embutida" sub="vira texto" />
        <Arrow x1={298} y1={71} x2={346} y2={71} label="publica" />
        <Box x={346} y={44} w={122} title="Pacote" sub="bundle, APK" />
        <Arrow x1={468} y1={71} x2={516} y2={71} label="instala" />
        <Box x={516} y={44} w={116} title="Aparelho" sub="de quem usa" hot />
        <text x={516} y={122} className="fill-[var(--primary)] text-[11px] font-semibold">
          segredo exposto
        </text>

        <path d="M8 152 H632" {...line} strokeDasharray="4 4" opacity={0.4} />
        <text x={8} y={176} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          O caminho que não vaza
        </text>
        <Box x={8} y={190} w={150} h={46} title="Cliente" sub="sem segredo" />
        <Arrow x1={158} y1={213} x2={214} y2={213} label="pede" />
        <Box x={214} y={190} w={186} h={46} title="Servidor seu" sub="guarda e limita" hot />
        <Arrow x1={400} y1={213} x2={456} y2={213} label="chama" />
        <Box x={456} y={190} w={172} h={46} title="Provedor externo" sub="não vê o cliente" />
      </>
    ),
  },

  laboratorio: {
    title: 'Laboratório isolado',
    alt: 'Três zonas concentradas: o computador de trabalho, uma máquina virtual descartável com instantâneo e, dentro dela, a amostra. A rede da máquina virtual passa por um registro de tráfego e por um bloqueio de saída; nada volta para o computador de trabalho a não ser as anotações.',
    caption: 'A amostra fica dentro da máquina descartável, com a rede observada e cortada por padrão. Só as anotações e os hashes atravessam de volta.',
    width: 640,
    height: 240,
    draw: () => (
      <>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          Laboratório isolado
        </text>
        <rect x={8} y={34} width={400} height={196} {...line} strokeDasharray="4 3" />
        <text x={20} y={54} className="fill-current text-[11px] opacity-70">
          Máquina virtual descartável · instantâneo antes de abrir
        </text>
        <Box x={28} y={66} w={160} title="Amostra" sub="aberta só aqui dentro" hot />
        <Box x={28} y={140} w={160} title="Ferramentas" sub="cópia local, sem conta" />
        <Box x={216} y={66} w={172} title="Registro de tráfego" sub="tudo o que ela procura" />
        <Box x={216} y={140} w={172} title="Saída bloqueada" sub="liberada caso a caso" />
        <Arrow x1={188} y1={93} x2={216} y2={93} />
        <Arrow x1={188} y1={167} x2={216} y2={167} />
        <Box x={452} y={66} w={176} title="Seu computador" sub="nunca executa a amostra" />
        <Box x={452} y={140} w={176} title="Anotações e hashes" sub="o que atravessa de volta" />
        <path d="M408 167 H452" {...line} />
        <path d="M445 163.5 L452 167 L445 170.5 Z" fill="currentColor" />
        <path d="M408 93 H452" {...line} strokeDasharray="3 3" opacity={0.5} />
        <text x={416} y={86} className="fill-[var(--primary)] text-[14px] font-bold">
          ✕
        </text>
      </>
    ),
  },

  modelo: {
    title: 'Antes de carregar um modelo',
    alt: 'Cadeia de verificação de um modelo em quatro conferências antes do carregamento: origem declarada, versão exata, hash ou assinatura conferidos e formato que guarda só pesos. Só depois das quatro o modelo é carregado; qualquer falha interrompe a sequência.',
    caption: 'Carregar um modelo é executar o que vem com ele. As quatro conferências acontecem antes, e qualquer uma que falhe interrompe a adoção.',
    width: 640,
    height: 200,
    draw: () => (
      <>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          Antes de carregar um modelo
        </text>
        {[
          ['Origem', 'quem publica'],
          ['Versão', 'revisão exata'],
          ['Integridade', 'hash ou assinatura'],
          ['Formato', 'só pesos'],
        ].map(([t, s], i) => (
          <g key={t}>
            <Box x={8 + i * 130} y={44} w={110} title={t} sub={s} />
            {i < 3 ? <Arrow x1={118 + i * 130} y1={71} x2={138 + i * 130} y2={71} /> : null}
            <text x={8 + i * 130 + 12} y={122} className="fill-current text-[16px] opacity-60">
              ✓
            </text>
          </g>
        ))}
        <Arrow x1={528} y1={71} x2={548} y2={71} />
        <Box x={548} y={44} w={84} title="Carregar" sub="agora sim" hot />
        <path d="M8 140 H632" {...line} strokeDasharray="4 4" opacity={0.4} />
        <text x={8} y={164} className="fill-current text-[11px] opacity-75">
          Qualquer conferência que falhe interrompe a sequência: o modelo
        </text>
        <text x={8} y={182} className="fill-current text-[11px] opacity-75">
          não é carregado, e a pendência volta para quem publicou.
        </text>
      </>
    ),
  },

  'cliente-servidor': {
    title: 'A fronteira de confiança',
    alt: 'Duas colunas. À esquerda, o que o cliente pode fazer: mostrar, montar o pedido e guardar preferências; tudo nele é legível e alterável. À direita, o que só o servidor pode decidir: identidade, permissão, preço, limite e registro. Uma linha vertical entre as duas marca a fronteira de confiança.',
    caption: 'A fronteira de confiança divide o que é conveniência do que é controle. Tudo o que está à esquerda pode ser lido e alterado por quem tem o artefato.',
    width: 640,
    height: 230,
    draw: () => (
      <>
        <text x={8} y={22} className="fill-[var(--heading)] text-[11px] font-semibold tracking-[0.12em] uppercase">
          A fronteira de confiança
        </text>
        <rect x={8} y={34} width={290} height={186} {...line} />
        <rect x={342} y={34} width={290} height={186} {...line} stroke="var(--primary)" />
        <text x={22} y={56} className="fill-[var(--heading)] text-[12px] font-semibold">
          Cliente · conveniência
        </text>
        <text x={356} y={56} className="fill-[var(--primary)] text-[12px] font-semibold">
          Servidor · controle
        </text>
        {['Mostrar e esconder telas', 'Montar o pedido', 'Guardar preferências', 'Validar para avisar cedo'].map((t, i) => (
          <text key={t} x={22} y={84 + i * 30} className="fill-current text-[11px] opacity-80">
            · {t}
          </text>
        ))}
        {['Quem é quem', 'Quem pode o quê', 'Preço e desconto', 'Limite e cota', 'Registro do que houve'].map((t, i) => (
          <text key={t} x={356} y={84 + i * 27} className="fill-current text-[11px] opacity-80">
            · {t}
          </text>
        ))}
        <path d="M320 34 V220" {...line} strokeDasharray="5 4" stroke="var(--primary)" />
        <text x={320} y={28} textAnchor="middle" className="fill-[var(--primary)] text-[10px]">
          fronteira
        </text>
        <text x={22} y={208} className="fill-current text-[10px] italic opacity-65">
          legível e alterável por quem tem o artefato
        </text>
      </>
    ),
  },
}

/** Desenha a ilustração de uma aula, com texto alternativo e legenda. */
export function LessonFigure({ name, className }: { name: FigureKey; className?: string }) {
  const f = figures[name]
  if (!f) return null
  return (
    <figure className={cn('m-0 grid gap-2', className)}>
      <div role="region" aria-label={`Ilustração: ${f.title}`} tabIndex={0} className="overflow-x-auto border border-[var(--line)] bg-[color-mix(in_oklab,var(--background)_60%,transparent)] p-3 focus-visible:outline-2">
        <svg
          viewBox={`0 0 ${f.width} ${f.height}`}
          role="img"
          aria-label={f.alt}
          className="mx-auto block h-auto w-full max-w-[680px] min-w-[520px] text-[var(--foreground)]"
          style={{ color: 'color-mix(in oklab, var(--foreground) 55%, transparent)' }}
        >
          {f.draw()}
        </svg>
      </div>
      <figcaption className="text-[12px] leading-relaxed text-muted-foreground">{f.caption}</figcaption>
    </figure>
  )
}
