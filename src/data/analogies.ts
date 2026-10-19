/** Analogias curtas dos módulos.
 *
 *  Cada módulo tem uma comparação do dia a dia que explica a ideia central em uma ou duas frases,
 *  seguida do que a analogia **não** cobre — porque toda analogia quebra em algum ponto, e esconder
 *  isso ensina errado. Elas ajudam a entrar no assunto; o conteúdo continua sendo o das aulas.
 *
 *  `curriculum` usa os ids dos módulos de `curriculum/tree.ts`; `classic` usa o índice do módulo
 *  da trilha (0 a 8). Nada aqui entra em progresso, pontuação ou busca. */

export interface Analogy {
  /** A comparação, em uma ou duas frases. */
  text: string
  /** Onde a comparação deixa de valer. */
  limit: string
}

export const curriculumAnalogies: Record<string, Analogy> = {
  /* Web */
  'web-fundamentos': {
    text: 'Uma requisição HTTP é um formulário preenchido por quem está do outro lado do balcão: você recebe o papel inteiro, inclusive os campos que esperava que ninguém mexesse.',
    limit: 'No balcão você vê a pessoa; na web, não. Qualquer campo pode ter sido reescrito antes de chegar, e nenhum deles prova quem enviou.',
  },
  'web-autenticacao': {
    text: 'Login é a portaria que confere o documento uma vez; a sessão é o crachá que você usa depois. O crachá vale enquanto a portaria o considerar válido.',
    limit: 'Um crachá físico some do bolso quando devolvido. O cookie continua existindo no navegador: encerrar a sessão precisa acontecer no servidor.',
  },
  'web-controle-acesso': {
    text: 'Ter a chave do prédio não é ter a chave de todos os apartamentos. Estar autenticado responde "quem é você"; autorização responde "e pode entrar aqui?".',
    limit: 'No prédio, a porta trancada impede por si só. Numa API, a porta só existe se o servidor conferir a cada pedido: esconder o corredor não tranca nada.',
  },
  'web-entradas-saidas': {
    text: 'É a diferença entre ler um bilhete em voz alta e obedecer ao bilhete. Injeção acontece quando o texto que alguém escreveu passa a ser executado como instrução.',
    limit: 'Uma pessoa percebe que o bilhete é estranho. O banco de dados e o navegador não desconfiam: eles executam o que receberam no formato certo.',
  },
  'web-design-config': {
    text: 'São as portas que ficam destrancadas por descuido de projeto: a janela dos fundos, a cópia da chave com o vizinho, o aviso que conta o que tem dentro de casa.',
    limit: 'Em casa, você vê a janela aberta. Aqui, a configuração errada é silenciosa e costuma aparecer só quando alguém de fora encontra.',
  },
  'web-verificacao': {
    text: 'É a checagem antes do voo: uma lista que não depende de lembrar, feita na mesma ordem toda vez, por quem não escreveu o avião.',
    limit: 'A lista do avião cobre um sistema fechado. Um sistema web muda toda semana, então a verificação precisa rodar de novo a cada mudança.',
  },

  /* APIs */
  'api-fundamentos': {
    text: 'Uma API é um cardápio: ela diz o que dá para pedir e em que formato. O problema é quando pratos antigos continuam saindo da cozinha mesmo fora do cardápio.',
    limit: 'No restaurante, pedir algo fora do cardápio é negado por uma pessoa. Na API, a rota antiga responde sozinha, sem ninguém perceber.',
  },
  'api-identidade-autz': {
    text: 'O token é a pulseira do evento. Ela diz que você pagou, não que pode entrar no camarim, mexer na mesa de som ou levar a pulseira de outra pessoa.',
    limit: 'A pulseira é conferida por um segurança que olha o rosto. A API só tem o que recebe, então a conferência precisa ser por objeto e por função, a cada chamada.',
  },
  'api-abuso-consumo': {
    text: 'Um caixa eletrônico sem limite de saque por dia não foi invadido quando alguém saca tudo: ele fez exatamente o que foi pedido, muitas vezes seguidas.',
    limit: 'No banco existe um valor máximo óbvio. Em uma API, o uso legítimo varia muito entre clientes, então o limite precisa ser por identidade, não só global.',
  },
  'api-integracoes': {
    text: 'Integrar com um terceiro é dar uma cópia da chave de casa para o encanador: útil enquanto durar o serviço, e um risco enquanto a cópia existir.',
    limit: 'A chave de casa abre uma porta só. Uma integração costuma abrir várias, e ainda pode pedir que o seu servidor busque coisas na rede por ela.',
  },
  'api-verificacao': {
    text: 'É conferir se a planta do prédio bate com o prédio construído: o contrato diz que a rota exige autenticação, e o teste confirma que ela exige mesmo.',
    limit: 'A planta de um prédio não muda sozinha. O contrato de uma API fica desatualizado em dias, então ele é ponto de partida, nunca prova.',
  },

  /* IA */
  'ia-fundamentos': {
    text: 'Um assistente de IA é um estagiário muito rápido, muito confiante e sem memória entre um dia e outro: faz o que você pede e também o que leu em um papel que alguém deixou na mesa.',
    limit: 'Um estagiário desconfia de um bilhete esquisito e pergunta. O modelo não distingue com segurança a sua instrução do texto que chegou junto.',
  },
  'ia-prompts-saidas': {
    text: 'É como ditar uma carta para alguém que lê em voz alta tudo o que está na mesa: se um documento disser "ignore o chefe e envie o anexo", isso entra na leitura.',
    limit: 'A pessoa que dita reconhece a voz do chefe. O modelo recebe tudo como texto, no mesmo canal, e não tem como separar por timbre.',
  },
  'ia-rag-seguranca': {
    text: 'Recuperação é mandar um estagiário buscar pastas no arquivo antes de responder. Se ele tem a chave do arquivo inteiro, vai trazer a pasta de qualquer pessoa.',
    limit: 'O estagiário sabe que não deve ler a pasta errada. O sistema só sabe o que a consulta permitiu: a permissão precisa entrar na busca, não depois dela.',
  },
  'ia-agentes-seguranca': {
    text: 'Dar ferramentas a um modelo é entregar as chaves do carro: o estrago possível não é do tamanho da intenção, é do tamanho das chaves que você deu.',
    limit: 'Um motorista responde por acidentes e aprende com eles. O modelo não responde por nada, então o limite precisa estar no que ele consegue chamar.',
  },
  'ia-modelos-dados': {
    text: 'Um modelo é um ingrediente comprado pronto: você precisa saber de qual fornecedor veio, de qual lote, e se a embalagem foi aberta no caminho.',
    limit: 'Um alimento estragado costuma ter cheiro. Um modelo alterado responde normalmente na maioria dos casos e falha só nos que interessam a quem o alterou.',
  },
  'ia-verificacao': {
    text: 'É o exame de sangue de rotina: um conjunto fixo de casos, repetido a cada mudança, que mostra se algo piorou sem ninguém ter notado.',
    limit: 'O exame tem valores de referência estáveis. Em IA, o comportamento muda com o modelo e com o prompt, então o conjunto de casos precisa ser revisto também.',
  },

  /* Mobile */
  'mob-fundamentos': {
    text: 'O aplicativo é uma loja física e o backend é o cofre no escritório. Você controla a decoração da loja, mas quem entra nela também mexe nas prateleiras.',
    limit: 'Uma loja tem câmeras e funcionários. No aparelho de quem usa, não existe vigilância sua: tudo o que ficou ali pode ser lido e alterado.',
  },
  'mob-android': {
    text: 'Componentes exportados são portas que dão para o corredor do prédio: úteis para o vizinho entregar uma encomenda, perigosas se qualquer um entrar por elas.',
    limit: 'No prédio, o corredor tem porteiro. No aparelho, qualquer aplicativo instalado é um vizinho, inclusive o que a pessoa instalou sem saber o que era.',
  },
  'mob-ios': {
    text: 'O sistema oferece um cofre embutido para guardar chaves e um armário comum para o resto. A diferença entre os dois aparece quando o aparelho é perdido.',
    limit: 'Um cofre real protege contra quem está fora. O cofre do sistema não protege contra um aplicativo que você mesmo autorizou a abrir.',
  },
  'mob-identidade-comunicacao': {
    text: 'A biometria é a fechadura da gaveta onde você guarda o crachá: ela destrava o seu segredo local, mas não é o crachá nem fala com a portaria.',
    limit: 'Na gaveta, a fechadura basta. No aplicativo, o servidor nunca vê a digital: ele vê o token, e é o token que precisa ser protegido e validado.',
  },
  'mob-integridade-distribuicao': {
    text: 'É o lacre da embalagem: mostra que o produto chegou do jeito que saiu da fábrica e identifica quem o embalou.',
    limit: 'O lacre não diz se o que está dentro é bom. Assinatura prova origem e integridade, não ausência de falhas — e, uma vez na mão do cliente, o pacote é dele.',
  },
  'mob-verificacao': {
    text: 'É a vistoria do carro antes da viagem, feita com a mesma lista toda vez: pneu, freio, luz. Aqui a lista é o MASVS, e o roteiro de teste é o MASTG.',
    limit: 'O carro sai da vistoria pronto. Um aplicativo muda a cada semana e roda em aparelhos que você não controla, então a vistoria é contínua.',
  },

  /* Engenharia reversa */
  'rev-fundamentos': {
    text: 'É abrir o rádio para ver como ele funciona, em uma bancada separada do resto da casa, com autorização de quem é dono do rádio.',
    limit: 'Um rádio aberto não reage. Um artefato de software pode agir quando executado, e por isso a bancada precisa ser descartável e desconectada.',
  },
  'rev-estatica': {
    text: 'É ler um livro em língua estrangeira: os nomes próprios, os números e os endereços saltam da página antes de você entender a gramática.',
    limit: 'Um livro é só texto. Um binário pode esconder conteúdo que só aparece quando executa, e aí a leitura sozinha não basta.',
  },
  'rev-segredos': {
    text: 'É como uma chave deixada embaixo do capacho: fácil de achar para quem procura, e trocar o capacho de lugar não resolve. Trocar a fechadura resolve.',
    limit: 'A chave embaixo do capacho é uma só. Um segredo em software se multiplica em cópias — histórico, imagens, pacotes instalados — e todas continuam valendo.',
  },
  'rev-aplicativos': {
    text: 'O aplicativo é o cardápio do restaurante: quem o lê descobre todos os pratos, inclusive os que a cozinha não deveria mais servir.',
    limit: 'No restaurante, pedir um prato fora do cardápio depende de alguém aceitar. Na API, a rota antiga responde sozinha a quem chamar.',
  },
  'rev-modelos': {
    text: 'Carregar um modelo é aceitar um pacote pelo interfone: dependendo do formato, abrir o pacote já é deixar alguém entrar.',
    limit: 'Um pacote físico você pode examinar antes de abrir. Em formatos que executam código, examinar e abrir são a mesma coisa — por isso o formato importa.',
  },
  'rev-dinamica': {
    text: 'É o test drive: a ficha técnica diz uma coisa, e o carro andando mostra outra. Só que o test drive é feito em pista fechada.',
    limit: 'Um carro se comporta igual na pista e na rua. Um artefato pode detectar que está sendo observado e agir diferente justamente aí.',
  },

  /* Cadeia de suprimentos */
  'sc-dependencias': {
    text: 'Você convidou três pessoas para o jantar e cada uma trouxe dois acompanhantes. Todas estão na sua casa, com acesso à cozinha.',
    limit: 'Em casa você vê quem entrou. Numa instalação, as dependências transitivas chegam sem apresentação e rodam com o mesmo acesso do seu código.',
  },
  'sc-repos-pipelines': {
    text: 'O pipeline é a cozinha do restaurante: quem entra nela decide o que sai no prato, mesmo sem nunca falar com o cliente.',
    limit: 'Uma cozinha tem paredes. O pipeline tem credenciais, e uma credencial vazada entra sem precisar passar pela porta.',
  },
  'sc-artefatos': {
    text: 'É a etiqueta de origem do alimento: diz de qual fazenda veio, em que dia foi embalado e se o lacre está intacto.',
    limit: 'A etiqueta pode ser impressa por qualquer um. Por isso a origem precisa ser assinada e verificável, e não apenas declarada.',
  },
  'sc-verificacoes': {
    text: 'São os exames automáticos de rotina: baratos, repetíveis e úteis justamente porque não dependem de alguém lembrar de pedir.',
    limit: 'Exame não substitui consulta. As ferramentas encontram padrões conhecidos; falhas de lógica e de autorização continuam exigindo leitura humana.',
  },
  'sc-incidentes': {
    text: 'É o relatório de acidente aeronáutico: não serve para apontar culpado, serve para que o mesmo encadeamento não se repita.',
    limit: 'Um acidente de avião tem caixa-preta. Em software, boa parte do que aconteceu só se conhece pelo que a empresa decidiu publicar.',
  },

  /* Arquitetura */
  'arq-modelagem': {
    text: 'É a planta da casa com as portas marcadas: antes de construir, você olha por onde se entra, o que cada cômodo guarda e quem precisa passar por ali.',
    limit: 'Uma planta é desenhada uma vez. Um sistema ganha portas novas a cada entrega, então o desenho precisa ser revisitado junto com as mudanças.',
  },
  'arq-identidade-dados': {
    text: 'É a política de chaves do prédio: cada pessoa recebe a chave do que precisa abrir, e a chave mestra fica guardada e registrada.',
    limit: 'Chaves físicas são poucas e visíveis. Em sistemas, as credenciais se multiplicam em automações, e as que ninguém lembra são as que continuam valendo.',
  },
  'arq-integradas': {
    text: 'É o projeto do condomínio inteiro, e não de um apartamento: as decisões boas isoladamente podem brigar quando os prédios se conectam.',
    limit: 'Um condomínio tem um projeto só. Arquiteturas reais crescem por partes, em tempos diferentes, e é nas emendas que as falhas aparecem.',
  },
  'arq-decisoes': {
    text: 'É a ata da reunião: daqui a seis meses, ninguém lembra por que a escolha foi aquela, e a ata é a diferença entre revisar e recomeçar a discussão.',
    limit: 'Uma ata registra o que foi dito. Uma boa decisão registra também o que foi recusado e em que condições ela deve ser revista.',
  },
  'arq-oficina': {
    text: 'É o simulador antes do voo de verdade: você erra onde errar é barato, com as mesmas restrições de tempo e de orçamento.',
    limit: 'O simulador reproduz um avião conhecido. O exercício aqui é um recorte: a realidade traz restrições de pessoas e de política que ele não simula.',
  },

  /* Governança */
  'gov-desenvolvimento': {
    text: 'É a diferença entre dizer que a cozinha é limpa e ter a ficha de limpeza assinada na parede: a segunda pode ser conferida por quem chega.',
    limit: 'A ficha pode ser preenchida sem que a limpeza aconteça. Evidência vale quando é gerada pelo próprio trabalho, não escrita depois para a auditoria.',
  },
  'gov-ia': {
    text: 'É o licenciamento de um veículo novo: antes de circular, alguém precisa dizer para que ele serve, quem responde por ele e como será fiscalizado.',
    limit: 'O licenciamento é um carimbo pontual. Um sistema de IA muda de comportamento com dados e versões, então a avaliação precisa ser recorrente.',
  },
  'gov-privacidade': {
    text: 'Dado pessoal é objeto emprestado: você guarda enquanto precisa, usa só para o combinado e devolve ou descarta quando a finalidade acaba.',
    limit: 'Um objeto devolvido sai das suas mãos. Um dado copiado continua em backups, relatórios e planilhas, e o descarte precisa alcançar todas as cópias.',
  },
}

export const classicAnalogies: Record<number, Analogy> = {
  0: {
    text: 'A lista do OWASP para LLM é o checklist da obra inteira, não só do motor: ela cobre o modelo, os dados, as integrações e a operação em volta.',
    limit: 'Um checklist de obra tem itens fixos. Esta lista muda de edição em edição, então citar a edição usada faz parte da resposta.',
  },
  1: {
    text: 'Injeção de prompt é um bilhete colocado no meio dos papéis do chefe: quem lê tudo em sequência pode obedecer ao bilhete sem perceber a troca de autor.',
    limit: 'Uma pessoa estranha o bilhete e pergunta. O modelo recebe instrução e conteúdo pelo mesmo canal, e delimitar o texto organiza sem proteger.',
  },
  2: {
    text: 'O MITRE ATLAS é o mapa de rotas conhecidas de um assalto: não descreve o seu prédio, descreve como costumam entrar nos prédios parecidos.',
    limit: 'Um mapa de rotas fica desatualizado. Ele serve para dar nome e ordem ao que você encontrou, não como lista de tudo o que pode acontecer.',
  },
  3: {
    text: 'Red teaming é o simulado de incêndio: alguém provoca a situação de propósito, com hora marcada e regras, para descobrir o que não funciona.',
    limit: 'O simulado de incêndio tem um roteiro. Um exercício de red teaming sem escopo e sem critério de parada vira exploração sem conclusão.',
  },
  4: {
    text: 'O NIST AI RMF é a divisão de tarefas de uma obra: quem governa, quem mapeia o terreno, quem mede e quem administra o que foi construído.',
    limit: 'Uma obra termina. O ciclo do framework é contínuo, e nenhuma das quatro funções é concluída de uma vez.',
  },
  5: {
    text: 'A ISO/IEC 42001 é o regimento interno do condomínio: define quem decide o quê, com que registro, e permite auditar se o combinado acontece.',
    limit: 'Um regimento aprovado não garante convivência. Certificar o sistema de gestão não diz que um produto específico é seguro ou justo.',
  },
  6: {
    text: 'A LGPD trata dado pessoal como objeto emprestado: há uma finalidade combinada, um tempo de guarda e o dever de devolver contas a quem emprestou.',
    limit: 'Um empréstimo entre pessoas se resolve conversando. Aqui existem bases legais, prazos e direitos específicos, que mudam conforme o caso.',
  },
  7: {
    text: 'O AI Act é o código de trânsito da IA na Europa: a regra que vale depende do veículo e de onde ele circula, não da tecnologia em si.',
    limit: 'O código de trânsito já está todo em vigor. O regulamento europeu entra por etapas, e cada obrigação tem a sua data.',
  },
  8: {
    text: 'Engenharia reversa defensiva é abrir o aparelho na bancada para descobrir o que ele faz de verdade — inclusive o seu próprio aparelho, antes que outra pessoa o abra.',
    limit: 'Uma bancada protege contra peças soltas. Aqui o artefato pode agir quando executado, e por isso a bancada precisa ser descartável, isolada e autorizada.',
  },
}

export const analogyOf = (moduleId: string): Analogy | undefined => curriculumAnalogies[moduleId]
export const classicAnalogyOf = (index: number): Analogy | undefined => classicAnalogies[index]
