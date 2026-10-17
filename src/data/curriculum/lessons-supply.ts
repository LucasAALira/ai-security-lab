import type { Lesson } from './types'

/* Aulas da área Supply Chain e DevSecOps. Texto próprio; exemplos inertes e sintéticos. As aulas dos
   incidentes reais resumem os dossiês de "Casos reais", que trazem as fontes primárias numeradas. */

export const supplyLessons: Record<string, Lesson> = {
  'sc-diretas-transitivas': {
    context: 'O projeto declara 18 dependências no manifesto. O lockfile tem 742 pacotes instalados.',
    concept: [
      'As **dependências diretas** são as que o projeto pede. As {{dependencia-transitiva|transitivas}} vêm junto, porque as diretas dependem delas. Na prática, a maior parte do que roda no projeto não foi escolhida por ninguém da equipe.',
      'Mapear o que está realmente instalado (pelo lockfile ou por um {{sbom|SBOM}}) é o primeiro passo para saber o que foi afetado quando um pacote é comprometido. Reduzir dependências desnecessárias reduz a superfície.',
    ],
    example: {
      title: 'De onde veio um pacote (npm)',
      language: 'text',
      code: ['$ npm ls pacote-x', 'app@1.0.0', '└─┬ sdk-assistente@4.2.0', '  └─┬ cliente-http@2.1.3', '    └── pacote-x@0.3.1'],
      caption: 'Ninguém pediu `pacote-x`; ele chegou por duas camadas de dependência.',
    },
    validation: 'Gere a árvore de dependências e conte diretas e transitivas. Para três transitivas escolhidas ao acaso, descubra quem as trouxe e se são necessárias.',
    review: [
      { front: 'O que é uma dependência transitiva?', back: 'Um pacote que veio porque uma dependência direta depende dele.' },
      { front: 'Por que mapear o que está instalado?', back: 'Para saber o que foi afetado quando um pacote é comprometido.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }],
  },
  'sc-typosquatting': {
    context: 'Um desenvolvedor instalou `reqeusts` em vez de `requests`. Em outro projeto, o pacote interno `empresa-utils` foi substituído por um homônimo publicado no registro público.',
    concept: [
      '**Typosquatting** é publicar pacotes com nomes parecidos com os populares, esperando erros de digitação. **Dependency confusion** é publicar no registro público um pacote com o nome de um pacote interno, esperando que o gerenciador o prefira.',
      'As defesas: escopos ou prefixos reservados para pacotes internos, configuração explícita de qual registro atende cada escopo, lockfile com origem e integridade, e revisão de pacotes novos antes de entrarem no projeto.',
    ],
    validation: 'Confira no lockfile a origem de cada pacote interno: deve ser o registro privado. Tente instalar um nome interno a partir do registro público em um ambiente de teste: a configuração deve impedir.',
    review: [
      { front: 'Qual a diferença entre typosquatting e dependency confusion?', back: 'Typosquatting explora erros de digitação; dependency confusion explora a resolução entre registros público e privado.' },
      { front: 'Como evitar dependency confusion?', back: 'Com escopos reservados e configuração explícita de qual registro atende cada escopo.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }, { framework: 'cwe', id: 'CWE-829' }],
  },
  'sc-install-scripts': {
    context: 'Uma atualização de dependência acrescentou um `postinstall` que baixava e executava um script. Ele rodou em todas as máquinas e na pipeline.',
    concept: [
      'Gerenciadores de pacotes podem executar {{script-de-instalacao|scripts de instalação}} automaticamente, com as permissões de quem instala. Instalar uma dependência pode significar executar código de terceiros na máquina do desenvolvedor e no ambiente de build.',
      'Reduza o risco: desligue scripts por padrão onde for possível e libere só os necessários, revise mudanças em scripts nas atualizações, instale em ambientes sem segredos e com saída de rede restrita.',
    ],
    example: {
      title: 'Instalação sem scripts na pipeline (npm)',
      language: 'yaml',
      code: ['- run: npm ci --ignore-scripts', '- run: npm rebuild pacote-nativo-aprovado'],
      caption: 'Os scripts ficam desligados, e só o pacote que precisa compilar algo é reconstruído, de forma explícita.',
    },
    validation: 'Rode a instalação na pipeline com scripts desligados e confira que o build funciona. Compare, em cada atualização, os scripts das dependências com a versão anterior.',
    review: [
      { front: 'Por que instalar um pacote pode executar código?', back: 'Porque gerenciadores executam scripts de instalação automaticamente.' },
      { front: 'Como reduzir o risco de scripts de instalação?', back: 'Desligando-os por padrão, revisando mudanças e instalando em ambientes sem segredos e com rede restrita.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }, { framework: 'cwe', id: 'CWE-829' }],
  },
  'sc-lockfiles': {
    context: 'A equipe confiou que o lockfile "garantia" a segurança. Uma versão maliciosa entrou nele por uma atualização aprovada sem revisão.',
    concept: [
      'O {{lockfile|lockfile}} fixa versões exatas, origem e hash do que foi instalado, para que a próxima instalação seja igual. Ele garante **reprodutibilidade**, e não que o pacote seja benigno: se uma versão maliciosa foi resolvida, ela fica fixada.',
      'Atualizações do lockfile merecem revisão: o que mudou, de onde vem, se há scripts novos e se a mudança era esperada. Instalações na pipeline usam o lockfile de forma estrita (por exemplo, `npm ci`).',
    ],
    validation: 'Confira que a pipeline falha se o lockfile não corresponder ao manifesto. Em uma atualização, revise o diff do lockfile: versões, origens e hashes novos devem ser explicados.',
    review: [
      { front: 'O lockfile garante que um pacote é seguro?', back: 'Não. Ele garante que a instalação seja igual; uma versão maliciosa resolvida também fica fixada.' },
      { front: 'O que revisar em um diff de lockfile?', back: 'Versões, origens, hashes e scripts novos, e se a mudança era esperada.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A08' }, { framework: 'nist-ssdf', id: 'PW.4' }],
  },
  'sc-revisao-branches': {
    context: 'A branch principal exige testes, mas não revisão de outra pessoa. O bot de dependências faz merge automático, e líderes podem fazer push direto.',
    concept: [
      'Proteger a branch principal significa: toda mudança passa por revisão de outra pessoa, as verificações obrigatórias precisam passar e não há atalhos (push direto, merge automático sem revisão, exceções amplas).',
      'Testes verdes não são revisão: eles conferem o que alguém pensou em testar. A revisão humana procura o que ninguém pensou, inclusive mudanças em pipelines, dependências e configurações de segurança.',
    ],
    validation: 'Tente fazer push direto na branch principal: deve ser recusado. Abra uma mudança sem revisão: o merge deve ser bloqueado. Liste as exceções configuradas e justifique cada uma.',
    review: [
      { front: 'Testes obrigatórios substituem revisão?', back: 'Não. Testes conferem o previsto; a revisão procura o que ninguém previu.' },
      { front: 'Que atalhos desfazem a proteção de uma branch?', back: 'Push direto, merge automático sem revisão e exceções amplas.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PS.1' }, { framework: 'slsa', id: 'source' }],
  },
  'sc-identidades-ci': {
    context: 'Todos os jobs da pipeline usam uma identidade com permissão de administrador na nuvem, inclusive o job de testes de pull requests.',
    concept: [
      'Cada job da pipeline roda com uma identidade e permissões. Se todos usam a mesma identidade ampla, qualquer passo comprometido (uma dependência, uma ação de terceiros) alcança tudo.',
      'Dê a cada job só o que ele precisa: o de testes não precisa de produção; o de publicação precisa de um único registro. Use {{credencial-efemera|credenciais temporárias}} emitidas por execução e restrinja quais branches e eventos podem obtê-las.',
    ],
    example: {
      title: 'Permissões mínimas por job (GitHub Actions)',
      language: 'yaml',
      code: ['permissions:', '  contents: read', 'jobs:', '  publicar:', '    if: github.ref == \'refs/heads/main\'', '    permissions:', '      contents: read', '      id-token: write'],
      caption: 'Só o job de publicação, na branch principal, pode pedir uma credencial temporária.',
    },
    validation: 'Liste cada job, a identidade e as permissões que usa. Confira que um pull request não consegue obter credenciais de publicação nem de produção.',
    review: [
      { front: 'Por que uma identidade única e ampla na pipeline é perigosa?', back: 'Porque qualquer passo comprometido passa a alcançar tudo o que ela alcança.' },
      { front: 'Quem deve poder obter credenciais de publicação?', back: 'Só o job de publicação, em branches e eventos autorizados.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PO.5' }, { framework: 'cwe', id: 'CWE-250' }],
  },
  'sc-segredos': {
    context: 'O deploy usa um par de chaves de nuvem criado há mais de um ano, guardado como segredo do repositório e visível para todos os passos do job.',
    concept: [
      'Segredos estáticos e de longa duração ficam disponíveis para tudo o que roda no passo, inclusive dependências e scripts de terceiros. Quanto mais amplo e duradouro, maior o dano de um vazamento.',
      'Substitua por credenciais temporárias, emitidas por execução a partir da identidade da pipeline, com escopo mínimo. Onde um segredo for inevitável, exponha só no passo que precisa, mascare em registros e tenha rotação automatizada.',
    ],
    validation: 'Procure segredos estáticos configurados na pipeline e a idade de cada um. Para os que restarem, confira o escopo, o passo em que aparecem e a data da última rotação.',
    review: [
      { front: 'Por que preferir credenciais temporárias na pipeline?', back: 'Porque expiram sozinhas e limitam o valor de um vazamento ao tempo de vida e ao escopo.' },
      { front: 'Se um segredo estático for inevitável, o que fazer?', back: 'Expor só no passo necessário, mascarar em registros e automatizar a rotação.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'nist-ssdf', id: 'PO.5' }],
  },
  'sc-runners': {
    context: 'Pull requests de contribuidores externos rodam no mesmo runner persistente que publica as versões, com acesso aos segredos.',
    concept: [
      'O **runner** é a máquina que executa os jobs. Código de origem não confiável (pull requests externos) não pode rodar onde há segredos nem onde o próximo build confiável vai rodar, porque pode deixar algo para trás.',
      'Use runners efêmeros (criados e destruídos por job), separe os que rodam código externo dos que publicam e restrinja a saída de rede. Eventos que dão acesso a segredos não executam código de pull requests externos.',
    ],
    validation: 'Confira que pull requests externos rodam em runners sem segredos e separados dos de publicação. Confirme que os runners de publicação são destruídos ao fim de cada job.',
    review: [
      { front: 'Por que separar runners de código externo dos de publicação?', back: 'Para que código não confiável não acesse segredos nem deixe algo para o próximo build confiável.' },
      { front: 'O que é um runner efêmero?', back: 'Um ambiente criado para um job e destruído ao final.' },
    ],
    refs: [{ framework: 'slsa', id: 'build' }, { framework: 'nist-ssdf', id: 'PO.5' }],
  },
  'sc-sbom': {
    context: 'Uma vulnerabilidade grave em uma biblioteca de compressão foi divulgada. A empresa levou dois dias para descobrir quais serviços a usavam.',
    concept: [
      'Um {{sbom|SBOM}} lista os componentes de um software (nome, versão, origem). Ele responde rapidamente "onde usamos isto?", porque o inventário já existe quando a notícia chega.',
      'O SBOM **não impede ataques**: ele não diz se um componente é malicioso nem se uma versão é segura. Ele é útil quando gerado a cada build, guardado junto do artefato e consultável por toda a organização.',
    ],
    validation: 'Gere o SBOM em cada build e guarde-o com o artefato. Faça um teste: escolha um componente qualquer e descubra, só pelos SBOMs, em quais artefatos publicados ele está.',
    review: [
      { front: 'O que um SBOM responde?', back: 'Quais componentes e versões estão em um software, e onde um componente é usado.' },
      { front: 'O SBOM impede um ataque à cadeia de suprimentos?', back: 'Não. Ele ajuda a encontrar o que foi afetado; não diz se um componente é benigno.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PS.3' }],
  },
  'sc-assinatura': {
    context: 'Uma atualização maliciosa foi distribuída com a assinatura digital válida do fornecedor. Os clientes a instalaram sem desconfiar.',
    concept: [
      'Uma {{assinatura|assinatura digital}} comprova que o artefato foi assinado por quem tem a chave e que não mudou depois. Ela **não comprova** que o conteúdo é inofensivo: se o código malicioso entrou antes da assinatura (no código ou no build), ele também é assinado.',
      'A assinatura é valiosa para integridade e origem, e precisa ser verificada por quem consome. A proteção do processo que gera o artefato (build, chaves, revisão) é o que dá sentido à assinatura.',
    ],
    validation: 'Confira que a pipeline de implantação verifica a assinatura de cada artefato antes de usar. Altere um byte de um artefato de teste: a verificação deve falhar.',
    review: [
      { front: 'O que uma assinatura digital comprova?', back: 'Que o artefato foi assinado por quem tem a chave e não mudou depois.' },
      { front: 'Por que uma atualização maliciosa pode ter assinatura válida?', back: 'Porque o código malicioso pode ter entrado antes da assinatura, no código ou no build.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PS.2' }, { framework: 'cwe', id: 'CWE-347' }],
  },
  'sc-proveniencia-slsa': {
    context: 'Um auditor pergunta: "como vocês sabem que este pacote veio deste commit, por esta pipeline?". A equipe só tem a assinatura.',
    concept: [
      'A {{proveniencia|proveniência}} é um registro verificável de como o artefato foi produzido: de qual código, por qual processo de build, com quais parâmetros. Uma **atestação** assinada pelo sistema de build carrega esse registro.',
      'A **trilha de build do SLSA** organiza níveis crescentes de garantia sobre esse processo, como proveniência gerada pela própria plataforma e builds isolados. O consumidor verifica a atestação antes de usar o artefato.',
    ],
    example: {
      title: 'Trecho de uma atestação de proveniência (simplificado)',
      language: 'json',
      code: ['{', '  "subject": [{ "name": "app.tgz", "digest": { "sha256": "<hash>" } }],', '  "buildDefinition": { "externalParameters": { "ref": "refs/heads/main" } },', '  "runDetails": { "builder": { "id": "https://ci.empresa.example/builder" } }', '}'],
      caption: 'O hash liga a atestação ao artefato; o builder e o ref dizem quem e de onde.',
    },
    validation: 'Gere a atestação de proveniência em cada build e verifique-a na implantação: o hash deve corresponder ao artefato, o builder deve ser o esperado e o ref deve ser o da branch protegida.',
    review: [
      { front: 'Qual a diferença entre assinatura e proveniência?', back: 'A assinatura prova quem assinou; a proveniência registra como e de onde o artefato foi produzido.' },
      { front: 'Para que serve a trilha de build do SLSA?', back: 'Para organizar níveis crescentes de garantia sobre o processo de build.' },
    ],
    refs: [{ framework: 'slsa', id: 'build' }, { framework: 'nist-ssdf', id: 'PS.2' }],
  },
  'sc-registries': {
    context: 'Para implantar em produção, a pipeline reconstrói a imagem a partir do código, em vez de promover a que foi testada em homologação.',
    concept: [
      'Um **registry** guarda os artefatos (pacotes, imagens). A **promoção** move o mesmo artefato, identificado pelo hash, de um ambiente para o outro. Reconstruir em cada ambiente produz um artefato diferente do que foi testado.',
      'Permissões de escrita no registry são mínimas (só a pipeline de publicação), artefatos são referenciados pelo hash e não por etiquetas mutáveis, e a implantação verifica assinatura e proveniência.',
    ],
    validation: 'Confira que produção usa o mesmo hash testado em homologação. Tente publicar no registry com uma identidade que não seja a da pipeline: deve ser recusado.',
    review: [
      { front: 'Por que promover, e não reconstruir, o artefato?', back: 'Para que o que vai a produção seja exatamente o que foi testado.' },
      { front: 'Por que referenciar artefatos pelo hash?', back: 'Porque etiquetas podem ser movidas para outro conteúdo; o hash não.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PS.3' }, { framework: 'owasp-top10', id: 'A08' }],
  },
  'sc-rollback': {
    context: 'Depois de descobrir uma dependência comprometida, a equipe fez rollback para a versão anterior e encerrou o incidente. As chaves que estavam no ambiente de build continuaram válidas.',
    concept: [
      'O **rollback** troca o código, mas não desfaz o que já aconteceu: credenciais lidas, dados enviados, artefatos publicados e persistência deixada em máquinas. Se o código malicioso rodou onde havia segredos, eles precisam ser considerados expostos.',
      'A recuperação inclui: rotação das credenciais acessíveis, verificação dos artefatos publicados no período, reconstrução de ambientes a partir de fontes confiáveis e comunicação a quem recebeu artefatos afetados.',
    ],
    validation: 'Para um incidente simulado, liste o que o código malicioso alcançou (segredos, artefatos, máquinas) e confira que cada item tem uma ação de recuperação além do rollback.',
    review: [
      { front: 'Por que o rollback pode ser insuficiente?', back: 'Porque não desfaz credenciais lidas, dados enviados, artefatos publicados e persistência.' },
      { front: 'O que fazer com segredos acessíveis ao código malicioso?', back: 'Considerá-los expostos e trocá-los.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
  },
  'sc-sast': {
    context: 'A ferramenta de análise estática não apontou nada em um módulo com uma falha de autorização grave.',
    concept: [
      'A **SAST** analisa o código sem executá-lo e encontra bem padrões conhecidos: injeção, uso de funções perigosas, segredos escritos no código. Ela vê mal falhas de lógica e de autorização, que dependem do significado das regras de negócio.',
      'Use a SAST na pipeline com regras ajustadas ao projeto, trate os achados com prazo por gravidade e combine com revisão de código e testes de autorização.',
    ],
    validation: 'Introduza, em um ramo de teste, uma injeção de SQL e uma falha de autorização: confira qual delas a SAST encontra. Use o resultado para decidir onde a revisão humana precisa olhar.',
    review: [
      { front: 'Que tipo de falha a SAST encontra bem?', back: 'Padrões conhecidos, como injeção e uso de funções perigosas.' },
      { front: 'Que tipo de falha a SAST vê mal?', back: 'Falhas de lógica e de autorização.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
  },
  'sc-sca': {
    context: 'A análise de dependências apontou 214 vulnerabilidades. A equipe não sabe por onde começar.',
    concept: [
      'A **SCA** compara as dependências com bases de vulnerabilidades conhecidas. Ela encontra o que já foi registrado: a ausência de {{cve|CVE}} não significa ausência de risco, e um pacote malicioso novo não aparece.',
      'Priorize por exploração conhecida, exposição (o trecho afetado é usado? está acessível de fora?) e correção disponível. Atualizações frequentes e pequenas evitam acumular centenas de achados.',
    ],
    validation: 'Para os dez achados mais graves, registre se o trecho é usado, se está exposto e se há correção. Corrija os que combinam os três e acompanhe o tempo médio de correção.',
    review: [
      { front: 'A ausência de CVE significa que o pacote é seguro?', back: 'Não. Significa só que ninguém registrou uma vulnerabilidade conhecida.' },
      { front: 'Como priorizar achados de SCA?', back: 'Por exploração conhecida, exposição do trecho afetado e correção disponível.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }, { framework: 'owasp-top10', id: 'A03' }],
  },
  'sc-dast': {
    context: 'O teste dinâmico expirou em cinco minutos e não deu resultado. A versão foi liberada assim mesmo, como se tivesse passado.',
    concept: [
      'A **DAST** testa a aplicação em execução, de fora, como um cliente faria. Encontra problemas de configuração, cabeçalhos, injeções visíveis e respostas inesperadas, mas depende de ambiente, autenticação e cobertura das rotas.',
      'Rode em homologação, com contas de teste e dados sintéticos, nunca contra sistemas de terceiros sem autorização. Um teste que não terminou não é um teste aprovado.',
    ],
    validation: 'Confira que a DAST autentica com contas de teste, cobre as rotas do inventário e tem tempo suficiente. Configure a pipeline para falhar quando o teste não terminar.',
    review: [
      { front: 'O que a DAST testa?', back: 'A aplicação em execução, de fora, como um cliente.' },
      { front: 'Um teste dinâmico que expirou pode ser tratado como aprovado?', back: 'Não. Sem resultado, o portão deve falhar e exigir a repetição.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
  },
  'sc-secret-scanning': {
    context: 'Uma chave de nuvem foi commitada há três meses e removida no commit seguinte. Ela continua no histórico do repositório.',
    concept: [
      'O **secret scanning** procura segredos no código, no histórico e em outros lugares (chamados, registros). Remover o segredo do arquivo não o tira do histórico, e quem clonou o repositório já o tem.',
      'Diante de um achado, o passo principal é **revogar e trocar** o segredo; limpar o histórico é secundário. Ganchos antes do commit e bloqueio no envio impedem novos vazamentos.',
    ],
    validation: 'Rode a varredura no histórico completo do repositório. Para cada achado, confira se o segredo foi revogado. Tente commitar um segredo de teste: o gancho ou o bloqueio deve impedir.',
    review: [
      { front: 'Remover um segredo do arquivo resolve o vazamento?', back: 'Não. Ele continua no histórico e com quem clonou; é preciso revogar e trocar.' },
      { front: 'Qual o passo principal diante de um segredo vazado?', back: 'Revogar e trocar o segredo.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }],
  },
  'sc-iac-containers': {
    context: 'Uma imagem de container levava um token de registro em uma camada intermediária. Um pod rodava com acesso ao sistema de arquivos do hospedeiro.',
    concept: [
      '**Infraestrutura como código** (Terraform, manifestos Kubernetes) e **imagens de container** também são código: podem ter configurações perigosas, como permissões amplas, containers privilegiados, portas expostas e segredos em camadas.',
      'Verifique manifestos e imagens na pipeline antes de implantar: regras contra privilégios, imagens de base mínimas e atualizadas, segredos fora das camadas (passados em tempo de execução) e varredura de vulnerabilidades.',
    ],
    validation: 'Rode a verificação de IaC e de imagens na pipeline e confirme que ela bloqueia containers privilegiados e segredos em camadas. Inspecione as camadas de uma imagem publicada procurando segredos.',
    review: [
      { front: 'Por que um segredo em uma camada intermediária é um problema?', back: 'Porque as camadas ficam na imagem publicada e podem ser inspecionadas.' },
      { front: 'Que configuração de container é especialmente perigosa?', back: 'Container privilegiado ou com acesso ao sistema de arquivos do hospedeiro.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A02' }, { framework: 'cwe', id: 'CWE-250' }],
  },
  'sc-limitacoes': {
    context: 'Com cinco ferramentas de segurança na pipeline, a equipe recebe 900 alertas por semana e passou a ignorar todos.',
    concept: [
      'Toda ferramenta tem **falsos positivos** (alertas sem problema real) e **falsos negativos** (problemas sem alerta). Alertas demais levam a ignorar todos; confiança cega deixa passar o que a ferramenta não vê.',
      'Priorize por risco real (exposição, exploração, dado afetado), ajuste regras ao projeto, defina o que bloqueia e o que alerta com prazo, e meça o tempo de correção. Ferramentas complementam, e não substituem, revisão e testes de autorização.',
    ],
    validation: 'Classifique uma amostra de alertas em verdadeiros e falsos positivos e ajuste as regras com mais ruído. Defina e documente o que bloqueia a liberação e o que vira alerta com prazo.',
    review: [
      { front: 'O que é um falso negativo?', back: 'Um problema real que a ferramenta não apontou.' },
      { front: 'Por que alertas demais são perigosos?', back: 'Porque levam a equipe a ignorar todos, inclusive os importantes.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
  },
  'sc-xz': {
    context: 'Em 2024, um desenvolvedor investigava uma lentidão no SSH e encontrou código malicioso em uma biblioteca de compressão presente em muitas distribuições Linux.',
    concept: [
      'No caso **XZ Utils**, as versões 5.6.0 e 5.6.1 da biblioteca liblzma receberam código malicioso (registrado como CVE-2024-3094). O gatilho estava nos **arquivos de distribuição** publicados para download, e não no repositório Git, e era acionado durante a compilação dos pacotes das distribuições.',
      'A lição para quem consome software: o repositório e o pacote publicado podem ser diferentes, a confiança em mantenedores é construída ao longo do tempo (a aproximação ao projeto começou anos antes) e builds reprodutíveis e verificação de origem ajudam a perceber divergências. O dossiê completo está em **Casos reais**.',
    ],
    validation: 'Para uma dependência crítica do seu projeto, confira se é possível reproduzir o pacote a partir do repositório e comparar. Registre quem mantém o projeto e como mudanças de mantenedor são acompanhadas.',
    review: [
      { front: 'Onde estava o gatilho do código malicioso no caso XZ Utils?', back: 'Nos arquivos de distribuição publicados para download, e não no repositório Git.' },
      { front: 'Que lição o caso traz sobre repositório e pacote?', back: 'Eles podem divergir; verificar a origem e reproduzir o build ajuda a perceber.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }, { framework: 'slsa', id: 'build' }],
    links: [{ label: 'Alerta do CERT-EU sobre o XZ Utils (2024-032)', url: 'https://cert.europa.eu/publications/security-advisories/2024-032/' }],
  },
  'sc-3cx': {
    context: 'Em 2023, o aplicativo de desktop da 3CX foi distribuído com código malicioso. A investigação mostrou que o ataque começou em outro fornecedor.',
    concept: [
      'Segundo a Mandiant, o comprometimento da 3CX começou com um instalador adulterado de outro software (X_TRADER, da Trading Technologies), baixado por um funcionário. Foi, nas palavras da empresa, a primeira vez que ela viu um ataque à cadeia de suprimentos levar a outro.',
      'As lições: o software instalado em estações de quem tem acesso ao build é parte da cadeia de suprimentos; software descontinuado ainda disponível para download é um risco; e assinaturas e antivírus são sinais, não garantias. O dossiê completo está em **Casos reais**.',
    ],
    validation: 'Liste o software instalado nas estações de quem tem acesso ao build e à assinatura. Confira se há programas descontinuados e se essas estações estão separadas do ambiente de build.',
    review: [
      { front: 'Como o ataque à 3CX começou, segundo a Mandiant?', back: 'Com um instalador adulterado de outro software, o X_TRADER, baixado por um funcionário.' },
      { front: 'Que lição o caso traz sobre as estações de trabalho?', back: 'O software instalado em estações com acesso ao build faz parte da cadeia de suprimentos.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }],
    links: [{ label: 'Análise da Mandiant (Google Cloud) sobre a 3CX', url: 'https://cloud.google.com/blog/topics/threat-intelligence/3cx-software-supply-chain-compromise' }],
  },
  'sc-solarwinds': {
    context: 'Em 2020, atualizações legítimas e assinadas de uma plataforma de monitoramento carregavam um componente alterado durante o build.',
    concept: [
      'No caso **SolarWinds Orion**, a empresa informou que o ataque comprometeu o **sistema de build**, e não o repositório de código-fonte. O componente alterado foi distribuído em atualizações legítimas e assinado digitalmente pela própria empresa.',
      'As lições: proteger o build é tão importante quanto proteger o código; uma assinatura válida não prova que o conteúdo é benigno; proveniência verificável e builds isolados reduzem o risco. O dossiê completo está em **Casos reais**.',
    ],
    validation: 'Desenhe o seu processo de build e marque quem pode alterá-lo, onde ficam as chaves de assinatura e se existe proveniência verificável dos artefatos.',
    review: [
      { front: 'Que parte do processo foi comprometida no caso SolarWinds?', back: 'O sistema de build, segundo a empresa, e não o repositório de código-fonte.' },
      { front: 'Por que a assinatura não impediu o ataque?', back: 'Porque o código alterado entrou antes da assinatura, durante o build.' },
    ],
    refs: [{ framework: 'slsa', id: 'build' }, { framework: 'nist-ssdf', id: 'PS.2' }],
  },
  'sc-npm-pypi': {
    context: 'Em 2021, três versões de uma biblioteca npm muito usada foram publicadas com um script de instalação que baixava programas maliciosos.',
    concept: [
      'No caso **ua-parser-js**, as versões 0.7.29, 0.8.0 e 1.0.0 foram publicadas em 2021-10-22 com código malicioso. O autor disse acreditar que a conta dele no npm foi sequestrada. As versões traziam um script de pré-instalação que iniciava downloads conforme o sistema operacional.',
      'As lições: a conta de quem publica é parte da cadeia de suprimentos (autenticação forte faz diferença); scripts de instalação executam código na hora de instalar; e quem instalou precisa trocar segredos acessíveis na máquina, além de atualizar. O dossiê completo está em **Casos reais**.',
    ],
    validation: 'Confira se a instalação de dependências na pipeline e nas máquinas da equipe roda com scripts desligados por padrão. Para os pacotes que você publica, confira se as contas têm segundo fator.',
    review: [
      { front: 'Como o código malicioso era executado no caso ua-parser-js?', back: 'Por um script de pré-instalação, executado quando o pacote era instalado.' },
      { front: 'Além de atualizar, o que quem instalou as versões maliciosas devia fazer?', back: 'Procurar indicadores de comprometimento e trocar senhas, chaves e tokens.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }, { framework: 'cwe', id: 'CWE-829' }],
  },
  'sc-investigacao-resposta': {
    context: 'Sexta-feira, 17h42: depois de atualizar um SDK, o ambiente de build passou a fazer conexões de saída inesperadas.',
    concept: [
      'Um incidente de cadeia de suprimentos pede uma ordem: **conter** (parar builds e publicações, bloquear o destino, sem apagar evidências), **preservar** (registros, artefatos, lockfiles), **medir o alcance** (que máquinas, segredos e artefatos o código alcançou), **erradicar e recuperar** (rotação de credenciais, reconstrução, retirada de artefatos) e **aprender**.',
      'Separar fatos de hipóteses evita conclusões precipitadas, e a rotação de credenciais acessíveis é obrigatória mesmo depois de um rollback.',
    ],
    validation: 'Faça um exercício de mesa com o cenário e confira se o plano cobre contenção sem apagar evidências, medição do alcance, rotação de credenciais e verificação dos artefatos publicados no período.',
    review: [
      { front: 'Qual a ordem de resposta a um incidente de cadeia de suprimentos?', back: 'Conter, preservar, medir o alcance, erradicar e recuperar, e aprender.' },
      { front: 'Por que a rotação de credenciais é obrigatória mesmo com rollback?', back: 'Porque o código malicioso pode ter lido credenciais enquanto rodava.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'RV.1' }],
  },
}
