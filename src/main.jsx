import React from 'react'
import ReactDOM from 'react-dom/client'

// Global error handler for debugging white screen on user devices
window.onerror = function(message, source, lineno, colno, error) {
  alert(`Global Error: ${message}\nAt: ${source}:${lineno}:${colno}`);
  return false;
};

window.onunhandledrejection = function(event) {
  alert(`Unhandled Rejection: ${event.reason}`);
};
import App from './App.jsx'
import './index.css'
import { ClassProvider } from './context/ClassContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <UserProvider>
        <DataProvider>
          <ClassProvider>
            <App />
          </ClassProvider>
        </DataProvider>
      </UserProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
