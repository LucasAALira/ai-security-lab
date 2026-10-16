import type { Materia } from '../types'

export const mitreAtlas: Materia = {
  slug: "mitre-atlas",
  moduleIndex: 2,
  number: "03",
  title: "MITRE ATLAS",
  summary: "Use uma linguagem de comportamentos adversariais para organizar hipóteses, evidências e oportunidades de defesa.",
  note: "Texto didático original · Exemplos fictícios · Revisão: 15/10/2026",
  sections: [
    {
      id: "compreender",
      eyebrow: "LEITURA 1 DE 3",
      heading: "Tática, técnica e procedimento",
      html: `<p>MITRE ATLAS é uma base de conhecimento sobre comportamento adversarial envolvendo sistemas de IA. Ela reúne táticas, técnicas e casos para ajudar a entender como ameaças podem se manifestar. O foco é a ação do adversário e sua relação com o sistema.</p>
<p><strong>Tática</strong> representa o objetivo em uma etapa. <strong>Técnica</strong> descreve uma forma de alcançar esse objetivo. <strong>Procedimento</strong> é uma realização concreta dessa forma em determinado ambiente. Pense na diferença entre “obter informação restrita”, o comportamento usado para isso e a sequência específica observada em um caso.</p>
<p>ATLAS complementa a análise de aplicações e infraestruturas. Não é sinônimo de um scanner, nem uma lista de todos os controles obrigatórios. Seu uso exige contexto e evidência, porque nomes parecidos podem esconder comportamentos diferentes.</p>
<p>O objetivo desta matéria é ensinar o raciocínio de mapeamento. O caso a seguir é didático e não é apresentado como um incidente oficial da MITRE.</p>`,
    },
    {
      id: "conectar",
      eyebrow: "LEITURA 2 DE 3",
      heading: "Um caso explicado em etapas",
      html: `<p><strong>Ambiente:</strong> um copiloto consulta uma base de documentos e pode solicitar acesso a arquivos. <strong>Condição inicial:</strong> um colaborador externo consegue enviar um documento para uma área que depois será consultada.</p>
<p><strong>Comportamento observado:</strong> o documento contém instruções para procurar informação de outro departamento. Quando recuperado, o modelo propõe uma chamada à ferramenta. O backend recusa porque o usuário não tem acesso ao recurso.</p>
<p>Separe fatos e hipóteses. O envio e a recuperação do documento foram observados. A proposta de chamada também. A obtenção do conteúdo restrito não aconteceu. Registrar “exfiltração concluída” seria incorreto nesse cenário.</p>
<p>Um mapeamento útil começa pela descrição da ação: a instrução chegou por conteúdo externo e tentou redirecionar o sistema. Depois, compara-se essa descrição com a definição da técnica pertinente. Um identificador só deve ser usado quando sua correspondência for confirmada na versão de referência.</p>
<p>A telemetria relevante pode incluir origem do documento, identidade do solicitante, recurso pedido e decisão da ferramenta. Não é necessário gravar todo o conteúdo sensível para produzir evidência útil.</p>`,
    },
    {
      id: "aplicar",
      eyebrow: "LEITURA 3 DE 3",
      heading: "Do mapeamento à decisão de defesa",
      html: `<p>Use uma ficha curta: objetivo adversarial, condição necessária, comportamento observado, componente afetado, evidência, controle e limite da conclusão. Essa ficha permite que outra pessoa revise o raciocínio.</p>
<p>No caso didático, há pelo menos duas oportunidades de defesa: controlar o processo de entrada de documentos e autorizar a leitura de arquivos. A segunda funcionou no exemplo, mas a primeira pode precisar de revisão. O registro não deve reduzir tudo a “o modelo falhou”.</p>
<p>ATLAS e OWASP respondem a perguntas diferentes. O OWASP ajuda a organizar classes de risco da aplicação; ATLAS ajuda a descrever comportamentos adversariais. Uma mesma avaliação pode usar ambos, sem presumir correspondência de um para um.</p>
<p><strong>Erro comum:</strong> selecionar uma técnica apenas pelo título. Uma frase vaga como “ataque à IA” não informa pré-condição, evidência ou impacto. Uma descrição precisa permite planejar testes e identificar quais registros faltam.</p>
<p><strong>Exercício de análise:</strong> se a ferramenta passasse a permitir acesso com uma conta de serviço irrestrita, qual consequência deixaria de ser hipótese? Que evidência adicional seria necessária para comprová-la?</p>`,
    },
  ],
  research: {
    heading: "Pesquisa orientada e revisão",
    html: `<p>Releia o caso didático e registre objetivo, acesso inicial, comportamento, evidência e duas oportunidades de defesa. Diferencie a tentativa bloqueada de um vazamento efetivo.</p>
<p>Registre sua descoberta e responda às questões no painel do módulo. A leitura pode ser marcada aqui ou no painel: cada parte concede XP apenas uma vez.</p>`,
  },
  bibliography: {
    heading: "Base conceitual desta matéria",
    html: `<ul>
<li>MITRE ATLAS: base de conhecimento de táticas, técnicas e casos.</li>
<li>MITRE ATLAS Fact Sheet.</li>
</ul>
<p>As explicações e os exercícios estão nesta página. As referências acima identificam a base do conteúdo e não exigem navegação externa.</p>`,
  },
}
