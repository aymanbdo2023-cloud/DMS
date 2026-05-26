import { useState } from 'react'
import LoginPage from './Pages/Login';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage /> } />
    </Routes>
  )
}

export default App
