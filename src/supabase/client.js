import { createBrowserClient } from "@supabase/ssr";
import { createContext } from "react";

export const createSupabaseClient = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );

const supabaseClient = createSupabaseClient();
export const AuthContext = createContext(supabaseClient);
