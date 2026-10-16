const remediationCases = [
  {
    "id": "small-docs",
    "size": "Pequena",
    "title": "Chatbot da loja encontra a planilha de clientes",
    "risk": "LLM02 / LLM08 · Divulgação de dados e recuperação sem controle",
    "context": "Uma pequena loja usa um chatbot público de produtos. O mesmo índice contém catálogo, preços e uma planilha interna de clientes. A equipe tem um desenvolvedor e usa serviços gerenciados.",
    "signal": "Uma pergunta sobre entregas faz o bot citar nome e telefone de outro cliente.",
    "goal": "Manter o atendimento público sem permitir que dados internos cheguem ao contexto do modelo.",
    "options": [
      "Adicionar ao prompt: “Nunca mostre dados de clientes”.",
      "Retirar dados internos do índice público e restringir a recuperação por permissão no backend.",
      "Ocultar a planilha no menu administrativo, mantendo o índice igual.",
      "Aumentar o tamanho dos documentos recuperados para melhorar o contexto."
    ],
    "correct": 1,
    "feedback": [
      "A instrução não controla os documentos que a aplicação envia ao modelo.",
      "Separar o conteúdo público e autorizar a recuperação corta o acesso indevido na origem.",
      "Ocultar o arquivo na interface não muda os dados que o mecanismo de busca pode recuperar.",
      "Recuperar mais conteúdo pode ampliar a exposição e não corrige o acesso indevido."
    ],
    "solution": [
      "Contenção: pausar a recuperação afetada e retirar a planilha do índice público.",
      "Correção: usar coleção pública curada e validar permissões no servidor para qualquer conteúdo privado.",
      "Sustentação: adicionar revisão simples antes de indexar documentos e um teste de acesso entre usuários."
    ],
    "test": "Com dados fictícios, consultar como visitante e como cliente A. Verificar que documentos privados e dados do cliente B não são recuperados nem enviados ao modelo.",
    "tradeoff": "Uma coleção pública pequena e uma regra de acesso no backend podem ser operadas por uma equipe enxuta. Não é necessário começar por uma plataforma complexa.",
    "residual": "Revisar também logs, caches e documentos já indexados; separar a coleção não apaga cópias anteriores.",
    "source": "https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/"
  },
  {
    "id": "small-mail",
    "size": "Pequena",
    "title": "Assistente de e-mail segue ordens de um fornecedor",
    "risk": "LLM01 / LLM06 · Injeção indireta e autonomia excessiva",
    "context": "Uma agência pequena usa IA para resumir e-mails. O conector permite ler a caixa postal e enviar anexos a qualquer destinatário.",
    "signal": "Um e-mail recebido instrui o assistente a encaminhar um contrato interno para um endereço externo.",
    "goal": "Continuar produzindo resumos sem permitir envio automático de anexos.",
    "options": [
      "Confiar em qualquer e-mail cujo remetente esteja nos contatos.",
      "Trocar o modelo e manter as mesmas permissões de envio.",
      "Renomear a ferramenta “enviar” para um nome difícil de adivinhar.",
      "Remover envio do fluxo de resumo; para envio necessário, exigir revisão e autorização no backend."
    ],
    "correct": 3,
    "feedback": [
      "Um remetente conhecido pode carregar conteúdo não confiável; isso não autoriza uma ação externa.",
      "A troca do modelo não remove a capacidade de envio excessiva.",
      "O nome da ferramenta não constitui um controle de autorização.",
      "O resumo não precisa de envio. Uma operação separada com autorização limita a consequência da instrução maliciosa."
    ],
    "solution": [
      "Contenção: desabilitar a ferramenta de envio no assistente de resumo.",
      "Correção: usar acesso somente de leitura; caso haja fluxo de envio, exigir confirmação com destinatário e anexo visíveis.",
      "Sustentação: limitar escopo do conector e registrar decisões de autorização."
    ],
    "test": "Inserir uma instrução fictícia em e-mail de teste. O resumo pode ser produzido, mas nenhuma chamada de envio deve ser autorizada pelo fluxo de leitura.",
    "tradeoff": "Separar leitura e envio mantém a solução simples; a revisão manual tem custo operacional, mas combina com baixo volume.",
    "residual": "Ainda é preciso testar se o conteúdo adversarial distorce o resumo. Impedir envio não garante integridade da resposta.",
    "source": "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
  },
  {
    "id": "medium-secret",
    "size": "Média",
    "title": "Copiloto de suporte contém uma chave no prompt",
    "risk": "LLM02 / LLM07 · Dados sensíveis e exposição do system prompt",
    "context": "Uma empresa de software com várias equipes colocou a chave de uma API interna no system prompt. A intenção era permitir que o copiloto autenticasse chamadas.",
    "signal": "Durante um teste autorizado, a chave aparece na resposta do assistente.",
    "goal": "Conter a exposição e permitir integração sem entregar o segredo ao modelo.",
    "options": [
      "Revogar a chave exposta e mover a credencial para uma integração no backend com escopo mínimo.",
      "Codificar a chave em Base64 dentro do mesmo prompt.",
      "Pedir ao modelo para esconder melhor a chave em respostas futuras.",
      "Apenas remover a chave do prompt, mantendo a credencial vazada ativa."
    ],
    "correct": 0,
    "feedback": [
      "Revogar trata a credencial já exposta; mantê-la fora do contexto reduz nova divulgação pelo modelo.",
      "Base64 é reversível e não impede que o segredo seja reconstruído ou usado.",
      "Uma instrução não transforma o prompt em um cofre de segredos.",
      "Remover o texto não invalida uma cópia já exposta da credencial."
    ],
    "solution": [
      "Contenção: revogar ou rotacionar a chave exposta e avaliar seu uso recente.",
      "Correção: manter segredos fora do prompt; a integração autentica no servidor e aplica escopo mínimo.",
      "Sustentação: incluir revisão de configuração e testes que impeçam inserir segredos no contexto e nas saídas."
    ],
    "test": "Confirmar que a chave antiga é rejeitada. Inspecionar uma chamada de teste para verificar que o modelo recebe apenas os dados necessários e que a integração restringe as operações.",
    "tradeoff": "Um serviço de integração compartilhado e um gerenciador de segredos evitam repetir a configuração em cada equipe.",
    "residual": "Verificar histórico de conversas, logs e outros locais onde a credencial pode ter sido copiada.",
    "source": "https://genai.owasp.org/llmrisk/llm072025-system-prompt-leakage/"
  },
  {
    "id": "medium-rag",
    "size": "Média",
    "title": "Busca interna expõe documentos do RH ao suporte",
    "risk": "LLM08 · Recuperação sem respeitar permissões",
    "context": "Uma empresa média possui áreas de RH, financeiro e suporte. O portal exige login, mas o RAG usa uma conta de serviço que pode buscar todos os documentos.",
    "signal": "Um analista de suporte obtém informações salariais ao perguntar ao copiloto.",
    "goal": "Fazer o assistente respeitar as permissões existentes de cada usuário.",
    "options": [
      "Considerar o login suficiente e manter a conta compartilhada irrestrita.",
      "Adicionar uma palavra-chave “confidencial” ao nome dos arquivos.",
      "Aplicar autorização de documentos durante a recuperação usando a identidade validada do usuário.",
      "Esconder o campo de busca para pessoas do suporte."
    ],
    "correct": 2,
    "feedback": [
      "Autenticação identifica o usuário; não limita automaticamente os documentos recuperados.",
      "Uma palavra no nome não impõe a política de acesso.",
      "A política deve filtrar o acesso antes de inserir os documentos no contexto do modelo.",
      "A restrição visual não protege o endpoint nem outros caminhos de consulta."
    ],
    "solution": [
      "Contenção: suspender a coleção afetada para usuários sem acesso até aplicar a regra correta.",
      "Correção: propagar identidade confiável e aplicar as permissões da fonte na recuperação.",
      "Sustentação: testar combinações de funções e documentos e revisar a atualização das permissões no índice."
    ],
    "test": "Com contas fictícias de RH e suporte, repetir a mesma busca. Confirmar que o usuário de suporte não recebe trechos restritos, incluindo após mudança de função.",
    "tradeoff": "Reutilizar o provedor de identidade e as permissões já existentes reduz o esforço; o índice precisa acompanhar alterações de acesso.",
    "residual": "Examinar caches e documentos previamente recuperados para que não atravessem a fronteira de permissão.",
    "source": "https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/"
  },
  {
    "id": "large-tenant",
    "size": "Grande",
    "title": "Assistente SaaS recupera dados de outro cliente",
    "risk": "LLM08 · Falha de isolamento entre organizações",
    "context": "Uma plataforma de grande porte atende muitas organizações. O identificador do cliente é recebido do navegador e usado diretamente para filtrar a busca vetorial.",
    "signal": "Ao alterar o identificador em um teste, a mesma sessão recebe trechos pertencentes a outra organização.",
    "goal": "Garantir isolamento entre clientes em todos os caminhos de recuperação.",
    "options": [
      "Pedir ao modelo que confira a organização antes de responder.",
      "Vincular o cliente à identidade validada no servidor e impor o escopo em busca, armazenamento e cache.",
      "Ocultar o identificador nas ferramentas de desenvolvedor.",
      "Aumentar o comprimento do identificador sem mudar a autorização."
    ],
    "correct": 1,
    "feedback": [
      "O modelo não deve decidir a autorização com base no conteúdo recebido.",
      "A identidade validada deve determinar o escopo, aplicado em cada componente que pode retornar dados.",
      "A interface do navegador não impede alteração de requisições.",
      "Um identificador difícil de adivinhar não substitui a verificação de acesso."
    ],
    "solution": [
      "Contenção: bloquear a consulta vulnerável e investigar o alcance da exposição preservando evidências.",
      "Correção: derivar o escopo do contexto autenticado e aplicá-lo em todas as consultas e chaves de cache.",
      "Sustentação: automatizar testes de isolamento e auditar alterações nas políticas de acesso."
    ],
    "test": "Executar testes positivos e negativos entre organizações fictícias, incluindo chamadas diretas, cache e troca de contexto. Dados de B nunca devem chegar ao contexto de A.",
    "tradeoff": "Políticas centralizadas e testes de integração ajudam a sustentar muitos times. A segregação física ou lógica deve ser escolhida conforme risco e arquitetura.",
    "residual": "Verificar exportações, memória de conversa e processos em lote; corrigir apenas uma rota deixa outros caminhos expostos.",
    "source": "https://genai.owasp.org/llmrisk/llm082025-vector-and-embedding-weaknesses/"
  },
  {
    "id": "large-payments",
    "size": "Grande",
    "title": "Agente financeiro tenta alterar dados bancários",
    "risk": "LLM01 / LLM06 · Instruções externas e ações de alto impacto",
    "context": "Uma organização grande usa um agente para ler notas fiscais e preparar pagamentos. A ferramenta permite alterar cadastro bancário e efetivar pagamentos com a mesma identidade.",
    "signal": "Uma nota fiscal de teste contém instruções para mudar o favorecido antes de pagar.",
    "goal": "Manter a preparação automatizada sem permitir alteração e pagamento indevidos.",
    "options": [
      "Delegar a aprovação ao mesmo modelo que lê a nota.",
      "Aprovar automaticamente documentos com aparência profissional.",
      "Exigir duas respostas idênticas do modelo antes do pagamento.",
      "Separar preparação e execução, aplicar políticas no servidor e aprovação humana independente."
    ],
    "correct": 3,
    "feedback": [
      "Usar o mesmo modelo como único aprovador mantém a decisão sob influência do documento.",
      "A aparência não comprova autorização para alterar dados ou efetivar pagamentos.",
      "Consistência de respostas não prova autorização nem integridade da transação.",
      "Separação de funções e verificação fora do modelo limitam ações sensíveis antes da execução."
    ],
    "solution": [
      "Contenção: impedir execução automática e alterações de favorecido pelo fluxo de leitura.",
      "Correção: separar funções e identidades, limitar operações e exigir aprovação independente vinculada à transação.",
      "Sustentação: monitorar recusas e alterações, testar documentos adversariais e manter procedimento de resposta."
    ],
    "test": "Em ambiente de teste, enviar uma nota com instrução adversarial. Sem aprovação válida, a mudança de favorecido e o pagamento devem ser recusados pela aplicação.",
    "tradeoff": "A segregação de funções acrescenta etapas, mas é adequada ao impacto financeiro. Automatize a preparação e mantenha controle proporcional sobre a execução.",
    "residual": "A revisão humana deve mostrar os dados exatos a aprovar; também é necessário detectar alteração entre aprovação e execução.",
    "source": "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
  }
];
