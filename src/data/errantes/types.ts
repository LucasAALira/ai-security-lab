import type { BossShape } from '@/components/gothic/BossArt'
import type { MissionContent } from '../campaigns/types'

/** Um guardião errante: não guarda módulo nenhum, aparece quando o descuido o chama.
 *  O combate é um exercício do mesmo motor das missões; o vilão é a moldura da história. */
export interface ErranteSpec {
  id: string
  nome: string
  epiteto: string
  /** Elemento da criatura — muda a cor e a silhueta nas crônicas. */
  elemento: 'gelo' | 'veneno'
  forma: BossShape
  /** O que ele faz, em uma frase, para a lista e para o leitor de tela. */
  resumo: string
  /** Fala do vilão, melancólica, mostrada antes do combate. */
  fala: string
  /** O exercício em si, já no formato das missões. */
  missao: MissionContent
}
