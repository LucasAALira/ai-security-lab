/* Glossário contextual. Os textos de estudo marcam um termo com `{{id}}` (ou `{{id|rótulo}}`) e a
   definição abre no próprio parágrafo, sem sair da página. Definições em palavras próprias. */

export interface GlossaryTerm {
  id: string
  term: string
  definition: string
}

export const glossary: GlossaryTerm[] = [
  { id: 'cadeia-de-suprimentos', term: 'Cadeia de suprimentos de software', definition: 'Tudo o que entra no seu produto sem ter sido escrito por você: bibliotecas, ferramentas de build, imagens, serviços e as pessoas e contas que publicam cada uma dessas coisas.' },
  { id: 'dependencia-transitiva', term: 'Dependência transitiva', definition: 'Pacote que você não pediu diretamente, mas que veio porque um pacote que você pediu depende dele.' },
  { id: 'lockfile', term: 'Lockfile', definition: 'Arquivo que fixa as versões exatas (e, em geral, os hashes) de tudo o que foi instalado, para que a próxima instalação seja igual. Fixa o que foi resolvido; não diz se aquilo é seguro.' },
  { id: 'script-de-instalacao', term: 'Script de instalação', definition: 'Comando que o gerenciador de pacotes executa automaticamente ao instalar (por exemplo, `postinstall`). Roda com as permissões de quem instala.' },
  { id: 'sbom', term: 'SBOM', definition: 'Lista de componentes de um software (nome, versão, origem). Ajuda a saber o que você tem e a achar o que foi afetado; não impede um ataque.' },
  { id: 'assinatura', term: 'Assinatura digital', definition: 'Prova que um conteúdo foi assinado por quem tem determinada chave e que não mudou depois. Não prova que o conteúdo é inofensivo nem que a chave não foi comprometida.' },
  { id: 'proveniencia', term: 'Proveniência', definition: 'Registro verificável de onde um artefato veio: qual código-fonte, qual processo de build, quem executou e quando.' },
  { id: 'cve', term: 'CVE', definition: 'Identificador público de uma vulnerabilidade conhecida. A ausência de uma CVE significa apenas que ninguém registrou ainda, não que o componente seja seguro.' },
  { id: 'credencial-efemera', term: 'Credencial temporária', definition: 'Credencial emitida para uma tarefa e que expira sozinha em minutos ou horas, em vez de ficar guardada por meses.' },
  { id: 'privilegio-minimo', term: 'Privilégio mínimo', definition: 'Dar a cada pessoa, serviço ou pipeline apenas o acesso de que precisa para a tarefa, e só pelo tempo necessário.' },
  { id: 'fronteira-de-confianca', term: 'Fronteira de confiança', definition: 'Ponto em que os dados passam de uma parte que você controla para outra que você não controla (ou o contrário). É onde a validação e a autorização precisam acontecer.' },
  { id: 'contencao', term: 'Contenção', definition: 'Ações para impedir que o incidente continue ou se espalhe, tomadas sem destruir as evidências necessárias para investigar.' },
  { id: 'indicador-de-comprometimento', term: 'Indicador de comprometimento', definition: 'Sinal observável de que algo pode ter sido comprometido: um endereço contactado, um arquivo alterado, uma conta usada fora do padrão. Serve para procurar, não para provar sozinho.' },
  { id: 'risco-residual', term: 'Risco residual', definition: 'O risco que sobra depois de aplicar os controles. Precisa ser declarado e aceito por quem responde pelo sistema, em vez de ser esquecido.' },
  { id: 'rag', term: 'RAG', definition: 'Arquitetura em que o sistema busca trechos de documentos e os entrega ao modelo como contexto antes de ele responder.' },
  { id: 'tenant', term: 'Tenant', definition: 'Cliente (ou organização) que compartilha a mesma plataforma com outros. O isolamento entre tenants evita que um veja os dados do outro.' },
  { id: 'injecao-de-prompt', term: 'Injeção de prompt', definition: 'Texto, vindo do usuário ou de um conteúdo externo, que tenta fazer o modelo seguir instruções que o dono do sistema não queria.' },
  { id: 'bola', term: 'BOLA', definition: 'Autorização quebrada em nível de objeto: a API entrega um objeto sem checar se quem pede tem direito àquele objeto específico.' },
  { id: 'idempotencia', term: 'Idempotência', definition: 'Propriedade de uma operação que, repetida várias vezes com o mesmo pedido, produz o mesmo efeito de uma execução só.' },
  { id: 'adr', term: 'ADR', definition: 'Registro de decisão arquitetural: documento curto com o contexto, as alternativas, a decisão, as consequências e como validar.' },
  { id: 'stride', term: 'STRIDE', definition: 'Roteiro de seis tipos de ameaça (falsificação, adulteração, repúdio, vazamento, negação de serviço, elevação de privilégio) para examinar cada componente e fluxo.' },
  { id: 'agente', term: 'Agente', definition: 'Sistema em que o modelo decide quais ferramentas chamar, e em que ordem, para cumprir um objetivo, em vez de apenas devolver um texto.' },
  { id: 'ferramenta-do-agente', term: 'Ferramenta do agente', definition: 'Função que o agente pode chamar: ler um arquivo, enviar um e-mail, executar um comando. Cada ferramenta é uma capacidade concedida, com o seu próprio risco.' },
  { id: 'agencia-excessiva', term: 'Agência excessiva', definition: 'Quando o agente tem mais ferramentas, permissões ou autonomia do que a tarefa exige. Um erro do modelo ou uma injeção de prompt passa a causar um dano muito maior.' },
  { id: 'aprovacao-humana', term: 'Aprovação humana', definition: 'Etapa em que uma pessoa confirma uma ação antes de ela acontecer. Só protege quando a pessoa vê o que de fato vai ocorrer, tem tempo de ler e pode recusar.' },
  { id: 'delegacao', term: 'Delegação de identidade', definition: 'Agir em nome de um usuário com as permissões dele, em vez de usar uma conta própria e mais ampla. Assim o agente nunca pode mais do que a pessoa que o chamou.' },
  { id: 'deep-link', term: 'Deep link', definition: 'Endereço que abre uma tela específica de um aplicativo. Esquemas próprios (como `app://`) podem ser registrados por qualquer aplicativo; App Links (Android) e Universal Links (iOS) ligam o link a um domínio verificado.' },
  { id: 'webview', term: 'WebView', definition: 'Componente que mostra páginas web dentro de um aplicativo. Se a página puder chamar funções do aplicativo, quem controla a página passa a controlar essas funções.' },
]

export const glossaryById = (id: string): GlossaryTerm | undefined => glossary.find((g) => g.id === id)
