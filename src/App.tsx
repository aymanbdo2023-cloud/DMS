import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} /> //Setting a default page
    </Routes>
  )
}

export default App
