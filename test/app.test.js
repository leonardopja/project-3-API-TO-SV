import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/shift-builder-test';
process.env.JWT_SECRET ||= 'test-secret-that-is-at-least-32-characters-long';

const { default: app } = await import('../src/app.js');

test('health endpoint reports that the API is running', async () => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});
