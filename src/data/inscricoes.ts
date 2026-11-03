/** Inscrições do santuário: frases curtas, melancólicas, no tom de quem escreveu numa pedra fria.
 *
 *  São originais, escritas para este projeto — nenhuma citação de jogo, livro ou filme. Falam de
 *  estudo, vigília e erro, que é do que este site trata, e nunca empurram ninguém a varar a noite
 *  ou a se cobrar além da conta: cansaço aqui é motivo de descanso, não de culpa. */

export interface Inscricao {
  /** O texto, sem aspas e sem ponto final quando já termina em pergunta. */
  texto: string
  /** Onde ela cabe melhor. `fogueira` é a legenda do descanso; `batalha`, as crônicas. */
  tom: 'fogueira' | 'batalha' | 'vigilia'
}

export const INSCRICOES: readonly Inscricao[] = [
  { texto: 'Descanse. A chama fica acesa enquanto você dorme.', tom: 'fogueira' },
  { texto: 'Nem toda noite pede vigília. Algumas pedem sono.', tom: 'fogueira' },
  { texto: 'O fogo não pergunta quanto você andou hoje.', tom: 'fogueira' },
  { texto: 'Senta-se aqui quem voltou, não quem venceu.', tom: 'fogueira' },
  { texto: 'A estrada estará aqui amanhã. Você também deveria estar.', tom: 'fogueira' },
  { texto: 'Há calor para quem chegou tarde.', tom: 'fogueira' },
  { texto: 'Quem guarda a porta também precisa dormir atrás dela.', tom: 'fogueira' },

  { texto: 'Toda sentinela já foi um andarilho com uma faca.', tom: 'vigilia' },
  { texto: 'A armadura é feita de erros que não se repetem.', tom: 'vigilia' },
  { texto: 'O que se aprende depressa, esquece-se depressa.', tom: 'vigilia' },
  { texto: 'Ninguém atravessa a nave inteira numa só noite.', tom: 'vigilia' },
  { texto: 'A dúvida pesa menos que a certeza errada.', tom: 'vigilia' },
  { texto: 'Grave o que aprendeu: a memória é de vidro.', tom: 'vigilia' },
  { texto: 'Um caminho conhecido ainda pede atenção.', tom: 'vigilia' },

  { texto: 'Caiu aqui quem veio desprevenido.', tom: 'batalha' },
  { texto: 'O guardião não odeia ninguém. Apenas não cede.', tom: 'batalha' },
  { texto: 'Derrotar não é entender. Volte quando quiser entender.', tom: 'batalha' },
  { texto: 'Há portas que só abrem para quem já errou diante delas.', tom: 'batalha' },
  { texto: 'Perder aqui custa tempo; perder lá fora custa mais.', tom: 'batalha' },
  { texto: 'Quem foge do guardião encontra-o depois, maior.', tom: 'batalha' },
  { texto: 'Nenhuma vitória aqui é definitiva. Só o aprendizado é.', tom: 'batalha' },
]

/** Uma inscrição estável: a mesma durante o dia inteiro, para o texto não dançar a cada clique. */
export function inscricaoDoDia(tom: Inscricao['tom'], dia: string, deslocamento = 0): string {
  const lista = INSCRICOES.filter((i) => i.tom === tom)
  let soma = deslocamento
  for (const letra of dia) soma = (soma * 31 + letra.charCodeAt(0)) % 100000
  return lista[soma % lista.length].texto
}
