const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, tasks } = require("../src/app");

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

beforeEach(() => {
  // Empty the shared store so each test starts from a known state.
  tasks.length = 0;
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