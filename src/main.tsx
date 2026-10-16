import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { migrateLegacyUrl } from './lib/legacy-url'
import { Providers } from './Providers'

// Links da versão anterior (`index.html?modulo=2#trilhas`) continuam levando ao mesmo lugar.
const legacy = migrateLegacyUrl({ search: window.location.search, hash: window.location.hash })
if (legacy !== null) window.history.replaceState(null, '', window.location.pathname + legacy)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
  </StrictMode>,
)
