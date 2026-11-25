import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource/anton/latin-400.css'
import '@fontsource/manrope/latin-300.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/latin-700.css'
import '@fontsource/manrope/latin-800.css'
import '@fontsource/mrs-saint-delafield/latin-400.css'

import './index.css'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'
import Analytics from './components/Analytics'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
        <Analytics />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
