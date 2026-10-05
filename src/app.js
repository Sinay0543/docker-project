const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory task store shared by the /tasks routes (no database for this challenge).
const tasks = [];
// eslint-disable-next-line no-unused-vars -- used by POST /tasks (issue #2)
let nextId = 1;

function calculateTotal(items) {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

app.get("/", (_req, res) => {
  res.json({
    service: "devops-platform-challenge",
    status: "ok"
  });
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

app.get("/tasks", (_req, res) => {
  res.status(200).json(tasks);
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