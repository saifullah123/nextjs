import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase Config Check:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    nodeEnv: process.env.NODE_ENV,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 8) : 'N/A'
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase Environment Variables Missing!', {
        url: supabaseUrl,
        keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
    });
    // We don't throw here during build to allow static analysis to pass
    // if the env vars are missing in the CI/CD environment.
    // However, the app will likely fail at runtime if these are critical.
}

// Fallback values to prevent createClient from crashing immediately if variables are undefined
const url = supabaseUrl || 'https://placeholder.supabase.co'
const key = supabaseAnonKey || 'placeholder-key'

export const supabase = createClient(url, key)

// Optional: Server-side client with service role key
export function createServerSupabaseClient() {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not found, using anon key')
        return supabase
    }

    return createClient(url, supabaseServiceKey)
}
