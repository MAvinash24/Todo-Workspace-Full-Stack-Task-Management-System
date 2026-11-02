# 📋 Full-Stack Todo Application

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js_4-black.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/Frontend-React_19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite_8-646CFF.svg)](https://vite.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, fast, full-stack Todo application built with an **Express.js REST API** backend and a **React + Vite** frontend. Features full CRUD operations, live API connectivity detection, task filtering, inline editing, and responsive UI.

---

## 📑 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Quick Start (TL;DR)](#-quick-start-tldr)
- [How to Run the Entire Project](#-how-to-run-the-entire-project)
  - [1. Running the Backend API](#1-running-the-backend-api)
  - [2. Running the Frontend App](#2-running-the-frontend-app)
- [REST API Reference & Testing](#-rest-api-reference--testing)
  - [Endpoints Summary](#endpoints-summary)
  - [Testing with cURL & PowerShell](#testing-with-curl--powershell)
- [Frontend Features](#-frontend-features)
- [Production Build](#-production-build)
- [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🏛️ Overview & Architecture

The application is structured into two main parts:

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     React + Vite Frontend       │  HTTP /   │       Express.js Backend        │
│    (http://localhost:5173)      │ ◄───────► │     (http://localhost:3000)     │
│  - Task state & counters        │   JSON    │  - In-memory CRUD store         │
│  - Live API status pill         │           │  - CORS enabled                 │
│  - Inline edit & filter tabs    │           │  - RESTful routes               │
└─────────────────────────────────┘           └─────────────────────────────────┘
```

- **Backend (`/`)**: Node.js ES Module server using Express.js providing REST endpoints on port `3000`.
- **Frontend (`/frontend`)**: React 19 application powered by Vite, running on port `5173`, with an automated proxy forwarding `/todos` to the backend.

---

## 📁 Project Structure

```text
Agentic AI/
├── package.json              # Root package config & orchestrator scripts
├── package-lock.json
├── server.js                 # Express.js REST API server (Port 3000)
├── .gitignore                # Git ignore rules
├── README.md                 # Project documentation
│
└── frontend/                 # React + Vite client app (Port 5173)
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.js        # Vite config with backend proxy
    ├── index.html            # Single page app entry HTML
    ├── eslint.config.js
    └── src/
        ├── main.jsx          # React DOM entry point
        ├── App.jsx           # Full-featured Todo application UI
        ├── App.css           # Modern styles, stats, badges, and animations
        ├── index.css         # Theme tokens and base typography
        └── assets/           # Logos and icons
```

---

## ⚙️ Prerequisites

Make sure you have Node.js and npm installed on your system:

- **Node.js**: `v18.0.0` or higher (`v20+` or `v24+` recommended)
- **npm**: `v9.0.0` or higher

Check your installed versions:
```bash
node -v
npm -v
```

---

## ⚡ Quick Start (TL;DR)

Open two terminal windows in the project root:

**Terminal 1 (Backend):**
```bash
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run frontend:install
npm run frontend:dev
```

Open your browser and navigate to **`http://localhost:5173`**.

---

## 🚀 How to Run the Entire Project

### 1. Running the Backend API

1. Open your terminal in the root directory:
   ```bash
   cd "path/to/Agentic AI"
   ```

2. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Express server:
   - **Normal start:**
     ```bash
     npm start
     ```
   - **Development auto-reload (Node 18+ watch mode):**
     ```bash
     npm run dev
     ```

4. You should see:
   ```text
   🚀 Server running at: http://localhost:3000
   📌 API Base URL: http://localhost:3000
   📋 Todos API: http://localhost:3000/todos
   ```

5. Verify backend health by visiting [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. Running the Frontend App

You can run the frontend either from the root or inside the `frontend` folder:

#### Method A: From the Root Directory (Convenient)
```bash
npm run frontend:dev
```

#### Method B: From the `frontend` Directory
```bash
cd frontend
npm install    # only needed on first run
npm run dev
```

The terminal will display:
```text
  VITE v8.x.x  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser!

> 💡 **Tip:** The top right corner of the web interface displays a live **`Backend API Online`** status pill when connected to port 3000.

---

## 📡 REST API Reference & Testing

Base URL: **`http://localhost:3000`**

### Endpoints Summary

| Method | Endpoint | Description | Request Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | API status and endpoint directory | _None_ | `200 OK` |
| `GET` | `/todos` | List all todos | _None_ | `200 OK` |
| `POST` | `/todos` | Create a new todo | `{"title": "string"}` | `201 Created` |
| `PUT` | `/todos/:id` | Update title or completed status | `{"title"?: "string", "completed"?: boolean}` | `200 OK` |
| `DELETE` | `/todos/:id` | Delete todo by ID | _None_ | `200 OK` |

---

### Testing with cURL & PowerShell

You can test the backend API directly from your terminal:

#### 1. Check API Health
```bash
curl http://localhost:3000/
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/"
```

#### 2. Get All Todos
```bash
curl http://localhost:3000/todos
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/todos"
```

#### 3. Create a Todo
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Complete documentation"}'
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/todos" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"title": "Complete documentation"}'
```

#### 4. Update a Todo (Toggle Complete or Edit Title)
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/todos/1" -Method PUT -Headers @{"Content-Type"="application/json"} -Body '{"completed": true}'
```

#### 5. Delete a Todo
```bash
curl -X DELETE http://localhost:3000/todos/1
```
*PowerShell:*
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/todos/1" -Method DELETE
```

---

## 🎨 Frontend Features

The React application comes equipped with:

- 🟢 **Live Backend Health Monitor**: Automatically detects whether the Express backend is running and displays an alert with a one-click **Retry Connection** button if offline.
- 📊 **Real-time Stat Counters**: Displays live counts of **Total**, **Active**, and **Completed** tasks.
- ✍️ **Instant Task Creation**: Quickly input tasks with `Enter` key submission and auto-trimming.
- ✅ **One-Click Checkbox Toggle**: Instantly toggles completion status with visual strike-through.
- ✏️ **Inline Task Renaming**: Double-click any task title or click the pencil icon (`✏️`) to rename it directly.
- 🔍 **Filter Views**: Toggle between **All**, **Active**, and **Completed** views.
- 🧹 **Bulk Cleanup**: "Clear Completed" button appears whenever completed tasks exist.
- ⚡ **Vite Proxy & CORS Ready**: Pre-configured Vite proxy seamlessly handles API communication without browser CORS blocks.

---

## 📦 Production Build

To build the frontend for production:

```bash
# From root directory:
npm run frontend:build

# Or from frontend directory:
cd frontend
npm run build
```

The optimized static assets will be output to `frontend/dist/`.

To preview the production build locally:
```bash
npm run frontend:preview
```

---

## 🛠️ Troubleshooting & FAQ

### 1. `EADDRINUSE: address already in use :::3000`
**Cause:** Another application (or a previous node instance) is using port 3000.  
**Fix (Windows PowerShell):**
```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Or kill it directly
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```
*Alternative:* Set a custom port before starting:
```powershell
$env:PORT=3001; npm start
```

### 2. Frontend shows "Backend API Offline"
- Make sure you ran `npm start` in the root folder.
- Confirm your terminal shows: `🚀 Server running at: http://localhost:3000`.
- Verify you can open `http://localhost:3000/` in your browser.
- Click the **Retry Connection** button on the frontend.

### 3. "Cannot find module 'express'"
Run `npm install` in the project root directory.

### 4. "vite: command not found"
Run `npm install` inside the `frontend` folder or run `npm run frontend:install` from the root.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
