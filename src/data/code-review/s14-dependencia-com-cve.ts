import type { ReviewSample } from './types'

export const dependenciaComCve: ReviewSample = {
  id: 'dependencia-com-cve',
  title: 'Alerta de dependência com falha conhecida',
  subtitle: 'Treinar a triagem de alcançabilidade: a função vulnerável é chamada pelo seu código, por um caminho que recebe entrada?',
  area: 'supply',
  level: 'Intermediário',
  minutes: 11,
  finding: {
    tool: 'Varredura de dependências (ferramenta fictícia)',
    rule: 'DEP-204 · dependência transitiva com falha conhecida',
    severity: 'alta',
    line: 7,
    message: 'A biblioteca de modelagem de documentos tem falha de consumo de recursos na análise de arquivos.',
    confidence: 'alta',
  },
  context: [
    'O serviço gera etiquetas em PDF a partir de dados do próprio banco. A biblioteca apontada entrou como dependência transitiva do gerador de PDF.',
    'A equipe quer saber se precisa interromper a entrega da semana para atualizar.',
  ],
  file: 'package.json',
  language: 'text',
  code: [
    '// trecho do package.json e do relatório da varredura',
    '"dependencies": {',
    '  "gerador-pdf": "^4.2.0",',
    '  "fastify": "^5.1.0"',
    '}',
    '',
    '// relatório: gerador-pdf@4.2.3 -> modelador-doc@2.0.1 (falha conhecida; corrigida em 2.1.0)',
    '// a falha está em modelador.analisarArquivo(buffer): entrada malformada consome memória sem limite',
    '',
    '// único uso no projeto:',
    'import { modelar } from "gerador-pdf"',
    'export async function gerarEtiqueta(pedido: Pedido) {',
    '  const doc = modelar({ titulo: pedido.codigo, linhas: linhasDe(pedido) })  // monta o documento em memória',
    '  return doc.paraPdf()',
    '}',
  ],
  extra: {
    title: 'O que a revisão conseguiu apurar',
    language: 'text',
    lines: [
      'busca por analisarArquivo no código do projeto: nenhuma ocorrência',
      'o gerador-pdf chama analisarArquivo? não foi verificado (código minificado no pacote publicado)',
      'o serviço aceita upload de arquivos? sim, no endpoint de importação de pedidos (formato CSV)',
      'o arquivo enviado chega a passar pelo gerador-pdf? não se sabe: a importação é assíncrona',
      'atualizar gerador-pdf para 4.3.0 traz modelador-doc 2.1.0 (mudança menor, sem quebra documentada)',
    ],
    note: 'Dois fatos apurados, duas perguntas em aberto e uma saída já conhecida.',
  },
  verdict: 'falta-contexto',
  verdictFeedback: [
    'Dizer que procede exigiria mostrar que a entrada do usuário alcança a função vulnerável, e isso não foi verificado: não se sabe se o gerador chama `analisarArquivo` nem se o arquivo importado chega até ele.',
    'Fechar como falso positivo porque "o projeto não chama a função" ignora a chamada indireta pela dependência e o endpoint de importação que aceita arquivos.',
    'Correto. Faltam dois fatos — a dependência chama a função vulnerável? o arquivo importado alcança esse caminho? — e os dois são verificáveis em pouco tempo.',
  ],
  verdictHints: [
    'Procure o caminho completo: entrada, chamada sua, chamada da dependência.',
    'A ausência da chamada no seu código responde a pergunta inteira?',
    'Repare no que a apuração marcou como "não verificado".',
  ],
  verdictExplain:
    'Alcançabilidade é a diferença entre um alerta urgente e um item de manutenção. Para afirmar qualquer coisa, é preciso saber se a função vulnerável é chamada em algum caminho que receba entrada externa. Aqui a cadeia tem duas lacunas, as duas apuráveis.',
  signals: [
    { text: 'Não foi verificado se o gerador de PDF chama a função vulnerável da dependência transitiva.', feedback: 'Sim: é a primeira lacuna da cadeia, e o pacote publicado estar minificado explica por que ninguém olhou.' },
    { text: 'Não se sabe se o arquivo do endpoint de importação chega a passar pelo gerador.', feedback: 'Sim: é a segunda lacuna, e ela decide se existe entrada externa nesse caminho.' },
    { text: 'O serviço aceita upload de arquivos em outro endpoint.', feedback: 'Sim: é o fato que impede fechar como falso positivo sem verificar o resto do caminho.' },
    { text: 'A busca por `analisarArquivo` no projeto não encontrou ocorrências.', feedback: 'Não encerra o assunto: a chamada pode partir da dependência, e não do seu código.' },
    { text: 'A atualização para a versão corrigida é uma mudança menor.', feedback: 'Não ajuda no veredito: é informação para decidir a conduta, não para decidir se o alerta procede.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito de indeterminado.',
  signalHints: [
    'Dois sinais são perguntas sem resposta.',
    'Um sinal é um fato que impede o fechamento rápido.',
    'Um item parece encerrar a análise e não encerra.',
  ],
  signalExplain:
    'As duas lacunas da cadeia e a existência de upload sustentam o indeterminado. A busca sem resultado no próprio código é um bom começo e não cobre a chamada indireta; o custo da atualização é assunto da conduta.',
  next: {
    prompt: 'A entrega da semana está em jogo. Qual conduta equilibra urgência e evidência?',
    options: [
      {
        text: 'Atualizar agora, já que a correção é uma mudança menor, e em paralelo registrar as duas perguntas de alcançabilidade para fechar o achado com evidência; se a atualização quebrar algo, aí sim a análise de alcançabilidade decide a urgência.',
        quality: 'best',
        flags: ['atualiza', 'registra-perguntas'],
        feedback: 'Reconhece que, quando a correção é barata, atualizar custa menos que provar alcançabilidade — sem abandonar a pergunta, que vale para o próximo alerta na mesma dependência.',
        consequence: 'A dependência sai da lista nesta semana e a equipe continua sabendo responder se alguém perguntar se havia risco real.',
      },
      {
        text: 'Fechar como falso positivo, porque o projeto não chama a função vulnerável.',
        quality: 'poor',
        feedback: 'A chamada pode vir da própria dependência, e existe endpoint que aceita arquivos: a premissa do fechamento não foi verificada.',
        consequence: 'O achado some da fila e um caminho de importação pode continuar alcançando a função vulnerável.',
      },
      {
        text: 'Interromper a entrega e investigar o pacote minificado até provar se a função é chamada.',
        quality: 'partial',
        feedback: 'A investigação é legítima, mas custa mais que a atualização disponível e trava a entrega por uma pergunta que talvez não precise ser respondida agora.',
        consequence: 'A equipe gasta dias desmontando um pacote para concluir o que a atualização resolveria na mesma tarde.',
      },
      {
        text: 'Adiar o achado para o próximo ciclo, marcando como risco aceito pelo time.',
        quality: 'poor',
        feedback: 'Aceitar risco exige saber qual é o risco, e é justamente isso que está indeterminado; além disso, a correção é barata.',
        consequence: 'O achado volta igual no ciclo seguinte, com mais versões de atraso na dependência.',
      },
    ],
    hints: [
      'Compare o custo de atualizar com o custo de provar alcançabilidade.',
      'Indeterminado não impede agir quando a ação é barata.',
      'Aceitar risco exige conhecer o risco.',
    ],
    explain:
      'Quando a correção é barata e sem quebra documentada, atualizar primeiro é mais eficiente do que provar alcançabilidade. A análise continua valendo: ela decide a urgência quando a atualização for cara, arriscada ou indisponível.',
  },
  closing:
    'A dependência foi atualizada na mesma semana e as duas perguntas de alcançabilidade ficaram registradas, para o caso de um próximo alerta na mesma biblioteca.',
  review: {
    solution: [
      'O veredito é indeterminado: não se sabe se a dependência chama a função vulnerável, nem se o arquivo importado alcança esse caminho.',
      'Os sinais são as duas lacunas da cadeia e a existência de um endpoint que aceita upload.',
      'A conduta eficiente é atualizar, porque a correção é barata, e registrar as perguntas para o próximo alerta na mesma biblioteca.',
    ],
    residual:
      'Atualizar fecha esta versão e não responde se havia caminho alcançável: se a mesma biblioteca aparecer com outra falha e sem correção disponível, a pergunta volta sem resposta pronta.',
    validation:
      'Confirme no lockfile que a versão corrigida entrou em toda a árvore; rode a geração de etiquetas e a importação de pedidos nos testes; e registre, no achado, as duas perguntas com responsável.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A03' },
    { framework: 'cwe', id: 'CWE-770' },
    { framework: 'nist-ssdf', id: 'RV.1' },
  ],
  tags: ['supply', 'dependencias', 'indeterminado'],
}
