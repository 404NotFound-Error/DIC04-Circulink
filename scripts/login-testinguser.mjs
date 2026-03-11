import 'dotenv/config';

const apiBase = process.env.VITE_API_URL || 'http://localhost:4000/api';
const email = process.env.VITE_TEST_EMAIL || 'test@example.com';
const password = process.env.VITE_TEST_PASSWORD || 'password123';

async function postJson(path, payload) {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      message = data?.error?.message || message;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  if (res.status === 204) return null;
  return res.json();
}

async function run() {
  console.log(`Using API: ${apiBase}`);
  console.log(`Test user: ${email}`);

  try {
    const login = await postJson('/auth/login', { email, password });
    console.log('Signed in:', JSON.stringify(login, null, 2));
    return;
  } catch (error) {
    console.log(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    await postJson('/auth/register', {
      email,
      password,
      name: 'Test User',
    });
    const loginAfterRegister = await postJson('/auth/login', { email, password });
    console.log('Registered and signed in:', JSON.stringify(loginAfterRegister, null, 2));
  } catch (error) {
    console.error('Register/sign-in failed:', error);
    process.exit(1);
  }
}

run();
