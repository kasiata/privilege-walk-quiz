import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Polyfill window.storage with localStorage for production
// (the Claude artifact storage API is not available outside Claude.ai)
if (!window.storage) {
  window.storage = {
    get: async (key, shared) => {
      try {
        const val = localStorage.getItem((shared ? 'shared_' : '') + key)
        if (val === null) throw new Error('not found')
        return { key, value: val, shared: !!shared }
      } catch {
        throw new Error('not found')
      }
    },
    set: async (key, value, shared) => {
      try {
        localStorage.setItem((shared ? 'shared_' : '') + key, value)
        return { key, value, shared: !!shared }
      } catch {
        return null
      }
    },
    delete: async (key, shared) => {
      localStorage.removeItem((shared ? 'shared_' : '') + key)
      return { key, deleted: true, shared: !!shared }
    },
    list: async (prefix, shared) => {
      const pfx = (shared ? 'shared_' : '') + (prefix || '')
      const keys = Object.keys(localStorage).filter(k => k.startsWith(pfx))
      return { keys, prefix, shared: !!shared }
    }
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
