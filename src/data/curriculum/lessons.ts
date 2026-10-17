import type { Lesson } from './types'
import { webLessons } from './lessons-web'
import { webLessons2 } from './lessons-web-2'
import { apiLessons } from './lessons-api'
import { iaLessons } from './lessons-ia'
import { mobileLessons } from './lessons-mobile'
import { supplyLessons } from './lessons-supply'
import { arqLessons } from './lessons-arq'
import { govLessons } from './lessons-gov'

/* Aulas dos submódulos, por id. Um submódulo sem aula aparece como "planejado" (ou só com
   desafios). As aulas são escritas por área nos arquivos `lessons-*.ts` e reunidas aqui. */

export const lessons: Record<string, Lesson> = {
  ...webLessons,
  ...webLessons2,
  ...apiLessons,
  ...iaLessons,
  ...mobileLessons,
  ...supplyLessons,
  ...arqLessons,
  ...govLessons,
}
