import { Volume2, VolumeX } from 'lucide-react'
import { useId } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { playUnlockChime } from '@/lib/sound'
import { useProgress } from '@/state/ProgressProvider'

/** Som opcional ao desbloquear uma conquista. Desligado por padrão; a escolha fica salva no progresso. */
export function SoundToggle() {
  const { state, dispatch } = useProgress()
  const id = useId()
  const on = state.prefs.sound
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-start gap-3">
        {on ? <Volume2 className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" /> : <VolumeX className="mt-0.5 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />}
        <div>
          <Label htmlFor={id} className="text-sm font-semibold">
            Som ao desbloquear conquistas
          </Label>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">Um toque curto e baixo. Fica desligado até você ativar.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={playUnlockChime}>
          <Volume2 aria-hidden="true" />
          Testar som
        </Button>
        <Switch id={id} checked={on} onCheckedChange={(next) => dispatch({ type: 'setSound', on: next })} />
      </div>
    </div>
  )
}
