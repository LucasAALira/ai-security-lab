import type { ReviewSample } from './types'

export const webhookDeEntrega: ReviewSample = {
  id: 'webhook-de-entrega',
  title: 'Webhook que busca a URL informada pelo cliente',
  subtitle: 'Treinar a análise de uma requisição feita pelo servidor: o destino é escolhido por quem?',
  area: 'api',
  level: 'Avançado',
  minutes: 12,
  finding: {
    tool: 'Varredura estática (ferramenta fictícia)',
    rule: 'NET-007 · requisição de saída com destino dinâmico',
    severity: 'média',
    line: 10,
    message: 'Requisição HTTP com URL vinda de entrada do usuário (possível requisição forjada no servidor).',
    confidence: 'média',
  },
  context: [
    'A plataforma permite que cada lojista cadastre uma URL para receber avisos de pedido. Antes de salvar, o sistema faz uma chamada de verificação e espera o código de confirmação na resposta.',
    'O serviço roda em um cluster na nuvem, com o serviço de metadados da instância disponível no endereço interno padrão.',
  ],
  file: 'src/webhooks/verificar.ts',
  language: 'ts',
  code: [
    'export async function verificarDestino(url: string, lojaId: string) {',
    '  const alvo = new URL(url)',
    '  if (alvo.protocol !== "https:") throw new ErroDeValidacao("use https")',
    '  if (alvo.hostname.endsWith(".interno.example")) throw new ErroDeValidacao("domínio interno")',
    '',
    '  const desafio = gerarDesafio(lojaId)',
    '  const resposta = await fetch(alvo, {',
    '    method: "POST",',
    '    headers: { "content-type": "application/json", "x-desafio": desafio },',
    '    body: JSON.stringify({ tipo: "verificacao", loja: lojaId }),',
    '    redirect: "follow",',
    '  })',
    '',
    '  const corpo = await resposta.text()',
    '  if (!corpo.includes(desafio)) throw new ErroDeValidacao("desafio não confirmado")',
    '  return { ok: true, status: resposta.status, corpo: corpo.slice(0, 2000) }',
    '}',
  ],
  extra: {
    title: 'Teste manual feito durante a revisão',
    language: 'text',
    lines: [
      'POST /api/webhooks/verificar  { "url": "https://coletor.example/eco" }',
      '  -> 200 { ok: true, status: 200, corpo: "...x-desafio recebido..." }',
      '',
      'o coletor responde 302 para http://169.254.169.254/latest/meta-data/iam/security-credentials/',
      '  -> 200 { ok: true, status: 200, corpo: "{\\"Code\\":\\"Success\\",\\"AccessKeyId\\":\\"...\\"}" }',
      '',
      'observação: o corpo da resposta volta para quem chamou a API',
    ],
    note: 'O que aconteceu quando o destino respondeu com um redirecionamento.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. As validações olham só a URL inicial, e o cliente controla o redirecionamento: o servidor segue para um endereço interno, lê a resposta e devolve o corpo a quem chamou.',
    'As verificações de esquema e de domínio existem, mas são aplicadas antes do redirecionamento e não impedem o destino final. O teste manual mostra a leitura de credenciais da instância.',
    'O contexto necessário está descrito: onde o serviço roda, o que é validado, que o redirecionamento é seguido e que o corpo volta na resposta.',
  ],
  verdictHints: [
    'Verifique em que momento as validações acontecem e o que pode mudar depois delas.',
    'Repare na opção de redirecionamento da chamada.',
    'Pergunte o que o cliente recebe de volta ao fim da verificação.',
  ],
  verdictExplain:
    'Validar a URL antes de chamar não basta quando o próprio destino escolhe para onde redirecionar. Com o redirecionamento seguido e o corpo devolvido, a verificação vira um leitor universal do que a rede interna responde, incluindo o serviço de metadados da instância.',
  signals: [
    { text: 'A chamada usa `redirect: "follow"`, e o destino final não passa pelas validações.', feedback: 'Sim: é o ponto central, porque transforma uma validação de entrada em uma verificação inútil.' },
    { text: 'O corpo da resposta é devolvido a quem chamou a API.', feedback: 'Sim: é o que converte o acesso interno em exfiltração de conteúdo.' },
    { text: 'O serviço roda em nuvem com serviço de metadados acessível em endereço interno.', feedback: 'Sim: define o alvo mais valioso alcançável a partir do servidor.' },
    { text: 'A validação recusa esquemas diferentes de `https`.', feedback: 'Não sustenta o veredito: é um controle correto, contornado pelo redirecionamento.' },
    { text: 'O desafio precisa aparecer no corpo para a verificação passar.', feedback: 'Não: o desafio prova posse do destino inicial, e o atacante controla esse destino.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Procure o que acontece depois da validação.',
    'Pergunte que informação volta para quem chamou.',
    'Dois itens são controles reais que não cobrem este caminho.',
  ],
  signalExplain:
    'O que sustenta o veredito é a combinação de três coisas: redirecionamento seguido, corpo devolvido e um alvo interno valioso. Esquema e desafio são controles que tratam outros riscos do mesmo fluxo.',
  next: {
    prompt: 'A verificação precisa continuar existindo. Qual desenho resolve o achado?',
    options: [
      {
        text: 'Não seguir redirecionamentos; resolver o nome e recusar endereços privados, de laço e de metadados, revalidando a cada salto permitido; sair por um proxy com lista de destinos externos; e devolver apenas o veredito da verificação, sem o corpo da resposta.',
        quality: 'best',
        flags: ['sem-redirect', 'rede', 'resposta-minima'],
        feedback: 'Fecha os três caminhos ao mesmo tempo: o destino não muda depois da validação, a rede impede o alcance interno e a resposta deixa de carregar conteúdo.',
        consequence: 'A verificação continua funcionando para destinos legítimos e deixa de servir como leitor do que está dentro da rede.',
      },
      {
        text: 'Manter o redirecionamento e bloquear endereços privados na validação inicial da URL.',
        quality: 'poor',
        feedback: 'A lista de bloqueio é aplicada antes do salto: basta o destino responder com redirecionamento para o endereço interno.',
        consequence: 'O teste manual que já funcionou continua funcionando igual, agora com a falsa sensação de controle.',
      },
      {
        text: 'Parar de devolver o corpo da resposta, mantendo o resto do fluxo.',
        quality: 'partial',
        feedback: 'Reduz bastante o valor do ataque, porque corta a leitura direta. Ainda sobra o alcance interno, com efeitos observáveis por tempo e por código de estado.',
        consequence: 'A exfiltração direta para, e o servidor continua alcançando serviços internos a pedido do cliente.',
      },
      {
        text: 'Exigir que o lojista confirme a posse do domínio por registro DNS antes de cadastrar a URL.',
        quality: 'good',
        flags: ['posse'],
        feedback: 'Eleva muito o custo do ataque e é uma boa medida de produto, mas não impede que um domínio confirmado redirecione para um endereço interno.',
        consequence: 'O abuso casual desaparece; quem controla um domínio próprio ainda consegue alcançar a rede interna.',
      },
    ],
    hints: [
      'Pense em cada etapa: validação, salto, rede e resposta.',
      'Uma medida isolada costuma ser contornada pelo caminho que ela não cobre.',
      'A verificação precisa dizer "funcionou", não "veja o que eu li".',
    ],
    explain:
      'Requisição forjada no servidor se trata em camadas: não seguir redirecionamento (ou revalidar a cada salto), impedir o alcance de faixas internas pela rede e devolver o mínimo possível. Cada medida sozinha deixa uma porta: juntas, fecham o caminho.',
  },
  closing:
    'A verificação parou de seguir redirecionamentos, passou a sair por um proxy com lista de destinos e devolve apenas o resultado, sem o corpo da resposta.',
  review: {
    solution: [
      'O veredito é "procede": as validações olham a URL inicial, o redirecionamento é seguido e o corpo da resposta volta para quem chamou.',
      'Os sinais são `redirect: "follow"`, o corpo devolvido e o serviço de metadados alcançável a partir do servidor.',
      'O desenho correto combina não seguir redirecionamento, controle de rede na saída e resposta mínima.',
    ],
    residual:
      'Mesmo com as três medidas, o servidor continua fazendo requisições a pedido de terceiros: destinos externos hostis, tempo de resposta e erros ainda contam alguma coisa a quem observa.',
    validation:
      'Repita o teste do redirecionamento e confirme a recusa; tente um destino que resolva para endereço privado e confirme a recusa pela resolução de nome; e verifique que a resposta da API não traz mais o corpo.',
  },
  frameworks: [
    { framework: 'owasp-api-top10', id: 'API7' },
    { framework: 'cwe', id: 'CWE-918' },
  ],
  tags: ['api', 'ssrf', 'procede'],
}
