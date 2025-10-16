import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.scss' // Importa o Sass principal
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
