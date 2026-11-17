import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'
import { applyBrandTheme } from './lib/theme'

// Re-skin the palette if this deployment sets its own brand colour.
applyBrandTheme()

// Installs/updates the service worker that makes the app installable and
// keeps it usable offline. autoUpdate: new versions activate on next visit.
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
