import type { Materia } from '../types'

export const redTeamingIa: Materia = {
  slug: "red-teaming-ia",
  moduleIndex: 3,
  number: "04",
  title: "Red teaming em IA",
  summary: "Estruture avaliações adversariais que gerem evidência útil para corrigir sistemas de IA.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que se pretende avaliar",
      html: `<p>Red teaming em IA usa uma perspectiva adversarial para investigar como um sistema pode falhar diante de comportamentos inesperados ou abusivos. O objeto pode incluir modelo, implementação, infraestrutura e comportamento durante a operação.</p>
<p>Não se resume a encontrar uma frase que faça o chatbot responder de modo inadequado. Uma avaliação pode examinar acesso a dados, ferramentas, isolamento entre clientes e caminhos de decisão. A pergunta é: que consequência a combinação desses componentes permite?</p>
<p>Um teste de vulnerabilidade costuma verificar uma condição específica. Uma campanha de red teaming pode encadear condições para avaliar um objetivo mais amplo. A distinção não depende apenas da ferramenta utilizada.</p>
<p><strong>Exemplo:</strong> o objetivo de uma campanha pode ser verificar se um usuário de suporte consegue provocar alteração de dados financeiros. Isso exige entender identidade, permissões e execução, além do texto produzido pelo modelo.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Planejamento e evidência",
      html: `<p>Defina ambiente autorizado, usuários de teste, dados sintéticos, funcionalidades incluídas, limites de execução e critérios de interrupção. A autorização deve corresponder aos componentes efetivamente avaliados.</p>
<p>Transforme cada ideia em uma hipótese. Por exemplo: “um documento recuperado pode induzir o agente a solicitar um arquivo fora do escopo do usuário”. Registre a pré-condição e o comportamento seguro esperado antes de observar a resposta.</p>
<p><strong>Caso didático:</strong> um assistente de RH tem cinco casos: pergunta legítima; consulta a documento de outra função; documento contendo instrução indevida; solicitação de ferramenta fora da função; resposta que afirma uma política inexistente. Cada caso investiga uma hipótese distinta.</p>
<p>Guarde versão, configuração relevante, entrada, saída e decisões das integrações. Quando há variabilidade, repita e registre quantas execuções produziram o comportamento. Uma taxa sem denominador ou sem descrição da amostra é difícil de interpretar.</p>
<p>Adicione controles positivos: o assistente deve continuar atendendo pedidos legítimos. Uma defesa que recusa tudo não demonstra qualidade operacional.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Interpretação, correção e reteste",
      html: `<p>Uma tentativa pode ser bloqueada em diferentes pontos. Se o modelo solicita uma ação indevida e a ferramenta nega, existe um comportamento adversarial relevante, mas o controle de consequência funcionou. Se a ferramenta executa, a evidência e a prioridade mudam.</p>
<p><strong>Exemplo numérico:</strong> em dez repetições de um caso, duas retornaram um marcador restrito. Registre “2 de 10 neste caso e nesta configuração”. Não conclua que o sistema tem 20% de risco geral nem compare esse número com outra campanha de escopo diferente.</p>
<p>Uma recomendação precisa nomear o componente e o controle. “Melhorar o prompt” é insuficiente quando a busca ignora permissões. “Aplicar o escopo do usuário na recuperação e testar troca de cliente” indica uma correção verificável.</p>
<p>Após corrigir, execute o caso original, variações pertinentes e o controle positivo. Registre também o que não foi testado. O resultado de uma campanha é limitado ao escopo, ao período e às condições observadas.</p>
<p><strong>Para o Security Champion:</strong> o valor está em traduzir o achado em uma mudança que a equipe consegue implementar, medir e manter, com responsável e prazo definidos.</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Use o caso de RH desta matéria para escrever duas hipóteses, o comportamento seguro esperado e a evidência necessária. Explique por que 2 falhas em 10 execuções não medem o risco geral.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>OWASP GenAI Red Teaming Guide.</li>
<li>OWASP DevSecOps Guideline: AI/LLM Application Security Testing and Red Teaming.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
