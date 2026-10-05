const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
let tasks = [];
let nextId = 1;

function calculateTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

app.get("/", (_req, res) => {
  res.json({ service: "devops-platform-challenge", status: "ok" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.get("/total", (_req, res) => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];
  res.json({ total: calculateTotal(items) });
});

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  const newTask = { id: nextId++, title: title.trim(), completed: false };
  tasks.push(newTask);

  res.status(201).json(newTask);
});
app.patch("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, completed } = req.body ?? {};

  if (title === undefined && completed === undefined) {
    return res.status(400).json({ error: "Nothing to update" });
  }
  if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
    return res.status(400).json({ error: "Invalid title" });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid completed status" });
  }

  // Validate everything first, then update, so an invalid request never changes the task.
  if (title !== undefined) {
    task.title = title.trim();
  }
  if (completed !== undefined) {
    task.completed = completed;
  }

  res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
  });
}

module.exports = { app, calculateTotal, tasks };
