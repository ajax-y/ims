import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClassProvider } from './context/ClassContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { ConfirmProvider } from './context/ConfirmContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Suppress browser alert popups for global errors - log to console instead
window.onerror = function(message, source, lineno, colno, error) {
  console.error(`Global Error: ${message} At: ${source}:${lineno}:${colno}`);
  return false;
};

window.onunhandledrejection = function(event) {
  console.error(`Unhandled Rejection:`, event.reason);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmProvider>
          <UserProvider>
            <DataProvider>
              <ClassProvider>
                <App />
              </ClassProvider>
            </DataProvider>
          </UserProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
