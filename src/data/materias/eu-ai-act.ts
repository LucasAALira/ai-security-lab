import type { Materia } from '../types'

export const euAiAct: Materia = {
  slug: "eu-ai-act",
  moduleIndex: 7,
  number: "08",
  title: "EU AI Act",
  summary: "Entenda por que finalidade, papel da organização e contexto de uso são essenciais para analisar o regulamento europeu.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "A lógica da regulação",
      html: `<p>O Regulamento (UE) 2024/1689, conhecido como AI Act, estabelece regras para inteligência artificial. A análise não começa apenas pelo tamanho do modelo: é preciso entender o sistema, sua finalidade, o papel da organização e o âmbito de aplicação.</p>
<p>A abordagem diferencia práticas proibidas, sistemas de alto risco e obrigações como transparência em situações específicas. Também há regras próprias para modelos de propósito geral. Essas categorias não devem ser reduzidas a uma etiqueta única aplicada a toda tecnologia de IA.</p>
<p><strong>Exemplo:</strong> o mesmo modelo pode integrar um assistente que organiza rascunhos ou um sistema usado em seleção de candidatos. O uso e o contexto mudam as perguntas regulatórias, mesmo que o componente técnico seja semelhante.</p>
<p>Esta matéria explica a estrutura de análise. A aplicação é faseada e pode ser objeto de alterações e orientações; não se presume uma data universal para todas as obrigações.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Papéis, risco e obrigações",
      html: `<p>Diferencie quem desenvolve ou disponibiliza um sistema de quem o utiliza em sua atividade. Alterações no sistema ou na finalidade podem afetar os papéis e responsabilidades. Essa identificação deve ser feita com os fatos da operação.</p>
<p>Em sistemas de alto risco, temas relevantes incluem gestão de riscos, qualidade dos dados, documentação, registros, supervisão humana, robustez e segurança. Quais requisitos e obrigações cabem a cada parte depende do enquadramento.</p>
<p><strong>Caso didático A:</strong> um chatbot de atendimento informa condições gerais de entrega. Investigue se a pessoa sabe que interage com IA, quais dados são usados e se o sistema executa decisões com outros efeitos.</p>
<p><strong>Caso didático B:</strong> um sistema classifica candidatos para apoiar recrutamento. Investigue sua finalidade exata, influência sobre a seleção, contexto de uso e os critérios regulatórios relevantes. Não conclua o enquadramento só pelo nome comercial “copiloto”.</p>
<p>Os casos são exercícios de raciocínio. Eles não substituem a avaliação das disposições aplicáveis, das exceções e do papel concreto de cada organização.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Como organizar a análise em AppSec",
      html: `<p>Monte uma ficha com finalidade, usuários, pessoas afetadas, fornecedor, organização responsável, dados, decisões apoiadas ou executadas e mercados envolvidos. Depois identifique quais informações ainda faltam para avaliar aplicação, classificação e obrigações.</p>
<p>Para o caso de recrutamento, uma equipe de segurança pode produzir evidências de autorização, integridade dos dados, rastreabilidade de mudanças e comportamento das integrações. Essas evidências apoiam a análise, mas não determinam sozinhas o enquadramento jurídico.</p>
<p>Não confunda instrumentos. O NIST AI RMF oferece uma estrutura voluntária de gestão de riscos; a ISO/IEC 42001 trata de um sistema de gestão; a LGPD regula tratamento de dados pessoais em seu âmbito. Nenhum deles substitui automaticamente o AI Act.</p>
<p><strong>Erro comum:</strong> usar a certificação de um sistema de gestão como conclusão de que todas as obrigações europeias foram atendidas. É necessário verificar o que se aplica ao sistema, ao papel e ao período em questão.</p>
<p><strong>Exercício:</strong> compare os dois casos desta página. Liste cinco fatos necessários para a análise e associe cada fato a uma evidência que a empresa poderia manter. O objetivo é reduzir suposições e tornar a decisão revisável.</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Compare o chatbot de entregas e o sistema de recrutamento. Liste finalidade, papel da organização, pessoas afetadas e informações que faltam para avaliar enquadramento e obrigações.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>Regulamento (UE) 2024/1689 — AI Act.</li>
<li>Comissão Europeia: visão geral do marco regulatório e abordagem europeia de IA.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
