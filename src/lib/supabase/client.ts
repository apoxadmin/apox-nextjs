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

    if (eventData.users.filter((user) => user.id == userData.id).length > 0)
        return Promise.reject(`Already signed up.`);

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
    const chairData = (await supabase.from('chair_joins').select('events ( id ), users ( id )').eq('event_id', eventId).maybeSingle()).data;

    if (chairData && chairData.users.length >= 2) {
        return Promise.reject('Too many chairs');
    }

    if (chairData && chairData.users.filter((user) => user.id == userData.id).length > 0)
        return Promise.reject(`Already chaired.`);

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

export async function getMyEvents(tracked: boolean = false, finished: boolean = false, trackable: boolean = false) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;
    
    let events;
    if (finished) {
        events = (await supabase.from('events').select('*, users_chairs:users!chair_joins(*), users_events:users!event_user_joins(*), event_types (name, abbreviation)').eq('users_chairs.uid', user.id).eq('tracked', tracked).lt('endDate', (new Date()).toISOString()).not('users_chairs', 'is', null));
    }
    else {
        events = (await supabase.from('events').select('*, users_chairs:users!chair_joins(*), users_events:users!event_user_joins(*), event_types (name, abbreviation)').eq('users_chairs.uid', user.id).eq('tracked', tracked).not('users_chairs', 'is', null));
    }

    let eventsData = events.data;
    if (eventsData) {
        return eventsData;
    }
    return [];
}

export async function getAllUsers() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const users = (await supabase.from('users').select('name, id').eq('enabled', true)).data;

    return users;
}

export async function queryUsers(name) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const users = (await supabase.from('users').select('name, id').ilike('name', `%${name}%`)).data;
    users.sort((a, b) => {
        const names1 = a.name.split(' ');
        const names2 = b.name.split(' ');
        if (names1[0].startsWith(name) && names2[0].startsWith(name)) {
            if (names1[0] < names2[0]) {
                return -1;
            } else {
                return 1
            }
        } else if (names1[0].startsWith(name)) {
            return -1;
        } else if (names2[0].startsWith(name)) {
            return 1;
        } else if (names1.length > 1 && names2.length > 1) {
            if (names1[1] < names2[1])
                return -1;
            else if (names1[1] > names2[1])
                return 1;
        }

        return 0;
    });

    return users;
}

export default async function getLatestDrive() {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });

    const drive_link = (await supabase.from('drive_links').select('url').order('created_at', { ascending: false }).limit(1).maybeSingle()).data;
    return drive_link;
}

export async function trackEvent(eventId, users) {
    if (users.length < 5)
        return Promise.reject(new Error('Not enough attendees for chairing.'));

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const update_data = users.map(user => { return { event_id: eventId, user_id: user.id, attended: true } });

    const updateData = await supabase.from('event_user_joins').upsert(update_data, { ignoreDuplicates: false, onConflict: 'user_id, event_id' });

    if (updateData.error)
        return Promise.reject(new Error('Could not update attendee status.'));

    const updateEvent = await supabase.from('events').update({ tracked: true }).eq('id', eventId);

    if (updateEvent.error)
        return Promise.reject(new Error('Could update event status.'));
}