import type { Materia } from '../types'

export const isoIec42001: Materia = {
  slug: "iso-iec-42001",
  moduleIndex: 5,
  number: "06",
  title: "ISO/IEC 42001",
  summary: "Entenda como um sistema de gestão transforma intenções sobre IA em processos, responsabilidades e evidências.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 16/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "Sistema de gestão de IA",
      html: `<p>A ISO/IEC 42001:2023 estabelece requisitos e orientações para um <strong>sistema de gestão de inteligência artificial</strong>. É uma norma internacional de sistema de gestão específica para IA, que pode ser usada por organizações que desenvolvem, fornecem ou usam produtos e serviços baseados em IA. Um sistema de gestão reúne políticas, objetivos, processos e responsabilidades para organizar o desenvolvimento, o fornecimento ou o uso de IA.</p>
<div class="callout"><p class="callout-title">Em palavras simples</p><p>Um sistema de gestão não garante que cada decisão seja a certa. Ele garante que existe um jeito <em>combinado, registrado e revisado</em> de decidir: quem aprova, o que se verifica, o que se guarda como prova e como se melhora depois de um erro.</p></div>
<p>O foco não é escolher um algoritmo ou garantir que uma resposta esteja sempre correta. A organização precisa demonstrar como toma decisões, acompanha seus sistemas e melhora o que faz. Esta matéria é uma explicação didática; não reproduz o texto integral da norma, que deve ser obtida junto à ISO ou a seus representantes.</p>
<h3>O ciclo da gestão</h3>
<p>Como outras normas de sistemas de gestão, a 42001 se apoia em um ciclo: <strong>planejar</strong> (definir contexto, riscos e objetivos), <strong>fazer</strong> (executar os processos), <strong>verificar</strong> (medir e auditar) e <strong>agir</strong> (corrigir e melhorar). Esses elementos precisam conversar entre si: uma política só tem efeito se orientar atividades e produzir evidências observáveis.</p>
<h3>A estrutura: sete grandes temas</h3>
<p>Os requisitos principais estão nas cláusulas 4 a 10, a mesma estrutura de outras normas de gestão, como a de segurança da informação (ISO/IEC 27001), o que facilita integrá-los:</p>
<ol>
<li><strong>Contexto da organização:</strong> quem somos, que papel temos em relação à IA, quem são as partes interessadas, qual é o escopo do sistema de gestão.</li>
<li><strong>Liderança:</strong> compromisso da direção, política de IA e atribuição de responsabilidades.</li>
<li><strong>Planejamento:</strong> riscos e oportunidades, avaliação de riscos de IA, avaliação de impacto, objetivos e a escolha dos controles.</li>
<li><strong>Apoio:</strong> recursos, competência, conscientização, comunicação e informação documentada.</li>
<li><strong>Operação:</strong> execução dos processos planejados, incluindo a avaliação de riscos e de impacto repetida quando necessário.</li>
<li><strong>Avaliação de desempenho:</strong> monitoramento, auditoria interna e análise crítica pela direção.</li>
<li><strong>Melhoria:</strong> tratamento de não conformidades, ação corretiva e melhoria contínua.</li>
</ol>
<h3>Os anexos</h3>
<ul>
<li><strong>Anexo A:</strong> controles de referência (veja a próxima leitura).</li>
<li><strong>Anexo B:</strong> orientação para implementar os controles.</li>
<li><strong>Anexo C:</strong> objetivos e fontes de risco típicas de IA, para inspirar a análise.</li>
<li><strong>Anexo D:</strong> uso do sistema de gestão em diferentes domínios e setores.</li>
</ul>
<p><strong>Exemplo:</strong> declarar que “sistemas de IA devem ter responsáveis” é uma intenção. Ter um inventário atualizado, responsáveis identificados e um fluxo para aprovar mudanças mostra como a intenção é aplicada.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Política, processo e evidência no cotidiano",
      html: `<p>Imagine que três equipes usam assistentes de IA, cada uma com um fornecedor e uma base de documentos. Sem coordenação, ninguém sabe quais dados são enviados, quem aprova mudanças ou quem deve agir em um incidente.</p>
<h3>Primeiro, tornar o cenário visível</h3>
<p>Uma abordagem de gestão começa por um <strong>inventário</strong>. Ele precisa de manutenção definida: não pode depender de uma pessoa lembrar de atualizá-lo.</p>
<div class="table-wrap" role="region" aria-label="Tabela: campos de um inventário de sistemas de IA" tabindex="0">
<table>
<caption>Campos úteis para um inventário. Os exemplos são fictícios.</caption>
<thead><tr><th scope="col">Campo</th><th scope="col">Por que existe</th><th scope="col">Exemplo</th></tr></thead>
<tbody>
<tr><th scope="row">Sistema e finalidade</th><td>Dizer para que serve e para que não serve</td><td>Assistente de resumo de contratos</td></tr>
<tr><th scope="row">Responsável</th><td>Alguém responde pelas decisões</td><td>Gerente de jurídico digital</td></tr>
<tr><th scope="row">Fornecedor e modelo</th><td>Saber de onde vem e quando muda</td><td>Fornecedor X, modelo Y, versão fixada</td></tr>
<tr><th scope="row">Dados envolvidos</th><td>Conectar a privacidade e a segurança</td><td>Contratos; dados pessoais de contato</td></tr>
<tr><th scope="row">Usuários e afetados</th><td>Mapear quem sofre as consequências</td><td>Time jurídico; contrapartes</td></tr>
<tr><th scope="row">Última avaliação</th><td>Mostrar que a revisão acontece</td><td>Data e referência do relatório</td></tr>
</tbody>
</table>
</div>
<h3>Depois, transformar decisões recorrentes em processos</h3>
<p>Antes de liberar uma integração, a equipe avalia riscos e registra a aprovação. Quando um fornecedor muda uma condição importante, alguém revisa o impacto. Quando aparece um incidente, existe um caminho para investigar e corrigir. Cada um desses momentos produz um registro.</p>
<p><strong>Evidência</strong> é o registro que ajuda a verificar se a atividade aconteceu e qual foi o resultado: avaliação de risco, decisão de aprovação, relatório de teste, revisão de acesso ou ação corretiva. Quantidade de documentos não é o mesmo que efetividade.</p>
<h3>O que a norma pede além da política</h3>
<ul>
<li><strong>Avaliação de riscos de IA:</strong> processo repetível para identificar e analisar riscos do sistema e da organização.</li>
<li><strong>Avaliação de impacto do sistema de IA:</strong> consideração dos efeitos sobre pessoas, grupos e a sociedade, e não apenas sobre a empresa. Há uma norma complementar específica sobre o tema, a ISO/IEC 42005.</li>
<li><strong>Declaração de aplicabilidade:</strong> lista dos controles escolhidos, com a justificativa de incluir ou excluir cada um.</li>
</ul>
<h3>O Anexo A em nove grupos</h3>
<p>O Anexo A traz 38 controles de referência, organizados em nove grupos. A organização decide quais se aplicam e justifica.</p>
<div class="table-wrap" role="region" aria-label="Tabela: grupos de controles do Anexo A" tabindex="0">
<table>
<caption>Os nove grupos e uma pergunta para cada um.</caption>
<thead><tr><th scope="col">Grupo</th><th scope="col">Pergunta que ele ajuda a responder</th></tr></thead>
<tbody>
<tr><th scope="row">A.2 Políticas relacionadas à IA</th><td>Quais regras a organização adotou e quem as aprova?</td></tr>
<tr><th scope="row">A.3 Organização interna</th><td>Quem tem qual papel e como se reporta uma preocupação?</td></tr>
<tr><th scope="row">A.4 Recursos para sistemas de IA</th><td>Que dados, ferramentas, pessoas e infraestrutura sustentam o sistema?</td></tr>
<tr><th scope="row">A.5 Avaliação de impactos</th><td>Quem pode ser afetado e como isso foi avaliado e registrado?</td></tr>
<tr><th scope="row">A.6 Ciclo de vida do sistema</th><td>Como se projeta, verifica, valida, implanta, opera e monitora?</td></tr>
<tr><th scope="row">A.7 Dados para sistemas de IA</th><td>De onde vêm os dados, como são preparados e qual é a qualidade?</td></tr>
<tr><th scope="row">A.8 Informação para partes interessadas</th><td>O que usuários e outros precisam saber, e como relatar problemas?</td></tr>
<tr><th scope="row">A.9 Uso de sistemas de IA</th><td>Como se garante que o sistema é usado como previsto?</td></tr>
<tr><th scope="row">A.10 Terceiros e clientes</th><td>Como se gerenciam fornecedores, e as responsabilidades com clientes?</td></tr>
</tbody>
</table>
</div>
<p>Esses são exemplos de implementação para estudo. A adequação depende do escopo do sistema de gestão e das circunstâncias da organização.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Avaliar e melhorar continuamente",
      html: `<p>Compare objetivos com resultados. Se a organização definiu que toda integração tem responsável, verifique se o inventário realmente cobre os sistemas em uso. Se estabeleceu revisão de riscos antes de mudanças relevantes, examine mudanças concretas e suas evidências. É nesse confronto entre o que está escrito e o que acontece que o sistema de gestão se prova.</p>
<h3>Auditoria interna e análise crítica</h3>
<p>A <strong>auditoria interna</strong> é uma checagem planejada, feita por pessoas com independência em relação ao processo auditado. Ela busca evidências de que os processos existem, são seguidos e funcionam. A <strong>análise crítica pela direção</strong> leva os resultados a quem decide, para definir recursos, prioridades e mudanças.</p>
<h3>Quando algo falha: causa, não só a correção</h3>
<p>Um problema observado deve levar à análise da causa. Veja um exemplo:</p>
<ol>
<li><strong>Constatação:</strong> um assistente de vendas está em uso, mas não está no inventário.</li>
<li><strong>Correção imediata:</strong> adicionar a linha na planilha e avaliar o sistema.</li>
<li><strong>Causa:</strong> a equipe de vendas desconhecia o processo de cadastro.</li>
<li><strong>Ação corretiva:</strong> incluir o cadastro no fluxo de aquisição de ferramentas e treinar as equipes.</li>
<li><strong>Verificação:</strong> na próxima auditoria, comparar o inventário com as contas pagas e as integrações ativas.</li>
</ol>
<p>Apenas corrigir a linha da planilha não resolve a possibilidade de repetição. Comunicação, responsabilidades ou processo podem precisar mudar.</p>
<h3>Certificação: o que ela diz e o que não diz</h3>
<p>Uma organização pode buscar a <strong>certificação</strong> do seu sistema de gestão por um organismo de certificação, que audita o escopo declarado. O certificado indica que aquele sistema de gestão atende aos requisitos da norma no escopo avaliado, e normalmente exige auditorias periódicas de acompanhamento. Ele <strong>não</strong> demonstra ausência de vulnerabilidades em cada produto e não substitui a análise das leis aplicáveis. Testes técnicos e governança cumprem funções relacionadas, mas diferentes.</p>
<div class="callout is-warn"><p class="callout-title">Erro comum</p><p>Tratar a norma como um selo que elimina a necessidade de revisão. O sistema de gestão precisa acompanhar mudanças na tecnologia, nas pessoas e na finalidade de uso. Papel em ordem com processo que ninguém segue é a falha mais comum.</p></div>
<h3>O que é diferente da segurança técnica</h3>
<ul>
<li>A norma pergunta se o <strong>processo</strong> de decidir e verificar existe e funciona. Um teste de invasão pergunta se uma <strong>falha específica</strong> é explorável.</li>
<li>Um bom processo aumenta a chance de problemas técnicos serem encontrados e corrigidos. Mas um processo sem testes técnicos não mostra a falha em si.</li>
<li>Uma boa prática técnica sem processo tende a depender de pessoas específicas e some quando elas saem.</li>
</ul>
<p><strong>Para AppSec:</strong> conecte requisitos de segurança ao processo de entrega e às evidências que já fazem sentido para a equipe. Uma verificação de permissões no RAG pode apoiar a decisão de liberar uma integração; o relatório de red teaming pode ser evidência de verificação e validação; a revisão trimestral de contas de serviço, de controle de acesso.</p>
<p><strong>Exercício:</strong> escolha uma política (por exemplo, “toda integração com modelo externo é aprovada antes de ir para produção”) e descreva o processo, o responsável e três evidências que um auditor poderia pedir para confirmar que ela é cumprida.</p>`,
    },
  ],
  recap: [
    "A ISO/IEC 42001:2023 define requisitos de um sistema de gestão de IA: políticas, processos, responsabilidades e evidências, em um ciclo de planejar, executar, verificar e melhorar.",
    "Os requisitos principais estão nas cláusulas 4 a 10 (contexto, liderança, planejamento, apoio, operação, avaliação de desempenho e melhoria), na mesma estrutura de outras normas de gestão.",
    "O Anexo A traz 38 controles em nove grupos. A organização escolhe os aplicáveis e justifica o que inclui e o que exclui.",
    "Um inventário vivo, com responsável e manutenção definida, é a base para avaliar riscos, impactos e mudanças.",
    "Evidência é o registro que mostra que a atividade aconteceu e qual foi o resultado. Quantidade de documentos não é efetividade.",
    "Certificação mostra que o sistema de gestão atende à norma no escopo auditado. Não prova ausência de vulnerabilidades nem substitui o cumprimento de leis.",
  ],
  glossary: [
    { term: "Ação corretiva", definition: "Medida que elimina a causa de um problema para que ele não se repita, além de corrigir o caso observado." },
    { term: "Análise crítica pela direção", definition: "Revisão periódica do sistema de gestão pela liderança, com decisões sobre recursos e melhorias." },
    { term: "Auditoria interna", definition: "Verificação planejada, feita pela própria organização com independência, para checar se o sistema de gestão é seguido e funciona." },
    { term: "Avaliação de impacto", definition: "Análise dos efeitos de um sistema de IA sobre pessoas, grupos e a sociedade." },
    { term: "Declaração de aplicabilidade", definition: "Documento que lista os controles escolhidos e justifica a inclusão ou a exclusão de cada um." },
    { term: "Escopo", definition: "Limite do que o sistema de gestão cobre: sistemas, unidades e atividades." },
    { term: "Evidência", definition: "Registro verificável de que uma atividade foi executada e do que resultou dela." },
    { term: "Inventário de sistemas de IA", definition: "Lista com finalidade, responsável, fornecedor, dados e data da última revisão de cada sistema." },
    { term: "Melhoria contínua", definition: "Ciclo permanente de medir, corrigir e aprimorar processos." },
    { term: "Não conformidade", definition: "Requisito que não está sendo cumprido, seja da norma, seja da própria organização." },
    { term: "Parte interessada", definition: "Pessoa ou organização que afeta, é afetada por ou tem interesse no sistema de IA." },
    { term: "Sistema de gestão", definition: "Conjunto de políticas, processos e responsabilidades para atingir objetivos de forma organizada e melhorada continuamente." },
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
<li>ISO/IEC 42005: avaliação de impacto de sistemas de IA (norma complementar).</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa. A norma completa é de acesso pago; confirme os requisitos no texto oficial antes de usá-los em auditoria ou certificação.</p>`,
  },
}
