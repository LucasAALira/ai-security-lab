/** Os sete campos da ADR simplificada do modo Arquiteto, iguais em todos os projetos. */
export const ADR_FIELDS: { label: string; hint: string }[] = [
  { label: 'Contexto', hint: 'Requisitos, restrições e as ameaças críticas que motivam a decisão.' },
  { label: 'Decisão', hint: 'Quais controles entram, onde cada um fica e quais são obrigatórios.' },
  { label: 'Alternativas', hint: 'Pelo menos uma opção que você descartou.' },
  { label: 'Justificativa', hint: 'Por que esta escolha, ligando controles a ameaças e aos critérios.' },
  { label: 'Consequências', hint: 'O que melhora e o que custa, inclusive para quem opera.' },
  { label: 'Risco residual', hint: 'O que continua sem solução, quem aceita e até quando.' },
  { label: 'Plano de validação', hint: 'Testes repetíveis e quando a decisão será revista.' },
]
