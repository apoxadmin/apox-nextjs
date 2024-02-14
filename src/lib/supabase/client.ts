'use server'

import { createClientComponentClient, createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function signUpEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    // Get event limit
    const eventData = (await supabase.from('events').select('limit, users!event_user_joins ( id )').eq('id', eventId).maybeSingle()).data;

    if (eventData.users && eventData.users.length == eventData.limit && eventData.limit != 0) {
        return Promise.reject(`Event is capped at ${eventData.limit}.`);
    }

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    const { error } = await supabase.from('event_user_joins').insert({
        user_id: userData.id,
        event_id: eventId
    });
}

export async function leaveEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    const { error } = await supabase.from('event_user_joins').delete().eq('event_id', eventId).eq('user_id', userData.id);
}

export async function getAttendees(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const { data, error } = await supabase
        .from('event_user_joins')
        .select('users ( id, name )')
        .eq('event_id', eventId);
    
    return data;
}

export async function getChairs(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const { data, error } = await supabase
        .from('chair_joins')
        .select('users ( id, name )')
        .eq('event_id', eventId);
    
    return data;
}

export async function chairEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    // Check chairs if full
    const chairData = (await supabase.from('chair_joins').select('events ( id )').eq('event_id', eventId)).data;

    if (chairData.length >= 2) {
        return Promise.reject('Too many chairs');
    }

    const { error } = await supabase.from('chair_joins').insert({
        user_id: userData.id,
        event_id: eventId
    });
}

export async function unchairEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    const { error } = await supabase.from('chair_joins').delete().eq('event_id', eventId).eq('user_id', userData.id);
}