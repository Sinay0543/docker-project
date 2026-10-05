const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateTotal } = require("../src/app");

test("calculates the total for several items", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  assert.equal(calculateTotal(items), 35);
});

test("returns zero for an empty basket", () => {
  assert.equal(calculateTotal([]), 0);
});

test("does not mutate the input items", () => {
  const items = [{ price: 4, quantity: 2 }];
  const copy = JSON.parse(JSON.stringify(items));

  calculateTotal(items);

  assert.deepEqual(items, copy);
});
test('POST /tasks creates a new task', async () => {
  const response = await request(app)
    .post('/tasks')
    .send({ title: 'Apprendre Docker' });
  
  assert.strictEqual(response.status, 201);
  assert.strictEqual(response.body.title, 'Apprendre Docker');
  assert.strictEqual(response.body.completed, false);
});

test('POST /tasks fails with empty title', async () => {
  const response = await request(app)
    .post('/tasks')
    .send({});
  
  assert.strictEqual(response.status, 400);
});
