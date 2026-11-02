import express from "express";

const app = express();

// Enable CORS for frontend requests
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());

let todos = [];
let id = 1;

// ROOT route
app.get("/", (req, res) => {
    res.json({
        message: "Backend API is working 🚀",
        endpoints: {
            getTodos: "http://localhost:3000/todos",
            createTodo: "POST http://localhost:3000/todos",
            updateTodo: "PUT http://localhost:3000/todos/:id",
            deleteTodo: "DELETE http://localhost:3000/todos/:id"
        }
    });
});

// GET all todos
app.get("/todos", (req, res) => {
    res.json(todos);
});

// POST create todo
app.post("/todos", (req, res) => {
    const { title } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ error: "Title required" });
    }

    const newTodo = {
        id: id++,
        title: title.trim(),
        completed: false
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// PUT update todo
app.put("/todos/:id", (req, res) => {
    const todo = todos.find(t => t.id == req.params.id);

    if (!todo) {
        return res.status(404).json({ error: "Not found" });
    }

    const { title, completed } = req.body;

    if (title !== undefined) todo.title = typeof title === "string" ? title.trim() : title;
    if (completed !== undefined) todo.completed = Boolean(completed);

    res.json(todo);
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
    const index = todos.findIndex(t => t.id == req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: "Not found" });
    }

    todos.splice(index, 1);
    res.json({ message: "Deleted" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at: http://localhost:${PORT}`);
    console.log(`📌 API Base URL: http://localhost:${PORT}`);
    console.log(`📋 Todos API: http://localhost:${PORT}/todos`);
});
