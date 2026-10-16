import type { Materia } from '../types'

export const lgpdIa: Materia = {
  slug: "lgpd-ia",
  moduleIndex: 6,
  number: "07",
  title: "LGPD aplicada à inteligência artificial",
  summary: "Aprenda a reconhecer o tratamento de dados pessoais nos fluxos de IA e a relacioná-lo a finalidade, necessidade e proteção.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "O que muda quando os dados entram na IA",
      html: `<p>A LGPD disciplina o tratamento de dados pessoais. Usar um modelo não remove automaticamente essa natureza: uma pergunta, um documento, um registro de conversa ou uma resposta pode se referir a uma pessoa identificada ou identificável.</p>
<p>Dados pessoais sensíveis têm tratamento específico na lei. Informações sobre saúde, por exemplo, exigem atenção diferente de um simples dado de contato. Não escolha uma hipótese legal só porque ela parece conveniente; a análise depende do tratamento e da categoria de dados.</p>
<p>Em IA, acompanhe o fluxo inteiro: coleta, envio ao modelo, recuperação de documentos, armazenamento, logs, uso da resposta e descarte. Um dado pode ficar em vários componentes, com operadores e finalidades diferentes.</p>
<p><strong>Exemplo:</strong> remover o nome de um currículo não garante anonimização se outros elementos ainda permitem identificar a pessoa. Da mesma forma, transformar texto em uma representação vetorial não deve ser tratado automaticamente como anonimização.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Finalidade, necessidade e direitos",
      html: `<p>O princípio da finalidade exige propósito legítimo, específico e informado; a necessidade direciona o uso ao que é pertinente e proporcional. Transparência, segurança e prevenção também orientam decisões sobre o fluxo.</p>
<p><strong>Caso didático:</strong> um copiloto de RH prepara uma visão geral de candidaturas. Pergunte quais informações são realmente necessárias, quem pode consultar os resultados e se o fornecedor utiliza os dados para outra finalidade. Ter acesso técnico a uma base não significa que todos os usos sejam adequados.</p>
<p>A hipótese legal deve corresponder ao caso; consentimento não é a única possibilidade prevista na lei nem uma solução automática para qualquer uso. Avalie separadamente situações que envolvam dados sensíveis.</p>
<p>O art. 20 trata do direito de solicitar revisão de decisões tomadas unicamente com base em tratamento automatizado de dados pessoais que afetem interesses do titular. Não confunda uma ferramenta de apoio com uma decisão exclusivamente automatizada sem analisar o fluxo real.</p>
<p>Para atender direitos, a organização precisa localizar dados e entender onde são usados. Histórico de conversas, documentos recuperados e registros técnicos entram nesse mapeamento.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Controles e análise aplicada",
      html: `<p>Para o copiloto de RH, uma proposta de controle pode limitar o acesso por função, reduzir o conteúdo enviado ao modelo, definir retenção e registrar decisões importantes. O desenho deve considerar a finalidade e o risco, não apenas conveniência técnica.</p>
<p>Considere três pontos: o currículo original, o contexto enviado ao modelo e o resumo armazenado. Cada um pode ter responsáveis, permissões e prazos diferentes. Uma correção no resumo não apaga automaticamente o original ou uma cópia em log.</p>
<p>Analise também a relação com fornecedores e eventuais transferências internacionais. A localização do serviço, as instruções de tratamento e as condições de uso precisam ser compreendidas no caso concreto.</p>
<p><strong>Erro comum:</strong> concluir que um sistema está adequado à LGPD porque tem criptografia. A proteção técnica é relevante, mas não responde sozinha às perguntas sobre finalidade, base legal, necessidade ou direitos.</p>
<p><strong>Atividade:</strong> descreva quais dados o copiloto recebe, por que precisa deles e quem pode acessá-los. Para cada cópia, proponha retenção e um procedimento para localizar o registro quando necessário. Este exercício organiza a análise; não constitui uma conclusão jurídica de conformidade.</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>No caso do copiloto de RH, escolha três pontos de tratamento. Explique finalidade, necessidade, controle de acesso e retenção em cada um. Diferencie apoio à decisão de decisão unicamente automatizada.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>Lei nº 13.709/2018 (LGPD), texto compilado: arts. 5º, 6º, 7º, 11, 18, 20 e 46.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
