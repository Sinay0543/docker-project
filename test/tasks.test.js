const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, tasks } = require("../src/app");

const baseUrl = "http://localhost:3000";
let server;

// On allume le serveur avant de lancer la rafale de tests
before((done) => {
  server = app.listen(3000, () => done());
});

// On éteint le serveur une fois les tests terminés
after(() => {
  server.close();
});

// On vide la liste des tâches avant chaque test pour repartir à zéro
beforeEach(() => {
  tasks.length = 0;
});

test("POST /tasks creates a new task", async () => {
  const response = await fetch(`${baseUrl}/tasks`, {
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
  const response = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "   " })
  });
  
  assert.strictEqual(response.status, 400);
});

test("GET /tasks returns HTTP 200 with JSON", async () => {
  const response = await fetch(`${baseUrl}/tasks`);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/json/);
});

test("GET /tasks returns an empty array when there is no task", async () => {
  const response = await fetch(`${baseUrl}/tasks`);

  assert.deepEqual(await response.json(), []);
});

test("GET /tasks returns every task with id, title and completed", async () => {
  tasks.push(
    { id: 1, title: "Write tests", completed: false },
    { id: 2, title: "Set up CI", completed: true }
  );

  const response = await fetch(`${baseUrl}/tasks`);
  const body = await response.json();

  assert.ok(Array.isArray(body));
  assert.equal(body.length, 2);
  for (const task of body) {
    assert.equal(typeof task.id, "number");
    assert.equal(typeof task.title, "string");
    assert.equal(typeof task.completed, "boolean");
  }
  assert.deepEqual(body, tasks);
});

test("DELETE /tasks/:id deletes an existing task and returns 204", async () => {
  tasks.push({ id: 1, title: "Task to delete", completed: false });

  const response = await fetch(`${baseUrl}/tasks/1`, { method: "DELETE" });

  assert.equal(response.status, 204);
  assert.equal(tasks.length, 0);
});

test("DELETE /tasks/:id returns 404 for an unknown task", async () => {
  const response = await fetch(`${baseUrl}/tasks/999`, { method: "DELETE" });

  assert.equal(response.status, 404);
});

test("DELETE /tasks/:id returns 404 for a non-numeric id", async () => {
  const response = await fetch(`${baseUrl}/tasks/abc`, { method: "DELETE" });

  assert.equal(response.status, 404);
});