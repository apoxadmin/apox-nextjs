'use server'

import { revalidatePath } from "next/cache";
import { createSupabaseServer } from "./server"
import { redirect } from "next/navigation";

export async function loginUserWithEmailAndPassword(email, password) {
    const supabase = createSupabaseServer();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (!error) {
        revalidatePath('/myapo', 'layout');
        redirect('/myapo');
    } else {
        return Promise.reject(new Error('User does not exist.'));
    }
}

export async function logout() {
    const supabase = createSupabaseServer();

    const { error } = await supabase.auth.signOut();

    if (!error) {
        revalidatePath('/', 'layout');
        redirect('/');
    } else {
        return Promise.reject(new Error('Cannot log out.'));
    }
}