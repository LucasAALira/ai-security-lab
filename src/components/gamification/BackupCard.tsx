import { Download, HardDrive, Upload } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { formatNumber } from '@/lib/format'
import { backupFileName, exportProgress, parseBackup, summary, type StudyState } from '@/lib/progress'
import { useProgress } from '@/state/ProgressProvider'

interface Pending {
  state: StudyState
  exportedAt: string | null
  xp: number
  medals: number
}

/** Exportar e importar o progresso. O site é só local: o arquivo é o único jeito de levar o
 *  progresso para outro navegador ou aparelho. Importar substitui o progresso atual, então confirma antes. */
export function BackupCard() {
  const { state, store, ctx } = useProgress()
  const input = useRef<HTMLInputElement>(null)
  const statusId = useId()
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null)
  const [pending, setPending] = useState<Pending | null>(null)

  const doExport = () => {
    const blob = new Blob([exportProgress(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = backupFileName()
    document.body.append(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setMessage({ tone: 'ok', text: `Arquivo ${a.download} gerado. Guarde-o: ele é a única cópia fora deste navegador.` })
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    const result = parseBackup(await file.text())
    if (input.current) input.current.value = ''
    if (!result.ok) {
      setPending(null)
      setMessage({ tone: 'error', text: result.error })
      return
    }
    const sm = summary(result.state, ctx)
    setMessage(null)
    setPending({ state: result.state, exportedAt: result.exportedAt, xp: sm.xp, medals: sm.medals })
  }

  const confirm = () => {
    if (!pending) return
    store.replace(pending.state)
    setMessage({ tone: 'ok', text: 'Progresso importado. Os dados anteriores deste navegador foram substituídos.' })
    setPending(null)
  }

  const current = summary(state, ctx)

  return (
    <Card className="gap-4 p-5">
      <div className="flex items-start gap-3">
        <HardDrive className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h3 className="text-base font-semibold">Backup do progresso</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
            Seu progresso fica salvo neste navegador (armazenamento local), sem conta e sem servidor. Ele <strong className="text-foreground">não é sincronizado entre dispositivos</strong>: para levar
            o progresso a outro aparelho, exporte o arquivo aqui e importe lá.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={doExport}>
          <Download aria-hidden="true" />
          Exportar progresso
        </Button>
        <Button variant="outline" onClick={() => input.current?.click()}>
          <Upload aria-hidden="true" />
          Importar progresso
        </Button>
        <input
          ref={input}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          tabIndex={-1}
          aria-label="Arquivo de backup do progresso (JSON)"
          aria-describedby={statusId}
          onChange={(e) => void onFile(e.target.files?.[0])}
        />
      </div>
      <p id={statusId} role="status" className={message?.tone === 'error' ? 'text-[13px] text-destructive' : 'text-[13px] text-muted-foreground'}>
        {message?.text ?? ''}
      </p>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Substituir o progresso deste navegador?</AlertDialogTitle>
            <AlertDialogDescription>
              O arquivo{pending?.exportedAt ? ` exportado em ${new Date(pending.exportedAt).toLocaleDateString('pt-BR')}` : ''} tem {pending ? formatNumber(pending.xp) : 0} XP e {pending?.medals ?? 0} conquistas. O progresso atual tem {formatNumber(current.xp)} XP e {current.medals}{' '}
              conquistas e será substituído. Isso não pode ser desfeito; exporte antes se quiser manter uma cópia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirm}>Substituir progresso</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
