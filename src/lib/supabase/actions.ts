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
    let standing = null;

    if (data.standing) {
        const standingResponse = await supabaseServer.from('standings').select().eq('name', data.standing).maybeSingle();

        if (standingResponse.error) {
            return Promise.reject('No standing specified');
        }

        standing = standingResponse.data.id;
    }

    // Create authenticated user
    const supabaseAdmin = adminClient;

    const authResponse = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true
    });

    if (authResponse.error) {
        console.log(authResponse.error);
        return Promise.reject('Failed to authenticate user.');
    }

    // Create user record
    data.standing = standing;
    data.uid = authResponse.data.user.id;
    delete data.password;

    const userResponse = await supabaseAdmin.from('users').insert(data);

    if (userResponse.error) {
        await supabaseAdmin.auth.admin.deleteUser(authResponse.data.user.id);
        console.log(userResponse.error);
        return Promise.reject('Failed to create user.');
    }
}

export async function updateEventField(client, data) {
    const id = data.id;
    delete data.id;
    delete data.eventType;
    const { error } = await client.from('events').update(data).eq('id', id);
    if (error) {
        console.error(error);
        return Promise.reject(error);
    }
}

export async function updateEvent(data) {
    const cookieStore = cookies();
    const supabaseServer = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabaseServer.auth.getUser()).data.user;
    const userData = (await supabaseServer.from('users').select('*, roles ( id, name )').eq('uid', user.id).maybeSingle()).data;
    if (userData.roles == null) {
        return Promise.reject('No user role.');
    }

    if (data.eventType == 'fellowship' && userData.roles.name == 'fellowship vice president') {
        return updateEventField(supabaseServer, data);
    }

    if (data.eventType == 'service' && userData.roles.name == 'service vice president') {
        return updateEventField(supabaseServer, data);
    }

    if (data.shifts) {
        const shiftData = { id: data.id, shifts: data.shifts };
        return updateEventField(supabaseServer, shiftData);
    }
}

export async function deleteEvent(data) {
    const cookieStore = cookies();
    const supabaseServer = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabaseServer.auth.getUser()).data.user;
    const userData = (await supabaseServer.from('users').select('*, roles ( id, name )').eq('uid', user.id).maybeSingle()).data;
    if (userData.roles) {
        await adminClient.from('events').delete().eq('id', data.id);
    }
}