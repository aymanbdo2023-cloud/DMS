export interface SharedDocument {
  id: number;
  title: string;
  file_size: number;
  storage_path: string;
  owner_id: number;
  created_at: string;
  sender_id: number;
  receiver_id: number;
  sender: string;
}

export const getInbox = async (userId: number): Promise<SharedDocument[]> => {
  const res = await fetch(`http://localhost:3000/inbox?userId=${userId}`, {
    headers: { "api-key": import.meta.env.API_KEY },
  });
  if (!res.ok) throw new Error("Failed to fetch inbox");
  return res.json();
};

export const sendFile = async (
  file: File,
  recipient: string,
  ownerId: number
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("ownerId", ownerId.toString());
  formData.append("title", file.name);
  formData.append("recipient", recipient);

  const res = await fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Upload failed");
  }
  return res.json();
};

export const downloadDocument = async (docId: number, fileName: string) => {
  const res = await fetch(`http://localhost:3000/download/${docId}`, {
    headers: { "api-key": import.meta.env.API_KEY },
  });
  if (!res.ok) throw new Error("Download failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
