import type { ReviewSample } from './types'

export const downloadDoAnexo: ReviewSample = {
  id: 'download-do-anexo',
  title: 'Caminho de arquivo montado com o nome recebido',
  subtitle: 'Treinar a leitura de uma defesa que já existe: a ordem entre resolver o caminho e conferir o prefixo muda tudo.',
  area: 'api',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'FS-004 · caminho de arquivo construído com entrada do usuário',
    severity: 'alta',
    line: 8,
    message: 'Nome de arquivo vindo da requisição usado na montagem do caminho (possível travessia de diretório).',
    confidence: 'média',
  },
  context: [
    'Os anexos de um chamado ficam em uma pasta por chamado, fora da árvore do código. O nome do arquivo é escolhido por quem envia e guardado no banco junto com o identificador do chamado.',
    'A rota confere antes se o chamado pertence a quem pede; esse trecho cuida apenas da leitura do arquivo.',
  ],
  file: 'src/anexos/baixar.ts',
  language: 'ts',
  code: [
    'import path from "node:path"',
    'import fs from "node:fs/promises"',
    '',
    'const RAIZ = path.resolve(process.env.ANEXOS_DIR ?? "/var/dados/anexos")',
    '',
    'export async function baixar(chamadoId: string, nomeArquivo: string) {',
    '  const pasta = path.join(RAIZ, chamadoId)',
    '  const alvo = path.resolve(pasta, nomeArquivo)',
    '',
    '  // o caminho resolvido precisa continuar dentro da pasta do chamado',
    '  const dentro = alvo === pasta || alvo.startsWith(pasta + path.sep)',
    '  if (!dentro) throw new ErroDeValidacao("caminho fora da pasta do chamado")',
    '',
    '  const info = await fs.stat(alvo)',
    '  if (!info.isFile()) throw new ErroDeValidacao("não é um arquivo")',
    '  return fs.createReadStream(alvo)',
    '}',
  ],
  extra: {
    title: 'Testes existentes do módulo',
    language: 'ts',
    lines: [
      'it.each([',
      '  "../../etc/passwd",',
      '  "..%2f..%2fetc%2fpasswd",',
      '  "/etc/passwd",',
      '  "pasta/../../../segredo.txt",',
      '])("recusa %s", async (nome) => {',
      '  await expect(baixar("4821", nome)).rejects.toThrow("caminho fora da pasta do chamado")',
      '})',
      '',
      '// o identificador do chamado é validado na rota: /^[0-9]{1,10}$/',
    ],
    note: 'Os casos que o módulo já cobre, e a validação do identificador feita antes.',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'A montagem existe, mas o caminho é resolvido antes da verificação e comparado com a pasta do chamado: uma travessia muda o caminho resolvido e cai fora do prefixo, sendo recusada.',
    'Correto. A regra marca a montagem do caminho com entrada do usuário e não reconhece a verificação do prefixo após a resolução, que é justamente a defesa recomendada.',
    'O trecho mostra a ordem das operações e os testes cobrem os vetores clássicos. Não falta informação para decidir.',
  ],
  verdictHints: [
    'Repare na ordem: o caminho é resolvido antes ou depois da verificação?',
    'Pergunte o que acontece com `..` depois de `path.resolve`.',
    'O separador no fim do prefixo não está ali por acaso.',
  ],
  verdictExplain:
    'Travessia de diretório se resolve comparando o caminho **já resolvido** com a raiz permitida. É o que o trecho faz, e o separador na comparação evita o caso clássico de uma pasta vizinha com nome parecido. Os testes cobrem os vetores usuais, inclusive codificados.',
  signals: [
    { text: 'O caminho é resolvido com `path.resolve` antes da verificação.', feedback: 'Sim: resolver primeiro é o que faz `..` desaparecer e revelar o destino real.' },
    { text: 'A verificação compara o caminho resolvido com a pasta do chamado, incluindo o separador no prefixo.', feedback: 'Sim: o separador impede que uma pasta vizinha com prefixo parecido passe na comparação.' },
    { text: 'O identificador do chamado é validado por expressão regular antes de compor a pasta.', feedback: 'Sim: fecha a outra metade do caminho, que também vem de fora.' },
    { text: 'A raiz vem de uma variável de ambiente.', feedback: 'Não: isso é configuração; quem controla a variável já controla o serviço.' },
    { text: 'O módulo confere se o alvo é um arquivo antes de abrir.', feedback: 'Não para este alerta: evita abrir diretório ou dispositivo, o que é outro problema.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de falso positivo.',
  signalHints: [
    'A ordem das operações é o argumento principal.',
    'As duas partes do caminho vêm de fora: as duas são tratadas?',
    'Dois itens tratam de outros riscos do mesmo módulo.',
  ],
  signalExplain:
    'O veredito se apoia na ordem (resolver, depois comparar), no cuidado com o separador no prefixo e na validação do identificador do chamado. Conferir o tipo do arquivo e ler a raiz do ambiente são boas práticas que tratam outras coisas.',
  next: {
    prompt: 'Você vai fechar o alerta. Como registrar esse fechamento de modo que ele resista ao tempo?',
    options: [
      {
        text: 'Fechar com justificativa que cite a ordem resolver-depois-comparar; acrescentar aos testes um caso com link simbólico apontando para fora da pasta; e extrair a verificação para uma função compartilhada, usada por qualquer leitura de arquivo com nome vindo de fora.',
        quality: 'best',
        flags: ['justifica', 'teste', 'reuso'],
        feedback: 'Cobre o furo que os testes atuais não cobrem e transforma a defesa em algo reutilizável, em vez de deixá-la como um acerto isolado deste arquivo.',
        consequence: 'O próximo módulo que precisar ler arquivo usa a mesma função, e o caso de link simbólico passa a ser verificado a cada execução dos testes.',
      },
      {
        text: 'Fechar o alerta e silenciar a regra FS-004 para a pasta `src/anexos`.',
        quality: 'partial',
        feedback: 'Fechar está certo; silenciar a regra na pasta inteira cega a varredura para arquivos futuros que não terão essa verificação.',
        consequence: 'Um módulo novo de exportação de relatórios entra na mesma pasta sem verificação e não gera alerta nenhum.',
      },
      {
        text: 'Substituir a verificação por uma lista de nomes permitidos, consultada no banco.',
        quality: 'good',
        flags: ['lista'],
        feedback: 'Conferir o nome contra o registro do anexo é uma defesa forte e torna a montagem quase irrelevante. Dá mais trabalho e não substitui a verificação do caminho, que continua útil.',
        consequence: 'A leitura passa a aceitar apenas nomes registrados, com uma consulta a mais por download.',
      },
      {
        text: 'Trocar `path.resolve` por concatenação de texto, já que a verificação do prefixo é que importa.',
        quality: 'poor',
        feedback: 'É o inverso do que sustenta o veredito: sem resolver, `..` permanece no caminho e a comparação de prefixo passa a ser enganada.',
        consequence: 'A travessia volta a funcionar e os testes atuais provavelmente passam a falhar.',
      },
    ],
    hints: [
      'Pergunte qual vetor os testes atuais ainda não cobrem.',
      'Uma defesa boa em um arquivo não protege os outros.',
      'Cuidado com a opção que inverte a ordem das operações.',
    ],
    explain:
      'O fechamento bom acrescenta o caso que falta (link simbólico), transforma a verificação em função compartilhada e evita silenciar a regra além do necessário. Conferir contra o registro do anexo é uma camada a mais, não um substituto.',
  },
  closing:
    'O alerta foi fechado com a justificativa da ordem das operações, um teste novo com link simbólico e a verificação extraída para uma função compartilhada.',
  review: {
    solution: [
      'O veredito é falso positivo: o caminho é resolvido antes da verificação e comparado com a pasta do chamado, com separador no prefixo.',
      'Os sinais são a resolução antes da comparação, o prefixo com separador e a validação do identificador do chamado.',
      'O fechamento deve citar a ordem das operações, acrescentar o caso de link simbólico e extrair a verificação para reuso.',
    ],
    residual:
      'A verificação trata o caminho, não o conteúdo: continua possível baixar um anexo malicioso enviado por outra pessoa do mesmo chamado, e links simbólicos criados fora do fluxo exigem o teste acrescentado.',
    validation:
      'Rode os testes de travessia, incluindo o caso codificado e o de link simbólico; crie um link dentro da pasta apontando para fora e confirme a recusa; e confirme que outros módulos de leitura usam a função compartilhada.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A01' },
    { framework: 'cwe', id: 'CWE-22' },
  ],
  tags: ['api', 'falso-positivo', 'arquivos'],
}
