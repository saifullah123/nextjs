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
        url: supabaseUrl, // Be careful not to leak full secrets in prod logs if possible, but safeish here for debug
        keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
    });
    throw new Error('Missing Supabase environment variables: ' +
        (!supabaseUrl ? 'NEXT_PUBLIC_SUPABASE_URL ' : '') +
        (!supabaseAnonKey ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY' : '')
    )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Optional: Server-side client with service role key
export function createServerSupabaseClient() {
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseServiceKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY not found, using anon key')
        return supabase
    }

    return createClient(supabaseUrl!, supabaseServiceKey)
}
