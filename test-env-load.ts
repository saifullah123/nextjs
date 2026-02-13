import dotenv from 'dotenv';
dotenv.config();

console.log('Testing Environment Variables Loading...');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found (hidden)' : 'Missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Found (hidden)' : 'Missing');
