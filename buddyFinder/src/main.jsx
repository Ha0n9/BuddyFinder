import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            padding: '16px',
          },
          success: {
            icon: '✓',
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1a1a1a',
            }
          },
          error: {
            duration: 4000,
            icon: '❌',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1a1a1a',
            },
          },
        }}
      />
      <App />
    </BrowserRouter>
  </StrictMode>,
)
