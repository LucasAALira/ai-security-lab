import type { ReviewSample } from './types'

export const chaveEmRepositorioPrivado: ReviewSample = {
  id: 'chave-em-repositorio-privado',
  title: 'Credencial em repositório privado da empresa',
  subtitle: 'Treinar o argumento "o repositório é privado": o que ele protege, e o que ele não protege.',
  area: 'supply',
  level: 'Intermediário',
  minutes: 10,
  finding: {
    tool: 'Varredura de segredos (ferramenta fictícia)',
    rule: 'SEC-021 · credencial de provedor de nuvem em arquivo versionado',
    severity: 'crítica',
    line: 5,
    message: 'Par de chaves de acesso de provedor de nuvem em texto claro.',
    confidence: 'alta',
  },
  context: [
    'O script faz a carga noturna de arquivos de backup para o armazenamento em nuvem. Ele vive em um repositório privado da organização, com 40 pessoas de acesso.',
    'A pessoa responsável respondeu na revisão: "é repositório privado, só gente de dentro vê; a chave está ali desde sempre".',
  ],
  file: 'scripts/carga-noturna.py',
  language: 'py',
  code: [
    'import boto3',
    '',
    '# credenciais da conta de serviço da carga noturna',
    'ACESSO = "AKIA00000000EXEMPLO0"',
    'SEGREDO = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXEMPLOKEY"',
    '',
    'def enviar(caminho: str, chave: str) -> None:',
    '    s3 = boto3.client("s3", aws_access_key_id=ACESSO, aws_secret_access_key=SEGREDO)',
    '    s3.upload_file(caminho, "backups-noturnos", chave)',
    '',
    'if __name__ == "__main__":',
    '    for arquivo in listar_backups():',
    '        enviar(arquivo, nome_destino(arquivo))',
  ],
  extra: {
    title: 'O que a revisão apurou sobre a conta e o acesso',
    language: 'text',
    lines: [
      'permissões da conta de serviço: leitura e escrita em todos os buckets da organização',
      'autenticação em dois fatores no provedor do repositório: não obrigatória',
      'pessoas com acesso ao repositório: 40, sendo 6 já desligadas da empresa (contas ainda ativas)',
      'a chave aparece no histórico desde o primeiro commit, há 4 anos',
      'o repositório é espelhado para um ambiente de análise estática de terceiro',
    ],
    note: 'Quem alcança o repositório, e o que a chave permite quando alguém o alcança.',
  },
  verdict: 'procede',
  verdictFeedback: [
    'Correto. "Privado" descreve quem deveria ver, não quem vê: há contas de pessoas desligadas, não há segundo fator obrigatório e o repositório é espelhado para um terceiro. A chave dá escrita em todos os buckets.',
    'Não é falso positivo: o valor é uma credencial real de conta de serviço, não um exemplo de documentação, e está no histórico há quatro anos.',
    'Não falta contexto: a apuração traz permissões, quem alcança o repositório e há quanto tempo o valor está lá.',
  ],
  verdictHints: [
    'Liste quem, hoje, consegue clonar esse repositório.',
    'Pergunte o que a credencial permite depois de obtida.',
    'Repare no espelhamento para o ambiente de terceiro.',
  ],
  verdictExplain:
    'Repositório privado é um controle de acesso, e controles de acesso falham do jeito de sempre: conta sem segundo fator, pessoa desligada com acesso ativo, cópia enviada a um terceiro. Como a credencial é a mesma há quatro anos e permite escrita em todos os buckets, o valor de um único desses furos é altíssimo.',
  signals: [
    { text: 'Contas de pessoas já desligadas continuam com acesso ao repositório.', feedback: 'Sim: a fronteira do "privado" já está furada no momento da análise.' },
    { text: 'O provedor do repositório não exige autenticação em dois fatores.', feedback: 'Sim: uma senha reaproveitada e vazada em outro serviço basta para alcançar o código.' },
    { text: 'A conta de serviço tem escrita em todos os buckets da organização.', feedback: 'Sim: define o impacto, que vai muito além da carga noturna.' },
    { text: 'O repositório é espelhado para um ambiente de análise de terceiro.', feedback: 'Sim: a cópia sai do perímetro e passa a depender da segurança de outra empresa.' },
    { text: 'O script roda apenas de madrugada.', feedback: 'Não: o horário de execução não limita quando a credencial pode ser usada por outra pessoa.' },
  ],
  correctSignals: [0, 1, 2, 3],
  signalPrompt: 'Marque **todos** os sinais que sustentam o veredito.',
  signalHints: [
    'Três sinais falam de quem alcança o repositório.',
    'Um sinal fala do que a chave permite.',
    'O horário do script não tem relação com a exposição.',
  ],
  signalExplain:
    'Os sinais se dividem em dois grupos: os que mostram que a fronteira do repositório é porosa (pessoas desligadas, sem segundo fator, espelho para terceiro) e o que mostra o impacto (escrita em todos os buckets). O horário de execução é irrelevante.',
  next: {
    prompt: 'A chave está no histórico há quatro anos. Por onde começar?',
    options: [
      {
        text: 'Trocar a credencial por identidade temporária do próprio provedor (papel assumido pelo executor, sem chave fixa); revogar o par antigo depois da migração; revisar os acessos ao repositório, removendo contas de pessoas desligadas e exigindo segundo fator; e registrar que o valor permanece no histórico e nos espelhos.',
        quality: 'best',
        flags: ['sem-chave-fixa', 'revoga', 'acessos'],
        feedback: 'Elimina a classe inteira do problema, em vez de trocar um segredo escrito por outro, e fecha os furos de acesso que tornavam o "privado" frágil.',
        consequence: 'O script passa a obter credencial temporária na execução, e não há mais valor fixo para vazar em código, histórico ou espelho.',
      },
      {
        text: 'Mover a chave para variável de ambiente no agendador e remover do script.',
        quality: 'good',
        flags: ['tira-do-codigo'],
        feedback: 'Tira o valor do código, que é o pedido do achado, mas mantém uma credencial de longa duração e não revoga a que já circulou.',
        consequence: 'A varredura fica limpa, e a chave antiga continua válida, inclusive nas cópias feitas nesses quatro anos.',
      },
      {
        text: 'Tornar o repositório ainda mais restrito, reduzindo para dez pessoas, e manter a chave no código.',
        quality: 'poor',
        feedback: 'Reduz a plateia e mantém o segredo escrito, inclusive nos espelhos já existentes e no histórico.',
        consequence: 'O número de pessoas cai, a credencial continua disponível em cada cópia do repositório.',
      },
      {
        text: 'Reescrever o histórico do repositório para apagar a chave, mantendo a credencial em uso.',
        quality: 'poor',
        feedback: 'Reescrever histórico não alcança clones, espelhos e caches, e deixa a credencial ativa, que é o que importa.',
        consequence: 'O esforço é grande, o valor continua em cópias fora do alcance e a conta segue acessível.',
      },
    ],
    hints: [
      'Pergunte se é possível não ter credencial fixa nenhuma.',
      'Trocar o lugar do segredo não revoga o segredo.',
      'Os acessos ao repositório também fazem parte do achado.',
    ],
    explain:
      'A melhor conduta elimina o segredo de longa duração: identidade temporária na execução, revogação do par antigo e limpeza dos acessos. Mover para variável de ambiente é um avanço parcial; restringir pessoas ou reescrever histórico não revoga nada.',
  },
  closing:
    'A carga noturna passou a assumir um papel com credencial temporária, o par antigo foi revogado, seis contas de pessoas desligadas saíram do repositório e o segundo fator virou obrigatório.',
  review: {
    solution: [
      'O veredito é "procede": a credencial é real, está no histórico há quatro anos e a fronteira do repositório privado tem furos conhecidos.',
      'Os sinais são as contas de pessoas desligadas, a ausência de segundo fator, o espelho para terceiro e a permissão de escrita em todos os buckets.',
      'A conduta correta substitui a chave fixa por identidade temporária, revoga a antiga e corrige os acessos ao repositório.',
    ],
    residual:
      'O par antigo continua no histórico, nos espelhos e em clones; a revogação encerra o uso, não a circulação. Além disso, identidade temporária exige que o executor seja confiável: quem controla o pipeline passa a ser o alvo.',
    validation:
      'Tente usar o par antigo depois da revogação e confirme a recusa; rode a carga noturna e confirme que ela obtém credencial temporária; e revise a lista de acesso do repositório conferindo que as contas desligadas saíram.',
  },
  frameworks: [
    { framework: 'owasp-top10', id: 'A08' },
    { framework: 'cwe', id: 'CWE-798' },
    { framework: 'cwe', id: 'CWE-250' },
  ],
  inspiredBy: {
    label: 'Federal Trade Commission, "Uber Technologies: Revised Complaint" (processo C-4662, 2018)',
    url: 'https://www.ftc.gov/system/files/documents/cases/152_3054_c-4662_uber_technologies_revised_complaint.pdf',
    note: 'Na denúncia da FTC, os invasores entraram no armazenamento em nuvem com uma chave de acesso que um engenheiro havia publicado em texto claro no código de um repositório privado do GitHub; eles chegaram ao repositório usando senhas expostas em vazamentos anteriores. A denúncia aponta que a empresa não proibia o reúso de credenciais nem exigia autenticação em dois fatores no acesso aos repositórios, e que 16 arquivos foram baixados entre 13 de outubro e 15 de novembro de 2016. O script e os números desta amostra são inventados.',
  },
  tags: ['supply', 'segredos', 'procede'],
}
