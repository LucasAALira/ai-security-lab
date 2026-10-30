import type { ReviewSample } from './types'

export const htmlDoEditor: ReviewSample = {
  id: 'html-do-editor',
  title: 'innerHTML com o texto do editor de comentários',
  subtitle: 'Treinar a leitura de uma cadeia de transformação: o que chega ao innerHTML já passou por onde?',
  area: 'web',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'XSS-014 · atribuição a innerHTML com valor de variável',
    severity: 'alta',
    line: 11,
    message: 'Valor dinâmico atribuído a innerHTML. Prefira textContent ou sanitize a entrada.',
    confidence: 'média',
  },
  context: [
    'Os comentários aceitam formatação simples (negrito, itálico, listas e links). O texto é escrito em Markdown, convertido no servidor e devolvido como HTML já higienizado pela biblioteca de sanitização adotada no projeto.',
    'A função abaixo apenas desenha na tela o HTML que veio da API.',
  ],
  file: 'src/comentarios/render.ts',
  language: 'ts',
  code: [
    'import { sanitizar } from "@/lib/sanitizar" // política: tags de formatação e href http/https',
    '',
    'export function desenharComentario(destino: HTMLElement, comentario: Comentario) {',
    '  const cabecalho = document.createElement("header")',
    '  cabecalho.textContent = `${comentario.autor} · ${formatarData(comentario.criadoEm)}`',
    '',
    '  const corpo = document.createElement("div")',
    '  corpo.className = "comentario-corpo"',
    '  // o HTML vem da API já convertido; aqui ele passa pela mesma política do servidor',
    '  const seguro = sanitizar(comentario.html)',
    '  corpo.innerHTML = seguro',
    '',
    '  destino.replaceChildren(cabecalho, corpo)',
    '}',
  ],
  extra: {
    title: 'Política da função `sanitizar` (trecho do módulo compartilhado)',
    language: 'ts',
    lines: [
      'const TAGS = ["b", "i", "em", "strong", "ul", "ol", "li", "p", "br", "a", "code"]',
      'const ATRIBUTOS = { a: ["href", "rel", "target"] }',
      'const ESQUEMAS = ["http:", "https:", "mailto:"]',
      '',
      '// remove qualquer outro elemento, atributo de evento (on*) e href com esquema fora da lista',
      'export function sanitizar(html: string): string { /* ... */ }',
      '',
      '// testes: 148 casos, incluindo svg/onload, javascript:, data: e atributos on*',
    ],
    note: 'A política e a cobertura de teste do módulo compartilhado.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'O `innerHTML` recebe a saída de uma sanitização com lista fechada de tags, atributos e esquemas, aplicada imediatamente antes. Sem um furo demonstrado nessa política, não há falha neste trecho.',
    'Correto. A regra marca toda atribuição dinâmica a `innerHTML`, e não sabe reconhecer o sanitizador do projeto. A cadeia inteira está à vista e termina em uma política restritiva.',
    'O trecho e a política do sanitizador estão disponíveis, então dá para decidir. Pedir mais contexto aqui só faz sentido se a dúvida for sobre a qualidade da biblioteca, e isso é outra análise.',
  ],
  verdictHints: [
    'Siga o valor que chega ao `innerHTML` uma linha para cima.',
    'Veja se a política do sanitizador cobre atributos de evento e esquemas de URL.',
    'A regra reconhece a forma da atribuição, não o que aconteceu antes dela.',
  ],
  verdictExplain:
    'O risco de `innerHTML` é receber marcação arbitrária. Aqui o valor passa por uma função com lista fechada de tags, atributos e esquemas, testada contra os vetores clássicos. O alerta aponta um padrão que merece atenção, mas neste caminho ele já está tratado.',
  signals: [
    { text: 'O valor atribuído é a saída de `sanitizar`, chamada na linha imediatamente anterior.', feedback: 'Sim: a proximidade importa, porque não há código entre a sanitização e o uso que pudesse alterar o valor.' },
    { text: 'A política lista tags e atributos permitidos, em vez de tentar remover os perigosos.', feedback: 'Sim: lista fechada é o desenho que resiste a variações novas de vetor.' },
    { text: 'Os esquemas de URL aceitos são `http`, `https` e `mailto`, o que descarta `javascript:` em `href`.', feedback: 'Sim: fecha o vetor mais comum que sobra quando se permite a tag de link.' },
    { text: 'O cabeçalho usa `textContent`.', feedback: 'Não ajuda no veredito: mostra cuidado no resto da função, mas não diz nada sobre o valor que vai ao `innerHTML`.' },
    { text: 'O HTML já vinha sanitizado do servidor.', feedback: 'Não como sinal principal: confiar só nisso seria frágil; o que sustenta o veredito é a sanitização aplicada aqui, no cliente.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de falso positivo.',
  signalHints: [
    'Olhe o que acontece com o valor entre a API e a tela.',
    'Lista fechada e lista de proibidos não dão a mesma garantia.',
    'Dois itens são verdadeiros e irrelevantes para este alerta.',
  ],
  signalExplain:
    'O veredito se apoia na sanitização aplicada no ponto de uso, no desenho por lista fechada e no tratamento dos esquemas de URL. O `textContent` do cabeçalho e a sanitização no servidor são bons sinais de higiene, mas não sustentam sozinhos o fechamento do alerta.',
  next: {
    prompt: 'Você vai fechar o alerta. O que acompanha esse fechamento?',
    options: [
      {
        text: 'Registrar a justificativa apontando a política do sanitizador; acrescentar um teste de interface que desenhe um comentário com `onerror`, `javascript:` e `<svg>` e confirme que nada executa; e abrir um lembrete para revisar a política quando a biblioteca de sanitização for atualizada.',
        quality: 'best',
        flags: ['justifica', 'teste', 'revisao'],
        feedback: 'Prende o veredito a um comportamento verificável e cria o gatilho para revisá-lo quando a dependência que o sustenta mudar.',
        consequence: 'O alerta fecha com evidência, e uma mudança futura na política de sanitização aparece no teste antes de virar falha.',
      },
      {
        text: 'Trocar `innerHTML` por `textContent` para a regra parar de disparar.',
        quality: 'poor',
        feedback: 'A formatação deixa de funcionar: os comentários passariam a exibir as marcações como texto cru.',
        consequence: 'O produto perde a formatação dos comentários e alguém reverte a mudança na semana seguinte, sem registro do motivo.',
      },
      {
        text: 'Fechar o alerta anotando apenas "o valor é sanitizado".',
        quality: 'partial',
        feedback: 'A direção está certa, mas a anotação não mostra qual política sustenta a afirmação nem deixa como verificar.',
        consequence: 'Na próxima varredura, quem triar precisa reconstruir toda a análise para confiar no fechamento.',
      },
      {
        text: 'Adicionar uma segunda sanitização, da mesma biblioteca, logo antes da atribuição.',
        quality: 'poor',
        feedback: 'Sanitizar duas vezes com a mesma política não acrescenta garantia e ainda pode alterar o HTML já tratado.',
        consequence: 'O código fica mais confuso, a regra continua disparando e nada muda em termos de segurança.',
      },
    ],
    hints: [
      'Pergunte o que faria o veredito deixar de valer no futuro.',
      'O fechamento precisa ser verificável por alguém que não fez a análise.',
      'Uma das opções quebra a funcionalidade para calar a ferramenta.',
    ],
    explain:
      'Fechar um falso positivo que depende de uma biblioteca exige dois cuidados: provar o comportamento com teste e marcar o momento de revisar, que é quando a biblioteca ou a política mudarem. Sem isso, o veredito envelhece sem ninguém perceber.',
  },
  closing:
    'O alerta foi fechado com a política citada, um teste de interface com três vetores clássicos e um lembrete ligado à atualização da biblioteca de sanitização.',
  review: {
    solution: [
      'O veredito é falso positivo: o valor passa por sanitização com lista fechada imediatamente antes de ir ao `innerHTML`.',
      'Os sinais são a sanitização no ponto de uso, o desenho por lista fechada e o tratamento dos esquemas de URL.',
      'O fechamento deve vir com justificativa, teste de interface com vetores clássicos e um gatilho de revisão para quando a biblioteca mudar.',
    ],
    residual:
      'O veredito depende da política do sanitizador continuar restritiva: permitir uma tag ou um atributo a mais, ou atualizar a biblioteca sem revisar, reabre o risco sem que a linha analisada mude.',
    validation:
      'Rode o teste de interface com `onerror`, `javascript:` em `href` e `<svg>` e confirme que nada executa; verifique a versão da biblioteca no lockfile; e confirme que a política não ganhou tags novas desde a análise.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A05' },
    { framework: 'cwe', id: 'CWE-79' },
  ],
  tags: ['web', 'falso-positivo', 'xss'],
}
