import type { Lesson } from './types'

/* Aulas da área Segurança Web (segunda parte): submódulos que já tinham desafios e ganham a explicação. */

export const webLessons2: Record<string, Lesson> = {
  'web-login-recuperacao': {
    context: 'O formulário "esqueci minha senha" responde "e-mail não encontrado" para quem não tem conta. Em uma tarde, alguém testa milhares de e-mails e descobre quem é cliente.',
    concept: [
      'O login e a recuperação de conta formam um só sistema: o atacante escolhe o caminho mais fraco. A recuperação precisa da mesma seriedade do login, com tokens imprevisíveis, de uso único e de vida curta.',
      'Respostas diferentes para conta existente e inexistente permitem **enumeração**. Limites de tentativas por conta e por origem, mensagens neutras e aviso por e-mail a cada troca de senha reduzem a tomada de contas.',
    ],
    example: {
      title: 'Respostas neutras',
      language: 'text',
      code: ['e-mail com conta:  "Se houver uma conta, enviamos um link para o e-mail informado."', 'e-mail sem conta:  "Se houver uma conta, enviamos um link para o e-mail informado."'],
      caption: 'A mesma mensagem e o mesmo tempo de resposta nos dois casos.',
    },
    validation: 'Compare respostas e tempos para e-mails com e sem conta: devem ser iguais. Gere vários tokens e confirme que não seguem padrão; use um token duas vezes e um expirado: ambos devem ser recusados.',
    review: [
      { front: 'O que é enumeração de contas?', back: 'Descobrir quais identificadores têm conta a partir de respostas diferentes do sistema.' },
      { front: 'Quais propriedades um token de recuperação precisa ter?', back: 'Aleatoriedade criptográfica, uso único e validade curta.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A07' }, { framework: 'cwe', id: 'CWE-330' }],
  },
  'web-oauth-oidc': {
    context: 'O login com um provedor de identidade aceita qualquer endereço de retorno que comece com o domínio da empresa. Um domínio parecido recebe o código de autorização.',
    concept: [
      'No fluxo de **código de autorização**, o provedor autentica a pessoa e devolve um código ao endereço de retorno cadastrado; o aplicativo troca o código por tokens. O **PKCE** liga essa troca a um segredo gerado pelo próprio aplicativo, e o `state` liga a resposta ao pedido.',
      'O endereço de retorno é comparado de forma **exata**. Ao receber um token de identidade, o aplicativo confere assinatura, emissor, audiência e validade. OAuth é sobre autorização delegada; o OIDC acrescenta a camada de identidade.',
    ],
    validation: 'Peça um login com um endereço de retorno que começa igual ao cadastrado e termina em outro domínio: deve ser recusado. Troque um código sem o verificador do PKCE: deve falhar. Altere o `state`: o aplicativo deve recusar a resposta.',
    review: [
      { front: 'O que o PKCE protege?', back: 'A troca do código por tokens: um código interceptado não serve sem o verificador.' },
      { front: 'Como validar o endereço de retorno?', back: 'Por comparação exata com a lista cadastrada, e nunca por prefixo.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-601' }, { framework: 'owasp-top10', id: 'A07' }],
  },
  'web-auth-falhas': {
    context: 'Em um teste de login, a equipe só verificou "senha certa entra, senha errada não entra". Ninguém testou o que acontece depois de mil tentativas, nem se o hash da senha é adequado.',
    concept: [
      'As falhas de autenticação mais comuns são de implementação: senhas guardadas com hash rápido, ausência de limite de tentativas, sessões que não expiram, recuperação fraca e mensagens que revelam demais.',
      'Senhas são guardadas com funções de hash lentas e com sal, próprias para senhas. Um plano de testes cobre também o que acontece em volume, em erro e em fluxos alternativos.',
    ],
    validation: 'Teste: mil tentativas seguidas em uma conta (deve haver limite); sessão antiga após troca de senha (deve cair); hash usado no banco (deve ser uma função própria para senhas, com sal); recuperação com token reutilizado (deve falhar).',
    review: [
      { front: 'Por que um hash rápido é ruim para senhas?', back: 'Porque permite testar muitas senhas por segundo se o banco vazar; funções lentas e com sal encarecem o ataque.' },
      { front: 'O que um teste de autenticação deve cobrir além do caminho feliz?', back: 'Volume de tentativas, sessões depois de eventos de segurança, recuperação e mensagens de erro.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A07' }, { framework: 'owasp-top10', id: 'A04' }],
  },
  'web-idor': {
    context: 'O e-mail de confirmação traz o link `/pedidos/100231`. Basta trocar o número para ver o pedido de outro cliente.',
    concept: [
      '**IDOR** (referência insegura a objeto) é a falta de verificação de que o objeto pedido pertence a quem pede. Ela aparece em detalhes, downloads, cancelamentos, listas e exportações, ou seja, em qualquer rota que recebe um identificador.',
      'A correção é conferir o dono (ou o direito de acesso) no servidor, de preferência junto da consulta, e responder do mesmo jeito para "não existe" e "não é seu", para não revelar a existência do objeto.',
    ],
    figure: 'idor',
    validation: 'Com duas contas, tente acessar o objeto da outra em cada rota que recebe um identificador, inclusive downloads e exportações. Escreva esses testes na suíte automatizada.',
    review: [
      { front: 'Em que tipo de rota o IDOR costuma aparecer?', back: 'Em qualquer rota que recebe um identificador: detalhe, download, cancelamento, exportação e listas.' },
      { front: 'Por que responder igual para "não existe" e "não é seu"?', back: 'Para não revelar que o objeto existe e pertence a outra pessoa.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A01' }, { framework: 'cwe', id: 'CWE-639' }],
  },
  'web-sqli': {
    context: 'Uma lista de clientes aceita ordenar "por qualquer coluna". O nome da coluna é colado na consulta SQL.',
    concept: [
      '**Injeção de SQL** acontece quando dados viram parte do comando SQL. Consultas parametrizadas separam comando e dados para valores. Partes que não podem ser parametrizadas, como nomes de colunas, usam uma lista fechada de opções permitidas.',
      'A conta do banco usada pela aplicação tem o mínimo de permissões, e mensagens de erro não mostram a consulta. Escapar caracteres manualmente é frágil e não substitui parâmetros.',
    ],
    example: {
      title: 'Parâmetros e lista de colunas (Python)',
      language: 'py',
      code: ['COLUNAS = {"nome": "nome", "criado": "criado_em"}', 'coluna = COLUNAS.get(pedido_ordenacao, "nome")', 'cursor.execute(f"SELECT id, nome FROM clientes WHERE loja = %s ORDER BY {coluna}", (loja_id,))'],
      caption: 'O valor vai por parâmetro; a coluna só pode ser uma das opções da lista.',
    },
    figure: 'injecao',
    validation: 'Envie aspas, comentários de SQL e nomes de coluna inexistentes em cada parâmetro: nenhum deve alterar a consulta nem gerar erro detalhado. Confirme as permissões da conta do banco.',
    review: [
      { front: 'Como tratar partes da consulta que não aceitam parâmetro, como o nome da coluna?', back: 'Com uma lista fechada de opções permitidas, mapeadas no servidor.' },
      { front: 'Escapar aspas resolve injeção de SQL?', back: 'Não de forma confiável. Consultas parametrizadas são a defesa principal.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A05' }, { framework: 'cwe', id: 'CWE-89' }],
  },
  'web-cmd-template': {
    context: 'Um recurso de "converter documento" monta o comando do sistema com o nome do arquivo enviado. Outro recurso aceita configurações em YAML e as carrega com o carregador completo.',
    concept: [
      'Quando entrada vira **comando** (shell), **expressão de template** ou **objeto desserializado**, quem controla a entrada passa a executar código. O padrão é o mesmo: dado sendo interpretado como instrução.',
      'As defesas são: chamar programas sem shell e com argumentos separados, nunca montar templates com entrada do usuário e usar carregadores seguros (que só criam dados simples) para formatos como YAML.',
    ],
    example: {
      title: 'Sem shell e com carregador seguro (Python)',
      language: 'py',
      code: ['subprocess.run(["conversor", "--entrada", caminho_validado, "--saida", destino], check=True)', 'config = yaml.safe_load(texto_enviado)'],
      caption: 'Argumentos separados não são interpretados pelo shell; `safe_load` não cria objetos arbitrários.',
    },
    validation: 'Envie nomes de arquivo com `;`, `$()` e aspas: nenhum comando extra deve ser executado. Envie um YAML com tags de objetos: deve ser recusado ou tratado como dado simples.',
    review: [
      { front: 'O que injeção de comando, de template e desserialização insegura têm em comum?', back: 'Dados controlados pelo usuário sendo interpretados como instrução.' },
      { front: 'Como chamar um programa externo com segurança?', back: 'Sem shell, com os argumentos separados e validados.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A05' }, { framework: 'cwe', id: 'CWE-502' }],
  },
  'web-xss': {
    context: 'A página de busca mostra "Resultados para: <termo>". Um link com um termo cheio de HTML circula por e-mail.',
    concept: [
      '**XSS** é a execução de script de terceiros na página da vítima, com a origem do site. A defesa principal é **codificar a saída conforme o contexto** (HTML, atributo, URL, JavaScript), usando a proteção do framework em vez de concatenar texto.',
      'Filtrar a entrada ajuda pouco, porque o mesmo dado aparece em contextos diferentes. Uma **CSP** restritiva reduz o dano quando algo escapa, e cookies HttpOnly impedem o roubo direto da sessão.',
    ],
    example: {
      title: 'Saída codificada (TypeScript com React)',
      language: 'ts',
      code: ['// o React codifica texto automaticamente', 'return <h1>Resultados para: {termo}</h1>', '', '// perigoso: insere HTML sem codificar', '// <div dangerouslySetInnerHTML={{ __html: termo }} />'],
      caption: 'Inserir HTML cru só é aceitável com sanitização por lista de elementos permitidos.',
    },
    figure: 'xss',
    validation: 'Envie `<script>`, atributos de evento e URLs `javascript:` em cada campo exibido: nada deve executar. Confira a CSP da página e que ela não permite scripts inline sem necessidade.',
    review: [
      { front: 'Qual é a defesa principal contra XSS?', back: 'Codificar a saída conforme o contexto em que ela é inserida.' },
      { front: 'O que a CSP acrescenta?', back: 'Reduz o impacto quando um script escapa, limitando de onde scripts podem vir.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A05' }, { framework: 'cwe', id: 'CWE-79' }],
  },
  'web-upload': {
    context: 'A foto de perfil aceita qualquer arquivo cujo tipo informado pelo navegador seja `image/png`. Um arquivo HTML passa e é servido no domínio do site.',
    concept: [
      'Nome, extensão e tipo declarado são **dados do cliente**. O que importa é o conteúdo real e onde o arquivo fica. Um arquivo servido no mesmo domínio e interpretado como página roda com a origem do site.',
      'Receba arquivos com tamanho máximo, confira o conteúdo real, gere um nome novo, guarde fora de pastas executáveis e sirva de um domínio separado ou com cabeçalhos que impeçam a interpretação. Reprocessar imagens elimina conteúdo escondido.',
    ],
    validation: 'Envie um arquivo HTML com extensão de imagem, um arquivo muito grande e um nome com `../`: todos devem ser recusados ou neutralizados. Abra a URL de um arquivo enviado: ele não deve ser interpretado como página.',
    review: [
      { front: 'Por que não confiar no tipo informado pelo navegador?', back: 'Porque é um dado enviado pelo cliente e pode ser qualquer coisa.' },
      { front: 'Por que servir uploads de um domínio separado?', back: 'Para que um arquivo malicioso não rode com a origem do site principal.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-434' }, { framework: 'owasp-top10', id: 'A06' }],
  },
  'web-path-traversal': {
    context: 'A rota `/relatorios?arquivo=junho.pdf` lê o arquivo do disco. Alguém pede `../../config/segredos.env`.',
    concept: [
      '**Path traversal** acontece quando um caminho informado sai do diretório permitido. Sequências como `../`, caminhos absolutos e codificações alternativas levam a arquivos fora da pasta.',
      'A defesa preferida é não usar nomes do cliente: usar um identificador e buscar o caminho no servidor. Se for preciso usar o nome, resolva o caminho completo e confira que ele continua dentro do diretório base.',
    ],
    example: {
      title: 'Conferir o caminho resolvido (TypeScript)',
      language: 'ts',
      code: ['const base = path.resolve("/srv/relatorios")', 'const alvo = path.resolve(base, nomePedido)', 'if (!alvo.startsWith(base + path.sep)) throw new Error("fora do diretório")'],
      caption: 'A verificação é feita sobre o caminho já resolvido, e não sobre o texto recebido.',
    },
    validation: 'Peça arquivos com `../`, caminhos absolutos, barras invertidas e codificações (`%2e%2e%2f`): todos devem ser recusados. Confirme que o processo só tem permissão de leitura na pasta de relatórios.',
    review: [
      { front: 'Qual é a defesa mais simples contra path traversal?', back: 'Não usar nomes enviados pelo cliente: usar um identificador e mapear o caminho no servidor.' },
      { front: 'Por que conferir o caminho resolvido, e não o texto?', back: 'Porque codificações e combinações de `../` só se revelam depois de resolver o caminho.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-22' }, { framework: 'owasp-top10', id: 'A01' }],
  },
  'web-csrf': {
    context: 'Uma página maliciosa contém um formulário escondido que envia `POST /conta/email`. A vítima, logada, abre a página e tem o e-mail trocado.',
    concept: [
      'O navegador anexa cookies às requisições para um site, mesmo quando elas são iniciadas por outro site. Se a ação depende só do cookie, outro site consegue dispará-la: isso é **CSRF**.',
      'As defesas combinam: cookie com `SameSite`, token anti-CSRF ligado à sessão em formulários e verificação da origem (`Origin`) nas ações que mudam estado. Ações críticas também pedem reautenticação.',
    ],
    validation: 'De uma página em outro domínio de teste, envie o formulário da ação: deve ser recusado. Envie sem o token e com o token de outra sessão: ambos devem ser recusados.',
    review: [
      { front: 'Por que o CSRF é possível?', back: 'Porque o navegador envia os cookies do site mesmo em requisições iniciadas por outra página.' },
      { front: 'Quais defesas combinar contra CSRF?', back: 'SameSite, token ligado à sessão e verificação da origem nas ações que mudam estado.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-352' }, { framework: 'owasp-top10', id: 'A01' }],
  },
  'web-ssrf': {
    context: 'Ao colar um link no chat de suporte, o servidor busca a página para mostrar a prévia. Alguém cola o endereço de um serviço interno.',
    concept: [
      'Em **SSRF**, o atacante faz o servidor buscar um destino escolhido por ele, aproveitando o acesso de rede do servidor: serviços internos, painéis administrativos e serviços de metadados de nuvem.',
      'A defesa resolve o nome, confere se o IP é público e permitido, conecta ao IP já verificado, repete a verificação a cada redirecionamento e limita tempo e tamanho. Quando possível, use uma lista de destinos permitidos e um serviço isolado, sem rota para a rede interna.',
    ],
    validation: 'Peça buscas para nomes que resolvem para IPs internos, para formatos alternativos de endereço e para um site que redireciona a um destino interno: todas devem ser recusadas. Uma busca legítima deve continuar funcionando com limites.',
    review: [
      { front: 'Por que verificar o IP resolvido, e não o texto da URL?', back: 'Porque nomes enganosos, formatos alternativos e redirecionamentos só se revelam no destino real.' },
      { front: 'Que alvo de SSRF é comum em nuvem?', back: 'O serviço de metadados, que pode entregar credenciais da máquina.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-918' }, { framework: 'owasp-top10', id: 'A01' }],
  },
  'web-cors-csp': {
    context: 'Para resolver um erro do navegador, alguém configurou a API para devolver a origem recebida com credenciais. No mesmo dia, outra pessoa afrouxou a CSP para permitir scripts inline.',
    concept: [
      '**CORS** controla quais origens podem ler respostas da API no navegador; deve usar uma lista exata de origens. **CSP** controla de onde a página pode carregar scripts, estilos e outros recursos; reduz o impacto de XSS.',
      'Cabeçalhos como `Strict-Transport-Security`, `X-Content-Type-Options` e `frame-ancestors` (na CSP) completam a configuração. Exceções amplas, adicionadas para "fazer funcionar", desfazem as proteções.',
    ],
    example: {
      title: 'Cabeçalhos de resposta (sintéticos)',
      language: 'http',
      code: ["Content-Security-Policy: default-src 'self'; script-src 'self'; frame-ancestors 'none'", 'Strict-Transport-Security: max-age=31536000; includeSubDomains', 'X-Content-Type-Options: nosniff'],
      caption: 'Cada diretiva fecha uma porta; uma exceção ampla pode reabrir todas.',
    },
    validation: 'Confira os cabeçalhos em uma resposta real. Envie uma requisição com origem de outro domínio e credenciais: a origem não deve ser aceita. Tente executar um script inline em uma página: a CSP deve bloquear.',
    review: [
      { front: 'Qual a diferença entre CORS e CSP?', back: 'CORS diz quem pode ler as respostas da API; CSP diz de onde a página pode carregar recursos.' },
      { front: 'Por que exceções amplas são perigosas?', back: 'Porque resolvem um erro pontual abrindo a proteção para todos os casos.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A02' }, { framework: 'cwe', id: 'CWE-942' }],
  },
  'web-regras-negocio': {
    context: 'Um cupom limitado a 500 usos foi usado mais de 3.000 vezes em minutos, com todos os testes passando.',
    concept: [
      'Falhas de regra de negócio não aparecem em varreduras: são usos válidos do sistema que produzem um resultado que o negócio não queria, como valores negativos, cupons repetidos, etapas puladas ou limites estourados.',
      'Muitas vêm de **condições de corrida**: verificar e depois gravar em passos separados. A defesa é tornar a operação atômica (verificar e gravar em uma só etapa no banco), usar chaves de idempotência e testar com requisições simultâneas.',
    ],
    validation: 'Dispare muitas requisições simultâneas para cada regra do tipo "no máximo N" ou "só uma vez": o limite nunca deve ser ultrapassado. Teste valores negativos, zero e etapas fora de ordem.',
    review: [
      { front: 'Por que testes de uma requisição por vez não pegam condições de corrida?', back: 'Porque a falha só aparece quando duas operações passam pela verificação antes de qualquer gravação.' },
      { front: 'Como proteger uma regra do tipo "no máximo N"?', back: 'Com uma operação atômica no banco que verifica e grava ao mesmo tempo.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-362' }, { framework: 'owasp-top10', id: 'A06' }],
  },
  'web-erros-logs': {
    context: 'Uma falha no banco mostrou, na tela do cliente, a consulta SQL inteira. Ao mesmo tempo, o registro da aplicação guardava o corpo completo das requisições, com senhas e tokens.',
    concept: [
      'O tratamento de erros deve **falhar fechado**: em caso de erro, negar o acesso, e nunca abrir. A pessoa vê uma mensagem genérica com um identificador; os detalhes ficam só no registro interno.',
      'O registro é útil para investigar quando guarda quem, o quê, quando e de onde, e é perigoso quando guarda segredos e dados pessoais. Mascarar tokens, senhas e documentos, restringir o acesso e definir retenção são parte do desenho.',
    ],
    validation: 'Provoque erros (entrada inválida, banco fora do ar): a resposta não deve mostrar detalhes internos, e o acesso deve continuar negado. Procure no registro por senhas, tokens e documentos de teste: não devem aparecer.',
    review: [
      { front: 'O que significa falhar fechado?', back: 'Diante de um erro, negar a operação em vez de liberá-la.' },
      { front: 'O que um registro de segurança deve e não deve ter?', back: 'Deve ter quem, o quê, quando e de onde; não deve ter senhas, tokens e dados pessoais em claro.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A10' }, { framework: 'owasp-top10', id: 'A09' }, { framework: 'cwe', id: 'CWE-532' }],
  },
}
