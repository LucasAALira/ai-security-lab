import type { Materia } from '../types'

export const owaspTop10Llm: Materia = {
  slug: "owasp-top-10-llm",
  moduleIndex: 0,
  number: "01",
  title: "OWASP Top 10 para LLM — edição 2025",
  summary: "Entenda os dez riscos e aprenda a localizar suas causas na aplicação, nos dados e nas integrações.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que o Top 10 organiza",
      html: `<p>Uma aplicação com LLM reúne mais do que um modelo. Ela recebe a pergunta, busca documentos, monta o contexto, solicita uma resposta e, em alguns casos, aciona ferramentas. O OWASP Top 10 ajuda a reconhecer classes importantes de risco nesse conjunto. Ele é um ponto de partida para análise, não uma garantia de que todos os problemas possíveis foram cobertos.</p>
<p>Esta matéria usa explicitamente a <strong>edição 2025</strong>, a mesma dos exercícios da trilha. Identificar a edição evita confundir números e nomes quando a lista é atualizada. A prioridade de correção depende do seu ambiente: uma ferramenta com acesso a pagamentos pode merecer atenção antes de um erro de resposta sem consequência operacional.</p>
<p>Considere um copiloto de atendimento. A pergunta vem do cliente, os documentos vêm de uma base interna e a ferramenta de estorno usa uma API. Cada passagem cria uma decisão de confiança: quem pode fornecer conteúdo, quais dados podem ser recuperados e quais ações podem ocorrer?</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Os dez riscos, com exemplos",
      html: `<dl class="concept-list">
<dt>LLM01 — Prompt Injection</dt>
<dd>Uma entrada tenta mudar as instruções ou o comportamento pretendido. Exemplo: um documento manda o assistente abandonar o resumo. Controle importante: impedir que o modelo conceda permissões às próprias ferramentas.</dd>
<dt>LLM02 — Sensitive Information Disclosure</dt>
<dd>Informações restritas aparecem em respostas ou outros fluxos. Exemplo: o bot de atendimento inclui dados de outro cliente. Reduza os dados enviados ao contexto e aplique autorização na origem.</dd>
<dt>LLM03 — Supply Chain</dt>
<dd>Dependências, modelos, componentes e fornecedores ampliam a superfície de risco. Exemplo: uma atualização de componente muda o comportamento da integração. Mantenha inventário, procedência e avaliação de mudanças.</dd>
<dt>LLM04 — Data and Model Poisoning</dt>
<dd>Dados ou componentes do modelo são manipulados para influenciar resultados. Exemplo: material adulterado passa a orientar respostas. Controle a origem e a integridade das entradas relevantes.</dd>
<dt>LLM05 — Improper Output Handling</dt>
<dd>A aplicação interpreta a saída do modelo sem proteção adequada. Exemplo: texto gerado é usado como HTML confiável. Valide e codifique a saída conforme o destino.</dd>
<dt>LLM06 — Excessive Agency</dt>
<dd>O agente recebe funções, permissões ou autonomia além da necessidade. Exemplo: um resumidor pode apagar arquivos. Limite capacidades e aplique aprovação para ações sensíveis.</dd>
<dt>LLM07 — System Prompt Leakage</dt>
<dd>As instruções internas são expostas. O problema se agrava quando contêm segredos ou substituem autorização. Credenciais de serviço devem ficar fora do prompt.</dd>
<dt>LLM08 — Vector and Embedding Weaknesses</dt>
<dd>Falhas na organização, proteção ou recuperação do conteúdo vetorial podem expor ou misturar dados. Exemplo: a busca entrega trechos de outro departamento. Aplique escopo de acesso antes da recuperação.</dd>
<dt>LLM09 — Misinformation</dt>
<dd>Informação incorreta pode ser apresentada de forma convincente. Exemplo: o assistente inventa uma política de reembolso. Verifique a evidência e estabeleça revisão proporcional ao impacto.</dd>
<dt>LLM10 — Unbounded Consumption</dt>
<dd>O consumo de recursos cresce sem limites adequados. Exemplo: um fluxo repete chamadas indefinidamente. Defina orçamento, limites, tempo máximo e critérios de parada.</dd>
</dl>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Como transformar a lista em controles",
      html: `<p>Comece pelo fluxo real. No copiloto de atendimento, anote quem consulta os documentos, qual conta acessa a base e quais operações a API de estorno permite. Em seguida, associe cada risco a uma condição concreta. “LLM06” sozinho não explica o problema; “a conta do bot pode estornar qualquer pedido sem validar o usuário” explica.</p>
<p>Uma mesma cadeia pode envolver vários riscos. Um documento malicioso pode provocar uma instrução indevida (LLM01), que solicita uma ferramenta com excesso de permissão (LLM06), resultando em exposição de dados (LLM02). Corrigir apenas a redação do prompt não elimina a capacidade de acesso indevido.</p>
<p><strong>Exemplo de evidência:</strong> uma conta fictícia de suporte tenta consultar um documento financeiro. O controle esperado é que a recuperação seja recusada antes de incluir o texto no contexto. Uma resposta que esconde o documento após já recebê-lo não demonstra isolamento completo.</p>
<p><strong>Erro comum:</strong> tratar a lista como uma classificação automática de severidade. Use impacto, alcance, pré-condições e controles existentes para decidir a prioridade.</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Compare LLM01 e LLM06 nesta página. Explique por que uma instrução maliciosa e uma permissão excessiva são problemas diferentes e como podem aparecer na mesma cadeia.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>OWASP Top 10 for LLM Applications, edição 2025.</li>
<li>OWASP GenAI Security Project: riscos e mitigação.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
