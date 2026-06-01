import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import InboxPage from './Pages/Inbox';
import SendFilePage from './Pages/SendFile';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/NotificationToast';

function App() {
  const user = localStorage.getItem("user");

  return (
    <NotificationProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/inbox"
          element={user ? <InboxPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/send"
          element={user ? <SendFilePage /> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      {user && <NotificationToast />}
    </NotificationProvider>
  )
}

export default App
