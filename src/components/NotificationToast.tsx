import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotifications } from "../context/NotificationContext";
import "./NotificationToast.css";

function NotificationToast() {
  const { latestNotification, clearToast } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!latestNotification) return;
    const timer = setTimeout(clearToast, 5000);
    return () => clearTimeout(timer);
  }, [latestNotification, clearToast]);

  if (!latestNotification) return null;

  const handleClick = () => {
    clearToast();
    if (location.pathname !== "/inbox") {
      navigate("/inbox");
    }
  };

  return (
    <div className="notif-toast" onClick={handleClick}>
      <div className="notif-toast-body">
        <span className="notif-toast-icon">📄</span>
        <span className="notif-toast-text">{latestNotification.message}</span>
      </div>
      <button
        className="notif-toast-close"
        onClick={(e) => { e.stopPropagation(); clearToast(); }}
      >
        ×
      </button>
    </div>
  );
}

export default NotificationToast;
