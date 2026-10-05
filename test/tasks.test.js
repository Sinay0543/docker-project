const test = require("node:test");
const assert = require("node:assert/strict");

test("POST /tasks creates a new task", async () => {
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "Apprendre Docker" })
  });
  const data = await response.json();
  
  assert.strictEqual(response.status, 201);
  assert.strictEqual(data.title, "Apprendre Docker");
  assert.strictEqual(data.completed, false);
});

test("POST /tasks fails with invalid title", async () => {
  const response = await fetch("http://localhost:3000/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "   " })
  });
  
  assert.strictEqual(response.status, 400);
});