import type { Materia } from '../types'

export const isoIec42001: Materia = {
  slug: "iso-iec-42001",
  moduleIndex: 5,
  number: "06",
  title: "ISO/IEC 42001",
  summary: "Entenda como um sistema de gestão transforma intenções sobre IA em processos, responsabilidades e evidências.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "Sistema de gestão de IA",
      html: `<p>A ISO/IEC 42001:2023 estabelece requisitos e orientações para um sistema de gestão de inteligência artificial. Um sistema de gestão reúne políticas, objetivos, processos e responsabilidades para organizar o desenvolvimento, o fornecimento ou o uso de IA.</p>
<p>O foco não é escolher um algoritmo ou garantir que uma resposta esteja sempre correta. A organização precisa demonstrar como toma decisões, acompanha seus sistemas e melhora o que faz. Esta matéria é uma explicação didática; não reproduz o texto integral da norma.</p>
<p>Os temas de estudo incluem contexto, liderança, planejamento, suporte, operação, avaliação de desempenho e melhoria. Esses elementos precisam conversar entre si: uma política só tem efeito se orientar atividades e produzir evidências observáveis.</p>
<p><strong>Exemplo:</strong> declarar que “sistemas de IA devem ter responsáveis” é uma intenção. Ter um inventário atualizado, responsáveis identificados e um fluxo para aprovar mudanças mostra como a intenção é aplicada.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Política, processo e evidência no cotidiano",
      html: `<p>Imagine que três equipes usam assistentes de IA, cada uma com um fornecedor e uma base de documentos. Sem coordenação, ninguém sabe quais dados são enviados, quem aprova mudanças ou quem deve agir em um incidente.</p>
<p>Uma abordagem de gestão começa por tornar esse cenário visível. Um inventário pode registrar finalidade, proprietário, fornecedor, usuários, dados envolvidos e última revisão. A informação precisa ter manutenção definida, não depender de uma pessoa lembrar de atualizar.</p>
<p>Depois, decisões recorrentes viram processos. Antes de liberar uma integração, a equipe avalia riscos e registra a aprovação. Quando um fornecedor muda uma condição importante, alguém revisa o impacto. Quando aparece um incidente, existe um caminho para investigar e corrigir.</p>
<p><strong>Evidência</strong> é o registro que ajuda a verificar se a atividade aconteceu e qual foi o resultado: avaliação de risco, decisão de aprovação, relatório de teste, revisão de acesso ou ação corretiva. Quantidade de documentos não é o mesmo que efetividade.</p>
<p>Esses são exemplos de implementação para estudo. A adequação depende do escopo do sistema de gestão e das circunstâncias da organização.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Avaliar e melhorar continuamente",
      html: `<p>Compare objetivos com resultados. Se a organização definiu que toda integração tem responsável, verifique se o inventário realmente cobre os sistemas em uso. Se estabeleceu revisão de riscos antes de mudanças relevantes, examine mudanças concretas e suas evidências.</p>
<p>Um problema observado deve levar à análise da causa. Se uma equipe omitiu um sistema do inventário porque o processo era desconhecido, apenas corrigir a linha da planilha não resolve a possibilidade de repetição. Comunicação, responsabilidades ou processo podem precisar mudar.</p>
<p>Uma certificação de sistema de gestão não demonstra ausência de vulnerabilidades em cada produto e não substitui a análise das leis aplicáveis. Testes técnicos e governança cumprem funções relacionadas, mas diferentes.</p>
<p><strong>Para AppSec:</strong> conecte requisitos de segurança ao processo de entrega e às evidências que já fazem sentido para a equipe. Uma verificação de permissões no RAG pode apoiar a decisão de liberar uma integração.</p>
<p><strong>Erro comum:</strong> tratar a norma como um selo que elimina a necessidade de revisão. O sistema de gestão precisa acompanhar mudanças na tecnologia, nas pessoas e na finalidade de uso.</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Usando o exemplo das três equipes, proponha os campos de um inventário e explique quem o atualizaria. Escolha uma política e descreva o processo e a evidência que demonstrariam sua aplicação.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>ISO/IEC 42001:2023 — visão geral oficial sobre sistemas de gestão de IA.</li>
<li>ISO: ISO/IEC 42001 explained.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
