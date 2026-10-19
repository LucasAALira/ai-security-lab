import type { Lesson } from './types'

/* Aulas da área Engenharia reversa — fundamentos, análise estática e caça a segredos.
   Todo o conteúdo é defensivo: analisar o que você recebe e reduzir o que o seu produto entrega.
   Dados sintéticos: hosts terminam em `.example`, chaves e hashes são inventados. */

export const revLessons: Record<string, Lesson> = {
  /* ---------- Fundamentos ---------- */

  'rev-o-que-e': {
    context:
      'A Vértice Saúde vai embutir no aplicativo um SDK de análise de imagens de um fornecedor pequeno. O contrato está assinado, o pacote chegou, e ninguém sabe dizer o que ele faz além do que o folheto promete.',
    concept: [
      'Engenharia reversa é entender como algo funciona a partir do resultado pronto, sem ter o projeto original. Quem defende usa isso para duas coisas: **verificar o que recebe** (um SDK, uma biblioteca, um modelo, um aplicativo de parceiro) e **ver o que o próprio produto entrega** a quem o examina.',
      'Ela responde a perguntas de fato, não a promessas: com quais endereços este pacote fala, que permissões ele pede, que dados ele guarda, que segredos vieram junto. Nenhuma dessas respostas está no folheto, e quase nenhuma está na documentação.',
      'O que ela **não** faz: não prova que um artefato é inofensivo (você viu o que procurou, não tudo), não substitui contrato e revisão de fornecedor, e não corrige nada sozinha. O resultado é uma lista de fatos e hipóteses que alimenta decisões.',
    ],
    deeper: [
      'Há uma assimetria que vale internalizar desde o começo: quem publica um artefato gasta semanas escondendo coisas, e quem analisa gasta horas encontrando-as. Isso não é porque quem analisa é mais esperto; é porque o artefato precisa funcionar, e para funcionar ele precisa carregar consigo tudo de que precisa, legível pela máquina — e, portanto, legível por uma pessoa paciente.',
      'Por isso a conclusão prática desta área inteira cabe em uma frase: **presuma que tudo o que vai para o cliente pode ser lido**. A engenharia reversa é a forma de verificar que você agiu de acordo com essa premissa.',
    ],
    figure: 'triagem',
    validation:
      'Pegue um artefato que a sua equipe já usa e tente responder, só lendo o pacote, a três perguntas: com que endereços ele fala, que permissões ele pede e que credenciais vieram dentro dele. Se não conseguir responder a nenhuma, falta ferramenta ou falta roteiro; se conseguir às três, você tem uma linha de base para comparar na próxima versão.',
    review: [
      { front: 'Para que a engenharia reversa serve a quem defende?', back: 'Para verificar o que se recebe de terceiros e para ver o que o próprio produto entrega a quem o examina.' },
      { front: 'Por que ela não prova que um artefato é inofensivo?', back: 'Porque você encontra o que procurou. A ausência de achado é ausência de evidência, não evidência de ausência.' },
      { front: 'Qual é a premissa que organiza a área toda?', back: 'Tudo o que vai para o cliente pode ser lido e alterado por quem o recebe.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M2' }, { framework: 'owasp-top10', id: 'A03' }],
  },

  'rev-legalidade': {
    context:
      'Um analista da Vértice quer abrir o aplicativo de um concorrente "só para ver como eles resolveram o login". O pedido parece inofensivo e é a forma mais rápida de criar um problema jurídico para a empresa.',
    concept: [
      'Antes de abrir qualquer artefato, três perguntas precisam de resposta escrita: **de quem é isto**, **o que o contrato ou a licença permitem** e **quem autorizou a análise**. Sem as três, não se começa — e a ordem importa, porque a terceira depende das duas primeiras.',
      'O terreno seguro é largo: o que a sua empresa escreveu, o que ela comprou com direito de examinar, o que veio com licença que permite estudo, amostras entregues para análise com autorização do dono e material feito para treino. O terreno perigoso também é claro: contornar proteção técnica de terceiro, violar termos de uso aceitos, redistribuir o que você extraiu.',
      'A autorização não é um e-mail perdido: ela registra o artefato (com {{hash|hash}}), o período, o escopo (o que pode ser feito), o que não pode e quem responde pelo resultado. Esse registro protege você e dá valor ao relatório — uma análise sem autorização documentada é inútil como evidência.',
    ],
    deeper: [
      'Há uma diferença prática entre *ler* e *contornar*. Ler o que o artefato carrega consigo (textos, configuração, bibliotecas) é observação. Remover uma verificação de licença, quebrar uma proteção de cópia ou burlar um controle de integridade de terceiro é outra categoria, e a maioria dos regimes jurídicos e contratos trata essas categorias de forma diferente.',
      'No próprio produto, você pode tudo: é seu. Boa parte do aprendizado desta área se faz com os seus artefatos, e é também onde o resultado tem mais valor, porque você pode corrigir o que encontrar.',
    ],
    validation:
      'Monte um modelo de autorização de uma página com estes campos: artefato e hash, origem, quem autoriza, período, o que está no escopo, o que está fora, destino do relatório e descarte da amostra. Toda análise começa por preenchê-lo; se um campo não puder ser preenchido, essa é a sua resposta sobre começar ou não.',
    review: [
      { front: 'Quais são as três perguntas antes de abrir um artefato?', back: 'De quem é, o que a licença ou o contrato permitem e quem autorizou a análise, por escrito.' },
      { front: 'Qual é a diferença entre ler e contornar?', back: 'Ler é observar o que o artefato carrega; contornar é remover ou burlar uma proteção de terceiro, o que costuma ser tratado de forma diferente por contratos e leis.' },
      { front: 'O que a autorização registra?', back: 'Artefato e hash, origem, período, escopo, o que fica de fora, destino do relatório e descarte.' },
    ],
    refs: [{ framework: 'nist-ssdf', id: 'PS.1' }],
  },

  'rev-laboratorio': {
    context:
      'A amostra chegou em um arquivo compactado com senha, enviada por um cliente que diz "achei isso na máquina do financeiro". Abrir esse arquivo no computador de trabalho transforma uma análise em um incidente.',
    concept: [
      'O laboratório vem antes das ferramentas. Ele é uma máquina virtual descartável, com **instantâneo tirado antes** de a amostra entrar, sem credenciais da empresa, sem pastas compartilhadas com o computador real e com a rede bloqueada por padrão, liberada caso a caso e sempre registrada.',
      'A higiene é um conjunto de hábitos simples: a amostra fica em uma pasta só dela e nunca é renomeada para algo executável por engano; o {{hash|hash}} é calculado assim que ela chega e conferido no fim; o que atravessa de volta para o seu computador são anotações, capturas e hashes, nunca o artefato; e, terminada a análise, você volta ao instantâneo em vez de "limpar".',
      'A rede merece atenção própria. Muitos artefatos mudam de comportamento quando não encontram a internet, e muitos entregam a si mesmos no primeiro endereço que procuram. Registrar as tentativas de conexão com a saída fechada costuma ser mais informativo do que deixá-las passar.',
    ],
    figure: 'laboratorio',
    validation:
      'Teste o seu laboratório antes de precisar dele: dentro da máquina virtual, tente alcançar um endereço qualquer e confirme que a saída está bloqueada e registrada; tente acessar uma pasta do computador real e confirme que não existe; volte ao instantâneo e confirme que o ambiente ficou idêntico ao do começo.',
    review: [
      { front: 'O que precisa existir antes de a amostra entrar no laboratório?', back: 'Um instantâneo da máquina virtual limpa, para se voltar a ele no fim.' },
      { front: 'Por que manter a saída de rede bloqueada por padrão?', back: 'Porque registrar o que a amostra tenta procurar é informativo e evita que ela alcance quem a controla.' },
      { front: 'O que atravessa do laboratório de volta para o seu computador?', back: 'Anotações, capturas e hashes. Nunca a amostra.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-829' }],
  },

  'rev-artefatos': {
    context:
      'Na mesma semana chegam para análise: um APK de parceiro, um pacote npm que o time quer instalar, uma imagem de contêiner de um fornecedor e um arquivo de pesos de modelo baixado de um repositório público. São quatro roteiros diferentes.',
    concept: [
      'Cada tipo de artefato guarda coisas diferentes e, por isso, recompensa perguntas diferentes. Reconhecer o tipo logo no começo economiza horas: um pacote de aplicativo é um arquivo compactado com manifesto; um pacote de linguagem traz metadados e, às vezes, {{script-de-instalacao|scripts de instalação}}; uma imagem de contêiner é um empilhado de camadas com histórico de comandos; um arquivo de modelo é um contêiner de pesos que pode ou não executar código ao ser carregado.',
      'O que cada um costuma entregar: **aplicativos** entregam endereços, chaves e regras que moram no cliente; **pacotes de linguagem** entregam dependências inesperadas e código que roda na instalação; **imagens** entregam variáveis de ambiente, segredos em camadas antigas e o histórico de como foram construídas; **modelos** entregam proveniência, formato e, nos clientes de IA, o prompt de sistema inteiro.',
      'Essa correspondência não é regra rígida: ela é a ordem em que vale a pena procurar. Você começa pelo que aquele tipo quase sempre revela e só depois vai para o que ele raramente revela.',
    ],
    example: {
      title: 'A mesma pergunta, quatro artefatos',
      language: 'text',
      code: [
        'Pergunta: "com que endereços isto fala?"',
        '',
        'APK            -> recursos, strings, configuração de rede, domínios no código',
        'Pacote npm     -> dependências, scripts de instalação, chamadas de rede no código',
        'Imagem OCI     -> ENV e ARG das camadas, histórico de build, config do app',
        'Modelo .safetensors -> nada: só pesos. O endereço está no cliente que o carrega',
      ],
      caption: 'O último caso é o mais instrutivo: um formato que só guarda pesos não tem comportamento para revelar. Quem tem comportamento é o código que o carrega.',
    },
    figure: 'artefato',
    validation:
      'Faça uma tabela com os tipos de artefato que a sua empresa recebe e, para cada um, três coisas que ele costuma revelar e a ferramenta que você usaria. Quando chegar um artefato novo, a tabela diz por onde começar; quando ela não souber responder, você acabou de achar uma lacuna do seu processo.',
    review: [
      { front: 'O que uma imagem de contêiner costuma entregar?', back: 'Variáveis de ambiente, segredos em camadas antigas e o histórico dos comandos de build.' },
      { front: 'Por que um arquivo só de pesos revela pouco comportamento?', back: 'Porque ele não contém código: o comportamento está no programa que o carrega.' },
      { front: 'Para que serve classificar o artefato antes de analisar?', back: 'Para começar pelo que aquele tipo quase sempre revela, em vez de procurar em ordem aleatória.' },
    ],
    refs: [{ framework: 'owasp-top10', id: 'A03' }, { framework: 'slsa', id: 'build' }],
  },

  'rev-triagem': {
    context:
      'Duas pessoas analisam o mesmo pacote. Uma abre o desmontador na primeira hora e passa o dia lendo instruções. A outra segue um roteiro de quatro passos e, na terceira hora, já tem a chave de API, os três endereços internos e a lista de permissões.',
    concept: [
      'A triagem é um roteiro: **identificar**, **ler**, **mapear**, **observar**. Nessa ordem, porque cada passo é mais barato que o seguinte e responde a perguntas que mudam o que vale a pena fazer depois. Pular para o desmontador é começar pelo passo mais caro com a menor quantidade de contexto.',
      '**Identificar** responde "o que é isto": tipo real do arquivo (não a extensão), tamanho, {{hash|hash}} e, quando houver, {{assinatura|assinatura}}. **Ler** responde "o que ele diz de si": textos embutidos, configuração, manifesto, bibliotecas. **Mapear** responde "com o que ele fala": endereços, permissões, chaves, pontos de entrada. **Observar** responde "o que ele faz mesmo", e é o único passo que exige execução — por isso vem por último e dentro do laboratório.',
      'Entre os passos há retorno: o que você observa quase sempre manda voltar a ler com outros olhos. A triagem não é uma escada de mão única; é um ciclo que termina quando as perguntas da autorização estão respondidas.',
    ],
    deeper: [
      'Um erro comum é confundir profundidade com valor. Desmontar uma função de criptografia é trabalhoso e costuma render menos do que ler o arquivo de configuração ao lado dela. A pergunta que guia é sempre "qual é a próxima coisa mais barata que pode mudar a minha conclusão?".',
      'O outro erro é parar cedo demais com um achado bom. Encontrar uma chave de API é satisfatório, e é exatamente aí que muita análise termina — deixando passar as outras três chaves e o endereço interno que estavam no mesmo arquivo.',
    ],
    figure: 'triagem',
    validation:
      'Cronometre a própria triagem em um artefato conhecido: anote o horário ao fim de cada um dos quatro passos e o que cada passo rendeu. Se o passo "ler" rendeu menos que o passo "observar", quase sempre falta ferramenta de extração de texto, e não falta tempo.',
    review: [
      { front: 'Quais são os quatro passos da triagem, em ordem?', back: 'Identificar, ler, mapear e observar.' },
      { front: 'Por que observar vem por último?', back: 'Porque é o único passo que exige executar o artefato, e o mais caro e arriscado; os anteriores já reduziram o que precisa ser observado.' },
      { front: 'Qual pergunta guia a escolha do próximo passo?', back: 'Qual é a próxima coisa mais barata que pode mudar a minha conclusão.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M2' }],
  },

  /* ---------- Análise estática ---------- */

  'rev-identificacao': {
    context:
      'O arquivo chegou como `relatorio-2026.pdf`. O primeiro comando mostrou que ele é um executável do Windows. A extensão era a única coisa que dizia o contrário, e ninguém tinha conferido.',
    concept: [
      'A extensão é uma sugestão do nome; o tipo real está nos primeiros bytes do arquivo (o "número mágico"). Identificar começa por aí, e por uma razão prática: tudo o que você fizer depois depende do tipo, e uma hipótese errada aqui custa a análise inteira.',
      'Junto com o tipo vêm o tamanho e o {{hash|hash}}. O hash identifica a amostra sem ambiguidade no relatório, prova que ela não mudou durante a análise e permite comparar duas entregas do mesmo fornecedor. Anote-o antes de abrir qualquer coisa.',
      'Metadados completam o retrato: datas de compilação, idioma, compilador usado, {{assinatura|assinatura}} e a cadeia de certificados quando existir. Eles não provam nada sozinhos — datas se forjam —, mas uma data de compilação que não bate com a versão anunciada é uma pergunta legítima para o fornecedor.',
    ],
    example: {
      title: 'Identificação antes de qualquer outra coisa',
      language: 'text',
      code: [
        '$ file amostra.bin',
        'amostra.bin: PE32+ executable (GUI) x86-64, for MS Windows',
        '',
        '$ sha256sum amostra.bin',
        '9f2c41ab77e0d5c8b1a3e64f0cd2b9178ae45c0f31d2a8b7e6c04f91d5a3b2c8  amostra.bin',
        '',
        '# anote o hash na ficha da análise antes de abrir o arquivo',
      ],
      caption: 'O hash é o nome da amostra no relatório. Qualquer pessoa que repita a análise precisa poder confirmar que está olhando exatamente o mesmo arquivo.',
    },
    validation:
      'Para cada amostra, registre tipo real, tamanho e hash em uma ficha antes do segundo comando. No fim da análise, calcule o hash de novo: se mudou, alguma etapa alterou a amostra e as conclusões precisam ser revistas.',
    review: [
      { front: 'Por que a extensão não identifica um arquivo?', back: 'Porque ela faz parte do nome. O tipo real está nos primeiros bytes do conteúdo.' },
      { front: 'Para que serve o hash na análise?', back: 'Para identificar a amostra sem ambiguidade, provar que ela não mudou e permitir que outra pessoa confirme que olhou o mesmo arquivo.' },
      { front: 'Uma data de compilação prova quando o artefato foi feito?', back: 'Não: metadados podem ser forjados. Ela serve como pergunta, não como prova.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-347' }, { framework: 'slsa', id: 'build' }],
  },

  'rev-strings': {
    context:
      'A extração de textos do aplicativo devolveu 48 mil linhas. Quarenta e sete mil e novecentas são lixo de biblioteca. As cem que importam têm endereços internos, um caminho de desenvolvedor e uma chave.',
    concept: [
      'Textos embutidos são a camada mais barata e mais produtiva da análise estática. Tudo o que o programa precisa mostrar, procurar ou comparar está lá em algum formato: endereços, nomes de parâmetros, mensagens de erro, consultas, caminhos de arquivo, versões de biblioteca e, com frequência desconfortável, credenciais.',
      'O trabalho não é extrair — é filtrar. Comece por padrões de alto valor: `http` e `https`, domínios internos, `Authorization`, `Bearer`, `password`, `secret`, `token`, `BEGIN PRIVATE KEY`, nomes de provedores de nuvem, prefixos conhecidos de chave. Depois varra por formato: cadeias longas em base64, hexadecimais de 32 ou 64 caracteres, blocos com estrutura de JWT.',
      'Dois cuidados de interpretação. O primeiro: textos vêm de bibliotecas tanto quanto do código próprio, e atribuir ao fornecedor o que é de uma biblioteca pública é um erro que destrói a credibilidade do relatório. O segundo: um texto que parece credencial pode ser exemplo, teste ou valor morto — confirmar é outro assunto, tratado na aula sobre reconhecer segredos.',
    ],
    example: {
      title: 'Filtrar antes de ler',
      language: 'text',
      code: [
        '$ strings -n 8 app.bin > textos.txt',
        '$ wc -l textos.txt',
        '48213 textos.txt',
        '',
        '# 1) alto valor primeiro',
        '$ grep -niE "https?://|authorization|bearer|secret|api[_-]?key|BEGIN .*PRIVATE KEY" textos.txt',
        'api-interna.vertice.example/v2/clientes',
        'builds.vertice.example/artefatos',
        'X-Api-Key: ak_live_8f3b2c9d04e7',
        '',
        '# 2) depois por formato',
        '$ grep -nE "[A-Za-z0-9+/]{40,}={0,2}" textos.txt | head',
      ],
      caption: 'Três linhas úteis em 48 mil. O endereço interno e a chave valem mais do que qualquer leitura de código que viesse antes deles.',
    },
    validation:
      'Rode a sua lista de padrões contra um artefato seu que você sabe estar limpo e contra um que você plantou com uma credencial de teste. A lista precisa achar a plantada e não gerar mais do que algumas dezenas de falsos positivos; se gerar milhares, ela está genérica demais para uso real.',
    review: [
      { front: 'Por que a extração de textos é o primeiro passo da leitura?', back: 'Porque é barata e costuma entregar endereços, parâmetros e credenciais sem nenhuma análise de código.' },
      { front: 'Qual é o erro de interpretação mais comum com textos?', back: 'Atribuir ao fornecedor textos que vêm de bibliotecas públicas embutidas.' },
      { front: 'Que dois tipos de busca vale fazer?', back: 'Por palavras de alto valor (endereços, cabeçalhos de autorização, chaves) e por formato (base64 longo, hexadecimal de 32 ou 64, estrutura de JWT).' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'owasp-mobile-top10', id: 'M1' }],
  },

  'rev-dependencias-binario': {
    context:
      'O SDK de análise de imagens tem 14 MB. A lista de bibliotecas que ele carrega mostra uma de rede, uma de compressão e uma de telemetria que não aparece em lugar nenhum da documentação.',
    concept: [
      'O que um artefato importa diz o que ele pode fazer. Bibliotecas carregadas, funções importadas e símbolos exportados formam um mapa de capacidades: rede, criptografia, acesso a arquivos, execução de processos, acesso à câmera. Uma capacidade presente não prova uso, mas uma capacidade ausente **prova** que aquele comportamento não acontece ali.',
      'Esse raciocínio pela ausência é a parte mais subestimada. Se o binário não importa nenhuma função de rede e não carrega biblioteca de rede, a hipótese "ele manda os dados para fora" morre sem precisar de execução. Eliminar hipóteses rápido é o que torna a análise finita.',
      'Em código gerenciado a lista de dependências costuma vir pronta em metadados; em binários nativos ela está na tabela de importações. Em ambos, compare o que está presente com o que a documentação descreve: a telemetria não documentada do exemplo acima é exatamente o tipo de achado que vale um e-mail ao fornecedor antes de qualquer outra análise.',
    ],
    validation:
      'Liste as capacidades do artefato (rede, criptografia, arquivos, processos, sensores) a partir das bibliotecas e importações e confronte com o que o fornecedor documentou. Cada capacidade presente e não documentada vira uma pergunta; cada capacidade documentada e ausente vira outra.',
    review: [
      { front: 'O que a lista de importações de um binário revela?', back: 'As capacidades disponíveis: rede, criptografia, arquivos, processos, sensores.' },
      { front: 'Por que a ausência de uma capacidade é mais conclusiva que a presença?', back: 'Porque a presença não prova uso, mas a ausência elimina o comportamento inteiro sem precisar executar nada.' },
      { front: 'O que fazer com uma biblioteca não documentada?', back: 'Registrar como achado e perguntar ao fornecedor antes de aprofundar a análise.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M2' }, { framework: 'cwe', id: 'CWE-829' }],
  },

  'rev-bytecode': {
    context:
      'O time esperava horas de desmontagem para entender a regra de desconto do aplicativo. O código era Kotlin, compilado para {{bytecode|bytecode}}: em quinze minutos a regra estava legível, com nomes de métodos e tudo.',
    concept: [
      'Linguagens que rodam sobre uma máquina virtual (Java e Kotlin, .NET, Python) compilam para {{bytecode|bytecode}}, um formato que preserva nomes de classes, métodos e campos, tipos e estrutura de controle. Ferramentas de decompilação devolvem algo muito próximo do código original — às vezes idêntico, exceto por comentários.',
      'A consequência prática é desconfortável para quem publica: a lógica do seu cliente é legível. Regras de preço, limites, listas de servidores, condições de habilitação de recursos e verificações de licença aparecem com os nomes que os desenvolvedores escolheram.',
      '{{ofuscacao|Ofuscação}} troca os nomes por letras e embaralha o fluxo. Isso aumenta o tempo de leitura e atrapalha a busca por palavra, mas a estrutura continua lá e as cadeias de texto costumam continuar legíveis. Trate ofuscação como atrito, nunca como controle: o que não pode ser conhecido não pode ir para o cliente.',
    ],
    example: {
      title: 'O que volta de um bytecode',
      language: 'kt',
      code: [
        '// decompilado a partir do pacote publicado',
        'class PrecoService(private val api: Api) {',
        '    fun precoFinal(itens: List<Item>, cupom: String?): Int {',
        '        val base = itens.sumOf { it.preco }',
        '        // a regra de desconto mora no cliente: quem lê isto sabe o que enviar',
        '        val desconto = if (cupom == "PARCEIRO30") base * 30 / 100 else 0',
        '        return base - desconto',
        '    }',
        '}',
      ],
      caption: 'Nomes, constantes e a regra inteira voltaram. O cupom literal no cliente é um achado de duas linhas, e a correção não é esconder melhor: é calcular o preço no servidor.',
    },
    figure: 'cliente-servidor',
    validation:
      'Pegue o seu próprio pacote publicado, decompile e procure por três coisas: constantes que deveriam ser do servidor, nomes de rotas internas e qualquer condição que decida permissão. O que você encontrar é exatamente o que um analista encontraria na primeira hora.',
    review: [
      { front: 'Por que bytecode volta quase ao código original?', back: 'Porque preserva nomes, tipos e estrutura de controle, que a decompilação reconstrói.' },
      { front: 'O que a ofuscação muda de fato?', back: 'O tempo de leitura e a busca por nome. A estrutura permanece e os textos costumam continuar legíveis.' },
      { front: 'Qual é a conclusão para quem publica?', back: 'O que não pode ser conhecido não pode ir para o cliente: regras e segredos ficam no servidor.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M7' }, { framework: 'masvs', id: 'MASVS-RESILIENCE' }, { framework: 'cwe', id: 'CWE-602' }],
  },

  'rev-nativo': {
    context:
      'O binário tem 2 MB, quase nenhum texto legível e uma seção com nome estranho ocupando 90% do arquivo. Isso costuma significar que o conteúdo real está empacotado e só aparece em memória.',
    concept: [
      'Binários nativos não guardam nomes nem tipos: a {{desmontagem|desmontagem}} devolve instruções, não código-fonte. O trabalho muda de natureza — em vez de ler, você reconhece padrões: prólogos de função, chamadas conhecidas, constantes de algoritmos, laços de cópia de memória.',
      'Antes de desmontar, examine a estrutura: seções e seus tamanhos, permissões de cada uma, tabela de importações, símbolos restantes. Uma seção enorme com alta entropia e poucas importações é a assinatura clássica de conteúdo empacotado ou cifrado, que só se revela na execução — e isso muda o plano: a resposta estará na análise dinâmica, não na estática.',
      'Proteções acrescentam atrito de formas diferentes: empacotamento esconde o conteúdo até a execução, verificação de integridade detecta modificação, detecção de depurador atrapalha a observação. Nenhuma delas impede a leitura do que o programa precisa ter em memória para funcionar.',
    ],
    deeper: [
      'Vale conhecer o limite inverso também: há muito pouco a extrair de um binário nativo bem escrito que não envie nada para fora e não guarde segredo nenhum. A análise é sobre o que o artefato carrega; um artefato que carrega pouco revela pouco, e isso é uma meta de projeto alcançável.',
      'Para quem defende, a leitura prática desta aula é: se a sua proteção contra extração de um segredo é o fato de o binário ser nativo, o segredo está exposto — ele precisa estar legível em memória para ser usado.',
    ],
    validation:
      'Antes de abrir o desmontador, escreva as três perguntas que você quer responder. Se, depois de examinar seções, importações e entropia, elas puderem ser respondidas pela análise dinâmica, faça a dinâmica primeiro: desmontar sem pergunta específica consome dias.',
    review: [
      { front: 'Por que a desmontagem não devolve o código-fonte?', back: 'Porque nomes, comentários e tipos originais não estão no binário; só restam as instruções.' },
      { front: 'O que uma seção grande e de alta entropia costuma indicar?', back: 'Conteúdo empacotado ou cifrado, que só se revela em memória durante a execução.' },
      { front: 'Um binário nativo protege um segredo embutido?', back: 'Não: para ser usado, o segredo precisa estar legível em memória.' },
    ],
    refs: [{ framework: 'owasp-mobile-top10', id: 'M7' }, { framework: 'masvs', id: 'MASVS-RESILIENCE' }],
  },

  /* ---------- Caça a segredos ---------- */

  'rev-segredos-onde': {
    context:
      'A Vértice girou a chave do provedor de SMS depois de um vazamento. Três semanas depois, a chave antiga voltou a aparecer em uma tentativa de uso: ela continuava dentro de uma imagem de contêiner publicada seis meses antes.',
    concept: [
      'Um {{segredo|segredo}} é qualquer valor que dá acesso: chave de API, senha, token, chave privada, string de conexão, cookie de sessão de serviço. A pergunta útil não é "existe segredo no código?", e sim "por quantos caminhos este segredo já passou?".',
      'Os lugares que de fato rendem, em ordem de produtividade: arquivos de configuração e recursos do pacote; variáveis de ambiente embutidas na build; bundles de frontend e seus {{sourcemap|source maps}}; camadas antigas de imagens de contêiner; histórico do repositório; artefatos de build e registros de pipeline; arquivos de teste e fixtures; backups e despejos de banco; e registros de aplicação que imprimem cabeçalhos.',
      'Um detalhe que muda tudo: segredos **persistem em cópias**. Remover do código atual não remove do histórico, da imagem publicada, do artefato no registro, do cache do CDN nem do aparelho de quem já instalou. Por isso a resposta correta a um vazamento começa pela {{rotacao|rotação}}, não pela remoção.',
    ],
    figure: 'segredo',
    validation:
      'Escolha um segredo real que a sua empresa usa e trace por escrito todos os lugares em que ele existe hoje: cofre, variável de CI, imagem, pacote publicado, máquina de desenvolvedor, backup. Se a lista tiver mais de três lugares, você acabou de medir o custo de uma rotação de emergência.',
    review: [
      { front: 'Qual é a pergunta certa sobre um segredo?', back: 'Por quantos caminhos ele já passou, e não apenas se ele está no código atual.' },
      { front: 'Por que remover um segredo do código não basta?', back: 'Porque ele persiste em cópias: histórico, imagens, artefatos, caches e aparelhos já instalados.' },
      { front: 'Cite três lugares produtivos para procurar segredos.', back: 'Configuração do pacote, variáveis embutidas na build e camadas antigas de imagens de contêiner (o histórico do repositório também vale).' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'cwe', id: 'CWE-312' }, { framework: 'owasp-top10', id: 'A04' }],
  },

  'rev-segredos-padroes': {
    context:
      'A varredura devolveu 312 "segredos". Depois da triagem sobraram quatro: duas chaves vivas, uma chave de teste de um provedor de pagamento e uma chave privada de assinatura que ninguém sabia que estava ali.',
    concept: [
      'Reconhecer um segredo tem duas partes: **forma** e **contexto**. A forma é o que a varredura automática vê: prefixos conhecidos de provedores, comprimento e alfabeto típicos, cabeçalhos de chave privada, estrutura de JWT, cadeias de alta entropia. A forma gera candidatos, não conclusões.',
      'O contexto decide: o nome da variável, o arquivo em que está, o que o código faz com o valor, se ele vai para um cabeçalho de autorização, se é de um ambiente de teste, se tem marca de exemplo. Um hexadecimal de 64 caracteres pode ser uma chave viva ou o hash de um arquivo — o que o código faz com ele resolve a dúvida.',
      'A regra de ouro: **não teste o segredo dos outros**. Usar uma credencial encontrada para "confirmar se funciona" é acesso não autorizado. A confirmação legítima vem de dentro: quem é dono do sistema consulta os registros de uso daquela credencial, verifica no painel do provedor se ela está ativa, ou simplesmente a trata como viva e a gira.',
    ],
    example: {
      title: 'Candidatos e o que decide cada um',
      language: 'text',
      code: [
        'ak_live_8f3b2c9d04e7a1b6        # prefixo "live": trate como viva. Gire.',
        'ak_test_0000000000000000        # prefixo de teste e valor repetido: candidato fraco',
        '9f2c41ab...b2c8 (64 hex)        # o código compara com um arquivo: é hash, não chave',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6...  # JWT: veja se é token de exemplo ou emitido de verdade',
        '-----BEGIN PRIVATE KEY-----      # sempre achado: chave privada no pacote não tem versão inofensiva',
      ],
      caption: 'A forma levanta os cinco; o contexto elimina dois. A chave privada é o único caso em que a forma já basta para a conclusão.',
    },
    validation:
      'Monte um conjunto de teste com dez valores: quatro segredos reais de teste que você plantou, três hashes, dois exemplos de documentação e uma chave pública. Rode a sua varredura: ela precisa marcar os quatro e explicar por que descartou os outros seis. Esse conjunto vira a regressão da sua ferramenta.',
    review: [
      { front: 'O que a forma de um valor permite concluir?', back: 'Que ele é candidato. A conclusão vem do contexto: nome, arquivo e uso no código.' },
      { front: 'Por que não testar uma credencial encontrada?', back: 'Porque usar credencial de terceiro é acesso não autorizado. A confirmação vem dos registros e do painel de quem é dono.' },
      { front: 'Qual achado dispensa confirmação de contexto?', back: 'Uma chave privada dentro do pacote: não existe versão inofensiva disso.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'owasp-mobile-top10', id: 'M1' }],
  },

  'rev-segredos-bundle': {
    context:
      'O painel administrativo da Vértice é uma aplicação de página única. Na aba de rede do navegador aparece uma chave de serviço do provedor de dados — a mesma que o backend usa, com permissão de leitura em todas as tabelas.',
    concept: [
      'Ferramentas de build substituem variáveis de ambiente por **texto literal** no pacote gerado. Qualquer prefixo público (`NEXT_PUBLIC_`, `VITE_`, `REACT_APP_`) deixa isso explícito, mas a regra vale para qualquer variável embutida: se foi para o bundle, está publicada.',
      'Os {{sourcemap|source maps}} multiplicam o problema. Publicados junto do pacote, devolvem a estrutura do projeto, os nomes originais e, muitas vezes, trechos inteiros do código-fonte — inclusive comentários que explicam onde ficam as coisas.',
      'A correção não é esconder melhor. Chaves de serviço com permissão ampla **não vão para o cliente**: o navegador chama uma rota sua, e o servidor guarda a credencial, aplica autorização por usuário e impõe limites. Quando o provedor oferece chave pública e chave de serviço, o cliente só pode receber a pública, e as permissões dela precisam ser verificadas no painel do provedor, não presumidas.',
    ],
    example: {
      title: 'A mesma função, dos dois lados da fronteira',
      language: 'ts',
      code: [
        '// cliente — vira texto no bundle, legível por qualquer visitante',
        'const KEY = import.meta.env.VITE_DADOS_SERVICE_KEY',
        'export const listar = (tenant: string) =>',
        "  fetch(`https://dados.vertice.example/tabelas/clientes?tenant=${tenant}`, {",
        '    headers: { Authorization: `Bearer ${KEY}` },',
        '  })',
        '',
        '// cliente corrigido — nenhum segredo; o servidor decide de quem são os dados',
        "export const listar = () => fetch('/api/clientes', { credentials: 'include' })",
      ],
      caption: 'Na primeira versão, quem abre o bundle recebe a chave e o parâmetro de tenant: basta trocar o valor para ler outro cliente. Na segunda, o cliente não escolhe o tenant nem carrega credencial.',
    },
    figure: 'segredo',
    validation:
      'Baixe o seu próprio bundle de produção e procure nele os prefixos de variável do seu framework, cabeçalhos de autorização e nomes de provedores. Confirme também se os source maps respondem em produção. Esse teste leva dois minutos e cabe no pipeline como verificação automática.',
    review: [
      { front: 'O que acontece com uma variável de build no pacote gerado?', back: 'Ela vira texto literal: quem baixa o pacote lê o valor.' },
      { front: 'Por que source maps em produção são um problema?', back: 'Porque devolvem estrutura, nomes originais e trechos do código-fonte.' },
      { front: 'Qual é a correção para uma chave de serviço no frontend?', back: 'Tirar a chave do cliente: o navegador chama uma rota própria e o servidor guarda a credencial e autoriza por usuário.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'owasp-top10', id: 'A01' }, { framework: 'cwe', id: 'CWE-312' }],
  },

  'rev-segredos-historico': {
    context:
      'O commit que removeu o arquivo `.env` tem a mensagem "remove credenciais". Ele prova que as credenciais existiram e indica exatamente em qual commit anterior elas estão.',
    concept: [
      'Sistemas de controle de versão guardam a história inteira. Um arquivo removido continua acessível em todos os commits anteriores, em branches, em tags e em cada cópia clonada por qualquer pessoa. Em repositórios públicos, também em caches e espelhos que você não controla.',
      'Pipelines deixam o mesmo rastro em outros lugares: registros de execução que imprimem variáveis, artefatos de build guardados por meses, imagens com camadas antigas e caches de dependências. Uma varredura que olha só a árvore atual encontra a minoria dos casos.',
      'Reescrever o histórico é possível e quase sempre insuficiente: as cópias já clonadas permanecem, e o esforço de coordenação é alto. A ordem correta é **girar primeiro** e limpar depois, se valer a pena. Prevenir custa menos: cofre de segredos, arquivos de exemplo sem valores reais, varredura no pipeline e verificação antes do commit.',
    ],
    example: {
      title: 'O que uma varredura de histórico encontra',
      language: 'text',
      code: [
        '$ git log --all --oneline -- .env',
        'c81a0f4 remove credenciais do repositório',
        '4b7e2d1 configura integração de SMS',
        '',
        '$ git show 4b7e2d1:.env',
        'SMS_API_KEY=ak_live_8f3b2c9d04e7a1b6',
        'DB_URL=postgres://app:Ver7ice%402024@db.interna.example:5432/clientes',
        '',
        '# a chave e a senha do banco continuam disponíveis em qualquer cópia do repositório',
      ],
      caption: 'Dois comandos, dois segredos. O commit de remoção funciona como índice: ele diz onde procurar.',
    },
    validation:
      'Rode uma varredura de segredos sobre o histórico completo (todas as referências, não só a branch principal) e sobre os artefatos e imagens publicados no último ano. Depois, acrescente a varredura ao pipeline com bloqueio na entrada, para que o próximo caso não entre.',
    review: [
      { front: 'Por que remover um arquivo não remove o segredo?', back: 'Porque ele continua em todos os commits anteriores, em branches, tags e em cada clone existente.' },
      { front: 'Qual é a ordem correta ao achar um segredo no histórico?', back: 'Girar a credencial primeiro; reescrever o histórico depois, se valer a pena.' },
      { front: 'Que outros lugares guardam o mesmo rastro?', back: 'Registros de pipeline, artefatos de build, camadas de imagem e caches de dependências.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'nist-ssdf', id: 'PO.5' }, { framework: 'owasp-top10', id: 'A03' }],
  },

  'rev-segredos-resposta': {
    context:
      'São 23h de uma sexta-feira. Um pesquisador avisa que a chave do provedor de pagamentos da Vértice está em um pacote npm publicado por engano há seis dias. A primeira pergunta da equipe é "como tiramos o pacote do ar?" — e essa é a pergunta errada.',
    concept: [
      'A ordem correta é **girar, revogar, investigar, corrigir, comunicar**. Girar emite uma credencial nova e passa a usá-la. Revogar invalida a antiga: enquanto ela aceitar conexões, o despublicar não ajuda em nada, porque as cópias já existem.',
      'Investigar é olhar os registros de uso da credencial antiga em toda a janela de exposição — não só desde o aviso. Procure origens novas, horários improváveis, volumes fora do padrão e operações que aquela credencial nunca fazia. O resultado é um fato ("não houve uso fora do esperado" ou "houve, entre tais datas"), e esse fato vai para o comunicado.',
      'Corrigir a origem é o que impede a repetição: tirar o segredo do caminho que o expôs (build, pacote, imagem, repositório), colocar a credencial em um cofre, reduzir o escopo dela ao mínimo e, quando possível, trocar por {{credencial-efemera|credenciais temporárias}}. Comunicar fecha: quem foi afetado, o que se sabe, o que ainda não se sabe e o que foi feito.',
    ],
    deeper: [
      'Dois erros aparecem quase sempre. O primeiro é a rotação parcial: gira-se a chave do serviço principal e esquecem-se os quatro lugares que usavam a mesma credencial, o que derruba um deles em produção na segunda-feira. Por isso o inventário de onde cada segredo é usado vale mais do que parece.',
      'O segundo é tratar a exposição como "potencial" porque não há prova de uso. Se o segredo saiu, ele está exposto. A ausência de uso nos registros é uma informação útil para o comunicado, não um motivo para não girar.',
    ],
    validation:
      'Ensaie uma rotação em ambiente de teste e cronometre: quanto tempo leva da decisão até a credencial antiga estar revogada e tudo funcionando com a nova? Se passar de uma hora, o problema não é o incidente, é o processo — e o ensaio acabou de mostrar onde.',
    review: [
      { front: 'Qual é a primeira ação ao descobrir um segredo exposto?', back: 'Girar a credencial e revogar a antiga. Despublicar não resolve, porque as cópias já existem.' },
      { front: 'Que janela os registros devem cobrir na investigação?', back: 'Toda a janela de exposição, desde quando o segredo saiu, e não apenas desde o aviso.' },
      { front: 'Por que a ausência de uso indevido não dispensa a rotação?', back: 'Porque um segredo que saiu está exposto; a ausência de uso é informação para o comunicado, não garantia.' },
    ],
    refs: [{ framework: 'cwe', id: 'CWE-798' }, { framework: 'nist-ssdf', id: 'RV.1' }, { framework: 'owasp-top10', id: 'A09' }],
  },
}
