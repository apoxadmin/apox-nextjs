'use server'

import { createSupabaseAdmin } from "@/supabase/admin";

export async function requestEvent(user_id, data) {
    const supabase = createSupabaseAdmin();
    const eventTypeQuery = await supabase.from('event_types').select().eq('name', data.event_type.name).maybeSingle();
    data.event_type = eventTypeQuery.data.id;
    data.creator = user_id;
    const { error } = await supabase.from('events').insert(data);
    if (error)
        return false;
}

export async function joinEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const joinQuery = await supabase.from('event_signups').select().eq('event_id', event?.id);
    if (joinQuery?.data.some(signUp => signUp.user_id === user_id)) {
        console.log('User already signed up!');
        return false;
    }
    if (joinQuery?.data.length === event?.capacity) {
        console.log('Event at capacity!');
        return false;
    }
    console.log('Signed up user!');
    const { error } = await supabase.from('event_signups').insert({ user_id, event_id: event?.id });
    if (error)
        return false;
    return true;
}

export async function leaveEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const { error, data } = await supabase.from('event_signups').delete().eq('user_id', user_id).eq('event_id', event?.id).maybeSingle();
    if (error) {
        console.log('User not signed up!');
        return false;
    }

    return true;
}

export async function chairEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const joinQuery = await supabase.from('event_chairs').select().eq('event_id', event?.id);
    if (joinQuery?.data.some(chair => chair.user_id === user_id)) {
        console.log('User already chairing!');
        return false;
    }
    if (joinQuery?.data.length === 2) {
        console.log('Chairing at capacity!');
        return false;
    }
    console.log('Now chairing!');
    const { error } = await supabase.from('event_chairs').insert({ user_id, event_id: event?.id });
    if (error)
        return false;
    return true;
}

export async function unchairEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const { error, data } = await supabase.from('event_chairs').delete().eq('user_id', user_id).eq('event_id', event?.id).maybeSingle();
    if (error) {
        console.log('User not chairing!');
        return false;
    }

    return true;
}
