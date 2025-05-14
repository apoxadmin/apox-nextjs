'use server'

import { createSupabaseAdmin, supabaseAdmin } from "@/supabase/admin";
import { isPrivileged } from "@/supabase/user";

export async function requestEvent(user_id, data) {
    const supabase = supabaseAdmin;
    const eventTypeQuery = await supabase.from('event_types').select().eq('name', data.event_type.name).maybeSingle();
    data.event_type = eventTypeQuery.data.id;
    data.creator = user_id;

    if (isPrivileged()) {
        data.reviewed = true;
    }

    const response = await supabase.from('events').insert(data).select();
    if (response.error)
    {
        console.log(response.error);
        return false;
    }
    else return response;
}

export async function deleteEvent(event_id) {
    if (!isPrivileged())
        return false;

    const { error } = await supabaseAdmin.from('events').delete().eq('id', event_id);

    return !error;
}

export async function joinEvent(user_id, event) {
    const supabase = supabaseAdmin;
    const joinQuery = await supabase.from('event_signups').select().eq('event_id', event?.id);
    if (joinQuery?.data.some(signUp => signUp.user_id === user_id)) {
        return false;
    }
    if (joinQuery?.data.length >= event?.capacity) {
        return false;
    }
    const { error } = await supabase.from('event_signups').insert({ user_id, event_id: event?.id });
    if (error)
        return false;
    return true;
}

export async function leaveEvent(user_id, event) {
    const supabase = supabaseAdmin;
    const { error, data } = await supabase.from('event_signups').delete().eq('user_id', user_id).eq('event_id', event?.id).maybeSingle();
    if (error) {
        return false;
    }

    return true;
}

export async function chairEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const joinQuery = await supabase.from('event_chairs').select().eq('event_id', event?.id);
    if (joinQuery?.data.some(chair => chair.user_id === user_id)) {
        return false;
    }
    if (joinQuery?.data.length === 2) {
        return false;
    }
    const { error } = await supabase.from('event_chairs').insert({ user_id, event_id: event?.id });
    if (error)
        return false;
    return true;
}

export async function unchairEvent(user_id, event) {
    const supabase = createSupabaseAdmin();
    const { error, data } = await supabase.from('event_chairs').delete().eq('user_id', user_id).eq('event_id', event?.id).maybeSingle();
    if (error) {
        return false;
    }

    return true;
}

export async function approveEvent(event_id) {
    if (!isPrivileged())
        return false;

    const updateEvent = await supabaseAdmin
        .from('events')
        .update({ reviewed: true })
        .eq('id', event_id)
        .select();

    return !updateEvent.error;
}

export async function unapproveEvent(event_id) {
    const updateEvent = await supabaseAdmin
        .from('events')
        .update({ reviewed: false })
        .eq('id', event_id)
        .select();

    return !updateEvent.error;
}

export async function updateChair(user_id, event_id) {
    const supabase = supabaseAdmin;
    const credit_req_name = 'chairing';
    const checkReq = await supabase
        .from('credit_users_requirements')
        .select('value')
        .eq('user_id', user_id)
        .eq('name', credit_req_name)
        .maybeSingle();
    let value = 1;
    if (!checkReq.error && checkReq.data) {
        value += checkReq.data.value;
    }
    const { error } = await supabase
        .from('credit_users_requirements')
        .upsert({ user_id: user_id, value: value, name: credit_req_name }, { onConflict: 'user_id, name' });
}

export async function setDriver(user_id, event_id)
{
    const supabase = createSupabaseAdmin();
    const { error } = await supabase
        .from('event_signups')
        .update({ driving: true })
        .eq('user_id', user_id)
        .eq('event_id', event_id);
    if (error) 
    {
        console.log(error);
        return false;
    }
    console.log(error)
    return true;
}

export async function removeDriver(user_id, event_id)
{
    const supabase = createSupabaseAdmin();
    const { error } = await supabase
        .from('event_signups')
        .update({ driving: false })
        .eq('user_id', user_id)
        .eq('event_id', event_id)
    if (error) return false;
    return true;
}