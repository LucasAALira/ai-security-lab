import type { ReviewSample } from './types'

export const chaveNoCodigo: ReviewSample = {
  id: 'chave-no-codigo',
  title: 'Chave encontrada no código do aplicativo',
  subtitle: 'Treinar a leitura de segredos: nem tudo que parece chave precisa ser escondido, e dizer qual é a diferença faz parte do trabalho.',
  area: 'config',
  level: 'Intermediário',
  minutes: 9,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-003 · material criptográfico embutido no código',
    severity: 'crítica',
    line: 4,
    message: 'Bloco de chave encontrado em arquivo versionado. Mova o segredo para a configuração.',
    confidence: 'alta',
  },
  context: [
    'O aplicativo verifica a assinatura dos pacotes de atualização de conteúdo antes de aplicá-los. A verificação usa criptografia assimétrica: a assinatura é gerada no servidor de publicação e conferida no aparelho.',
    'A varredura marcou o arquivo como crítico e bloqueou a publicação da versão.',
  ],
  file: 'src/atualizacao/verificar.ts',
  language: 'ts',
  code: [
    '// Chave de verificação dos pacotes de conteúdo.',
    '// Par gerado em 2026-02; a privada fica no cofre do pipeline de publicação.',
    'export const CHAVE_PUBLICA_PACOTES = `-----BEGIN PUBLIC KEY-----',
    'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7rC2mF1u8gQ0W0tQ3f8s',
    'c3VwZXItZmFrZS1rZXktcGFyYS1leGVtcGxvLW5hby11c2FyLWVtLXByb2R1Y2Fv',
    '-----END PUBLIC KEY-----`',
    '',
    'export async function verificarPacote(pacote: ArrayBuffer, assinatura: ArrayBuffer) {',
    '  const chave = await crypto.subtle.importKey("spki", pem(CHAVE_PUBLICA_PACOTES), ALG, false, ["verify"])',
    '  const ok = await crypto.subtle.verify(ALG, chave, assinatura, pacote)',
    '  if (!ok) throw new Error("pacote com assinatura inválida")',
    '  return aplicar(pacote)',
    '}',
  ],
  extra: {
    title: 'Outros achados da mesma varredura, no mesmo pedido de mudança',
    language: 'text',
    lines: [
      'SEC-003  src/atualizacao/verificar.ts:4      bloco de chave (PUBLIC KEY)',
      'SEC-003  ios/Config/Release.xcconfig:12      API_TOKEN=sk_live_7f3a...  (40 caracteres)',
      'SEC-003  docs/exemplos/config.sample.yml:8   senha: "troque-esta-senha"',
    ],
    note: 'Três achados da mesma regra. Eles merecem o mesmo veredito?',
  },
  verdict: 'falso-positivo',
  verdictFeedback: [
    'A chave do trecho analisado é pública por definição: ela serve para conferir assinatura, e distribuí-la com o aplicativo é o desenho esperado. O achado da linha 4 não descreve exposição de segredo.',
    'Correto. A regra reconhece o formato do bloco e não distingue chave pública de chave privada. Para a linha apontada, o alerta não procede — o que não vale para os outros dois achados da mesma varredura.',
    'O trecho diz o que a chave faz (`verify`), e o comentário diz onde fica a privada. Não falta informação para decidir sobre esta linha.',
  ],
  verdictHints: [
    'Leia o cabeçalho do bloco e a operação permitida na importação da chave.',
    'Pergunte o que um atacante consegue fazer de posse dessa chave.',
    'Os outros achados da lista não precisam ter o mesmo veredito que este.',
  ],
  verdictExplain:
    'Chave pública embutida é o modo correto de verificar assinatura no cliente: quem a obtém consegue conferir assinaturas, não gerá-las. O risco mudaria de figura se a chave privada estivesse ali, ou se a verificação aceitasse chave vinda do próprio pacote.',
  signals: [
    { text: 'O bloco é `PUBLIC KEY`, e a importação declara apenas a operação `verify`.', feedback: 'Sim: a operação permitida confirma o papel da chave no fluxo.' },
    { text: 'A chave privada correspondente fica no cofre do pipeline, conforme o comentário e o fluxo de publicação.', feedback: 'Sim: o segredo do par está fora do repositório, que é o que a regra deveria procurar.' },
    { text: 'A chave está fixa no código, e não é lida do pacote que está sendo verificado.', feedback: 'Sim: se a chave viesse junto com o pacote, a verificação não valeria nada.' },
    { text: 'O arquivo está versionado no repositório.', feedback: 'Não: estar versionado é o esperado para uma chave pública; o problema seria o conteúdo ser privado.' },
    { text: 'Os outros dois achados da varredura também são blocos de chave.', feedback: 'Não: um é um token de produção e o outro é um exemplo de documentação; cada um tem veredito próprio.' },
  ],
  correctSignals: [0, 1, 2],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito para a **linha 4**.',
  signalHints: [
    'O cabeçalho do bloco e a operação permitida dizem muito.',
    'Pergunte onde está a outra metade do par.',
    'Cuidado para não misturar os três achados da lista.',
  ],
  signalExplain:
    'O veredito se apoia em três fatos: a chave é pública, a privada está no cofre e a verificação não aceita chave vinda do pacote. O arquivo estar versionado é normal, e os achados vizinhos são casos independentes.',
  next: {
    prompt: 'A publicação está bloqueada pelos três achados. Qual é a conduta?',
    options: [
      {
        text: 'Fechar o achado da chave pública com justificativa e um teste que falhe se o bloco virar `PRIVATE KEY`; tratar o token de produção como vazamento (revogar, trocar e procurar uso indevido); e corrigir a regra para não marcar blocos públicos, mantendo-a para privados e tokens.',
        quality: 'best',
        flags: ['justifica', 'revoga', 'ajusta-regra'],
        feedback: 'Dá a cada achado o tratamento que ele merece, trata o vazamento real com urgência e reduz o ruído futuro sem cegar a regra.',
        consequence: 'A publicação volta a andar, o token exposto é revogado no mesmo dia e a varredura passa a acertar mais nos próximos pedidos de mudança.',
      },
      {
        text: 'Marcar os três achados como falso positivo para desbloquear a publicação e revisar depois.',
        quality: 'poor',
        feedback: 'Entre os três há um token de produção exposto: fechá-lo como falso positivo transforma um vazamento em um registro de aprovação.',
        consequence: 'A versão sai, o token continua válido em um arquivo versionado e o incidente só aparece quando alguém o usar.',
      },
      {
        text: 'Mover a chave pública para uma variável de ambiente lida na inicialização, como a regra pede.',
        quality: 'partial',
        feedback: 'Tira o alerta e piora o desenho: a chave de verificação passa a depender da configuração do ambiente, que é mais fácil de trocar do que o binário.',
        consequence: 'A verificação fica frágil, porque quem alterar a configuração passa a decidir qual chave valida os pacotes.',
      },
      {
        text: 'Adicionar o arquivo à lista de exceções da varredura de segredos.',
        quality: 'partial',
        feedback: 'Resolve este arquivo e sem justificativa registrada: se amanhã alguém colar uma chave privada nele, a varredura não dirá nada.',
        consequence: 'O ruído some, a proteção do arquivo some junto, e ninguém percebe quando o conteúdo mudar.',
      },
    ],
    hints: [
      'Os três achados não têm o mesmo veredito.',
      'Um deles exige ação imediata que não é técnica no código.',
      'Pense em como a regra deveria se comportar na próxima vez.',
    ],
    explain:
      'Triagem de segredos separa o que é público do que é segredo. A chave pública fecha com justificativa e um teste que vigia o tipo do bloco; o token de produção vira resposta a incidente, com revogação; e a regra é ajustada para errar menos, sem perder cobertura.',
  },
  closing:
    'A chave pública ficou onde estava, com justificativa e teste; o token de produção foi revogado e trocado; a regra passou a distinguir blocos públicos de privados.',
  review: {
    solution: [
      'Para a linha 4 o veredito é falso positivo: trata-se de chave pública usada apenas para verificar assinatura.',
      'Os sinais são o tipo do bloco com a operação `verify`, a chave privada guardada no cofre e a chave fixa no código, e não lida do pacote.',
      'A conduta separa os três achados: justificar e testar a chave pública, revogar o token de produção e ajustar a regra.',
    ],
    residual:
      'A verificação depende de ninguém trocar a chave embutida em uma versão futura: quem conseguir publicar um binário com outra chave pública passa a assinar os próprios pacotes.',
    validation:
      'Confirme que a assinatura falha quando o pacote é alterado; rode o teste que recusa blocos `PRIVATE KEY` no arquivo; e verifique no provedor que o token antigo foi revogado e não tem uso recente.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'cwe', id: 'CWE-347' },
  ],
  tags: ['config', 'segredos', 'falso-positivo'],
}
