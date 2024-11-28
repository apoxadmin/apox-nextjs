'use server'

import { createSupabaseAdmin } from "@/supabase/admin";
import { createSupabaseServer } from "@/supabase/server";

export async function isPrivileged() {
    const supabase = createSupabaseServer();
    const authUser = await supabase.auth.getUser();
    if (authUser.error)
        return false;

    const userResponse = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', authUser.data.user.id)
        .maybeSingle();
    if (userResponse.error)
        return false;

    const userId = userResponse.data.id;
    const privilegedResponse = await supabase
        .from('privileged')
        .select()
        .eq('user_id', userId)
        .maybeSingle();

    return !!privilegedResponse.data;
}

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
        console.log('Invalid user!', newAuthUserResponse.error)
        return false;
    }
    const authId = newAuthUserResponse.data.user.id;
    userData.auth_id = authId;
    delete userData.password;

    const newUserResponse = await supabase.from('users').insert(userData);
    if (newUserResponse.error) {
        console.log('Cannot insert user', newUserResponse.error);
        return false;
    }

    return authId;
}

/**
 * @param {int} id the user's id
 * @param {Object} userData Information about the user
 **/
export async function updateUser(id, userData) {
    const supabase = createSupabaseAdmin();
    const newAuthUser = {
        email: userData.email,
        password: userData.password,
        email_confirm: true
    };
    const newAuthUserResponse = await supabase.auth.admin.updateUserById(userData.auth_id, newAuthUser);
    if (newAuthUserResponse.error) {
        console.log('Invalid user!', newAuthUserResponse.error)
        return false;
    }
    delete userData.password;

    const updateUserResponse = await supabase.from('users').update(userData).eq('id', id);
    if (updateUserResponse.error) {
        console.log('Cannot insert user', updateUserResponse.error);
        return false;
    }

    return true;
}

export async function resetPassword(email) {
    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

    const auth_id = data.auth_id;

    const newAuthUser = {
        email: email,
        password: "stinkyelliot",
        email_confirm: true
    };
    const newAuthUserResponse = await supabase.auth.admin.updateUserById(auth_id, newAuthUser);
    if (newAuthUserResponse.error) {
        console.log('Invalid user!', newAuthUserResponse.error)
        return false;
    }

    return true;
}

/**
 * @param {string | undefined} userId User ID
 **/
export async function deleteUser(userId) {
    // if (!userId) {
    //     console.log('No')
    //     return false;
    // }

    const supabase = createSupabaseAdmin();
    const delUsers = await supabase.auth.admin.listUsers({ perPage: 100 });
    for (const user of delUsers.data.users) {
        if (user.email !== 'andersonleetruong@gmail.com') {
            console.log('Update', user.email);
            await supabase.auth.admin.updateUserById(user.id, { password: 'smelliot' });
        }
        // await supabase.auth.admin.deleteUser(user.id);
    }

    // const deleteUserResponse = await supabase.auth.admin.deleteUser(userId);
    // if (deleteUserResponse.error) {
    //     return false;
    // }
    return true;
}
