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

test('DELETE /tasks/:id deletes a task', async () => {
  // 1. Création d'une tâche pour le test
  const createRes = await request(app).post('/tasks').send({ title: 'Task to delete' });
  const taskId = createRes.body.id;

  // 2. Tentative de suppression
  const deleteRes = await request(app).delete(`/tasks/${taskId}`);
  
  // 3. Le test attend le code 204 (ce qui va échouer à cause de notre 500)
  assert.strictEqual(deleteRes.status, 204);
});
