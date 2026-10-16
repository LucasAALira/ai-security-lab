import { Navigate, useLocation, useNavigate, useParams } from 'react-router'
import { modules } from '@/data/modules'
import { LessonDialog } from './LessonDialog'

/** Rota `/modulo/:n`: abre o diálogo do módulo sobre a página inicial.
 *  Aberto a partir da própria página inicial (`state.overlay`), fechar volta uma entrada no
 *  histórico; vindo de fora (link direto, matéria), fechar leva à página inicial. */
export function LessonRoute() {
  const { n } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const index = n !== undefined && /^\d+$/.test(n) ? Number(n) : -1
  if (index < 0 || index >= modules.length) return <Navigate to="/" replace />
  const close = () => ((location.state as { overlay?: boolean } | null)?.overlay ? navigate(-1) : navigate('/', { replace: true }))
  return <LessonDialog key={index} index={index} onClose={close} />
}
