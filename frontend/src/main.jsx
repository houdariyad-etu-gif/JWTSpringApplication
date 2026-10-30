import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <App />
      </BrowserRouter>
  </StrictMode>,
)
