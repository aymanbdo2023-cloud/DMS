import { useEffect, useState } from "react";
import {
  getInbox,
  downloadDocument,
  type SharedDocument,
} from "../api/documents";
import { useNotifications } from "../context/NotificationContext";
import Navbar from "./Navbar";
import "./styles/Inbox.css";

function InboxPage() {
  const [documents, setDocuments] = useState<SharedDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const { markAllRead } = useNotifications();

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  useEffect(() => {
    markAllRead();
    const fetchInbox = async () => {
      try {
        const data = await getInbox(user?.id ?? 0);
        setDocuments(data);
      } catch {
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchInbox();
  }, []);

  // Making the file size display be more user-friendly, (using MB / KB) instead of just B
  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
    if (bytes >= 1024) return (bytes / 1024).toFixed(0) + " KB";
    return bytes + " B";
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDownload = async (doc: SharedDocument) => {
    try {
      await downloadDocument(doc.id, doc.title);
    } catch {
      alert("A problem occured when trying to download the document!");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="inbox-container">
          <div className="inbox-loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="inbox-container">
        <div className="inbox-card">
          <h1 className="inbox-title">Shared with me</h1>

          {documents.length === 0 ? (
            <div className="inbox-empty">No files shared with you yet</div>
          ) : (
            <table className="inbox-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Sender</th>
                  <th>Date</th>
                  <th>Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc.id}>
                    <td className="cell-title">{doc.title}</td>
                    <td className="cell-sender">{doc.sender}</td>
                    <td className="cell-date">{formatDate(doc.created_at)}</td>
                    <td className="cell-size">{formatSize(doc.file_size)}</td>
                    <td className="cell-action">
                      <button
                        className="btn-download"
                        onClick={() => handleDownload(doc)}
                      >
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default InboxPage;
