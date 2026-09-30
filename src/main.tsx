import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import '@fontsource-variable/space-grotesk/wght.css'
import './index.css'
import App from './App.tsx'
import { startAlertWatcher } from './hooks/usePriceAlerts'
import { migrateStorage } from './lib/storage'

migrateStorage()
startAlertWatcher()

// After a deploy, an open tab can ask for a chunk that no longer exists.
// Reload once to pick up the new build (guarded against reload loops).
window.addEventListener('vite:preloadError', (event) => {
  const key = 'emaskuy.chunkReloadAt'
  const last = Number(sessionStorage.getItem(key) ?? 0)
  if (Date.now() - last < 10_000) return
  event.preventDefault()
  sessionStorage.setItem(key, String(Date.now()))
  window.location.reload()
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <App />
  </BrowserRouter>,
)
