'use server'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"
import { adminClient } from "./admin";

export async function createUser(data) {
    
    // Check user's role
    const cookieStore = cookies();
    const supabaseServer = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabaseServer.auth.getUser()).data.user;
    const userRoleKey = (await supabaseServer.from('users').select().eq('uid', user.id).maybeSingle()).data.role;
    if (userRoleKey == null) {
        return Promise.reject('No user role.');
    }
    
    const userRole = (await supabaseServer.from('roles').select().eq('id', userRoleKey).maybeSingle()).data;
    if (userRole == null) {
        return Promise.reject('Invalid user role.');
    }
    
    const privileged = userRole.privileged;
    if (!privileged) {
        return Promise.reject('Not a privileged user.');
    }

    // Check valid signup request

    if (!data.standing) {
        return Promise.reject('No standing specified');
    }

    const standingResponse = await supabaseServer.from('standings').select().eq('name', data.standing).maybeSingle();

    if (standingResponse.error) {
        return Promise.reject('No standing specified');
    }

    const standing = standingResponse.data.id;

    // Create authenticated user
    const supabaseAdmin = adminClient;

    const authResponse = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password
    });

    if (authResponse.error) {
        return Promise.reject('Failed to authenticate user.');
    }

    // Create user record
    data.standing = standing;
    delete data.password;

    const userResponse = await supabaseAdmin.from('users').insert(data);

    if (userResponse.error) {
        await supabaseAdmin.auth.admin.deleteUser(authResponse.data.user.id);
        console.log(userResponse.error);
        return Promise.reject('Failed to create user.');
    }
}