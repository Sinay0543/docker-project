const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { app } = require("../src/app");

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

test("GET / returns the service name and status", async () => {
  const response = await fetch(`${baseUrl}/`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    service: "devops-platform-challenge",
    status: "ok"
  });
});

test("GET /health returns healthy", async () => {
  const response = await fetch(`${baseUrl}/health`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "healthy" });
});

test("GET /total returns the computed basket total", async () => {
  const response = await fetch(`${baseUrl}/total`);

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { total: 35 });
});

test("unknown routes return 404", async () => {
  const response = await fetch(`${baseUrl}/does-not-exist`);

  assert.equal(response.status, 404);
});
