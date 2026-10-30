import { useState } from 'react'
import { Link, Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import ProtectRoute from './components/ProtectRoute.jsx';
import './App.css'

function App() {

  return (
    <>
      <nav>
        <Link to="/login">Se connecter</Link>{"|"}
        <Link to="/profile">Profil</Link>
      </nav>
      <hr/>
        <Routes>
            <Route path={"/login"} element={<Login />} />
            <Route path={"/profile"} element={<ProtectRoute><Profile /></ProtectRoute>} />
        </Routes>
    </>
  )
}

export default App
