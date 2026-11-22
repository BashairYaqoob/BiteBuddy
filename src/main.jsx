import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './theme/tokens.css'
import './theme/theme-b.css'
import App from './App.jsx'
// Loaded after App (and so after every component stylesheet) so that the
// [data-theme="A"] overrides win. Every rule in it is scoped to Theme A.
import './theme/theme-a.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
