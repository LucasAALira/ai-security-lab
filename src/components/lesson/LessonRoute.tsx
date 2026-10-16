import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { modules } from '@/data/modules'
import { LessonDialog } from './LessonDialog'

/** Rotas `/modulo/:n` e `/trilha/modulo/:n`: abrem o diálogo do módulo sobre a página inicial ou
 *  sobre a trilha. Aberto a partir da própria página de fundo (`state.overlay`), fechar volta uma
 *  entrada no histórico; vindo de fora (link direto, matéria), fechar leva à página de fundo. */
export function LessonRoute() {
  const { n } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const index = n !== undefined && /^\d+$/.test(n) ? Number(n) : -1
  const base = location.pathname.startsWith('/trilha/') ? '/trilha' : '/'
  if (index < 0 || index >= modules.length) return <Navigate to={base} replace />
  const close = () => ((location.state as { overlay?: boolean } | null)?.overlay ? navigate(-1) : navigate(base, { replace: true }))
  return <LessonDialog key={index} index={index} onClose={close} />
}
