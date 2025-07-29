import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './i18n.ts'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<div>Loading translations...</div>}>{/*added this Suspence toavoid a fallback error while loading*/}
      <App />
    </Suspense>
  </StrictMode>,
)