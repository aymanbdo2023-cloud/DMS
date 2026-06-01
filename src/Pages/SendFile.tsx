import { useState, useRef, type DragEvent } from "react";
import { sendFile } from "../api/documents";
import Navbar from "./Navbar";
import "./styles/SendFile.css";

function SendFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleSend = async () => {
    if (!file || !recipient.trim()) return;

    setError("");
    setSuccess("");
    setSending(true);
    try {
      await sendFile(file, recipient.trim(), user?.id ?? 0);
      setSuccess(`File sent to ${recipient.trim()}`);
      setFile(null);
      setRecipient("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message || "Failed to send file. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="send-container">
        <div className="send-card">
          <h1 className="send-title">Send a File</h1>

          <div className="send-section">
            <label className="send-label">Recipient username</label>
            <input
              className="send-input"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className="send-section">
            <label className="send-label">File</label>
            <div
              className={`drop-zone${dragOver ? " drop-zone-active" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileSelect}
              />
              {file ? (
                <span className="drop-file-name">{file.name}</span>
              ) : (
                <span className="drop-placeholder">
                  Drag & drop a file here, or click to browse
                </span>
              )}
            </div>
          </div>

          {error && <div className="send-error">{error}</div>}
          {success && <div className="send-success">{success}</div>}

          <button
            className="send-btn"
            disabled={!file || !recipient.trim() || sending}
            onClick={handleSend}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </>
  );
}

export default SendFilePage;
