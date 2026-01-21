import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anon key. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env');
  process.exit(1);
}

const email = process.env.VITE_TEST_EMAIL || 'test@example.com';
const password = process.env.VITE_TEST_PASSWORD || 'password123';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  try {
    console.log('Signing in test user:', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Sign-in error:', error.message || error);
      // Try sign up then sign in
      console.log('Attempting sign-up for test user...');
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: 'Test User', university: 'Test University' } }
      });
      if (signupError) {
        console.error('Sign-up error:', signupError.message || signupError);
        process.exit(1);
      }
      const { data: data2, error: error2 } = await supabase.auth.signInWithPassword({ email, password });
      if (error2) {
        console.error('Sign-in after sign-up error:', error2.message || error2);
        process.exit(1);
      }
      console.log('Signed in after sign-up:', JSON.stringify(data2, null, 2));
      process.exit(0);
    }

    console.log('Signed in:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

run();
