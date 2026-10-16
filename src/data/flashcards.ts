import type { Flashcard } from './types'

/** Cinco cartões por módulo, com a pergunta na frente e a resposta curta atrás.
 *  Os ids (`m{módulo}-c{n}`) ficam guardados no progresso: não renomeie. */
const deck: Record<number, [string, string][]> = {
  0: [
    ['O que a lista OWASP Top 10 para LLM 2025 organiza?', 'Riscos da aplicação inteira — modelo, dados, integrações e operação —, e não só do modelo. Cite sempre a edição usada.'],
    ['LLM05 (Improper Output Handling): qual é o problema e o controle?', 'A saída do modelo é usada por outro componente sem validação. Trate-a como entrada não confiável: valide e codifique para o contexto de uso.'],
    ['Qual a diferença entre LLM01 (Prompt Injection) e LLM06 (Excessive Agency)?', 'LLM01 é a instrução maliciosa que chega ao modelo. LLM06 é o poder excessivo (permissões, funções, autonomia) que amplia o impacto. Podem aparecer na mesma cadeia.'],
    ['O que é LLM07 (System Prompt Leakage)?', 'A exposição das instruções do sistema. Não ponha segredos nelas e não use o prompt como único controle de acesso.'],
    ['Quais riscos tratam de dados e de recuperação?', 'LLM02 (divulgação de informações sensíveis), LLM04 (envenenamento de dados e modelo) e LLM08 (fragilidades de vetores e embeddings, como permissões em RAG).'],
  ],
  1: [
    ['Injeção direta ou indireta: qual a diferença?', 'Na direta, o usuário tenta alterar a tarefa. Na indireta, a instrução chega por documentos, páginas ou resultados de ferramentas.'],
    ['Qual é a raiz do problema na injeção de prompt?', 'O modelo não separa de forma confiável o conteúdo não confiável das instruções. Delimitar o texto organiza, mas não protege.'],
    ['Por que a autorização deve ficar fora do modelo?', 'Porque o modelo pode ser enganado. Quem decide o que é permitido é o código do serviço, com a identidade do usuário, e não um pedido em linguagem natural.'],
    ['Quais controles limitam o impacto de uma injeção?', 'Ferramentas com escopo mínimo, validação de saída, aprovação humana para ações sensíveis e novos testes após cada mudança.'],
    ['Bloquear "ignore as instruções" basta?', 'Não. Um filtro de palavras cobre só variações conhecidas. Use-o como camada extra, nunca como único controle.'],
  ],
  2: [
    ['O que é o MITRE ATLAS?', 'Uma base de conhecimento sobre o comportamento de adversários contra sistemas de IA, organizada em táticas e técnicas.'],
    ['Tática ou técnica: qual a diferença?', 'A tática é o objetivo do adversário (o porquê). A técnica é como ele age para chegar lá (o como).'],
    ['O que sustenta o mapeamento de um achado para uma técnica?', 'Evidência observável — logs, artefatos, telemetria —, e não apenas nomes parecidos.'],
    ['Como usar o ATLAS na defesa?', 'Relacionando o comportamento observado ao controle e à telemetria que permitem detectar ou interromper a ação.'],
    ['O que registrar no caso didático do ATLAS?', 'Objetivo, acesso inicial, componentes afetados, evidências e ao menos duas oportunidades de defesa.'],
  ],
  3: [
    ['O que definir antes de um red team em IA?', 'Autorização, ambiente, dados sintéticos, objetivos e critérios de interrupção.'],
    ['Por que repetir execuções e variar o contexto?', 'Porque o modelo responde de forma variável: uma única execução não mostra a taxa real de sucesso.'],
    ['Como relatar a taxa de sucesso de um ataque?', 'Com o denominador explícito (por exemplo, 3 de 20), a versão do modelo e a configuração usada.'],
    ['O que registrar em cada teste?', 'Versão do modelo, configuração, entrada, saída, impacto e o controle envolvido.'],
    ['Como validar uma correção?', 'Repetindo os casos originais e variações na versão corrigida, e registrando o resultado.'],
  ],
  4: [
    ['O NIST AI RMF é obrigatório?', 'Não. É um framework voluntário.'],
    ['O que faz a função GOVERN?', 'Estabelece políticas, responsabilidades e cultura de forma transversal às outras funções.'],
    ['O que fazem MAP e MEASURE?', 'MAP contextualiza o uso, as pessoas afetadas e os impactos. MEASURE reúne avaliações, métricas e evidências.'],
    ['O que faz a função MANAGE?', 'Prioriza o tratamento dos riscos, aplica as respostas e acompanha os resultados.'],
    ['As quatro funções formam uma lista linear?', 'Não. Elas apoiam um processo contínuo, que não termina com a implantação.'],
  ],
  5: [
    ['O que a ISO/IEC 42001:2023 define?', 'Requisitos de um sistema de gestão de IA: estabelecer, implementar, manter e melhorar continuamente.'],
    ['Quais áreas a norma percorre?', 'Contexto, liderança, planejamento, suporte, operação, avaliação de desempenho e melhoria.'],
    ['Basta ter a política escrita?', 'Não. Relacione cada política a evidências de execução: registros, revisões, auditorias.'],
    ['A certificação garante ausência de vulnerabilidades?', 'Não, nem conformidade com todas as leis por si só: ela atesta um sistema de gestão.'],
    ['O que entra em um inventário de sistemas de IA?', 'Finalidade, responsável, fornecedor, dados utilizados, avaliação de impacto e data de revisão.'],
  ],
  6: [
    ['Onde há dados pessoais em uma aplicação de IA?', 'Em prompts, documentos, embeddings, logs e respostas.'],
    ['Quais princípios guiam o tratamento?', 'Finalidade, necessidade, transparência, segurança e prevenção.'],
    ['O que exigem os dados sensíveis?', 'Análise das hipóteses específicas previstas na lei.'],
    ['O que trata o art. 20 da LGPD?', 'A revisão de decisões tomadas unicamente com base em tratamento automatizado que afetem os interesses do titular.'],
    ['O que avaliar além da coleta?', 'Direitos dos titulares, retenção, operadores e transferências internacionais.'],
  ],
  7: [
    ['O que é o Regulamento (UE) 2024/1689?', 'O AI Act, que estabelece regras para sistemas de IA na União Europeia.'],
    ['Do que depende a análise de um caso?', 'Do caso de uso, do papel da organização e do âmbito de aplicação.'],
    ['Que blocos o AI Act obriga a distinguir?', 'Práticas proibidas, sistemas de alto risco, obrigações de transparência e regras para modelos de propósito geral.'],
    ['Como tratar os prazos?', 'Há aplicação faseada. Consulte o texto e as atualizações oficiais para o cenário concreto.'],
    ['ISO 42001 e LGPD substituem a análise do AI Act?', 'Não. São instrumentos diferentes: regulação, norma de gestão e lei de proteção de dados.'],
  ],
}

export const flashcards: Flashcard[] = Object.entries(deck).flatMap(([module, cards]) =>
  cards.map(([front, back], i) => ({ id: `m${module}-c${i + 1}`, module: Number(module), front, back })),
)

export const flashcardsOfModule = (module: number) => flashcards.filter((c) => c.module === module)
