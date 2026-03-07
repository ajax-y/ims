import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClassProvider } from './context/ClassContext.jsx'
import { UserProvider } from './context/UserContext.jsx'
import { DataProvider } from './context/DataContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <DataProvider>
        <ClassProvider>
          <App />
        </ClassProvider>
      </DataProvider>
    </UserProvider>
  </React.StrictMode>,
)
