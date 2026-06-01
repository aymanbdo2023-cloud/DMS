import { createContext, useContext, useEffect, useState, useRef } from "react";

export interface Notification {
  id: number;
  userId: number;
  message: string;
  documentId: number | null;
  read: boolean;
  created_at: string;
}

interface NotificationContextValue {
  unreadCount: number;
  latestNotification: Notification | null;
  clearToast: () => void;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestNotification, setLatestNotification] = useState<Notification | null>(null);
  const prevCountRef = useRef(0);

  const userRaw = localStorage.getItem("user");
  const userId = userRaw ? JSON.parse(userRaw).id : null;

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await fetch(`http://localhost:3000/notifications/unread-count?userId=${userId}`, {
          headers: { "api-key": import.meta.env.API_KEY },
        });
        const data = await res.json();
        if (data.count > prevCountRef.current) {
          const notifRes = await fetch(`http://localhost:3000/notifications?userId=${userId}`, {
            headers: { "api-key": import.meta.env.API_KEY },
          });
          const notifs: Notification[] = await notifRes.json();
          const latest = notifs.find((n) => !n.read);
          if (latest) setLatestNotification(latest);
        }
        prevCountRef.current = data.count;
        setUnreadCount(data.count);
      } catch {
        // service not available
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);
    return () => clearInterval(interval);
  }, [userId]);

  const clearToast = () => setLatestNotification(null);

  const markAllRead = async () => {
    if (!userId) return;
    try {
      await fetch("http://localhost:3000/notifications/read-all", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "api-key": import.meta.env.API_KEY,
        },
        body: JSON.stringify({ userId }),
      });
      setUnreadCount(0);
    } catch {
      // ignore
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, latestNotification, clearToast, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
