import type { Lesson } from './types'

/* Aulas da área Segurança Mobile (Android e iOS). Texto próprio; exemplos inertes e sintéticos.
   A experiência funciona no navegador; nenhuma aula exige emulador ou aparelho. */

export const mobileLessons: Record<string, Lesson> = {
  'mob-arquitetura': {
    context: 'Uma equipe web vai construir o primeiro aplicativo da empresa e pergunta: "onde ficam os dados e quem consegue ler?".',
    concept: [
      'No Android, o aplicativo é formado por **componentes** declarados no manifesto (activities, services, receivers, providers) e roda com um usuário próprio do sistema. No iOS, o aplicativo é um pacote assinado, com **entitlements** que concedem capacidades, e roda em um contêiner próprio.',
      'Nos dois, os dados ficam em áreas do aplicativo (arquivos, preferências, bancos locais) e em cofres do sistema (Keystore no Android, Keychain no iOS). O aplicativo também fala com o backend, que é onde ficam as decisões de segurança.',
    ],
    validation: 'Desenhe o aplicativo com os componentes, os lugares onde guarda dados e os serviços que chama. Marque, para cada dado, onde ele fica e quem pode lê-lo.',
    review: [
      { front: 'Onde guardar segredos em Android e iOS?', back: 'No Keystore (Android) e no Keychain (iOS), e não em preferências comuns.' },
      { front: 'O que são entitlements no iOS?', back: 'Capacidades concedidas ao aplicativo assinado, como acesso a serviços do sistema.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-PLATFORM' }],
  },
  'mob-sandbox': {
    context: 'Um desenvolvedor acha que, por causa do sandbox, nenhum dado do aplicativo pode sair do aparelho.',
    concept: [
      'O **sandbox** isola um aplicativo dos outros: um não lê os arquivos do outro sem permissão. Mas os dados ainda podem sair por backups, por componentes exportados, por logs, pela área de transferência, por capturas de tela ou por um aparelho com o sistema adulterado.',
      'O **ciclo de vida** também importa: o aplicativo vai para segundo plano (e o sistema pode tirar uma imagem da tela), é encerrado, reinstalado ou restaurado de backup. Cada transição é um momento em que dados podem ficar expostos.',
    ],
    validation: 'Para um dado sensível, siga o caminho: ele vai para backup? Aparece em logs? Fica na imagem do seletor de aplicativos? Sobrevive à reinstalação? Corrija cada saída não prevista.',
    review: [
      { front: 'O sandbox impede que dados saiam do aparelho?', back: 'Não. Backups, logs, componentes exportados e capturas de tela são saídas possíveis.' },
      { front: 'Que momento do ciclo de vida pode expor a tela?', back: 'A ida para segundo plano, quando o sistema guarda uma imagem para o seletor de aplicativos.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-STORAGE' }],
  },
  'mob-app-backend': {
    context: 'O aplicativo decide no próprio código se o cliente tem o plano Pro e libera os recursos. O servidor confia nessa decisão.',
    concept: [
      'O aplicativo roda em um aparelho controlado por quem o usa: ele pode ser descompilado, alterado ou ter as chamadas interceptadas. O que o aplicativo "garante" vale só para quem não quer burlá-lo.',
      'Decisões de segurança e de negócio (plano, permissão, preço, limite, autorização) ficam no **servidor**. O aplicativo cuida da experiência e protege o que guarda e mostra no aparelho.',
    ],
    figure: 'app-backend',
    validation: 'Para cada decisão tomada no aplicativo, envie ao servidor uma requisição que finge o resultado oposto: o servidor deve decidir por conta própria e recusar o que não for permitido.',
    review: [
      { front: 'O que o aplicativo consegue garantir sozinho?', back: 'Só a experiência e a proteção do que guarda no aparelho; decisões de segurança ficam no servidor.' },
      { front: 'Por que o servidor não pode confiar em um campo enviado pelo aplicativo?', back: 'Porque o aplicativo pode ser alterado ou as chamadas, forjadas.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-602' }, { framework: 'owasp-mobile-top10', id: 'M3' }],
  },
  'mob-ameacas': {
    context: 'O modelo de ameaças do aplicativo de uma clínica só considerava "hackers na internet". Ninguém pensou no aparelho perdido no táxi.',
    concept: [
      'Um modelo de ameaças mobile inclui cenários próprios: **aparelho perdido ou roubado** (desbloqueado ou não), **aplicativo adulterado** e redistribuído, **rede hostil** (Wi-Fi público), **outros aplicativos** no aparelho e **SDKs de terceiros** dentro do próprio aplicativo.',
      'Para cada cenário, pergunte o que o atacante consegue (ler dados, usar a sessão, chamar o backend) e o que limita o dano (armazenamento protegido, sessão curta, autorização no servidor, validação de TLS).',
    ],
    validation: 'Escreva, para cada um dos cinco cenários, o que o atacante consegue hoje e o controle que limita o dano. Cenários sem controle viram itens do plano de correção.',
    review: [
      { front: 'Cite três cenários próprios de um modelo de ameaças mobile.', back: 'Aparelho perdido, aplicativo adulterado e rede hostil (também: outros aplicativos e SDKs).' },
      { front: 'O que limita o dano de um aparelho perdido?', back: 'Armazenamento protegido, sessão curta e revogável e decisões no servidor.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M9' }, { framework: 'owasp-mobile-top10', id: 'M5' }],
  },
  'mob-manifest': {
    context: 'O pacote de release de um aplicativo saiu com depuração ligada e backup completo, herdados da configuração de desenvolvimento.',
    concept: [
      'O **AndroidManifest.xml** declara componentes, permissões, se o aplicativo permite backup e se é depurável. Ler o manifesto do pacote final, e não só o do projeto, revela o que de fato foi publicado.',
      'Pontos de atenção: `android:debuggable` (nunca em release), `android:allowBackup` e regras de exclusão (o que sai em backup), permissões pedidas (só as necessárias) e componentes com `exported` (só os que outros aplicativos precisam chamar).',
    ],
    example: {
      title: 'Trecho de manifesto de release',
      language: 'xml',
      code: ['<application', '    android:allowBackup="false"', '    android:networkSecurityConfig="@xml/rede">', '    <activity android:name=".Principal" android:exported="true" />', '    <service android:name=".Sincronizar" android:exported="false" />', '</application>'],
      caption: 'Sem depuração, sem backup completo e só o que precisa exportado.',
    },
    validation: 'Extraia o manifesto do pacote de release e confira depuração, backup, permissões e componentes exportados. Inclua essa verificação na pipeline de release.',
    review: [
      { front: 'Por que ler o manifesto do pacote final?', back: 'Porque a configuração de build pode mudar o que foi declarado no projeto.' },
      { front: 'Que atributos do manifesto merecem atenção?', back: 'Depuração, backup, permissões pedidas e componentes exportados.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M8' }, { framework: 'cwe', id: 'CWE-489' }],
  },
  'mob-componentes': {
    context: 'Um serviço que exporta o histórico do cliente para a nuvem ficou exportado depois de um teste. Qualquer aplicativo no aparelho conseguia chamá-lo e escolher o destino.',
    concept: [
      'Componentes **exportados** podem ser chamados por outros aplicativos. Um filtro de intent torna o componente exportado em muitos casos, mesmo sem a intenção explícita de quem escreveu.',
      'Exporte só o que outros aplicativos ou o sistema precisam chamar. Para o que precisa ser exportado, exija permissão (de preferência do tipo assinatura, que só aplicativos da mesma empresa têm) e trate tudo o que chega como entrada não confiável.',
    ],
    validation: 'Liste os componentes exportados no pacote de release. Para cada um, tente chamá-lo a partir de um aplicativo de teste com dados forjados: só os necessários devem responder, e com validação.',
    review: [
      { front: 'O que torna um componente exportado?', back: 'O atributo `exported` ou, em muitos casos, um filtro de intent declarado.' },
      { front: 'Como proteger um componente que precisa ser exportado?', back: 'Com permissão (preferencialmente de assinatura) e validação do que ele recebe.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-926' }, { framework: 'masvs', id: 'MASVS-PLATFORM' }],
  },
  'mob-intents-links': {
    context: 'O link de "acesso rápido" do e-mail abre o aplicativo com um token que vira sessão. Um aplicativo de lanterna registrou o mesmo esquema.',
    concept: [
      'Dados que chegam por intents e por {{deep-link|links}} são **entrada não confiável**: qualquer aplicativo pode enviá-los e qualquer página pode montá-los. Esquemas próprios (`app://`) podem ser registrados por outros aplicativos.',
      'Os **App Links** ligam o link a um domínio verificado, de modo que só o aplicativo dono abre o link. Mesmo assim, o link nunca carrega credenciais nem executa ações sozinho: indica a tela, e o aplicativo autentica e pede confirmação.',
    ],
    figure: 'deep-link',
    validation: 'Instale um aplicativo de teste que registre o mesmo esquema e toque no link: com App Links verificados, só o aplicativo correto deve abrir. Abra links com parâmetros forjados: nenhuma ação deve acontecer sem confirmação.',
    review: [
      { front: 'Por que esquemas próprios são arriscados?', back: 'Porque qualquer aplicativo pode registrá-los e receber o link.' },
      { front: 'O que um link pode e não pode fazer?', back: 'Pode indicar uma tela; não pode carregar credencial nem executar ação sem confirmação.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-939' }, { framework: 'owasp-mobile-top10', id: 'M4' }],
  },
  'mob-armazenamento-android': {
    context: 'O refresh token ficava no arquivo de preferências. Uma cópia de backup bastou para entrar na conta a partir de outro aparelho.',
    concept: [
      'Preferências comuns, arquivos e bancos locais são legíveis por quem tem acesso ao aparelho desbloqueado, a um backup ou a um sistema adulterado. Segredos (tokens, chaves) ficam cifrados com uma chave guardada no **Android Keystore**, que não sai do hardware ou do sistema.',
      'O backup precisa de regras: segredos e dados sensíveis ficam de fora. Também vale a pergunta anterior: o dado precisa mesmo ser guardado no aparelho?',
    ],
    example: {
      title: 'Regras de exclusão de backup (sintéticas)',
      language: 'xml',
      code: ['<data-extraction-rules>', '  <cloud-backup>', '    <exclude domain="sharedpref" path="sessao.xml" />', '    <exclude domain="database" path="exames.db" />', '  </cloud-backup>', '</data-extraction-rules>'],
      caption: 'O que é sessão ou dado sensível não sai do aparelho em backup.',
    },
    validation: 'Faça um backup de um aparelho de teste e procure tokens e dados sensíveis na cópia: não devem aparecer. Confira que o token é cifrado com chave do Keystore.',
    review: [
      { front: 'Onde guardar um refresh token no Android?', back: 'Cifrado com uma chave do Android Keystore, fora do backup.' },
      { front: 'Que pergunta vem antes de "onde guardar"?', back: 'Se é preciso guardar o dado no aparelho.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M9' }, { framework: 'masvs', id: 'MASVS-STORAGE' }],
  },
  'mob-webview-android': {
    context: 'A central de ajuda abre em uma WebView que expõe uma ponte JavaScript para o pagamento. A URL inicial vem de um extra do intent.',
    concept: [
      'Uma {{webview|WebView}} com ponte JavaScript entrega as funções da ponte a qualquer página carregada nela, inclusive scripts de terceiros. Se a URL vem de fora, quem escolhe a página escolhe quem usa a ponte.',
      'Restrinja as origens carregadas, não aceite URLs vindas de intents, desligue recursos não usados (acesso a arquivos, JavaScript quando não necessário) e tire da ponte ações com efeito. A configuração de rede do aplicativo também proíbe tráfego sem TLS.',
    ],
    validation: 'Abra a tela com uma URL forjada: deve ser recusada. Carregue uma página de outra origem e tente chamar a ponte: ela não deve existir. Confira a configuração de rede do pacote de release.',
    review: [
      { front: 'Por que uma ponte JavaScript é perigosa?', back: 'Porque qualquer página carregada na WebView pode chamar as funções da ponte.' },
      { front: 'Onde ações como pagamento devem acontecer?', back: 'Em telas nativas com confirmação, e não pela ponte da WebView.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-749' }, { framework: 'masvs', id: 'MASVS-PLATFORM' }],
  },
  'mob-ios-permissoes': {
    context: 'Um aplicativo de agendamento pede acesso aos contatos, à localização sempre e à câmera no primeiro uso, "para o caso de precisar".',
    concept: [
      'No iOS, **permissões** de privacidade (câmera, localização, contatos) são pedidas à pessoa com uma justificativa declarada no Info.plist. **Entitlements** concedem capacidades ao aplicativo assinado (como domínios associados e grupos de Keychain).',
      'Peça só o necessário, no momento em que a funcionalidade é usada, com uma justificativa clara. Permissões a mais ampliam o dano de um SDK ou de um aplicativo comprometido e reduzem a confiança de quem usa.',
    ],
    validation: 'Liste as permissões e entitlements do pacote. Para cada um, aponte a funcionalidade que o usa; remova os que não têm. Confira que cada pedido aparece só quando a funcionalidade é aberta.',
    review: [
      { front: 'Qual a diferença entre permissão e entitlement no iOS?', back: 'Permissão é pedida à pessoa (câmera, localização); entitlement é uma capacidade concedida ao aplicativo assinado.' },
      { front: 'Quando pedir uma permissão?', back: 'No momento em que a funcionalidade que precisa dela é usada, com justificativa clara.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-PRIVACY' }, { framework: 'owasp-mobile-top10', id: 'M6' }],
  },
  'mob-keychain': {
    context: 'O aplicativo guardava o token de sessão no UserDefaults, junto das preferências de tema.',
    concept: [
      'O **UserDefaults** é para preferências e não protege segredos. O **Keychain** guarda segredos cifrados pelo sistema, com uma **acessibilidade** que define quando podem ser lidos (por exemplo, só com o aparelho desbloqueado) e se podem migrar para outro aparelho.',
      'Para tokens de sessão, escolha uma acessibilidade restrita ao aparelho, que não vá para backup em outro aparelho, e considere exigir a presença do usuário para segredos mais sensíveis.',
    ],
    example: {
      title: 'Guardar no Keychain (Swift, simplificado)',
      language: 'swift',
      code: ['let consulta: [String: Any] = [', '  kSecClass as String: kSecClassGenericPassword,', '  kSecAttrAccount as String: "sessao",', '  kSecValueData as String: tokenData,', '  kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,', ']', 'SecItemAdd(consulta as CFDictionary, nil)'],
      caption: 'A acessibilidade "ThisDeviceOnly" impede que o item migre para outro aparelho.',
    },
    validation: 'Confira que não há tokens no UserDefaults nem em arquivos do aplicativo. Restaure um backup em outro aparelho de teste: o token não deve funcionar ali.',
    review: [
      { front: 'Por que não guardar tokens no UserDefaults?', back: 'Porque é armazenamento de preferências, sem proteção para segredos.' },
      { front: 'O que define a acessibilidade de um item do Keychain?', back: 'Quando o item pode ser lido e se pode migrar para outro aparelho.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-STORAGE' }, { framework: 'owasp-mobile-top10', id: 'M9' }],
  },
  'mob-universal-links': {
    context: 'O esquema `banco://transferir?para=…&valor=…` abre a transferência já preenchida. Qualquer página consegue montar esse link.',
    concept: [
      '**Esquemas de URL** próprios podem ser registrados por qualquer aplicativo e montados por qualquer página. **Universal Links** ligam o link a um domínio, verificado por um arquivo publicado pelo dono, e só abrem o aplicativo associado.',
      'Mesmo com Universal Links, o link é entrada não confiável: valide o caminho e os parâmetros, exija a sessão do aplicativo e confirmação explícita para qualquer ação, e deixe a decisão final com o servidor.',
    ],
    validation: 'Monte, em uma página de teste, um link com valores forjados: o aplicativo pode abrir a tela, mas não pode executar a ação sem autenticação e confirmação. Confira o arquivo de associação de domínio.',
    review: [
      { front: 'Qual a vantagem dos Universal Links sobre esquemas próprios?', back: 'Só o aplicativo associado ao domínio verificado abre o link.' },
      { front: 'Universal Links tornam os parâmetros confiáveis?', back: 'Não. Qualquer página pode montar o link; os parâmetros continuam sendo entrada não confiável.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-939' }, { framework: 'masvs', id: 'MASVS-PLATFORM' }],
  },
  'mob-ios-webview-ats': {
    context: 'Uma chamada de homologação falhava por usar HTTP. A solução do dia foi permitir carregamentos arbitrários no Info.plist, e a configuração foi junto para a produção.',
    concept: [
      'O **App Transport Security** (ATS) exige conexões seguras por padrão. Desligá-lo de forma global, com `NSAllowsArbitraryLoads`, permite tráfego sem criptografia para qualquer destino. Exceções, quando inevitáveis, são específicas a um domínio e justificadas.',
      'Na **WKWebView**, restrinja os destinos carregados e os manipuladores de mensagens que a página pode chamar. O que a página pode chamar fica sob controle de quem controla a página.',
    ],
    example: {
      title: 'Exceção específica, e não global (Info.plist)',
      language: 'plist',
      code: ['<key>NSAppTransportSecurity</key>', '<dict>', '  <key>NSExceptionDomains</key>', '  <dict>', '    <key>legado.parceiro.example</key>', '    <dict><key>NSExceptionAllowsInsecureHTTPLoads</key><true/></dict>', '  </dict>', '</dict>'],
      caption: 'Se uma exceção for inevitável, ela vale só para um domínio e tem prazo para sair.',
    },
    validation: 'Confira o Info.plist do pacote de release: não deve haver `NSAllowsArbitraryLoads`. Intercepte o tráfego em um aparelho de teste: nenhuma conexão deve ser sem criptografia.',
    review: [
      { front: 'O que faz `NSAllowsArbitraryLoads`?', back: 'Desliga a exigência de conexões seguras do ATS para todos os destinos.' },
      { front: 'Como tratar um destino que ainda usa HTTP?', back: 'Migrar para HTTPS; se for inevitável, uma exceção específica ao domínio, com prazo.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-319' }, { framework: 'masvs', id: 'MASVS-NETWORK' }],
  },
  'mob-ios-backups': {
    context: 'Um aplicativo de saúde guardava os PDFs de exames em uma pasta incluída no backup do computador, sem criptografia.',
    concept: [
      'No iOS, arquivos recebem uma **classe de proteção de dados** que define quando ficam cifrados (por exemplo, sempre que o aparelho está bloqueado). Arquivos sensíveis usam as classes mais restritas.',
      'Arquivos que não devem ir para backup são marcados para exclusão, e dados que podem ser baixados de novo não precisam ser guardados. Backups feitos pelo computador podem ficar sem criptografia, dependendo da configuração da pessoa.',
    ],
    validation: 'Confira a classe de proteção dos arquivos sensíveis e se estão marcados para exclusão do backup. Faça um backup de teste e procure os arquivos: não devem aparecer.',
    review: [
      { front: 'O que define uma classe de proteção de dados no iOS?', back: 'Quando o arquivo fica cifrado, por exemplo, sempre que o aparelho está bloqueado.' },
      { front: 'Por que excluir arquivos sensíveis do backup?', back: 'Porque backups podem ficar sem criptografia e fora do controle do aplicativo.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-STORAGE' }],
  },
  'mob-login-biometria': {
    context: 'Para confirmar uma transferência, o aplicativo pede a biometria e envia `confirmadoPorBiometria: true`. O servidor acredita no campo.',
    concept: [
      'A biometria é verificada pelo sistema do aparelho e serve para **liberar um segredo local**, e não para provar algo ao servidor. Um campo dizendo "biometria feita" pode ser enviado por qualquer cliente.',
      'O padrão correto liga a biometria a uma chave guardada no aparelho (Keystore ou Keychain), que só é usada depois da biometria. O servidor envia um desafio, o aparelho assina com essa chave, e o servidor confere a assinatura.',
    ],
    validation: 'Envie ao servidor o pedido com `confirmadoPorBiometria: true` e sem assinatura: deve ser recusado. Envie com a assinatura de outro desafio: deve ser recusado. Troque a biometria cadastrada no aparelho e confirme que a chave é invalidada.',
    review: [
      { front: 'A biometria prova a identidade ao servidor?', back: 'Não sozinha. Ela libera uma chave local; a prova ao servidor é a assinatura feita com essa chave.' },
      { front: 'Por que o servidor envia um desafio?', back: 'Para que a assinatura não possa ser reutilizada de outro pedido.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-AUTH' }, { framework: 'cwe', id: 'CWE-602' }],
  },
  'mob-oauth-app': {
    context: 'O aplicativo mostra o login do provedor de identidade dentro de uma WebView própria e guarda a senha "para facilitar".',
    concept: [
      'Para aplicativos nativos, o recomendado é o fluxo de **código de autorização com PKCE**, aberto no **navegador do sistema** (ou nas sessões de autenticação que o sistema oferece). Assim a senha nunca passa pelo aplicativo, e a pessoa reaproveita a sessão do provedor.',
      'O endereço de retorno é exato (de preferência um link verificado do domínio), o `state` liga a resposta ao pedido, e os tokens ficam no armazenamento protegido. WebViews próprias para login permitem ao aplicativo capturar a senha e não são recomendadas.',
    ],
    validation: 'Confira que o login abre no navegador do sistema, que a troca do código exige o verificador do PKCE e que o retorno é exato. Procure a senha no armazenamento e nos registros do aplicativo: não deve existir.',
    review: [
      { front: 'Por que usar o navegador do sistema para o login?', back: 'Para que a senha não passe pelo aplicativo e a sessão do provedor seja reaproveitada.' },
      { front: 'Que fluxo é recomendado para aplicativos nativos?', back: 'Código de autorização com PKCE.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-AUTH' }, { framework: 'cwe', id: 'CWE-601' }],
  },
  'mob-tls': {
    context: 'Um cliente HTTP criado para homologação aceitava qualquer certificado e foi parar na versão publicada.',
    concept: [
      'O HTTPS só protege se o aplicativo **validar** o certificado e o nome do servidor. Um cliente que aceita qualquer certificado permite que qualquer intermediário leia e altere o tráfego.',
      'Use a validação padrão do sistema, sem tráfego sem criptografia em release, e certificados de teste só em builds de depuração. A **fixação de certificado** acrescenta proteção contra autoridades indevidas, mas exige plano de rotação e não corrige uma validação desligada.',
    ],
    validation: 'Coloque um proxy de interceptação com certificado próprio entre o aparelho de teste e a internet: o aplicativo de release deve recusar todas as conexões. Inclua esse teste na pipeline.',
    review: [
      { front: 'A fixação de certificado corrige uma validação desligada?', back: 'Não. Ela complementa uma validação correta e exige plano de rotação.' },
      { front: 'Como testar a validação de TLS de um aplicativo?', back: 'Com um proxy de interceptação usando um certificado próprio: o aplicativo deve recusar a conexão.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-295' }, { framework: 'owasp-mobile-top10', id: 'M5' }],
  },
  'mob-logs-notificacoes': {
    context: 'Uma paciente viu "Seu resultado de biópsia ficou pronto" na tela bloqueada, na frente dos colegas. O mesmo texto estava nos registros do aparelho.',
    concept: [
      'Dados sensíveis saem do aplicativo por caminhos laterais: **registros do sistema**, **notificações** na tela bloqueada, **imagem do seletor** de aplicativos, **capturas de tela** e **área de transferência**.',
      'As correções são simples: registrar sem conteúdo em release, notificações genéricas com detalhe só depois do desbloqueio, ocultar telas sensíveis no seletor e em capturas, e não copiar dados sensíveis para a área de transferência.',
    ],
    validation: 'Em um aparelho de teste, receba uma notificação com a tela bloqueada, abra os registros do sistema, abra o seletor de aplicativos em uma tela sensível e copie um dado: nenhum desses caminhos deve mostrar dados sensíveis.',
    review: [
      { front: 'Cite três caminhos laterais por onde dados saem de um aplicativo.', back: 'Registros, notificações e imagem do seletor (também capturas e área de transferência).' },
      { front: 'Como deve ser uma notificação sobre dado sensível?', back: 'Genérica na tela bloqueada, com o detalhe só dentro do aplicativo.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M6' }, { framework: 'cwe', id: 'CWE-532' }],
  },
  'mob-privacidade-sdks': {
    context: 'Um SDK de análise de uso recebia o nome do medicamento comprado em cada evento. Ninguém tinha revisado o que o evento levava.',
    concept: [
      'Cada **SDK** embutido roda com as permissões do aplicativo e pode coletar e enviar dados. A empresa responde pelo que o aplicativo envia, inclusive por meio de terceiros.',
      'Minimizar começa por perguntar o que cada evento precisa levar. Mantenha uma lista de SDKs aprovados, revise o que cada um coleta, use propriedades aprovadas nos eventos e declare corretamente as práticas de privacidade nas lojas.',
    ],
    validation: 'Capture os eventos enviados por cada SDK em um aparelho de teste: nenhum deve levar dados pessoais ou de saúde além do aprovado. Confira se a lista de SDKs aprovados está atualizada.',
    review: [
      { front: 'Por que a empresa responde pelo que um SDK envia?', back: 'Porque o SDK roda dentro do aplicativo dela, com as permissões dele.' },
      { front: 'Como controlar o que vai nos eventos de análise?', back: 'Com uma lista de propriedades aprovadas e revisão de cada evento novo.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M6' }, { framework: 'masvs', id: 'MASVS-PRIVACY' }],
  },
  'mob-assinatura': {
    context: 'A chave de assinatura do aplicativo ficava no repositório, acessível a todos os desenvolvedores e aos jobs da pipeline.',
    concept: [
      'A **chave de assinatura** define o que os aparelhos aceitam como legítimo: quem a tem pode publicar uma versão adulterada que se passa pela verdadeira, inclusive como atualização.',
      'A chave fica em cofre ou em serviço de assinatura, usada só pela pipeline de release, com aprovação e registro. Programas de assinatura gerenciados pelas lojas, quando disponíveis, reduzem o risco de perda e de vazamento.',
    ],
    validation: 'Procure a chave no repositório e no histórico: não deve existir. Confira quem pode usar a chave e que cada uso fica registrado. Verifique a assinatura do pacote publicado.',
    review: [
      { front: 'Por que a chave de assinatura é tão sensível?', back: 'Porque quem a tem publica versões que os aparelhos aceitam como legítimas.' },
      { front: 'Onde a chave deve ficar?', back: 'Em cofre ou serviço de assinatura, usada só pela pipeline de release com aprovação.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M2' }, { framework: 'nist-ssdf', id: 'PS.1' }],
  },
  'mob-dependencias': {
    context: 'Um aplicativo carregava doze SDKs, três deles sem atualização havia anos e um com vulnerabilidade conhecida.',
    concept: [
      'Bibliotecas e SDKs embutidos fazem parte do aplicativo publicado. Diferente do servidor, uma correção só chega a quem atualiza o aplicativo, então dependências vulneráveis ficam em campo por mais tempo.',
      'Mantenha inventário (com versão e dono), versões fixadas, revisão de atualizações e varredura de vulnerabilidades na pipeline. Remova SDKs que não são mais usados.',
    ],
    validation: 'Gere o inventário de dependências do pacote de release e cruze com as vulnerabilidades conhecidas. Confira se cada SDK tem dono e uso atual; remova os que não têm.',
    review: [
      { front: 'Por que dependências vulneráveis ficam mais tempo em campo no mobile?', back: 'Porque a correção só chega a quem atualiza o aplicativo.' },
      { front: 'O que manter sobre as dependências de um aplicativo?', back: 'Inventário com versão e dono, versões fixadas e varredura na pipeline.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M2' }, { framework: 'owasp-top10', id: 'A03' }],
  },
  'mob-adulteracao': {
    context: 'Uma versão adulterada do aplicativo de um jogo, com moedas infinitas, circulava fora da loja.',
    concept: [
      '**Controles de resiliência** (verificação de integridade, detecção de depuração, detecção de adulteração) elevam o custo de analisar e alterar o aplicativo. Eles fazem sentido quando o valor do ataque ao aplicativo justifica, conforme o modelo de ameaça.',
      'O que importa nunca depende só deles: o saldo de moedas, a compra e a permissão ficam no servidor. Sinais de adulteração podem alimentar uma decisão de risco no servidor, sabendo que podem ser falsificados.',
    ],
    validation: 'Para cada controle de resiliência adotado, descreva que ataque ele encarece e qual controle no servidor protege o mesmo ativo. Ativos protegidos só no aplicativo viram itens a corrigir.',
    review: [
      { front: 'Quando controles de resiliência fazem sentido?', back: 'Quando o valor do ataque ao aplicativo justifica o custo, conforme o modelo de ameaça.' },
      { front: 'Como usar sinais de adulteração no servidor?', back: 'Como um fator de risco a mais, sabendo que podem ser falsificados.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M7' }, { framework: 'masvs', id: 'MASVS-RESILIENCE' }],
  },
  'mob-limites-ofuscacao': {
    context: 'Um fornecedor prometeu que ofuscação e detecção de root "resolvem a segurança do aplicativo".',
    concept: [
      'A **ofuscação** dificulta a leitura do código; a **detecção de root ou jailbreak** tenta perceber aparelhos modificados. Ambas podem ser contornadas por quem tiver tempo, e nenhuma protege dados guardados de forma errada nem decisões que deveriam estar no servidor.',
      'Elas são camadas a mais, úteis em alguns contextos. Bloquear aparelhos modificados também atinge pessoas legítimas. A pergunta certa é: se o controle for contornado, o que continua protegido?',
    ],
    validation: 'Liste o que o aplicativo protege com ofuscação e detecção de root. Para cada item, confira se há um controle no servidor ou no armazenamento protegido que continua valendo se essas camadas forem contornadas.',
    review: [
      { front: 'Ofuscação protege um segredo embutido no aplicativo?', back: 'Não de forma confiável; o segredo pode ser extraído. Segredos não devem estar no aplicativo.' },
      { front: 'Qual o efeito colateral de bloquear aparelhos com root?', back: 'Atinge pessoas legítimas e pode ser contornado por quem quer atacar.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M7' }, { framework: 'masvs', id: 'MASVS-RESILIENCE' }],
  },
  'mob-top10': {
    context: 'A revisão de um aplicativo terminou com vinte achados, e a diretoria quer saber "quais são os mais graves para mobile".',
    concept: [
      'O **OWASP Mobile Top 10** (versão final de 2024) lista riscos como uso inadequado de credenciais, cadeia de suprimentos, autenticação e autorização, validação de entrada e saída, comunicação, privacidade, proteção do binário, configuração, armazenamento e criptografia.',
      'Como lista de riscos, ele ajuda a priorizar e a comunicar. A verificação detalhada usa o MASVS (controles) e o MASTG (procedimentos de teste).',
    ],
    validation: 'Classifique os achados da última revisão nas categorias do Mobile Top 10:2024, citando a edição. Para cada categoria com achados, aponte o grupo do MASVS que traz os controles correspondentes.',
    review: [
      { front: 'Qual a relação entre o Mobile Top 10, o MASVS e o MASTG?', back: 'O Top 10 lista riscos; o MASVS traz controles; o MASTG traz procedimentos de teste.' },
      { front: 'Que edição do Mobile Top 10 é usada aqui?', back: 'A versão final de 2024.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M1' }, { framework: 'owasp-mobile-top10', id: 'M9' }],
  },
  'mob-masvs': {
    context: 'Uma empresa quer um critério comum para aprovar os aplicativos de várias equipes.',
    concept: [
      'O **MASVS** organiza controles de segurança mobile em grupos: armazenamento, criptografia, autenticação e autorização, rede, interação com a plataforma, qualidade do código, resiliência e privacidade.',
      'Use os grupos como referência para escolher os controles que se aplicam a cada aplicativo, conforme o risco. Nem todo aplicativo precisa dos controles de resiliência; todo aplicativo precisa dos de armazenamento, rede e autenticação.',
    ],
    validation: 'Para um aplicativo, escolha os controles de cada grupo que se aplicam e justifique os que ficaram de fora. Cada controle escolhido precisa de um teste correspondente.',
    review: [
      { front: 'Cite quatro grupos do MASVS.', back: 'Armazenamento, rede, autenticação e privacidade (também: criptografia, plataforma, código e resiliência).' },
      { front: 'Todo aplicativo precisa dos controles de resiliência?', back: 'Não. Eles dependem do modelo de ameaça; armazenamento, rede e autenticação valem para todos.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-STORAGE' }, { framework: 'masvs', id: 'MASVS-NETWORK' }],
  },
  'mob-mastg': {
    context: 'Um auditor pergunta como a equipe comprovou que o aplicativo não guarda tokens em armazenamento comum.',
    concept: [
      'O **MASTG** é o guia de testes de segurança mobile: descreve técnicas e procedimentos para verificar os controles do MASVS em Android e iOS, com análise estática, dinâmica e de rede.',
      'Cada controle escolhido vira um procedimento: o que preparar, o que executar e o que observar. O resultado registrado é a evidência de que o controle funciona.',
    ],
    validation: 'Para três controles escolhidos (armazenamento, rede e autenticação), escreva o procedimento de teste a partir do guia, execute em um aparelho ou emulador de teste (opcional nesta plataforma) e registre a evidência.',
    review: [
      { front: 'Para que serve o MASTG?', back: 'Para testar, com procedimentos detalhados, os controles do MASVS.' },
      { front: 'O que transforma um teste em evidência?', back: 'O registro do que foi preparado, executado e observado.' },
    ],
    links: [{ label: 'OWASP MASTG', url: 'https://mas.owasp.org/MASTG/' }],
  },
  'mob-revisao-android': {
    context: 'O aplicativo Android de uma farmácia vai ser publicado na semana que vem. Você recebe o pacote de release e o código.',
    concept: [
      'Uma revisão Android de ponta a ponta percorre: o **manifesto** (depuração, backup, permissões, componentes exportados), o **armazenamento** (onde ficam tokens e dados), os **links e intents** (o que entra de fora), as **WebViews**, a **rede** (validação de TLS, configuração de rede) e as **dependências**.',
      'Cada achado diz o que foi visto, onde, o impacto e a correção, e indica se a correção é no aplicativo, no servidor ou nos dois.',
    ],
    validation: 'Use uma lista de verificação com os seis blocos e, para cada item, a evidência encontrada. Confira que nenhum controle de segurança depende só do aplicativo.',
    review: [
      { front: 'Quais blocos uma revisão Android cobre?', back: 'Manifesto, armazenamento, links e intents, WebViews, rede e dependências.' },
      { front: 'O que todo achado deve dizer?', back: 'O que foi visto, onde, o impacto, a correção e se ela é no aplicativo, no servidor ou nos dois.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-PLATFORM' }, { framework: 'owasp-mobile-top10', id: 'M8' }],
  },
  'mob-revisao-ios': {
    context: 'O aplicativo iOS da mesma farmácia segue para revisão, com o pacote e o código.',
    concept: [
      'Uma revisão iOS percorre: o **Info.plist** (ATS, permissões e justificativas, esquemas de URL), os **entitlements** (domínios associados, grupos de Keychain), o **armazenamento** (Keychain e classes de proteção, UserDefaults, arquivos e backup), os **links**, as **WebViews** e a **rede**.',
      'Como no Android, a pergunta final é o que fica no servidor: autorização, decisões de negócio e validação das confirmações.',
    ],
    validation: 'Use uma lista com os blocos do iOS e registre a evidência de cada item. Confira o Info.plist do pacote de release, e não só o do projeto.',
    review: [
      { front: 'Que configurações do Info.plist revisar?', back: 'ATS, permissões e justificativas e esquemas de URL.' },
      { front: 'Onde procurar tokens mal guardados no iOS?', back: 'No UserDefaults e nos arquivos do aplicativo, em vez do Keychain.' },
    ],
    refs: [{ framework: 'masvs', id: 'MASVS-STORAGE' }, { framework: 'masvs', id: 'MASVS-NETWORK' }],
  },
  'mob-projeto-final': {
    context: 'Aplicativo e backend vão ser revisados juntos antes de uma auditoria. A diretoria quer saber, para cada risco, onde está o controle.',
    concept: [
      'A revisão integrada divide os controles: **no aplicativo** (armazenamento protegido, validação de TLS, links sem credencial, dados fora de notificações e registros), **no servidor** (autorização, decisões de negócio, confirmações assinadas, limites) e **na distribuição** (chave de assinatura, SDKs aprovados).',
      'Nenhum controle no aparelho substitui uma decisão no servidor. A entrega é uma tabela de riscos com o controle, o lugar e o teste de cada um.',
    ],
    validation: 'Entregue a tabela de riscos, controles, lugar (aplicativo, servidor, distribuição) e teste. Para cada controle no servidor, rode o teste a partir de um cliente forjado.',
    review: [
      { front: 'Em que três lugares ficam os controles de um aplicativo com backend?', back: 'No aplicativo, no servidor e na distribuição.' },
      { front: 'Como testar um controle do servidor?', back: 'Chamando-o a partir de um cliente forjado, que finge o que o aplicativo enviaria.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M3' }, { framework: 'masvs', id: 'MASVS-AUTH' }],
  },
}
