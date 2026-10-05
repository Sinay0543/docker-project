const { test, before, after, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { app, tasks } = require("../src/app");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});

beforeEach(() => {
  tasks.length = 0;
  tasks.push({ id: 1, title: "Finish the challenge", completed: false });
});

function patchTask(id, body) {
  return fetch(`${baseUrl}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}

test("PATCH /tasks/:id marks an existing task as completed", async () => {
  const response = await patchTask(1, { completed: true });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { id: 1, title: "Finish the challenge", completed: true });
});

test("PATCH /tasks/:id returns 404 for an unknown task", async () => {
  const response = await patchTask(999, { completed: true });

  assert.equal(response.status, 404);
});

test("PATCH /tasks/:id returns 404 for a non-numeric id", async () => {
  const response = await patchTask("abc", { completed: true });

  assert.equal(response.status, 404);
});

test("PATCH /tasks/:id returns 400 when completed is not a boolean", async () => {
  for (const completed of ["yes", 1, null]) {
    const response = await patchTask(1, { completed });

    assert.equal(response.status, 400, `expected 400 for completed=${JSON.stringify(completed)}`);
  }
  assert.equal(tasks[0].completed, false);
});

test("PATCH /tasks/:id returns 400 when the body has nothing to update", async () => {
  const response = await patchTask(1, {});

  assert.equal(response.status, 400);
});

test("PATCH /tasks/:id does not partially update the task on invalid input", async () => {
  const response = await patchTask(1, { title: "New title", completed: "yes" });

  assert.equal(response.status, 400);
  assert.equal(tasks[0].title, "Finish the challenge");
});
