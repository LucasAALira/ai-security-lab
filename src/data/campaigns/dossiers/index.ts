import type { DossierContent } from '../types'
import { tresCx } from './3cx'
import { solarwinds } from './solarwinds'
import { uaParserJs } from './ua-parser-js'
import { xzUtils } from './xz-utils'

/* Dossiês de casos reais: ver `README.md` ("Como adicionar um caso real"). */
export const dossiers: DossierContent[] = [xzUtils, tresCx, solarwinds, uaParserJs]
