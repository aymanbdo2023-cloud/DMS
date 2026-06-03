# DMS — Document Management System

A full-stack document management system that allows registered users to upload, send, receive, and download documents in real time. This repository contains the **React + TypeScript frontend**, which consumes a set of backend microservices.

## Architecture Overview

The system follows a **microservices architecture**:

```
[Frontend (React + Vite, port 5173)]
        |
        | HTTP (REST)
        v
[API Gateway (port 3000 / 8080)]
        |
        +---> Auth Service (port 4001)        — PostgreSQL (dms_auth)
        +---> Document Service (port 4002)    — PostgreSQL (dms_documents)
        +---> Notification Service (port 4003)— PostgreSQL (dms_notifications)
        +---> File Storage Service (port 4004) — MinIO (S3-compatible object storage)
```

Services communicate via RabbitMQ for internal messaging. Files are stored in **MinIO**, an S3-compatible object store.

## Features

- **User registration & login** — Create an account and authenticate
- **Send documents** — Upload a file and send it to another registered user by username
- **Inbox** — View all documents shared with you, with sender info, date, and file size
- **Download** — Download received documents directly from the browser
- **Real-time notifications** — Polls for new notifications every 15 seconds and displays a toast when a new document arrives
- **Dockerized development** — Frontend and MinIO run via Docker Compose with hot-reload

## Tech Stack

- **React 19** with TypeScript
- **Vite 8** (build tool and dev server)
- **react-router-dom v7** (client-side routing)
- **Vanilla CSS** (no framework)
- **Docker** + **Docker Compose** (frontend + MinIO)
- **MinIO** (S3-compatible file storage in development)

## How It Works

### Authentication Flow

1. A user registers at `/register` with a username and password.
2. On login (`/login`), credentials are sent as query parameters to the Auth Service via the API Gateway.
3. The backend returns a user object `{ id, username }`, which is stored in `localStorage`.
4. Protected routes (`/inbox`, `/send`) check for the presence of this user object to guard access.
5. Logout removes the object from `localStorage` and redirects to `/login`.

### Sending a Document

1. The sender navigates to `/send` and selects a file (via click-to-browse or drag-and-drop).
2. They enter the recipient's username and submit.
3. The file is uploaded as `multipart/form-data` (FormData) to the Document Service via `POST /upload`.
4. The backend stores the file in MinIO, records metadata in PostgreSQL, and triggers a notification to the recipient via RabbitMQ.

### Receiving a Document

1. The recipient's inbox (`/inbox`) fetches all documents shared with them via `GET /inbox?userId=...`.
2. Documents are displayed in a table with title, sender, date, and size.
3. A download button triggers `GET /download/:docId`, which streams the file from MinIO through the backend.

### Notifications

- The `NotificationProvider` (React context) polls `GET /notifications/unread-count?userId=...` every 15 seconds.
- When a new unread notification is detected, it fetches the full notification list and displays a toast popup.
- The toast auto-dismisses after 5 seconds or can be closed manually.
- Clicking the toast navigates to the inbox.
- Visiting the inbox calls `markAllRead()` to reset the unread count to 0.

## Project Structure

```
src/
  main.tsx                    — Entry point (BrowserRouter)
  App.tsx                     — Root component (routes + NotificationProvider)
  api/
    user-auth.ts              — Login / register API calls
    documents.ts              — Inbox / upload / download API calls
  context/
    NotificationContext.tsx    — Notification polling and state management
  components/
    NotificationToast.tsx      — Toast notification popup
  Pages/
    Login.tsx                  — Login form
    Register.tsx               — Registration form
    Inbox.tsx                  — Document inbox with download
    SendFile.tsx               — File upload with drag-and-drop
    Navbar.tsx                 — Top navigation bar
    styles/                    — Per-page CSS files
```

## Routes

| Route       | Component     | Auth Required | Description                    |
|-------------|---------------|---------------|--------------------------------|
| `/login`    | `LoginPage`   | No            | Sign in                        |
| `/register` | `RegisterPage`| No            | Create an account              |
| `/inbox`    | `InboxPage`   | Yes           | View received documents        |
| `/send`     | `SendFilePage`| Yes           | Upload and send a document     |
| `*`         | Redirect      | —             | Redirects to `/login`          |

## Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (optional, for MinIO)

### Local Development

```bash
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`. It expects the backend services (API Gateway + microservices) to be running on `localhost:3000`.

### Docker Development

```bash
docker compose up
```

Runs the frontend at `http://localhost:5173` with live code reloading, plus a MinIO instance for file storage (console at `http://localhost:9001`).

## Environment Variables

See `.env.example` for all required variables. Key variables:

| Variable         | Description                     | Default        |
|------------------|---------------------------------|----------------|
| `VITE_API_URL`   | Backend API Gateway URL         | localhost:8080 |
| `API_URL`        | Internal API URL (used by code) | localhost:3000 |
| `API_KEY`        | API key for backend requests    | my_secret_key  |

## Scripts

| Command             | Description                      |
|---------------------|----------------------------------|
| `npm run dev`       | Start Vite dev server            |
| `npm run build`     | Type-check and build for production |
| `npm run preview`   | Preview production build         |
| `npm run lint`      | Run ESLint                       |
