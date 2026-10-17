import type { Lesson } from './types'

/* Aulas dos submódulos, por id. Um submódulo sem aula aparece como "planejado" (ou só com
   desafios). As aulas são escritas por área nos arquivos `lessons-*.ts` e reunidas aqui. */

export const lessons: Record<string, Lesson> = {}
