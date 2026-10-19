import type { Materia } from '../types'

export const engenhariaReversa: Materia = {
  slug: "engenharia-reversa",
  moduleIndex: 8,
  number: "09",
  title: "Engenharia reversa para defensores",
  summary: "Aprenda a examinar aplicativos, binários e arquivos de modelo que você não escreveu, em laboratório isolado, para achar o que eles escondem e decidir o que corrigir.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 19/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que é engenharia reversa e quando ela é legítima",
      html: `<p>Engenharia reversa é o trabalho de descobrir como algo funciona a partir do resultado pronto, sem ter o projeto original. Em software, isso significa examinar um programa, um aplicativo ou um arquivo de modelo para entender o que ele faz, de onde vêm seus dados e o que acontece quando algo dá errado, mesmo sem acesso ao código-fonte.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>É como desmontar um relógio para entender o mecanismo. A regra de ouro é que você só desmonta o seu relógio, um relógio de treino, ou um que o dono autorizou por escrito.</p></div>
<h3>Para que defensores usam</h3>
<ul>
<li><strong>Verificar a cadeia de suprimentos.</strong> Confirmar que uma biblioteca, um aplicativo ou um modelo baixado faz só o que promete. É a ligação direta com o risco LLM03 do módulo 01.</li>
<li><strong>Responder a incidentes.</strong> Entender uma amostra suspeita para saber o que ela tocou, com quem tentou falar e como conter o problema.</li>
<li><strong>Revisar o que a sua própria empresa publica.</strong> Abrir o seu aplicativo “como um atacante abriria” para ver o que está exposto antes que outra pessoa veja.</li>
<li><strong>Manter sistemas antigos.</strong> Documentar formatos e protocolos quando o fornecedor original não existe mais.</li>
<li><strong>Pesquisar vulnerabilidades com divulgação responsável.</strong> Encontrar falhas e comunicá-las a quem pode corrigi-las.</li>
</ul>
<h3>Os limites: autorização, licença e lei</h3>
<p>A mesma técnica pode ser rotina profissional ou infração, dependendo do contexto. Antes de analisar qualquer coisa, responda a quatro perguntas: eu tenho o direito de examinar este artefato? A licença ou o contrato proíbe isso? Como eu obtive o arquivo? A lei do meu país trata esse caso de forma específica? As respostas variam de país para país e de contrato para contrato, e este módulo não substitui orientação jurídica.</p>
<p>Como regra de estudo, analise apenas: (1) software seu; (2) amostras feitas para treinamento e desafios abertos; (3) artefatos que você tem autorização escrita para examinar, dentro de um escopo combinado.</p>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Achar que “estou só olhando” dispensa autorização. Examinar o programa de outra pessoa sem permissão pode violar contratos e leis, mesmo sem executá-lo e mesmo sem causar dano.</p></div>
<h3>Análise estática e análise dinâmica</h3>
<p>Existem duas famílias de análise, e elas se completam.</p>
<dl class="concept-list">
<dt>Estática</dt>
<dd>Examina o artefato sem executá-lo: tipo de arquivo, hash, textos embutidos, bibliotecas usadas, estrutura e código desmontado. É mais segura e deve vir primeiro. Pode ser enganada quando o conteúdo está compactado ou cifrado e só aparece durante a execução.</dd>
<dt>Dinâmica</dt>
<dd>Observa o artefato em execução, em ambiente controlado: arquivos que ele abre, conexões de rede que tenta fazer, processos que cria. Mostra o comportamento real, mas exige isolamento, porque executar é aceitar o risco.</dd>
</dl>
<h3>O laboratório seguro vem antes da ferramenta</h3>
<ul>
<li>Use uma <strong>máquina virtual</strong> só para análise, nunca o computador do dia a dia.</li>
<li>Tire um <strong>instantâneo</strong> (snapshot) limpo antes de começar, para voltar ao zero depois.</li>
<li>Deixe a <strong>rede desligada</strong> ou restrita a uma rede de teste que você controla. Nada de credenciais reais, e-mails ou arquivos pessoais dentro da máquina.</li>
<li>Guarde o artefato de um jeito que não seja executado por engano, como um arquivo compactado com senha e extensão neutra. Nunca o abra com um clique duplo.</li>
<li>Registre tudo: data, hash, ferramentas, comandos e o que você observou.</li>
</ul>
<p>Este cuidado não é exagero. Quem analisa um programa suspeito está, por definição, lidando com algo que pode se comportar mal. O ambiente isolado transforma um possível incidente em um simples “voltar ao instantâneo”.</p>
<h3>O roteiro de quatro passos</h3>
<p>A triagem segue sempre a mesma ordem, do passo mais barato ao mais caro. Cada um responde a uma pergunta e reduz o que falta fazer no seguinte.</p>
<div class="table-wrap" role="region" aria-label="Triagem em camadas" tabindex="0"><table><caption>Triagem em camadas</caption><thead><tr><th scope="col">Passo</th><th scope="col">Pergunta</th><th scope="col">O que costuma render</th></tr></thead><tbody>
<tr><th scope="row">1. Identificar</th><td>O que é isto?</td><td>Tipo real (não a extensão), tamanho, hash, assinatura</td></tr>
<tr><th scope="row">2. Ler</th><td>O que ele diz de si?</td><td>Textos, manifesto, configuração, bibliotecas, endereços, chaves</td></tr>
<tr><th scope="row">3. Mapear</th><td>Com o que ele fala?</td><td>Permissões, rotas, pontos de entrada, capacidades</td></tr>
<tr><th scope="row">4. Observar</th><td>O que ele faz mesmo?</td><td>Arquivos, processos e conexões em execução isolada</td></tr>
</tbody></table></div>
<p>Entre os passos há retorno: o que se observa quase sempre manda voltar a ler. Dois erros aparecem com frequência. O primeiro é começar pelo desmontador, que é o passo mais caro e o de menor contexto. O segundo é parar no primeiro achado bom — encontrar uma chave é satisfatório, e é exatamente aí que muita análise termina, deixando passar as outras três que estavam no mesmo arquivo.</p>
<h3>O que a análise não prova</h3>
<p>Você encontra o que procurou. “Nenhum achado” significa que os procedimentos aplicados não encontraram nada, e não que o artefato seja inofensivo. Por isso o relatório registra também <em>o que não foi examinado</em>: quem lê precisa saber a diferença entre uma região limpa e uma região não visitada.</p>
<div class="callout"><p class="callout-title">Continua na área Engenharia reversa</p><p>Esta matéria é a visão geral. A área <strong>Engenharia reversa</strong> desenvolve cada parte em submódulos próprios, com aulas, ilustrações e desafios: fundamentos, análise estática, caça a segredos, aplicativos e clientes, artefatos de IA e análise dinâmica com relatório.</p></div>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Lendo um artefato por camadas",
      html: `<p>Ninguém começa abrindo o código desmontado. A triagem segue camadas, da mais barata e segura para a mais cara e arriscada. Cada camada responde a uma pergunta e decide se vale a pena ir à próxima.</p>
<ol>
<li><strong>Identidade.</strong> Que tipo de arquivo é, qual o tamanho e qual o <em>hash</em>? O hash (por exemplo, SHA-256) é uma “impressão digital” do arquivo: serve para registrar exatamente o que foi analisado e para comparar com versões conhecidas.</li>
<li><strong>Textos embutidos.</strong> Que textos legíveis existem dentro do arquivo? Endereços, nomes de arquivo, mensagens de erro, trechos de configuração e até prompts costumam aparecer aqui.</li>
<li><strong>Dependências e chamadas.</strong> Que bibliotecas e funções o programa usa? Funções de rede, de arquivo e de criptografia indicam o que ele pretende fazer.</li>
<li><strong>Estrutura e código.</strong> Um <em>desmontador</em> mostra as instruções de máquina; um <em>decompilador</em> tenta reconstruir algo parecido com código-fonte. É a camada mais trabalhosa, reservada ao que as anteriores não explicaram.</li>
<li><strong>Comportamento.</strong> Executar em ambiente isolado e observar arquivos, processos e rede confirma ou derruba as hipóteses das camadas anteriores.</li>
</ol>
<h3>Um exemplo de brinquedo: a senha dentro do programa</h3>
<p>Imagine um programa que libera um recurso quando o usuário digita a chave correta. Em pseudocódigo, o coração dele é este:</p>
<pre tabindex="0"><code>se (entrada == "OURO-1234-LIVRE")
    liberar_recursos()
senão
    mostrar("licença inválida")</code></pre>
<p>A chave correta precisa estar no programa para que a comparação aconteça. Por isso, uma simples listagem de textos embutidos já a revela:</p>
<pre tabindex="0"><code>$ strings app-licenca.bin | grep -i "OURO"
OURO-1234-LIVRE</code></pre>
<p>Duas lições saem daí. Primeiro, <strong>um segredo comparado dentro do código não é segredo</strong>. Segundo, a decisão “liberar ou não” acontece na máquina de quem examina, que pode alterá-la. Verificações feitas só no cliente são conveniência de interface, nunca controle de acesso.</p>
<h3>O que um decompilador entrega (e o que ele esconde)</h3>
<p>Ao compilar, o programa perde nomes de variáveis, comentários e a organização original. O decompilador reconstrói uma versão aproximada. A mesma verificação aparece, por exemplo, assim:</p>
<pre tabindex="0"><code>int FUN_00101189(char *param_1)
{
  int iVar1;
  iVar1 = strcmp(param_1, "OURO-1234-LIVRE");
  return (uint)(iVar1 == 0);
}</code></pre>
<p>Os nomes <code>FUN_00101189</code> e <code>param_1</code> foram inventados pela ferramenta. Quem analisa renomeia essas peças conforme descobre o que fazem. O resultado ajuda muito, mas é uma <em>reconstrução</em>: pode errar, e por isso cada conclusão importante deve ser confirmada por outra evidência.</p>
<div class="callout"><p class="callout-title">Ofuscação e compactação</p><p>Alguns artefatos vêm embaralhados ou compactados justamente para dificultar a leitura. Sinais comuns: quase nenhum texto legível, pouquíssimas bibliotecas listadas e conteúdo muito “aleatório”. A conclusão certa é <strong>não concluir nada pela ausência de sinais</strong> e passar à análise dinâmica em ambiente isolado. A ofuscação aumenta o esforço de quem lê; não impede a leitura.</p></div>
<h3>Aplicativos e páginas: o cliente é público</h3>
<p>Um aplicativo móvel é, na prática, um pacote compactado que qualquer pessoa pode abrir e inspecionar. O código JavaScript de uma página chega inteiro ao navegador. Portanto, <strong>tudo o que o servidor envia ao cliente pode ser lido</strong>. Os achados mais comuns em revisões desse tipo são:</p>
<ul>
<li>chaves de API e senhas deixadas na configuração;</li>
<li>endereços internos, como painéis administrativos e rotas de teste;</li>
<li>prompts de sistema embutidos, com regras de negócio e códigos internos;</li>
<li>bloqueios de recurso decididos no cliente (“plano Pro”, “modo administrador”);</li>
<li>verificação de certificado desligada para “facilitar os testes” e esquecida.</li>
</ul>
<p>O laboratório de código do módulo 01 já trouxe um exemplo: a chave do provedor dentro do widget. Aqui você aprende o lado de quem encontra essa chave.</p>
<h3>O ângulo de IA: modelos, prompts e APIs</h3>
<p>Três pontos merecem atenção especial em sistemas de IA.</p>
<dl class="concept-list">
<dt>Arquivos de modelo</dt>
<dd>Alguns formatos de serialização, como o <em>pickle</em> do Python (usado por arquivos <code>.pkl</code> e por checkpoints antigos de frameworks), podem executar código quando o arquivo é carregado. Baixar e carregar um modelo desse tipo equivale a executar um programa desconhecido. Formatos criados para guardar apenas pesos, como o <em>safetensors</em>, não carregam código executável. Mesmo assim, origem confiável, hash e versão fixada continuam necessários.</dd>
<dt>Prompts e segredos no pacote</dt>
<dd>O prompt de sistema embutido em um aplicativo pode ser lido por quem o examina. E, mesmo sem abrir o pacote, perguntas bem escolhidas ao modelo podem fazê-lo repetir as próprias instruções (LLM07). Por isso o prompt nunca deve guardar segredos nem ser o único controle de acesso.</dd>
<dt>Extração pela API</dt>
<dd>Quem consegue fazer muitas consultas a um endpoint de inferência pode usar as respostas para treinar um modelo substituto que imita o original. O MITRE ATLAS descreve esse tipo de comportamento. A engenharia reversa aqui não abre arquivos: ela observa entradas e saídas.</dd>
</dl>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Confundir um formato “seguro” com um arquivo “confiável”. Um arquivo só de pesos não executa código ao carregar, mas pode conter um modelo adulterado, com comportamento diferente do prometido. Segurança do formato e confiança na origem são perguntas diferentes.</p></div>
<h3>Caça a segredos: onde eles de fato aparecem</h3>
<p>A pergunta útil não é “existe segredo no código?”, e sim “por quantos caminhos este segredo já passou?”. Um valor que chegou ao cliente ou ao histórico precisa ser tratado como exposto.</p>
<div class="table-wrap" role="region" aria-label="Onde procurar segredos" tabindex="0"><table><caption>Lugares produtivos, em ordem de retorno</caption><thead><tr><th scope="col">Lugar</th><th scope="col">Por que rende</th><th scope="col">Some ao remover do código?</th></tr></thead><tbody>
<tr><th scope="row">Recursos e configuração do pacote</th><td>Escritos por pessoas, empacotados inteiros</td><td>Só nas versões futuras</td></tr>
<tr><th scope="row">Variáveis embutidas na build</th><td>A ferramenta troca a variável por texto literal</td><td>Só nas versões futuras</td></tr>
<tr><th scope="row">Bundle de frontend e source maps</th><td>Baixados por qualquer visitante, antes do login</td><td>Só nas versões futuras</td></tr>
<tr><th scope="row">Camadas antigas de imagens</th><td>Cada instrução grava uma camada, e o <code>rm</code> cria outra</td><td>Não</td></tr>
<tr><th scope="row">Histórico do repositório</th><td>O commit que “removeu” indica onde procurar</td><td>Não</td></tr>
<tr><th scope="row">Registros de pipeline e artefatos</th><td>Comandos de diagnóstico imprimem o valor</td><td>Não</td></tr>
</tbody></table></div>
<p>Reconhecer um candidato tem duas partes. A <strong>forma</strong> levanta a suspeita: prefixos conhecidos de provedor, cadeias longas de alta entropia, cabeçalhos de chave privada, estrutura de JWT. O <strong>contexto</strong> decide: o nome da variável, o arquivo, o que o código faz com o valor. Um hexadecimal de 64 caracteres pode ser chave viva ou hash de arquivo, e só o uso resolve. Uma regra não se negocia: <strong>não teste a credencial de terceiros</strong> para “ver se funciona” — isso é acesso não autorizado. A confirmação vem dos registros de quem é dono, ou simplesmente se trata o valor como vivo e se gira.</p>
<h3>Quando um segredo vaza</h3>
<p>A ordem é <strong>girar, revogar, investigar, corrigir, comunicar</strong>. Emitir a credencial nova sem revogar a antiga mantém o vazamento ativo; despublicar um pacote não alcança quem já o baixou. A investigação cobre toda a janela de exposição, desde a publicação do artefato — não desde o aviso. E a ausência de uso indevido nos registros é informação para o comunicado, nunca motivo para não girar.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Defesas, verificação e relatório",
      html: `<p>Há dois lados na defesa. Um é <strong>reduzir o que a engenharia reversa de terceiros revela</strong> sobre o seu produto. O outro é <strong>verificar o que você recebe</strong> antes de colocar em produção.</p>
<h3>Reduzir o que o seu produto entrega</h3>
<ul>
<li><strong>O cliente é território do atacante.</strong> Nada que precise ser secreto vai para o aplicativo, o navegador ou o prompt.</li>
<li><strong>Segredos ficam no servidor.</strong> O cliente chama o seu servidor, que guarda a chave do provedor, autentica o usuário, aplica limites e registra o uso.</li>
<li><strong>Autorização é decidida no servidor, com dados do servidor.</strong> Nunca com um campo que o aplicativo envia (“plano”, “perfil”, “é administrador”).</li>
<li><strong>Canal protegido.</strong> Mantenha a verificação de certificado ligada. Se precisar de uma autoridade interna, configure-a em vez de desligar a verificação.</li>
<li><strong>Ofuscação como camada extra.</strong> Ela aumenta o custo de quem lê, mas não corrige uma chave embutida nem uma decisão no cliente.</li>
<li><strong>Chave exposta é chave comprometida.</strong> Revogue e gere outra. Depois, procure nos registros do provedor sinais de uso indevido.</li>
</ul>
<h3>Verificar o que você recebe</h3>
<ul>
<li><strong>Origem e integridade.</strong> Baixe de fontes oficiais, confira assinaturas quando existirem e registre o hash do que foi aprovado. Fixe versões em vez de aceitar “a mais recente”.</li>
<li><strong>Inventário.</strong> Mantenha uma lista de componentes, incluindo modelos e conjuntos de dados, com origem, versão e responsável. Sem inventário, não há como responder “estamos afetados?” quando surge um alerta.</li>
<li><strong>Carregar modelos com cuidado.</strong> Prefira formatos só de pesos. Em PyTorch, desde a versão 2.6 o <code>torch.load</code> usa por padrão <code>weights_only=True</code>, que restringe a carga a pesos; usar <code>weights_only=False</code> com um arquivo de origem desconhecida pode executar código. Faça o primeiro carregamento em ambiente isolado e com poucas permissões.</li>
<li><strong>Testar antes de promover.</strong> Compare o comportamento do modelo recebido com o esperado, em dados de teste, antes de liberar para usuários.</li>
</ul>
<h3>Dificultar a extração de modelo</h3>
<p>Não existe bloqueio perfeito, porque o serviço precisa responder a consultas legítimas. O objetivo é elevar o custo e criar evidência: exija autenticação, imponha limites de taxa e de volume, monitore padrões incomuns (muitas consultas variadas e sistemáticas de um mesmo cliente) e exponha o mínimo de detalhe nas respostas. Por exemplo, devolver só a resposta final em vez de todas as probabilidades, quando elas não são necessárias.</p>
<h3>Habilidades de agente também são artefatos</h3>
<p>Uma habilidade de agente é um pacote que concede capacidades: instruções em texto, metadados, lista de ferramentas e, às vezes, scripts. Instalar é conceder. Antes de instalar, verifique o escopo pedido por cada ferramenta, a origem das instruções (buscar instruções de um endereço externo a cada execução anula a revisão), a política de atualização automática e o isolamento. Os metadados merecem atenção especial porque são lidos <em>pelo modelo</em>: uma descrição que manda “ignorar instruções anteriores” é injeção embalada como documentação. A defesa é aplicar permissões no código, não pedir bom comportamento no prompt.</p>
<h3>Registrar a análise para que outra pessoa a repita</h3>
<p>Uma análise sem registro vira opinião. Um relatório curto e útil separa fato de hipótese e termina em uma ação verificável. Exemplo fictício:</p>
<pre tabindex="0"><code>Objeto:        app-atendimento 3.2.1 (SHA-256 completo no anexo)
Autorização:   OS interna SEG-123, análise do pacote do próprio produto
Método:        estática (textos e bibliotecas), em VM isolada, sem rede
Achado 1:      FATO - chave de provedor em config.json
Achado 2:      HIPÓTESE - a rota /admin/exportar pode não exigir login;
               a confirmar em ambiente de teste
Impacto:       uso indevido da chave, a custo da empresa
Recomendação:  mover a chamada ao servidor; revogar e girar a chave;
               exigir autenticação na rota
Reteste:       novo pacote sem a chave; rota recusa pedido sem sessão</code></pre>
<p>Depois da correção, repita a análise no novo pacote. O reteste confirma que o segredo saiu do artefato, que a chave antiga foi revogada e que o servidor recusa pedidos forjados. Registre também o que <em>não</em> foi examinado, para que ninguém leia “sem achados” como “seguro”.</p>
<h3>Falar com quem pode corrigir</h3>
<p>Quando o achado é de terceiro, o objetivo é a correção, não o crédito. Comunique primeiro em canal privado, com achado, impacto, passos de reprodução, versão afetada, prazo pretendido e contato — sem exploração pronta e sem adjetivos sobre quem escreveu o código. Sem canal de segurança publicado, tente nesta ordem: política pública ou arquivo de segurança, endereço de segurança do site, contato comercial e, por fim, um intermediário. Registre cada tentativa com data: esse registro é o que justifica os passos seguintes e protege quem reportou.</p>
<div class="callout"><p class="callout-title">Para o Security Champion</p><p>Você não precisa dominar um desmontador para ajudar. Perguntar “o que um estranho enxerga se abrir este pacote?”, “quem decide a permissão, o cliente ou o servidor?” e “de onde veio este modelo e como sabemos que é o mesmo que foi aprovado?” já muda a qualidade de uma revisão.</p></div>`,
    },
  ],
  recap: [
    "Engenharia reversa só é legítima com autorização e em laboratório isolado: máquina virtual, instantâneo limpo e rede controlada.",
    "Comece pela análise estática (hash, textos, bibliotecas) e só execute em ambiente isolado; separe sempre fato de hipótese.",
    "Tudo o que vai ao cliente pode ser lido e alterado: segredos e autorização ficam no servidor.",
    "Arquivos de modelo em pickle podem executar código ao carregar; prefira formatos só de pesos e confira origem e hash.",
    "Ofuscar atrasa quem lê, mas não corrige uma falha. Chave exposta deve ser revogada.",
    "Registre cada análise de um jeito que outra pessoa consiga repetir, e faça o reteste depois da correção.",
    "Segredos persistem em cópias: a resposta a um vazamento começa por girar e revogar, e só depois limpa a origem.",
    "Habilidades de agente concedem capacidades: avalie escopo, origem das instruções e atualização automática antes de instalar.",
    "Achado de terceiro vai primeiro por canal privado, com reprodução e prazo combinado, e com registro de cada tentativa.",
  ],
  glossary: [
    { term: "Análise dinâmica", definition: "Observação do artefato em execução, em ambiente controlado, para ver arquivos, processos e conexões de rede." },
    { term: "Análise estática", definition: "Exame do artefato sem executá-lo: tipo, hash, textos embutidos, bibliotecas e código desmontado." },
    { term: "Decompilador", definition: "Ferramenta que reconstrói, de forma aproximada, algo parecido com código-fonte a partir do código de máquina." },
    { term: "Desmontador", definition: "Ferramenta que mostra as instruções de máquina de um programa em forma legível." },
    { term: "Hash", definition: "Valor calculado a partir do conteúdo de um arquivo. Qualquer alteração muda o resultado; serve para identificar e comparar arquivos." },
    { term: "Instantâneo (snapshot)", definition: "Cópia do estado de uma máquina virtual, para voltar ao ponto limpo depois de uma análise." },
    { term: "Ofuscação", definition: "Técnica que embaralha o código para dificultar a leitura. Aumenta o esforço, mas não impede a análise." },
    { term: "Pickle", definition: "Formato de serialização do Python que pode executar código quando o arquivo é carregado." },
    { term: "Rotação de segredo", definition: "Emitir uma credencial nova e invalidar a antiga. É o que encerra de fato um vazamento, porque alcança as cópias que você não controla." },
    { term: "Safetensors", definition: "Formato pensado para guardar apenas os pesos de um modelo, sem código executável." },
    { term: "Sandbox", definition: "Ambiente isolado onde um programa é executado com limites, para observar seu comportamento sem arriscar o sistema real." },
    { term: "Segredo embutido", definition: "Chave, senha ou código interno gravado no aplicativo, na página ou no prompt. Quem examina o pacote consegue lê-lo." },
    { term: "Source map", definition: "Arquivo que liga o código empacotado ao original, para depurar. Publicado em produção, entrega estrutura, nomes e trechos do fonte." },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Compare ofuscação e autorização no servidor. Explique por que ofuscar só atrasa quem lê o artefato, dê um exemplo de falha que a ofuscação não corrige (como a chave embutida ou o plano decidido pelo cliente) e diga qual controle a corrigiria.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>OWASP Top 10 for LLM Applications, edição 2025: LLM03 (cadeia de suprimentos) e LLM07 (vazamento do prompt de sistema).</li>
<li>OWASP Mobile Application Security: MASVS e guia de testes MASTG.</li>
<li>MITRE ATLAS: técnicas de acesso e de extração de modelos.</li>
<li>Documentação do PyTorch sobre serialização e o parâmetro <code>weights_only</code>.</li>
<li>Documentação do formato safetensors.</li>
<li>NIST SP 800-218: Secure Software Development Framework (SSDF).</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. Esta matéria é educacional e não substitui orientação jurídica sobre o que pode ser analisado.</p>`,
  },
}
