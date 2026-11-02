# Todo Workspace — Full-Stack Task Management System

A task management web application built with React, Vite, Node.js, and Express. Users can create tasks, rename them, mark them complete, filter the list, and delete tasks through a REST API.

## Project suitability

**Recommended project title:** Todo Workspace — Full-Stack Task Management System.

This is suitable for a web development mini-project, a REST API assignment, or a portfolio demonstration of frontend/backend integration.

If your subject is **Agentic AI**, the existing application can serve as the foundation for **TaskPilot — Agentic AI Task Planning and Progress Assistant**. The current code has no model integration, agent, planning loop, or tool-calling workflow. The proposed extension below is separate from implemented features. No assignment rubric was supplied, so course-specific suitability remains unverified.

## Abstract and objectives

Todo Workspace helps users record work and track completion through a single-page interface. React manages the visible task list, filters, and counters. Express exposes JSON endpoints and stores tasks temporarily in a JavaScript array. The project demonstrates CRUD operations, HTTP communication, React state management, inline editing, and basic error feedback.

Objectives:

- Implement create, read, update, and delete operations through a REST API.
- Integrate a React frontend with a separate Node.js backend.
- Display progress using total, active, and completed counters.
- Provide task filters, inline editing, loading states, and error feedback.

## Screenshot and source analysis

The supplied screenshot shows Todo Workspace at `localhost:5173`, a green backend indicator, three zero-valued counters, a task input, filter tabs, an empty task panel, and the API reference card.

| Element | Implementation and interpretation |
| --- | --- |
| Backend API Online | A successful task fetch sets the indicator; this is not continuous health monitoring. |
| Total / Active / Completed | Counts derived from the task array in React state. |
| Add Task | Sends a nonblank title through `POST /todos`. |
| Filter tabs | Filter tasks already loaded into the browser. |
| Empty panel | Appears when the selected view has no tasks. |
| API reference | Describes the four task operations in the backend. |
| Dark appearance | CSS follows the system/browser color-scheme preference. |

The screenshot establishes the visible empty state when captured. Source inspection confirms edit, completion, delete, and clear-completed handlers; the screenshot alone does not establish successful CRUD interactions.

## Implemented features

- Add a task with the button or Enter; trim surrounding title whitespace.
- Retrieve tasks from the backend.
- Toggle a task between active and completed.
- Rename tasks using the edit button or by double-clicking a title.
- Save an edit with Enter or cancel with Escape.
- Delete individual tasks.
- Clear completed tasks through sequential individual delete requests.
- Filter by All, Active, or Completed and display task counts.
- Display loading and empty states, dismissible errors, and a connection retry button.
- Support system-aware light/dark colors. Small-screen usability needs browser testing.

## Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19 | Components, forms, and UI state |
| Build tooling | Vite 8 | Development server and production build |
| Backend | Node.js / Express 4 | REST API and JSON handling |
| Communication | Fetch API | Browser HTTP requests |
| Styling | CSS | Layout, themes, and task states |
| Storage | JavaScript array | Temporary server-process storage |
| Static checks | ESLint | Frontend code analysis |

Version families come from the repository manifests; lockfiles determine installed versions.

## Architecture

```text
User action
    |
React UI (localhost:5173)
    | fetch('/todos') or fetch('/todos/:id')
Vite development proxy
    | forwards /todos requests
Express API (localhost:3000)
    |
In-memory task array
    |
JSON response -> React state update -> Updated interface
```

On initial load, React fetches the task list. Mutations update the backend first, then update browser state after a successful response. Counters and filters run in the frontend. There is no database, WebSocket connection, or automatic synchronization between browser tabs.

### Data model

```json
{
  "id": 1,
  "title": "Prepare project demonstration",
  "completed": false
}
```

IDs increment within one server process. Restarting Express clears all tasks and resets the ID counter.

## Project structure

```text
Todo Workspace — Full-Stack Task Management System/
├── README.md
├── README.previous.md        # Previous root README retained for reference
├── package.json              # Backend dependencies and convenience scripts
├── package-lock.json
├── server.js                 # Express routes and temporary storage
├── .gitignore
└── frontend/
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js        # Development proxy to localhost:3000
    ├── eslint.config.js
    ├── index.html
    ├── public/
    └── src/
        ├── main.jsx          # React entry point
        ├── App.jsx           # Task UI and API handlers
        ├── App.css           # Application styles
        ├── index.css         # Base styles and theme variables
        └── assets/
```

## Requirements and setup

Use Node.js **22.12 or later within the Node 22 release line**, or Node 24, with npm. The installed Vite package declares `^20.19.0 || >=22.12.0`; the previous README's Node 18 prerequisite was insufficient for this frontend.

From the project root, install both sets of dependencies:

```powershell
npm install
npm run frontend:install
```

Terminal 1 — start the backend:

```powershell
npm start
```

Terminal 2 — start the frontend from the project root:

```powershell
npm run frontend:dev
```

Open [Todo Workspace](http://localhost:5173). The backend is at [localhost:3000](http://localhost:3000). If port 5173 is occupied, use the frontend URL printed by Vite.

### Commands

| Command | Purpose |
| --- | --- |
| `npm start` | Start Express |
| `npm run dev` | Start Express with Node watch mode |
| `npm run frontend:install` | Install frontend dependencies |
| `npm run frontend:dev` | Start Vite |
| `npm run frontend:build` | Build into `frontend/dist/` |
| `npm run frontend:preview` | Preview the built frontend |
| `npm run lint --prefix frontend` | Run frontend ESLint |

## REST API reference

Default base URL: `http://localhost:3000`.

| Method | Endpoint | Request body | Success response |
| --- | --- | --- | --- |
| GET | `/` | None | `200`: API message and endpoint directory |
| GET | `/todos` | None | `200`: task array |
| POST | `/todos` | `{"title":"Read documentation"}` | `201`: created task |
| PUT | `/todos/:id` | `{"title":"Updated task","completed":true}`; either field may be omitted | `200`: updated task |
| DELETE | `/todos/:id` | None | `200`: `{"message":"Deleted"}` |

Creation returns `400` with `{"error":"Title required"}` for missing, non-string, or blank titles. Update and delete return `404` with `{"error":"Not found"}` for missing tasks.

**Current update behavior:** PUT does not enforce creation's title validation. It accepts blank or non-string titles and converts completion values using JavaScript `Boolean()`. For example, the string `"false"` becomes `true`. Send a nonblank string title and a JSON boolean; strict backend validation remains an improvement to implement.

### PowerShell example

This creates, updates, and deletes its own example task on a development server.

```powershell
$base = 'http://localhost:3000'
Invoke-RestMethod -Uri "$base/todos"

$task = Invoke-RestMethod -Uri "$base/todos" -Method Post -ContentType 'application/json' -Body '{"title":"Prepare project demonstration"}'

Invoke-RestMethod -Uri "$base/todos/$($task.id)" -Method Put -ContentType 'application/json' -Body '{"title":"Demonstration prepared","completed":true}'

Invoke-RestMethod -Uri "$base/todos/$($task.id)" -Method Delete
```

## Demonstration workflow

1. Start both servers and open the frontend.
2. Add two tasks and inspect the Total and Active counters.
3. Complete one task and inspect all three filter views.
4. Rename the remaining active task.
5. Clear completed tasks, then delete the remaining task.
6. Refresh while Express stays running: tasks should remain in server memory.
7. Restart Express and reload: tasks should disappear because storage is temporary.

## Validation performed

Checks performed on **2 November 2026**, using Node `v24.22.1` and npm `12.0.2`:

| Check | Result |
| --- | --- |
| Source review | Reviewed backend, frontend component, styles, entry point, manifests, proxy, and lint configuration |
| `npm run frontend:build` | Passed; production assets generated |
| `npm run lint --prefix frontend` | Failed: one `react-hooks/set-state-in-effect` error at `frontend/src/App.jsx:36`, where the effect calls `fetchTodos()` |
| Isolated HTTP CRUD smoke check | Attempted on a separate server port; blocked by local connection error `EACCES 127.0.0.1:30387`. Runtime CRUD success is unverified. |
| Browser interaction, mobile, and accessibility checks | Not performed in this review |

There is no configured automated test suite or test script. Compilation success does not establish runtime correctness.

## Limitations and improvement priorities

1. **Persistence:** add a database so tasks survive server restarts.
2. **Validation:** validate update titles, strict boolean values, and IDs; standardize errors.
3. **Connection status:** it reflects successful list fetching and creation. Some mutation failures display errors without switching the indicator offline.
4. **User separation:** no authentication or ownership checks exist; callers share one task collection. CORS currently allows any origin.
5. **Concurrent interactions:** add pending states and stronger handling for repeated submissions, overlapping edits, and partial bulk-delete failures.
6. **Accessibility and layout:** add explicit accessible control labels and visible keyboard focus; test narrow screens and keyboard operation.
7. **Verification:** resolve the existing lint error and add API and browser workflow tests.

## Optional Agentic AI project: TaskPilot

**Proposed title:** TaskPilot — Agentic AI Task Planning and Progress Assistant.

This is a suitable extension if the deliverable must involve Agentic AI. The following features are proposed and are not implemented.

**Example:** the user enters “Prepare my project presentation in three days.” An agent proposes subtasks, dependencies, and an order of work. The user reviews the plan before the application saves its tasks.

```text
User goal -> Backend planning agent -> Structured draft plan
                      |                        |
                      |                 User reviews plan
                      |                        |
                      +-- Validated tools <----+ Approved plan
                                 |
                         Persistent task store
                                 |
                         Progress evaluation
                                 |
                         Suggested plan revisions
```

Suggested implementation stages:

1. Stabilize the CRUD API and add persistent storage.
2. Add a backend-only model integration returning a structured draft plan.
3. Give the agent validated task tools; require user approval before saving generated plans or deleting tasks.
4. Add priorities, due dates, dependencies, and plan history.
5. Let the agent read progress and propose revisions, using bounded tool execution and an action log.
6. Evaluate plan structure, dependency consistency, tool failures, and whether actions remain within the approved goal.

Model credentials would remain on the backend. Planning, tool use, and progress-based replanning would provide the agentic functionality beyond the current CRUD application.

## Build and deployment

```powershell
npm run frontend:build
npm run frontend:preview
```

Preview serves the static build locally. The `/todos` proxy is configured under Vite's development `server` settings; no production API reverse proxy is configured. For deployment, serve the frontend and forward `/todos` to Express, or implement an explicit API base URL. Express currently does not serve `frontend/dist/`.

## Troubleshooting

- **Backend offline:** start Express, check `http://localhost:3000/todos`, then click Retry Connection.
- **Port 3000 occupied:** identify the application using it before stopping anything. Express supports `PORT`, but changing it also requires updating the Vite proxy target; displayed port labels remain hard-coded.
- **Dependency or engine errors:** check Node meets the requirement above; install dependencies in both directories.
- **Tasks disappear:** restarting Express clears its array by design.

## License

This repository includes the Apache License 2.0. See [LICENSE](LICENSE) for the terms.
