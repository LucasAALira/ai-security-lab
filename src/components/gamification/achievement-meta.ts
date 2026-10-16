import type { AchievementCategory, Medal } from '@/lib/progress'

export const categoryNames: Record<AchievementCategory, string> = {
  aprendizado: 'Aprendizado',
  desafios: 'Desafios',
  trilha: 'Trilha',
  constancia: 'Constância',
  extras: 'Extras',
}

export const categoryOrder = Object.keys(categoryNames) as AchievementCategory[]

/** Para onde levar quem quer conquistar. Conquista secreta oculta não aponta para lugar nenhum. */
export function whereToEarn(medal: Medal): { to: string; label: string } | null {
  if (medal.masked || medal.unlocked) return null
  const specific: Record<string, { to: string; label: string }> = {
    'primeira-chama': { to: '/trilha', label: 'Abrir a trilha' },
    'explorador-de-falhas': { to: '/desafios', label: 'Ir ao laboratório de código' },
    'guardiao-das-apis': { to: '/desafios', label: 'Ir ao laboratório de código' },
    'codigo-protegido': { to: '/desafios', label: 'Ir ao laboratório de código' },
    'sem-ajuda': { to: '/desafios', label: 'Ir ao laboratório de código' },
    'mestre-do-modulo': { to: '/trilha', label: 'Abrir a trilha' },
    persistencia: { to: '/trilha', label: 'Estudar hoje' },
  }
  if (specific[medal.id]) return specific[medal.id]
  switch (medal.category) {
    case 'desafios':
      return { to: '/?secao=cenarios', label: 'Ver os cenários' }
    case 'trilha':
    case 'aprendizado':
      return { to: '/trilha', label: 'Abrir a trilha' }
    case 'constancia':
      return { to: '/revisao', label: 'Ir à revisão' }
    case 'extras':
      return { to: '/loja', label: 'Abrir a loja' }
  }
}
