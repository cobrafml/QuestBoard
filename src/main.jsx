import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CsvProvider } from './components/CsvPrevider.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CsvProvider>
      <App />
    </CsvProvider>
  </StrictMode>,
)
