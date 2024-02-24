'use server'

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClientServer } from "@/utils/supabase/server"

interface LoginDataSchema {
    email: string,
    password: string
}

export async function login(loginData: LoginDataSchema) {
    const supabase = createClientServer();

    const { error } = await supabase.auth.signInWithPassword(loginData);

    if (!error) {
        revalidatePath('/calendar', 'layout');
        redirect('/calendar');
    }
}

export async function logout() {
    const supabase = createClientServer();

    const { error } = await supabase.auth.signOut();

    if (!error) {
        revalidatePath('/login', 'layout');
        redirect('/login');
    }
}