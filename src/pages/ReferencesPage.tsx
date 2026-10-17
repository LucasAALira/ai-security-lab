import { ExternalLink } from 'lucide-react'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useDocumentTitle } from '@/lib/use-document-title'

interface Lib {
  name: string
  url: string
  license: string
  use: string
}

const libraries: Lib[] = [
  { name: 'Game-icons.net — Lorc e Delapouite', url: 'https://game-icons.net', license: 'CC BY 3.0', use: 'Licença: creativecommons.org/licenses/by/3.0. Ícones de relíquias e conquistas. Lorc: dragon-head, burning-embers, chained-heart, crystal-ball, key, locked-chest, trophy e crown. Delapouite: ring e spell-book. Adaptação: fundo removido e acabamento em CSS. Nomes, histórias, molduras e cenários são originais deste projeto.' },
  { name: 'shadcn/ui', url: 'https://ui.shadcn.com', license: 'MIT', use: 'Botões, diálogos, formulários, abas e avisos. Os componentes são copiados para src/components/ui e ajustados ao tema, sobre o Radix UI (MIT).' },
  { name: 'daisyUI', url: 'https://daisyui.com', license: 'MIT', use: 'Os temas de cor (Biblioteca dos Condenados, Dragão e os da loja) e componentes de exibição: estatísticas, progresso radial e etapas. As cores do shadcn derivam do mesmo tema.' },
  { name: 'Motion', url: 'https://motion.dev', license: 'MIT', use: 'Animações de entrada, de medalhas e de vidas. Respeita a preferência do sistema por menos movimento.' },
  { name: 'Rive', url: 'https://rive.app', license: 'MIT (runtime)', use: 'Espaço para animações interativas em arquivos .riv (src/assets/rive). Sem o arquivo, a interface mostra uma ilustração estática.' },
  { name: 'React Bits', url: 'https://reactbits.dev', license: 'MIT + Commons Clause', use: 'Dois componentes copiados: contador animado e cartão com destaque. A Commons Clause permite usar dentro do app, mas não revender os componentes separados.' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com', license: 'MIT', use: 'Estilos utilitários e tokens de tema.' },
  { name: 'Lucide, Sonner, React Router', url: 'https://lucide.dev', license: 'ISC / MIT', use: 'Ícones, avisos em tela e navegação entre páginas.' },
  { name: 'Cinzel (Natanael Gama), via Fontsource', url: 'https://fontsource.org/fonts/cinzel', license: 'SIL OFL 1.1', use: 'Títulos e inscrições. Empacotada com o site (só os subconjuntos latinos), sem carregar nada da internet.' },
  { name: 'Literata (TypeTogether), via Fontsource', url: 'https://fontsource.org/fonts/literata', license: 'SIL OFL 1.1', use: 'Texto das aulas, formulários e controles: uma serifa feita para leitura em tela.' },
  { name: 'Grenze Gotisch (Omnibus-Type), via Fontsource', url: 'https://fontsource.org/fonts/grenze-gotisch', license: 'SIL OFL 1.1', use: 'Só na marca e em inscrições curtas, como "Santuário do Conhecimento". Nunca em parágrafos, formulários ou código.' },
  { name: 'JetBrains Mono, via Fontsource', url: 'https://fontsource.org/fonts/jetbrains-mono', license: 'SIL OFL 1.1', use: 'Código dos desafios, exemplos e evidências.' },
]

interface Study {
  name: string
  url: string
  license: string
  note: string
  ideas: string[]
}

const projects: Study[] = [
  {
    name: 'Lingo — Duolingo Clone',
    url: 'https://github.com/sanidhyy/duolingo-clone',
    license: 'MIT',
    note: 'App de idiomas com vidas, pontos, missões e loja.',
    ideas: ['Vidas que acabam com erros → revisão com 3 vidas por sessão.', 'Missões por marcos → missões diárias sorteadas, com baú.', 'Loja onde pontos viram vidas → loja onde moedas viram escudos e temas.'],
  },
  {
    name: 'Duolingo Next.js',
    url: 'https://github.com/RikhiSingh/Duolingo-Clone',
    license: 'MIT',
    note: 'Clone do Duolingo em Next.js, TypeScript, Tailwind e ShadCN UI. Consultado pela organização do projeto; as mecânicas seguem o fluxo conhecido de apps do tipo Duolingo.',
    ideas: ['Lição curta com barra de progresso e vidas no topo → mesma estrutura na revisão.', 'Confirmar antes de sair da lição → aviso ao sair da revisão.'],
  },
  {
    name: 'Habitica',
    url: 'https://github.com/HabitRPG/habitica',
    license: 'Código GPL v3 · arte CC BY-NC-SA 3.0',
    note: 'Hábitos como RPG. Código e arte têm licenças que não combinam com este projeto, então só as ideias foram estudadas.',
    ideas: ['Recompensas que você mesmo cria e paga com ouro → recompensas pessoais pagas com moedas.', 'Tarefas diárias com sequência → missões do dia e sequência de estudo.'],
  },
]

/* Referências visuais da identidade "Biblioteca dos Condenados" (2026). Foram examinadas, com a licença
   conferida no próprio repositório; nenhum código, imagem, fonte ou som delas foi copiado. */
const visual: Study[] = [
  {
    name: 'RPGUI (RonenNess)',
    url: 'https://github.com/RonenNess/RPGUI',
    license: 'Código zlib · arte padrão em domínio público',
    note: 'Framework de interface de RPG em pixel art. O estilo pixelado não combina com a direção gótica, então só a organização foi estudada.',
    ideas: ['Molduras com borda dupla e variantes douradas → painéis e cantoneiras desenhados em CSS.', 'Barras de progresso coloridas → medidor de XP em brasa e ouro, com o valor sempre escrito.'],
  },
  {
    name: 'DarkSoulsNotification (rmarchet)',
    url: 'https://github.com/rmarchet/DarkSoulsNotification',
    license: 'Código MIT · o som incluído vem do jogo e não foi usado',
    note: 'Aviso em faixa escura no meio da tela, com texto em serifa e um "eco" que se expande.',
    ideas: ['Faixa central com máscara de degradê → "Provação superada", curta, sem som e sem bloquear a página.'],
  },
  {
    name: 'Projeto Dark Souls (Gatapericles)',
    url: 'https://github.com/Gatapericles/projeto-darksouls',
    license: 'Sem licença declarada · imagens do jogo',
    note: 'Página temática de estudo. Por não ter licença e usar imagens do jogo, foi só observada.',
    ideas: ['Página de entrada com um único chamado em destaque → a missão atual com um botão principal.'],
  },
  {
    name: 'CastlevaniaJS (Viet281101)',
    url: 'https://github.com/Viet281101/CastlevaniaJS',
    license: 'Código MIT · gráficos CC BY-NC-SA 4.0 e sprites de terceiros',
    note: 'Jogo de plataforma com cenários góticos. Nenhum gráfico foi usado (licença não comercial e sprites de fãs).',
    ideas: ['Castelo, vitrais e bibliotecas como ambientação → a cena do Santuário, desenhada em SVG próprio.'],
  },
  {
    name: 'rpgui (ApiO)',
    url: 'https://github.com/ApiO/rpgui',
    license: 'MIT',
    note: 'Protótipo de barras de ação de RPG em HTML e CSS.',
    ideas: ['Barra de status sempre visível → cabeçalho compacto com nível, XP, sequência e moedas.'],
  },
]

const skipped = [
  'Ligas e placares: exigem contas e servidor; este site funciona só no seu navegador, sem enviar dados.',
  'Pagamentos e moedas compradas com dinheiro: não existem. Moedas só vêm do estudo.',
  'Código e imagens desses projetos: nada foi copiado. As mecânicas foram reescritas do zero para o conteúdo de segurança de IA.',
]

function ExternalLinkText({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline">
      {children}
      <ExternalLink className="size-3" aria-hidden="true" />
      <span className="sr-only">(abre em nova aba)</span>
    </a>
  )
}

function StudyList({ items }: { items: Study[] }) {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2 xl:grid-cols-3">
      {items.map((p) => (
        <li key={p.name}>
          <Card className="h-full gap-2.5 p-4">
            <h3 className="text-sm font-semibold">
              <ExternalLinkText href={p.url}>{p.name}</ExternalLinkText>
            </h3>
            <Badge variant="outline" className="self-start text-[10px] whitespace-normal">
              {p.license}
            </Badge>
            <p className="text-xs text-muted-foreground">{p.note}</p>
            <ul className="list-disc space-y-1 pl-4 text-xs text-foreground/80">
              {p.ideas.map((idea) => (
                <li key={idea}>{idea}</li>
              ))}
            </ul>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export function ReferencesPage() {
  useDocumentTitle('Referências')
  return (
    <div className="py-8 md:py-10">
      <SectionHeading eyebrow="REFERÊNCIAS" level="h1" title="Bibliotecas e projetos de apoio" description="O que o site usa por baixo e de onde vieram as ideias de jogo. Licenças conferidas em 16/10/2026." />

      <section aria-labelledby="ref-libs" className="mt-8">
        <h2 id="ref-libs" className="mb-3 text-lg font-semibold">
          Bibliotecas de interface
        </h2>
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          {libraries.map((l) => (
            <li key={l.name}>
              <Card className="h-full gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold">
                    <ExternalLinkText href={l.url}>{l.name}</ExternalLinkText>
                  </h3>
                  <Badge variant="outline" className="shrink-0 text-[10px] whitespace-normal">
                    {l.license}
                  </Badge>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{l.use}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="ref-projects" className="mt-10">
        <h2 id="ref-projects" className="mb-1 text-lg font-semibold">
          Projetos estudados
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-muted-foreground">Estudamos as mecânicas e as adaptamos ao estudo de segurança de IA. Nenhum código nem imagem desses projetos está aqui.</p>
        <StudyList items={projects} />
      </section>

      <section aria-labelledby="ref-visual" className="mt-10">
        <h2 id="ref-visual" className="mb-1 text-lg font-semibold">
          Referências da identidade visual
        </h2>
        <p className="mb-3 max-w-2xl text-sm text-muted-foreground">
          A direção "Biblioteca dos Condenados" foi inspirada na atmosfera de RPGs góticos. Estes projetos foram examinados e as licenças conferidas em 17/10/2026. Cena, selos, brasões, molduras, nomes e textos são originais; nenhum personagem, logotipo, trilha sonora ou arte de franquias foi usado.
        </p>
        <StudyList items={visual} />
      </section>

      <section aria-labelledby="ref-skipped" className="mt-10">
        <h2 id="ref-skipped" className="mb-3 text-lg font-semibold">
          O que ficou de fora
        </h2>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground/80">
          {skipped.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
