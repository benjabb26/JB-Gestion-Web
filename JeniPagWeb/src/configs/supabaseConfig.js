import { createClient } from '@supabase/supabase-js';

// En Vite, las variables de entorno se acceden con import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hvglofrmzhnokmrqhpzw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ux71fLmhqdwPXGXAa_PFhw_9l_i_CXX';

// SEGURIDAD: Solo se expone la clave anónima (pública) en el frontend.
// La SERVICE_ROLE_KEY vive ÚNICAMENTE en el backend (JB_Backend/.env) y nunca
// debe ser incluida en variables VITE_ ni en el bundle del navegador.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
