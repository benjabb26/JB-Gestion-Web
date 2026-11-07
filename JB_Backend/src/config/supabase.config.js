import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://hvglofrmzhnokmrqhpzw.supabase.co';
// Si el usuario provee el SERVICE_ROLE_KEY, tiene acceso total sin restricciones RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_ux71fLmhqdwPXGXAa_PFhw_9l_i_CXX';

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});

export default supabase;
