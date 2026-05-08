import React from 'react'
import ReactDOM from 'react-dom/client'
import Chain from './App'
import { FirebaseProvider } from './lib/FirebaseProvider'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <Chain />
    </FirebaseProvider>
  </React.StrictMode>
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
