'use server'

import { createSupabaseAdmin } from "@/supabase/admin";

/**
 * @param {Object} userData Information about the user
 * @param {string} userData.email User's email
 * @param {string} userData.password User's password
 **/
export async function createUser(userData) {
    const supabase = createSupabaseAdmin();
    const newAuthUser = {
        email: userData.email,
        password: userData.password,
        email_confirm: true
    };
    const newAuthUserResponse = await supabase.auth.admin.createUser(newAuthUser);
    if (newAuthUserResponse.error) {
        return false;
    }
    const authId = newAuthUserResponse.data.user.id;
    userData.auth_id = authId;
    delete userData.password;

    const newUserResponse = await supabase.from('users').insert(userData);
    if (newUserResponse.error) {
        return false;
    }

    return authId;
}

/**
 * @param {string | undefined} userId User ID
 **/
export async function deleteUser(userId) {
    console.log(userId)
    if (!userId) {
        return false;
    }
    const supabase = createSupabaseAdmin();
    const deleteUserResponse = await supabase.auth.admin.deleteUser(userId);
    if (deleteUserResponse.error) {
        return false;
    }
    return true;
}
