import { useState, useEffect } from 'react'
import './App.css'

const API_BASE = '/todos'

function App() {
  const [todos, setTodos] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'active' | 'completed'
  const [isLoading, setIsLoading] = useState(true)
  const [apiOnline, setApiOnline] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  // Fetch todos from backend
  const fetchTodos = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const res = await fetch(API_BASE)
      if (!res.ok) throw new Error(`HTTP error ${res.status}`)
      const data = await res.json()
      setTodos(data)
      setApiOnline(true)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
      setApiOnline(false)
      setErrorMessage('Cannot connect to backend API (http://localhost:3000). Ensure the backend server is running.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  // Create new todo
  const handleAddTodo = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle.trim() }),
      })
      if (!res.ok) throw new Error(`Failed to create: ${res.statusText}`)
      const created = await res.json()
      setTodos((prev) => [...prev, created])
      setNewTitle('')
      setApiOnline(true)
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to add todo. Please check backend connection.')
    }
  }

  // Toggle completed state
  const handleToggle = async (todo) => {
    try {
      const res = await fetch(`${API_BASE}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed }),
      })
      if (!res.ok) throw new Error(`Failed to update: ${res.statusText}`)
      const updated = await res.json()
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to update todo status.')
    }
  }

  // Start inline editing
  const startEditing = (todo) => {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  // Save inline edit
  const handleSaveEdit = async (id) => {
    if (!editingTitle.trim()) {
      setEditingId(null)
      return
    }

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle.trim() }),
      })
      if (!res.ok) throw new Error(`Failed to edit: ${res.statusText}`)
      const updated = await res.json()
      setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
      setEditingId(null)
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to rename todo.')
    }
  }

  // Delete todo
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error(`Failed to delete: ${res.statusText}`)
      setTodos((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      console.error(err)
      setErrorMessage('Failed to delete todo.')
    }
  }

  // Delete all completed
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter((t) => t.completed)
    for (const t of completedTodos) {
      await handleDelete(t.id)
    }
  }

  // Filtered list
  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const totalCount = todos.length
  const completedCount = todos.filter((t) => t.completed).length
  const activeCount = totalCount - completedCount

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-badge-row">
          <span className="brand-tag">FULL-STACK APP</span>
          <div className={`status-pill ${apiOnline ? 'status-online' : 'status-offline'}`}>
            <span className="dot" />
            {apiOnline ? 'Backend API Online (Port 3000)' : 'Backend API Offline'}
          </div>
        </div>
        <h1>Todo Workspace</h1>
        <p className="subtitle">
          Express.js REST API + React &amp; Vite frontend with full CRUD operations
        </p>
      </header>

      {/* Offline Alert */}
      {!apiOnline && (
        <div className="alert-card">
          <div className="alert-icon">⚠️</div>
          <div className="alert-body">
            <strong>Backend API is not reachable</strong>
            <p>
              Run <code>npm start</code> or <code>npm run dev</code> in the project root to start the Express server on port 3000.
            </p>
          </div>
          <button className="retry-btn" onClick={fetchTodos}>
            Retry Connection
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="toast-error" onClick={() => setErrorMessage(null)}>
          {errorMessage} (click to dismiss)
        </div>
      )}

      {/* Stats Counter */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total</span>
          <span className="stat-value">{totalCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active</span>
          <span className="stat-value">{activeCount}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completedCount}</span>
        </div>
      </div>

      {/* Add Todo Form */}
      <form className="add-todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task (e.g. Test Express API endpoints)..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" className="add-btn" disabled={!newTitle.trim()}>
          + Add Task
        </button>
      </form>

      {/* Filter and Actions Bar */}
      <div className="toolbar">
        <div className="filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active ({activeCount})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        {completedCount > 0 && (
          <button className="clear-btn" onClick={handleClearCompleted}>
            Clear Completed
          </button>
        )}
      </div>

      {/* Todo List */}
      <main className="todo-list-card">
        {isLoading ? (
          <div className="state-message">Loading tasks...</div>
        ) : filteredTodos.length === 0 ? (
          <div className="state-message">
            <p>No tasks found in this view.</p>
            <span className="state-subtext">
              {filter === 'all'
                ? 'Type in the box above and click "Add Task" to create one!'
                : `No ${filter} tasks right now.`}
            </span>
          </div>
        ) : (
          <ul className="todo-list">
            {filteredTodos.map((todo) => {
              const isEditing = editingId === todo.id
              return (
                <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                    />
                    <span className="checkmark" />
                  </label>

                  {isEditing ? (
                    <div className="edit-container">
                      <input
                        type="text"
                        className="edit-input"
                        value={editingTitle}
                        autoFocus
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(todo.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                      />
                      <button className="save-btn" onClick={() => handleSaveEdit(todo.id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={() => setEditingId(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span
                      className="todo-title"
                      onDoubleClick={() => startEditing(todo)}
                      title="Double click to edit"
                    >
                      {todo.title}
                    </span>
                  )}

                  <div className="todo-actions">
                    {!isEditing && (
                      <button
                        className="icon-btn"
                        onClick={() => startEditing(todo)}
                        title="Edit title"
                      >
                        ✏️
                      </button>
                    )}
                    <button
                      className="icon-btn delete-btn"
                      onClick={() => handleDelete(todo.id)}
                      title="Delete task"
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>

      {/* Developer API Reference Card */}
      <footer className="api-reference">
        <h3>Backend API Quick Reference</h3>
        <div className="api-grid">
          <div className="api-chip">
            <span className="method get">GET</span>
            <code>/todos</code>
            <span className="chip-desc">List all todos</span>
          </div>
          <div className="api-chip">
            <span className="method post">POST</span>
            <code>/todos</code>
            <span className="chip-desc">Create todo ({'{ title }'})</span>
          </div>
          <div className="api-chip">
            <span className="method put">PUT</span>
            <code>/todos/:id</code>
            <span className="chip-desc">Update todo ({'{ title, completed }'})</span>
          </div>
          <div className="api-chip">
            <span className="method delete">DELETE</span>
            <code>/todos/:id</code>
            <span className="chip-desc">Remove todo</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
