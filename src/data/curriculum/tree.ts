import type { Level } from '../types'
import type { Area, AreaId, CurriculumModule, Platform, Submodule } from './types'

/* Árvore Área -> Módulo -> Submódulo. Os ids são estáveis e vão para o progresso salvo e para os
   links: nunca renomeie um id publicado. A organização é pedagógica; ela não reproduz a estrutura
   de nenhuma edição de framework (o mapa de cobertura faz essa ligação, item a item).

   Os módulos clássicos (índices 0 a 8 do progresso antigo) entram por `legacy`, sem renumerar nada:
   o submódulo usa as aulas, tarefas, questões e o chefe do módulo que já existia. */

const B: Level = 'Básico'
const I: Level = 'Intermediário'
const A: Level = 'Avançado'

type Row = [id: string, title: string, level: Level, objective: string, platforms?: Platform[], legacy?: number]

function subs(module: string, area: AreaId, defaults: Platform[], rows: Row[]): Submodule[] {
  return rows.map(([id, title, level, objective, platforms, legacy], i) => ({
    id,
    module,
    area,
    title,
    level,
    objective,
    platforms: platforms ?? defaults,
    legacy: legacy ?? null,
    recommends: i > 0 ? [rows[i - 1][0]] : [],
  }))
}

/* ---------- Segurança Web ---------- */

const webFundamentos = subs('web-fundamentos', 'web', ['web'], [
  ['web-http', 'HTTP, requisições e respostas', B, 'Ler uma requisição e uma resposta HTTP e apontar o que o cliente controla e o que o servidor decide.'],
  ['web-origem', 'Navegador, origem e política de mesma origem', B, 'Explicar o que é uma origem e o que a política de mesma origem permite e bloqueia.'],
  ['web-cookies-sessao', 'Cookies, sessões e armazenamento', B, 'Distinguir cookies, sessão no servidor e armazenamento do navegador e dizer onde cada dado deve ficar.'],
  ['web-fronteiras', 'Fronteiras de confiança entre frontend e backend', B, 'Identificar o que vem do navegador (e por isso não é confiável) e o que o backend precisa revalidar.'],
])
const webAutenticacao = subs('web-autenticacao', 'web', ['web'], [
  ['web-login-recuperacao', 'Login e recuperação de senha', I, 'Projetar login e recuperação de conta sem revelar quem tem cadastro nem permitir adivinhar tokens.'],
  ['web-mfa', 'MFA', I, 'Comparar fatores de autenticação e reconhecer onde a MFA falha por fadiga, fluxo alternativo ou recuperação.'],
  ['web-sessao-cookies', 'Cookies e gerenciamento de sessão', I, 'Configurar cookie de sessão (Secure, HttpOnly, SameSite) e definir renovação, expiração e encerramento.'],
  ['web-oauth-oidc', 'OAuth 2.0, OIDC e SSO', A, 'Explicar o fluxo de código com PKCE e validar state, redirect_uri, emissor e audiência.'],
  ['web-auth-falhas', 'Falhas de implementação e testes', A, 'Testar login, sessão e recuperação procurando os erros de implementação mais comuns.'],
])
const webControleAcesso = subs('web-controle-acesso', 'web', ['web'], [
  ['web-authn-authz', 'Autenticação versus autorização', B, 'Mostrar por que estar autenticado não significa ter permissão para o recurso pedido.'],
  ['web-idor', 'IDOR e acesso horizontal', B, 'Encontrar e corrigir acesso a objetos de outra pessoa por identificador previsível ou não.'],
  ['web-escalacao', 'Escalação vertical de privilégios', I, 'Reconhecer funções administrativas expostas e exigir a permissão no servidor.'],
  ['web-rbac-abac-tenant', 'RBAC, ABAC e isolamento entre tenants', I, 'Escolher entre papéis e atributos e garantir o isolamento de dados entre clientes.'],
  ['web-permissao-servidor', 'Validação de permissões no servidor', I, 'Centralizar a decisão de acesso no servidor, por padrão negada, e testá-la.'],
])
const webEntradasSaidas = subs('web-entradas-saidas', 'web', ['web'], [
  ['web-sqli', 'SQL Injection', I, 'Eliminar a concatenação de entrada em consultas com parâmetros e privilégios mínimos no banco.'],
  ['web-cmd-template', 'Injeção de comandos e templates', I, 'Evitar que entrada vire comando de sistema ou expressão de template.'],
  ['web-xss', 'XSS e codificação de saída', I, 'Codificar a saída para o contexto certo e reduzir o impacto com CSP.'],
  ['web-upload', 'Upload e processamento de arquivos', I, 'Receber arquivos sem confiar em nome, tipo declarado nem conteúdo, e guardá-los fora do alcance de execução.'],
  ['web-path-traversal', 'Path traversal e inclusão de arquivos', I, 'Impedir que um caminho informado saia do diretório permitido.'],
])
const webDesignConfig = subs('web-design-config', 'web', ['web'], [
  ['web-csrf', 'CSRF', I, 'Explicar por que o navegador envia cookies em pedidos forjados e aplicar SameSite e tokens.'],
  ['web-ssrf', 'SSRF', A, 'Restringir os destinos que o servidor aceita buscar a pedido do usuário.'],
  ['web-cors-csp', 'CORS, CSP e cabeçalhos', I, 'Configurar CORS, CSP e cabeçalhos de segurança sem abrir exceções amplas.'],
  ['web-regras-negocio', 'Regras de negócio e condições de corrida', A, 'Encontrar abusos de regra de negócio e garantir atomicidade nas operações críticas.'],
  ['web-erros-logs', 'Erros, logs e exposição de informações', I, 'Tratar falhas sem expor detalhes internos, sem abrir acesso e com registro útil para investigar.'],
])
const webVerificacao = subs('web-verificacao', 'web', ['web'], [
  ['web-top10', 'OWASP Top 10 (edição 2025)', I, 'Usar o Top 10 como lista de riscos para priorizar, sem tratá-lo como checklist completo.'],
  ['web-asvs', 'Requisitos selecionados do ASVS', A, 'Escolher requisitos verificáveis do ASVS e transformá-los em critérios de aceite.'],
  ['web-wstg', 'Testes guiados pelo WSTG', A, 'Planejar testes de uma funcionalidade com os cenários do guia de testes.'],
  ['web-revisao-projeto', 'Revisão de código e projeto final', A, 'Revisar uma funcionalidade Web de ponta a ponta e justificar cada apontamento.'],
])

/* ---------- Segurança de APIs ---------- */

const apiFundamentos = subs('api-fundamentos', 'api', ['api'], [
  ['api-rest-graphql', 'REST, GraphQL e contratos', B, 'Descrever um contrato de API e o que ele promete e não promete sobre segurança.'],
  ['api-metodos-codigos', 'Métodos HTTP e códigos de resposta', B, 'Usar métodos e códigos de resposta de forma coerente, sem vazar informação pelo erro.'],
  ['api-inventario', 'Inventário, documentação e versionamento', I, 'Manter inventário de endpoints e versões e retirar o que não deve mais existir.'],
])
const apiIdentidade = subs('api-identidade-autz', 'api', ['api'], [
  ['api-jwt', 'Tokens e validação de JWT', I, 'Validar assinatura, algoritmo, emissor, audiência e validade de um token.'],
  ['api-bola', 'Autorização por objeto: BOLA', B, 'Verificar, em cada requisição, se quem pede tem direito àquele objeto.'],
  ['api-bopla', 'Autorização por propriedade: BOPLA', I, 'Controlar quais campos podem ser lidos e alterados por cada perfil.'],
  ['api-bfla', 'Autorização por função: BFLA', I, 'Exigir a permissão de cada função e método, inclusive os administrativos.'],
  ['api-escopos', 'Escopos e identidades de serviço', A, 'Dar a cada cliente e serviço apenas os escopos de que precisa.'],
])
const apiAbuso = subs('api-abuso-consumo', 'api', ['api'], [
  ['api-limites', 'Limites de uso e paginação', I, 'Definir limites por identidade, tamanho de página e custo da operação.'],
  ['api-fluxos-sensiveis', 'Automação de fluxos sensíveis', A, 'Reconhecer fluxos de negócio que não toleram automação e protegê-los.'],
  ['api-consumo-recursos', 'Consumo excessivo de recursos', I, 'Limitar tempo, memória, profundidade e tamanho de entrada.'],
  ['api-idempotencia', 'Idempotência e concorrência', A, 'Tornar operações repetíveis sem efeito duplicado e proteger contra corridas.'],
])
const apiIntegracoes = subs('api-integracoes', 'api', ['api'], [
  ['api-resp-terceiros', 'Validação de respostas de terceiros', I, 'Tratar a resposta de uma API externa como entrada não confiável.'],
  ['api-ssrf', 'SSRF em integrações', A, 'Proteger webhooks e buscas de URL contra destinos internos.'],
  ['api-config-insegura', 'Configuração insegura', I, 'Revisar CORS, erros detalhados, métodos e cabeçalhos de uma API.'],
  ['api-endpoints-antigos', 'Endpoints antigos e inventário incompleto', I, 'Encontrar versões esquecidas e aplicar a elas as mesmas regras.'],
])
const apiVerificacao = subs('api-verificacao', 'api', ['api'], [
  ['api-top10', 'OWASP API Security Top 10 (2023)', I, 'Usar a lista de riscos de APIs para priorizar achados.'],
  ['api-openapi', 'Análise de contratos OpenAPI', A, 'Ler um contrato OpenAPI procurando segurança ausente ou inconsistente.'],
  ['api-testes-autz', 'Testes de autorização', A, 'Montar uma matriz de testes de autorização por perfil, objeto e função.'],
  ['api-projeto-final', 'Projeto final com API multi-tenant', A, 'Revisar uma API multi-tenant e propor controles verificáveis.'],
])

/* ---------- Segurança de IA ---------- */

const iaFundamentos = subs('ia-fundamentos', 'ia', ['ia'], [
  ['ia-modelos-prompts', 'Modelos, prompts e contexto', B, 'Descrever o que entra no contexto de um modelo e quem controla cada parte.'],
  ['ia-embeddings', 'Embeddings e bancos vetoriais', B, 'Explicar como a busca vetorial recupera trechos e o que ela não decide.'],
  ['ia-rag', 'RAG', B, 'Desenhar o fluxo de um RAG e marcar onde entram dados não confiáveis.'],
  ['ia-agentes', 'Agentes e ferramentas', I, 'Descrever como um agente escolhe e executa ferramentas e onde o poder é concedido.'],
  ['ia-fronteiras', 'Fronteiras de confiança em aplicações com IA', I, 'Traçar as fronteiras de confiança de uma aplicação com modelo, dados e ferramentas.'],
])
const iaPrompts = subs('ia-prompts-saidas', 'ia', ['ia'], [
  ['ia-injecao-direta', 'Prompt injection direta', B, 'Reconhecer instruções do usuário que tentam sobrepor as do sistema e limitar o dano.', undefined, 1],
  ['ia-injecao-indireta', 'Prompt injection indireta', I, 'Mostrar como conteúdo externo (página, documento, e-mail) vira instrução e como separá-lo.'],
  ['ia-info-sensivel', 'Exposição de informações sensíveis', I, 'Evitar que o modelo tenha acesso a dados que o usuário não poderia ver.'],
  ['ia-saida-insegura', 'Tratamento inseguro da saída', I, 'Tratar a saída do modelo como entrada não confiável em qualquer destino.'],
  ['ia-limites-prompt', 'Limitações dos controles baseados apenas em prompts', I, 'Explicar por que pedir ao modelo para se comportar não é um controle de segurança.'],
])
const iaRag = subs('ia-rag-seguranca', 'ia', ['ia'], [
  ['ia-ingestao', 'Ingestão e origem dos documentos', I, 'Controlar o que entra na base, de onde veio e com que permissões.'],
  ['ia-autz-recuperacao', 'Autorização na recuperação', I, 'Aplicar a permissão do usuário na busca, antes de qualquer trecho chegar ao modelo.'],
  ['ia-isolamento', 'Isolamento entre usuários e tenants', A, 'Isolar dados, caches e históricos entre usuários e clientes.'],
  ['ia-contaminacao', 'Contaminação da base e conteúdo não confiável', A, 'Reduzir o efeito de documentos contaminados ou com instruções escondidas.'],
  ['ia-cache-contexto', 'Cache, contexto e rastreabilidade', A, 'Definir chaves de cache seguras e registrar de onde veio cada resposta.'],
])
const iaAgentes = subs('ia-agentes-seguranca', 'ia', ['ia'], [
  ['ia-permissoes-ferramentas', 'Permissões de ferramentas', I, 'Dar a cada ferramenta o mínimo de permissão e a identidade certa.'],
  ['ia-validacao-args', 'Validação de argumentos', I, 'Validar fora do modelo os argumentos que ele escolhe para uma ferramenta.'],
  ['ia-aprovacao-humana', 'Aprovação humana', A, 'Exigir aprovação para ações críticas, com contexto suficiente para decidir.'],
  ['ia-autonomia', 'Autonomia excessiva', A, 'Reduzir autonomia, escopo e alcance de um agente até o necessário.'],
  ['ia-limites-auditoria', 'Limites, auditoria e contenção', A, 'Impor limites de uso, registrar as ações e conter um agente que se comporta mal.'],
])
const iaModelos = subs('ia-modelos-dados', 'ia', ['ia'], [
  ['ia-proveniencia', 'Proveniência de modelos e datasets', I, 'Registrar a origem de modelos e dados e verificar a integridade antes de usar.'],
  ['ia-artefatos', 'Artefatos e carregamento seguro', A, 'Escolher formatos e carregamento que não executam código do artefato.'],
  ['ia-envenenamento', 'Envenenamento de dados', A, 'Explicar como dados manipulados alteram o comportamento e como detectar.'],
  ['ia-dependencias-ia', 'Dependências e fornecedores de IA', I, 'Avaliar bibliotecas e fornecedores de modelos como parte da cadeia de suprimentos.'],
  ['ia-avaliacao', 'Avaliação e monitoramento', A, 'Definir avaliações e sinais de monitoramento que revelem regressões de segurança.'],
])
const iaVerificacao = subs('ia-verificacao', 'ia', ['ia'], [
  ['ia-owasp-llm', 'OWASP Top 10 para aplicações com LLMs', I, 'Associar os dez riscos da edição 2025 a componentes e controles.', undefined, 0],
  ['ia-mitre-atlas', 'MITRE ATLAS', A, 'Descrever táticas e técnicas contra sistemas de IA e usá-las para mapear um cenário.', undefined, 2],
  ['ia-red-teaming', 'Red teaming autorizado', A, 'Planejar um exercício de red team de IA com escopo, regras e relatório.', undefined, 3],
  ['ia-regressao-projeto', 'Testes de regressão e projeto final', A, 'Transformar achados em testes que impedem o retorno da falha.'],
])

/* ---------- Segurança Mobile ---------- */

const mobFundamentos = subs('mob-fundamentos', 'mobile', ['android', 'ios'], [
  ['mob-arquitetura', 'Arquitetura Android e iOS', B, 'Comparar os blocos de um app Android e de um app iOS e onde ficam os dados.'],
  ['mob-sandbox', 'Sandbox e ciclo de vida', B, 'Explicar o isolamento entre apps e o que acontece com os dados no ciclo de vida.'],
  ['mob-app-backend', 'Aplicativo versus backend', B, 'Decidir o que o app pode garantir e o que só o servidor garante.'],
  ['mob-ameacas', 'Modelo de ameaças Mobile', I, 'Montar um modelo de ameaças que inclua dispositivo perdido, app adulterado e rede hostil.'],
])
const mobAndroid = subs('mob-android', 'mobile', ['android'], [
  ['mob-manifest', 'AndroidManifest e permissões', B, 'Ler um manifesto e apontar permissões, backup e depuração indevidos.'],
  ['mob-componentes', 'Activities, Services e componentes exportados', I, 'Identificar componentes exportados que não deviam ser acessíveis a outros apps.'],
  ['mob-intents-links', 'Intents, deep links e App Links', I, 'Tratar dados de intents e links como não confiáveis e verificar a propriedade do domínio.'],
  ['mob-armazenamento-android', 'Armazenamento, Keystore e backups', I, 'Guardar segredos no lugar certo e impedir que vazem por backup.'],
  ['mob-webview-android', 'WebViews e configurações de rede', A, 'Configurar WebViews e a política de rede para não abrir o app a conteúdo hostil.'],
])
const mobIos = subs('mob-ios', 'mobile', ['ios'], [
  ['mob-ios-permissoes', 'Permissões e entitlements', B, 'Explicar permissões, entitlements e o princípio de pedir só o necessário.'],
  ['mob-keychain', 'Keychain e armazenamento', I, 'Guardar segredos no Keychain com a acessibilidade correta.'],
  ['mob-universal-links', 'Universal Links e esquemas de URL', I, 'Preferir Universal Links e validar toda entrada que chega por URL.'],
  ['mob-ios-webview-ats', 'WebViews e App Transport Security', I, 'Manter o ATS ativo e restringir o que a WebView carrega.'],
  ['mob-ios-backups', 'Backups e proteção de dados', I, 'Escolher classes de proteção de dados e excluir o que não deve ir para backup.'],
])
const mobIdentidade = subs('mob-identidade-comunicacao', 'mobile', ['android', 'ios'], [
  ['mob-login-biometria', 'Login, sessão e biometria', I, 'Usar biometria como destravamento local de um segredo, não como prova de identidade ao servidor.'],
  ['mob-oauth-app', 'OAuth/OIDC em aplicativos', A, 'Aplicar o fluxo recomendado para apps nativos, com PKCE e navegador do sistema.'],
  ['mob-tls', 'TLS e validação de certificados', I, 'Validar certificados corretamente e saber o que o pinning acrescenta e não acrescenta.'],
  ['mob-logs-notificacoes', 'Logs, notificações e captura de informações', I, 'Evitar dados sensíveis em logs, notificações, capturas de tela e área de transferência.'],
  ['mob-privacidade-sdks', 'Minimização de dados e SDKs de terceiros', I, 'Coletar o mínimo e saber o que cada SDK envia.'],
])
const mobIntegridade = subs('mob-integridade-distribuicao', 'mobile', ['android', 'ios'], [
  ['mob-assinatura', 'Assinatura e distribuição', I, 'Proteger chaves de assinatura e o caminho de distribuição do aplicativo.'],
  ['mob-dependencias', 'Dependências do aplicativo', I, 'Inventariar e atualizar bibliotecas e SDKs embutidos no app.'],
  ['mob-engenharia-reversa', 'Engenharia reversa para defensores', A, 'Analisar um app e um artefato como adversário para decidir defesas, sem violar proteções de terceiros.', undefined, 8],
  ['mob-adulteracao', 'Adulteração e controles de resiliência', A, 'Escolher controles de resiliência conforme o modelo de ameaça do app.'],
  ['mob-limites-ofuscacao', 'Limitações de ofuscação e detecção de root/jailbreak', A, 'Explicar por que ofuscação e detecção de root não substituem autorização no servidor.'],
])
const mobVerificacao = subs('mob-verificacao', 'mobile', ['android', 'ios'], [
  ['mob-top10', 'OWASP Mobile Top 10 (2024)', I, 'Usar a lista de riscos mobile para priorizar achados.'],
  ['mob-masvs', 'OWASP MASVS', A, 'Ler os controles do MASVS por grupo e escolher os que se aplicam ao app.'],
  ['mob-mastg', 'OWASP MASTG', A, 'Relacionar um controle a um procedimento de teste do guia.'],
  ['mob-revisao-android', 'Revisão Android', A, 'Revisar um app Android de ponta a ponta com manifesto, código e rede.'],
  ['mob-revisao-ios', 'Revisão iOS', A, 'Revisar um app iOS de ponta a ponta com Info.plist, Keychain e rede.'],
  ['mob-projeto-final', 'Projeto final integrado ao backend', A, 'Revisar app e backend juntos e dividir os controles entre eles.'],
])

/* ---------- Engenharia reversa ---------- */

const revFundamentos = subs('rev-fundamentos', 'rev', ['geral'], [
  ['rev-o-que-e', 'O que é engenharia reversa na defesa', B, 'Explicar o que a engenharia reversa responde a quem defende e o que ela não resolve.'],
  ['rev-legalidade', 'Autorização, licença e limites', B, 'Decidir se você pode analisar um artefato e registrar a autorização antes de começar.'],
  ['rev-laboratorio', 'Laboratório isolado e higiene de análise', B, 'Montar um ambiente descartável e manter a amostra separada do resto do mundo.'],
  ['rev-artefatos', 'Tipos de artefato e o que cada um revela', B, 'Reconhecer o tipo de artefato recebido e prever o que ele costuma entregar.'],
  ['rev-triagem', 'Triagem em camadas: o roteiro de quatro passos', I, 'Aplicar o roteiro identificar, ler, mapear e observar sem pular etapas.'],
])
const revEstatica = subs('rev-estatica', 'rev', ['geral'], [
  ['rev-identificacao', 'Identificação: tipo, hash e metadados', B, 'Identificar o formato real de um arquivo e registrar o hash antes de qualquer outra coisa.'],
  ['rev-strings', 'Textos embutidos e o que eles entregam', B, 'Extrair textos de um artefato e separar achado de ruído.'],
  ['rev-dependencias-binario', 'Bibliotecas, símbolos e importações', I, 'Listar o que o artefato carrega e chamar, e tirar disso hipóteses de comportamento.'],
  ['rev-bytecode', 'Bytecode e código gerenciado', I, 'Ler código gerenciado (Java, .NET, Python) que volta quase ao original e saber o limite disso.'],
  ['rev-nativo', 'Binários nativos: seções, desmontagem e proteções', A, 'Reconhecer seções, empacotamento e proteções de um binário nativo antes de desmontar.'],
])
const revSegredos = subs('rev-segredos', 'rev', ['geral'], [
  ['rev-segredos-onde', 'Onde os segredos se escondem', I, 'Procurar segredos nos lugares em que eles de fato aparecem, do pacote ao histórico.'],
  ['rev-segredos-padroes', 'Como reconhecer um segredo de verdade', I, 'Separar credencial viva de exemplo, teste e chave pública, sem testar o que não pode.'],
  ['rev-segredos-bundle', 'Bundles web, mapas de código e variáveis de build', I, 'Entender por que uma variável de build vira texto no navegador e o que fazer no lugar.'],
  ['rev-segredos-historico', 'Histórico do repositório e artefatos de build', I, 'Achar segredos que saíram do código atual mas continuam no histórico e nos artefatos.'],
  ['rev-segredos-resposta', 'O que fazer quando um segredo vaza', I, 'Conduzir a resposta na ordem certa: girar, revogar, investigar uso e corrigir a origem.'],
])
const revAplicativos = subs('rev-aplicativos', 'rev', ['android', 'ios', 'web'], [
  ['rev-app-pacote', 'Anatomia de um pacote de aplicativo', I, 'Abrir um pacote de aplicativo e saber o que cada parte dele conta.'],
  ['rev-app-rede', 'Descobrir a API a partir do cliente', I, 'Reconstruir rotas, parâmetros e autenticação de uma API lendo o cliente.'],
  ['rev-app-cliente-decide', 'Decisões tomadas no cliente', I, 'Identificar regras de preço, permissão e limite que moram no cliente e precisam ir ao servidor.'],
  ['rev-app-armazenamento', 'O que o app guarda no aparelho', I, 'Encontrar dados sensíveis guardados pelo aplicativo e decidir onde eles deveriam estar.'],
  ['rev-app-resiliencia', 'Ofuscação, detecção e o que elas valem', A, 'Dizer o que ofuscação e detecção de root atrasam e o que elas nunca substituem.'],
])
const revModelos = subs('rev-modelos', 'rev', ['ia'], [
  ['rev-modelo-formatos', 'Formatos de modelo e o risco de carregar', I, 'Escolher formatos que guardam só pesos e explicar por que pickle executa código.'],
  ['rev-modelo-proveniencia', 'Proveniência, hash e cartão do modelo', I, 'Verificar origem, versão e integridade de um modelo antes de usá-lo.'],
  ['rev-modelo-prompts', 'Prompts, ferramentas e chaves embutidos', I, 'Encontrar prompt de sistema, lista de ferramentas e credenciais embutidos em um cliente de IA.'],
  ['rev-modelo-extracao', 'Extração de modelo pela API', A, 'Reconhecer consulta sistemática que copia o comportamento de um modelo e dificultá-la.'],
  ['rev-modelo-defesas', 'O que reduzir no que você publica', A, 'Reduzir o que o seu próprio artefato revela, sem contar com a ofuscação.'],
  ['rev-skills-agente', 'Habilidades de agente como artefato', A, 'Analisar uma habilidade de agente antes de instalá-la: metadados, permissões, isolamento e atualização.'],
])
const revDinamica = subs('rev-dinamica', 'rev', ['geral'], [
  ['rev-execucao-isolada', 'Execução observada em ambiente descartável', I, 'Executar uma amostra com rede controlada e registrar o que ela faz.'],
  ['rev-rede-observada', 'Tráfego, proxy e TLS no laboratório', I, 'Observar o tráfego de um cliente que você controla, sem quebrar proteção de terceiros.'],
  ['rev-instrumentacao', 'Instrumentação e pontos de observação', A, 'Escolher onde instrumentar para responder a uma pergunta específica.'],
  ['rev-relatorio', 'Relatório reproduzível e cadeia de evidências', I, 'Escrever uma análise que outra pessoa consegue repetir, separando fato de hipótese.'],
  ['rev-divulgacao', 'Divulgação responsável e conversa com o fornecedor', I, 'Comunicar um achado ao responsável com prazo, prova e caminho de correção.'],
])

/* ---------- Supply Chain e DevSecOps ---------- */

const scDependencias = subs('sc-dependencias', 'supply', ['cicd'], [
  ['sc-diretas-transitivas', 'Dependências diretas e transitivas', B, 'Mapear o que o projeto realmente instala, inclusive o que ninguém pediu.'],
  ['sc-typosquatting', 'Typosquatting e dependency confusion', I, 'Reconhecer nomes enganosos e conflitos entre registros público e privado.'],
  ['sc-install-scripts', 'Scripts de instalação', I, 'Entender que instalar pode executar código e reduzir esse risco.'],
  ['sc-lockfiles', 'Lockfiles e atualização de pacotes', I, 'Usar lockfile com origem e integridade e revisar atualizações com critério.'],
])
const scRepos = subs('sc-repos-pipelines', 'supply', ['cicd'], [
  ['sc-revisao-branches', 'Revisão de código e proteção de branches', B, 'Exigir revisão e verificações antes de integrar mudanças.'],
  ['sc-identidades-ci', 'Identidades e permissões de CI/CD', I, 'Reduzir as permissões de pipelines ao mínimo por job.'],
  ['sc-segredos', 'Segredos e credenciais temporárias', I, 'Substituir segredos estáticos por credenciais temporárias e escopadas.'],
  ['sc-runners', 'Runners e isolamento de builds', A, 'Isolar builds de origens diferentes e evitar reutilizar ambientes sensíveis.'],
])
const scArtefatos = subs('sc-artefatos', 'supply', ['cicd'], [
  ['sc-sbom', 'SBOM', I, 'Gerar e usar um SBOM e saber o que ele inventaria e o que não garante.'],
  ['sc-assinatura', 'Assinatura e integridade', I, 'Explicar o que uma assinatura comprova e o que não comprova.'],
  ['sc-proveniencia-slsa', 'Proveniência e SLSA', A, 'Ler uma atestação de proveniência e os níveis da trilha de build do SLSA.'],
  ['sc-registries', 'Registries e promoção de artefatos', I, 'Promover artefatos entre ambientes sem reconstruir nem trocar a origem.'],
  ['sc-rollback', 'Rollback e recuperação', A, 'Planejar rollback e recuperação considerando credenciais já expostas.'],
])
const scVerificacoes = subs('sc-verificacoes', 'supply', ['cicd'], [
  ['sc-sast', 'SAST', I, 'Usar análise estática, sabendo o que ela encontra e o que deixa passar.'],
  ['sc-sca', 'SCA', I, 'Usar análise de composição de software e priorizar por exploração e exposição.'],
  ['sc-dast', 'DAST', I, 'Usar testes dinâmicos em ambiente controlado e interpretar o resultado.'],
  ['sc-secret-scanning', 'Secret scanning', B, 'Detectar segredos no código e no histórico e responder ao achado.'],
  ['sc-iac-containers', 'IaC e imagens de containers', I, 'Verificar infraestrutura como código e imagens de container antes de implantar.'],
  ['sc-limitacoes', 'Limitações, falsos positivos e priorização', A, 'Priorizar achados sem confiar cegamente em nenhuma ferramenta.'],
])
const scIncidentes = subs('sc-incidentes', 'supply', ['cicd'], [
  ['sc-xz', 'XZ Utils', A, 'Resumir o caso XZ Utils e extrair lições sobre confiança em mantenedores.'],
  ['sc-3cx', '3CX', A, 'Resumir o caso 3CX e extrair lições sobre compromisso encadeado.'],
  ['sc-solarwinds', 'SolarWinds', A, 'Resumir o caso SolarWinds e extrair lições sobre o processo de build.'],
  ['sc-npm-pypi', 'Caso verificado de npm ou PyPI', A, 'Resumir um caso verificado de pacote malicioso e as lições para dependências.'],
  ['sc-investigacao-resposta', 'Investigação e resposta a supply chain', A, 'Conduzir contenção, investigação e recuperação em um incidente de cadeia de suprimentos.'],
])

/* ---------- Arquitetura de Segurança ---------- */

const arqModelagem = subs('arq-modelagem', 'arq', ['geral'], [
  ['arq-diagramas', 'Diagramas de contexto e componentes', B, 'Desenhar contexto e componentes de um sistema de forma que sirva à análise de segurança.'],
  ['arq-fluxos-dados', 'Fluxos de dados', B, 'Traçar o caminho dos dados e classificar cada fluxo.'],
  ['arq-ativos-fronteiras', 'Ativos e fronteiras de confiança', I, 'Listar ativos críticos e marcar onde a confiança muda.'],
  ['arq-stride-arvores', 'STRIDE e árvores de ataque', I, 'Aplicar STRIDE a componentes e fluxos e organizar ameaças em uma árvore de ataque.'],
])
const arqIdentidade = subs('arq-identidade-dados', 'arq', ['geral'], [
  ['arq-identidade', 'Identidade de usuários e serviços', I, 'Distinguir a identidade de quem pede da identidade do serviço que executa.'],
  ['arq-privilegio-minimo', 'Privilégio mínimo', I, 'Reduzir permissões a partir do que a função realmente usa.'],
  ['arq-segredos', 'Gestão de segredos', I, 'Armazenar, distribuir, girar e revogar segredos com ciclo de vida definido.'],
  ['arq-cripto-kms', 'Criptografia, KMS e HSM', A, 'Escolher onde cifrar, quem gerencia as chaves e o que KMS e HSM acrescentam.'],
  ['arq-retencao-classificacao', 'Retenção e classificação de dados', I, 'Classificar dados e definir quanto tempo e onde podem ficar.'],
])
const arqIntegradas = subs('arq-integradas', 'arq', ['geral'], [
  ['arq-web-apis', 'Web e APIs', I, 'Posicionar controles entre navegador, gateway e serviços.'],
  ['arq-mobile-backend', 'Mobile e backend', I, 'Dividir controles entre aplicativo e servidor.'],
  ['arq-microsservicos', 'Microsserviços e integrações', A, 'Proteger a comunicação entre serviços e com terceiros.'],
  ['arq-rag-agentes', 'RAG e agentes', A, 'Arquitetar assistentes com RAG e agentes com controles fora do modelo.'],
  ['arq-multitenant', 'Sistemas multi-tenant', A, 'Isolar clientes em dados, cache, logs e identidade.'],
])
const arqDecisoes = subs('arq-decisoes', 'arq', ['geral'], [
  ['arq-requisitos', 'Requisitos e restrições', B, 'Separar requisitos funcionais, não funcionais e restrições antes de decidir.'],
  ['arq-alternativas', 'Comparação de alternativas', I, 'Comparar alternativas por segurança, privacidade, custo, disponibilidade e complexidade.'],
  ['arq-adr', 'ADR', I, 'Registrar uma decisão arquitetural com contexto, alternativas, consequências e validação.'],
  ['arq-custo-disp', 'Custo, disponibilidade e complexidade', I, 'Equilibrar controles com o custo e o impacto operacional.'],
  ['arq-risco-residual', 'Risco residual e validação', A, 'Declarar o risco que sobra e como verificar se o controle funciona.'],
])
const arqOficina = subs('arq-oficina', 'arq', ['geral'], [
  ['arq-revisar-projeto', 'Revisar um projeto', A, 'Conduzir uma revisão de arquitetura do começo ao fim.'],
  ['arq-riscos-diagrama', 'Identificar riscos no diagrama', A, 'Encontrar riscos nos componentes e conexões de um diagrama.'],
  ['arq-escolher-controles', 'Escolher controles', A, 'Escolher controles proporcionais ao risco e às restrições.'],
  ['arq-defender', 'Defender a decisão', A, 'Defender uma decisão arquitetural com evidências e alternativas descartadas.'],
  ['arq-pos-incidente', 'Reavaliar a arquitetura após um incidente', A, 'Rever a arquitetura com o que o incidente revelou.'],
])

/* ---------- Governança e Desenvolvimento Seguro ---------- */

const govDesenvolvimento = subs('gov-desenvolvimento', 'gov', ['geral'], [
  ['gov-samm', 'OWASP SAMM', I, 'Usar o SAMM para avaliar a maturidade de um programa de segurança e escolher o próximo passo.'],
  ['gov-ssdf', 'NIST SSDF', I, 'Mapear práticas de desenvolvimento seguro aos grupos do SSDF.'],
  ['gov-requisitos', 'Requisitos de segurança', B, 'Escrever requisitos de segurança testáveis.'],
  ['gov-vulnerabilidades', 'Gestão e priorização de vulnerabilidades', I, 'Priorizar correções por risco, exposição e prazo.'],
])
const govIa = subs('gov-ia', 'gov', ['ia'], [
  ['gov-nist-rmf', 'NIST AI RMF', I, 'Aplicar as funções do AI RMF a um sistema de IA.', undefined, 4],
  ['gov-iso-42001', 'ISO/IEC 42001', I, 'Entender o sistema de gestão de IA e seus controles.', undefined, 5],
  ['gov-papeis-fornecedores', 'Papéis, responsabilidades e fornecedores', I, 'Definir quem responde por quê, inclusive nos contratos com fornecedores.'],
  ['gov-evidencias', 'Evidências e acompanhamento de riscos', A, 'Manter evidências e acompanhar riscos ao longo do tempo.'],
])
const govPrivacidade = subs('gov-privacidade', 'gov', ['geral'], [
  ['gov-lgpd', 'LGPD aplicada aos cenários', I, 'Aplicar a LGPD a fluxos reais de dados pessoais, inclusive com IA.', undefined, 6],
  ['gov-ciclo-dados', 'Ciclo de vida dos dados', I, 'Acompanhar um dado da coleta ao descarte e pontuar os riscos.'],
  ['gov-ai-act', 'AI Act, conforme aplicabilidade', A, 'Avaliar se e como o AI Act se aplica a um sistema.', undefined, 7],
  ['gov-obrigacao-vs-pratica', 'Obrigação legal, orientação e boa prática', I, 'Distinguir o que a lei exige do que orientações e boas práticas recomendam.'],
])

/* ---------- Árvore ---------- */

const mod = (id: string, area: AreaId, title: string, summary: string, rows: Submodule[], recommends: string[] = []): CurriculumModule => ({
  id,
  area,
  title,
  summary,
  recommends,
  subs: rows.map((r) => r.id),
  // O desafio integrador é definido em `index.ts`, depois que os desafios e as missões existem.
  integrator: null,
})

export const curriculumModules: CurriculumModule[] = [
  mod('web-fundamentos', 'web', 'Fundamentos Web', 'HTTP, origem, cookies e as fronteiras entre navegador e servidor.', webFundamentos),
  mod('web-autenticacao', 'web', 'Autenticação e sessões', 'Login, recuperação de conta, MFA, sessões e identidade federada.', webAutenticacao, ['web-fundamentos']),
  mod('web-controle-acesso', 'web', 'Controle de acesso', 'Quem pode ver e fazer o quê, e como garantir isso no servidor.', webControleAcesso, ['web-autenticacao']),
  mod('web-entradas-saidas', 'web', 'Entradas, saídas e injeções', 'Como entrada não confiável vira consulta, comando ou script.', webEntradasSaidas, ['web-fundamentos']),
  mod('web-design-config', 'web', 'Design e configuração', 'CSRF, SSRF, cabeçalhos, regras de negócio e tratamento de erros.', webDesignConfig, ['web-controle-acesso']),
  mod('web-verificacao', 'web', 'Verificação Web', 'Top 10, ASVS e WSTG para priorizar, exigir e testar.', webVerificacao, ['web-design-config']),

  mod('api-fundamentos', 'api', 'Fundamentos de APIs', 'Contratos, métodos, códigos de resposta e inventário.', apiFundamentos),
  mod('api-identidade-autz', 'api', 'Identidade e autorização', 'Tokens e autorização por objeto, propriedade e função.', apiIdentidade, ['api-fundamentos']),
  mod('api-abuso-consumo', 'api', 'Abuso e consumo de recursos', 'Limites, automação de fluxos sensíveis e concorrência.', apiAbuso, ['api-identidade-autz']),
  mod('api-integracoes', 'api', 'Integrações e exposição', 'Terceiros, SSRF, configuração e endpoints esquecidos.', apiIntegracoes, ['api-fundamentos']),
  mod('api-verificacao', 'api', 'Verificação de APIs', 'API Security Top 10, contratos OpenAPI e testes de autorização.', apiVerificacao, ['api-identidade-autz']),

  mod('ia-fundamentos', 'ia', 'Fundamentos de aplicações com IA', 'Modelos, contexto, RAG, agentes e suas fronteiras de confiança.', iaFundamentos),
  mod('ia-prompts-saidas', 'ia', 'Prompts e saídas', 'Injeção de prompt, vazamento e tratamento da saída do modelo.', iaPrompts, ['ia-fundamentos']),
  mod('ia-rag-seguranca', 'ia', 'Segurança de RAG', 'Ingestão, autorização na recuperação, isolamento e cache.', iaRag, ['ia-prompts-saidas']),
  mod('ia-agentes-seguranca', 'ia', 'Segurança de agentes', 'Permissões, argumentos, aprovação humana, limites e auditoria.', iaAgentes, ['ia-prompts-saidas']),
  mod('ia-modelos-dados', 'ia', 'Modelos, dados e dependências', 'Proveniência, artefatos, envenenamento e fornecedores.', iaModelos, ['ia-fundamentos']),
  mod('ia-verificacao', 'ia', 'Verificação de IA', 'OWASP LLM Top 10, MITRE ATLAS, red teaming e regressão.', iaVerificacao, ['ia-prompts-saidas']),

  mod('mob-fundamentos', 'mobile', 'Fundamentos Mobile', 'Android, iOS, sandbox e a divisão entre aplicativo e backend.', mobFundamentos),
  mod('mob-android', 'mobile', 'Android', 'Manifesto, componentes, links, armazenamento e WebViews.', mobAndroid, ['mob-fundamentos']),
  mod('mob-ios', 'mobile', 'iOS', 'Permissões, Keychain, links, ATS e proteção de dados.', mobIos, ['mob-fundamentos']),
  mod('mob-identidade-comunicacao', 'mobile', 'Identidade, comunicação e privacidade', 'Sessão, biometria, TLS, logs e SDKs.', mobIdentidade, ['mob-fundamentos']),
  mod('mob-integridade-distribuicao', 'mobile', 'Integridade e distribuição', 'Assinatura, dependências, engenharia reversa e resiliência.', mobIntegridade, ['mob-android', 'mob-ios']),
  mod('mob-verificacao', 'mobile', 'Verificação Mobile', 'Mobile Top 10, MASVS, MASTG e revisão de apps e backend.', mobVerificacao, ['mob-identidade-comunicacao']),

  mod('rev-fundamentos', 'rev', 'Fundamentos da engenharia reversa', 'Para que serve na defesa, o que a lei e a licença permitem e o laboratório que vem antes.', revFundamentos),
  mod('rev-estatica', 'rev', 'Análise estática', 'Identificação, textos embutidos, bibliotecas, bytecode e binários nativos.', revEstatica, ['rev-fundamentos']),
  mod('rev-segredos', 'rev', 'Caça a segredos em artefatos', 'Onde eles se escondem, como reconhecê-los e o que fazer quando um vaza.', revSegredos, ['rev-estatica']),
  mod('rev-aplicativos', 'rev', 'Aplicativos e clientes', 'Pacote, API reconstruída do cliente, regras no cliente, armazenamento e resiliência.', revAplicativos, ['rev-estatica']),
  mod('rev-modelos', 'rev', 'Artefatos de IA', 'Formatos de modelo, proveniência, prompts embutidos e extração pela API.', revModelos, ['rev-estatica']),
  mod('rev-dinamica', 'rev', 'Análise dinâmica e relatório', 'Execução observada, tráfego, instrumentação, relatório e divulgação responsável.', revDinamica, ['rev-segredos']),

  mod('sc-dependencias', 'supply', 'Dependências', 'O que o projeto instala, de onde vem e com que garantias.', scDependencias),
  mod('sc-repos-pipelines', 'supply', 'Repositórios e pipelines', 'Revisão, identidades, segredos e isolamento de builds.', scRepos, ['sc-dependencias']),
  mod('sc-artefatos', 'supply', 'Artefatos e distribuição', 'SBOM, assinatura, proveniência, registries e rollback.', scArtefatos, ['sc-repos-pipelines']),
  mod('sc-verificacoes', 'supply', 'Verificações automatizadas', 'SAST, SCA, DAST, segredos, IaC e como priorizar.', scVerificacoes, ['sc-dependencias']),
  mod('sc-incidentes', 'supply', 'Incidentes reais', 'Casos documentados e como investigar e responder.', scIncidentes, ['sc-artefatos']),

  mod('arq-modelagem', 'arq', 'Modelagem', 'Diagramas, fluxos de dados, ativos, fronteiras e STRIDE.', arqModelagem),
  mod('arq-identidade-dados', 'arq', 'Identidade e proteção de dados', 'Identidades, privilégio mínimo, segredos, criptografia e retenção.', arqIdentidade, ['arq-modelagem']),
  mod('arq-integradas', 'arq', 'Arquiteturas integradas', 'Web, APIs, mobile, microsserviços, RAG e multi-tenant.', arqIntegradas, ['arq-identidade-dados']),
  mod('arq-decisoes', 'arq', 'Decisões arquiteturais', 'Requisitos, alternativas, ADR, custo e risco residual.', arqDecisoes, ['arq-modelagem']),
  mod('arq-oficina', 'arq', 'Oficina do arquiteto', 'Revisar, escolher controles, defender e reavaliar.', arqOficina, ['arq-integradas', 'arq-decisoes']),

  mod('gov-desenvolvimento', 'gov', 'Desenvolvimento seguro', 'SAMM, SSDF, requisitos e gestão de vulnerabilidades.', govDesenvolvimento),
  mod('gov-ia', 'gov', 'Governança de IA', 'NIST AI RMF, ISO/IEC 42001, papéis e evidências.', govIa),
  mod('gov-privacidade', 'gov', 'Privacidade e regulação', 'LGPD, ciclo de vida dos dados, AI Act e o que é obrigação.', govPrivacidade),
]

export const curriculumAreas: Area[] = [
  { id: 'web', title: 'Segurança Web', summary: 'Do HTTP ao Top 10: autenticação, controle de acesso, injeções e verificação.', icon: 'globe', modules: [] },
  { id: 'api', title: 'Segurança de APIs', summary: 'Contratos, tokens, autorização por objeto, propriedade e função, abuso e integrações.', icon: 'server', modules: [] },
  { id: 'ia', title: 'Segurança de IA', summary: 'Prompts, RAG, agentes, modelos e dados, com OWASP LLM, ATLAS e red teaming.', icon: 'brain', modules: [] },
  { id: 'mobile', title: 'Segurança Mobile', summary: 'Android e iOS: armazenamento, links, WebViews, rede, privacidade e integridade.', icon: 'smartphone', modules: [] },
  { id: 'supply', title: 'Supply Chain e DevSecOps', summary: 'Dependências, pipelines, artefatos, verificações automatizadas e incidentes reais.', icon: 'package', modules: [] },
  { id: 'arq', title: 'Arquitetura de Segurança', summary: 'Modelagem, identidade, dados, decisões e a oficina do arquiteto.', icon: 'blocks', modules: [] },
  { id: 'rev', title: 'Engenharia reversa', summary: 'Ler aplicativos, binários e modelos que você não escreveu: triagem, segredos, clientes e relatório.', icon: 'microscope', modules: [] },
  { id: 'gov', title: 'Governança e Desenvolvimento Seguro', summary: 'SAMM, SSDF, governança de IA, privacidade e regulação.', icon: 'scale', modules: [] },
].map((a) => ({ ...a, modules: curriculumModules.filter((m) => m.area === a.id).map((m) => m.id) })) as Area[]

export const curriculumSubs: Submodule[] = [
  ...webFundamentos, ...webAutenticacao, ...webControleAcesso, ...webEntradasSaidas, ...webDesignConfig, ...webVerificacao,
  ...apiFundamentos, ...apiIdentidade, ...apiAbuso, ...apiIntegracoes, ...apiVerificacao,
  ...iaFundamentos, ...iaPrompts, ...iaRag, ...iaAgentes, ...iaModelos, ...iaVerificacao,
  ...mobFundamentos, ...mobAndroid, ...mobIos, ...mobIdentidade, ...mobIntegridade, ...mobVerificacao,
  ...revFundamentos, ...revEstatica, ...revSegredos, ...revAplicativos, ...revModelos, ...revDinamica,
  ...scDependencias, ...scRepos, ...scArtefatos, ...scVerificacoes, ...scIncidentes,
  ...arqModelagem, ...arqIdentidade, ...arqIntegradas, ...arqDecisoes, ...arqOficina,
  ...govDesenvolvimento, ...govIa, ...govPrivacidade,
]
