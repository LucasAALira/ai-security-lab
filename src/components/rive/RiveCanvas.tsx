import { Alignment, Fit, Layout, RuntimeLoader } from '@rive-app/canvas'
import { useRive } from '@rive-app/react-canvas'
import wasmUrl from '@rive-app/canvas/rive.wasm?url'

// O runtime do Rive vem junto do site (em vez do CDN padrão), então funciona offline.
RuntimeLoader.setWasmUrl(wasmUrl)

interface Props {
  src: string
  stateMachine?: string
  onError: () => void
}

/** O desenho em si. Fica em um arquivo à parte para só ser baixado quando existir um `.riv`. */
export default function RiveCanvas({ src, stateMachine, onError }: Props) {
  const { RiveComponent } = useRive({
    src,
    stateMachines: stateMachine,
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
    onLoadError: onError,
  })
  return <RiveComponent className="size-full" />
}
