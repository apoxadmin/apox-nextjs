'use server'

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { intervalToDuration } from "date-fns";
import { cookies } from "next/headers";
import { adminClient } from "./admin";

export async function updateUser(userId, data) {
    const cookieStore = cookies();
    const supabaseServer = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabaseServer.auth.getUser()).data.user;
    const userData = (await supabaseServer.from('users').select('*, roles ( id, name, privileged )').eq('uid', user.id).maybeSingle()).data;
    if (userData.roles == null) {
        return Promise.reject(new Error('No user role.'));
    }

    if (!userData.roles.privileged) {
        return Promise.reject(new Error('Unprivileged.'))
    }

    const standingValue = (await supabaseServer.from('standings').select().eq('name', data.standing).maybeSingle()).data;
    
    const updateData = {...data, standing: standingValue.id };
    const { error } = await adminClient.from('users').update(updateData).eq('id', userId);
    if (error) {
        return Promise.reject(new Error('Could not update data.'))
    }
}

export async function createEvent(data) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;
    if (user == null) {
        return Promise.reject(new Error('Unauthenticated'));
    }

    const userData = (await supabase.from('users').select('id, roles(*)').eq('uid', user.id).maybeSingle()).data;

    const eventTypeResponse = await supabase.from('event_types').select().eq('name', data.type).maybeSingle();

    if (eventTypeResponse.error) {
        return Promise.reject(new Error('Invalid event type.'));
    }

    const eventTypeKey = eventTypeResponse.data.id;

    const eventResponse = await supabase.from('events').insert({
        type: eventTypeKey,
        name: data.name,
        description: data.description,
        location: data.location,
        startDate: data.dates.startDate,
        endDate: data.dates.endDate,
        limit: data.limit,
        shifts: data?.shifts,
        creator: userData.id,
        reviewed: Boolean(userData.roles)
    });

    if (eventResponse.error) {
        return Promise.reject(new Error('Could not create event.'));
    }
}

export async function signUpShift(eventId: number, shiftIndex: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    const eventData = (await supabase.from('events').select('shifts').eq('id', eventId).maybeSingle()).data;

    if (eventData.shifts?.length == 0) {
        return Promise.reject(new Error('No shifts available.'));
    }

    if (eventData.shifts?.length <= shiftIndex) {
        return Promise.reject(new Error('Shift out of range'));
    }

    // Check if shift is full
    const shiftData = (await supabase.from('shift_joins').select('length').eq('index', shiftIndex).eq('event_id', eventId)).data;
    if (shiftData && shiftData.length >= eventData.shifts?.length) {
        return Promise.reject(new Error('Shift is full'));
    }

    // Add user to shift_join
    const { error } = await supabase.from('shift_user_joins').insert({ event_id: eventId, user_id: userData.id, index: shiftIndex });
    if (error) {
        return Promise.reject(new Error('Shift could not be added'));
    }
}

export async function leaveShift(eventId: number, shiftIndex: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    // Add user to shift_join
    const { error } = await supabase.from('shift_user_joins').delete().eq('event_id', eventId).eq('user_id', userData.id).eq('index', shiftIndex);
    if (error) {
        return Promise.reject(new Error('Shift could not be removed'));
    }
}

export async function signUpEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    // Get event limit
    const eventRes = (await supabase.from('events').select('limit, users!event_user_joins ( id )').eq('id', eventId).maybeSingle());
    const eventData = eventRes.data;

    if (eventData.users && eventData.users.length == eventData.limit && eventData.limit != 0) {
        return Promise.reject(new Error(`Event is capped at ${eventData.limit}.`));
    }

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    if (eventData.users.filter((user) => user.id == userData.id).length > 0)
        return Promise.reject(new Error('Already signed up.'));

    const { error } = await supabase.from('event_user_joins').insert({
        user_id: userData.id,
        event_id: eventId
    });

    if (error) {
        return Promise.reject(error);
    }
}

export async function leaveEvent(eventId: number) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const user = (await supabase.auth.getUser()).data.user;

    if (user == null)
        return;

    const userData = (await supabase.from('users').select('id').eq('uid', user.id).maybeSingle()).data;

    const { error } = await supabase.from('event_user_joins').delete().eq('event_id', eventId).eq('user_id', userData.id);

    if (error) {
        return Promise.reject(error);
    }
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

    if (error) {
        return Promise.reject(error);
    }
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

export async function trackEvent(eventId, users, usersInShifts=null) {
    if (users.length < 5)
        return Promise.reject(new Error('Not enough attendees for chairing.'));

    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const userAuth = await supabase.auth.getUser();
    const update_data = users.map(user => { return { event_id: eventId, user_id: user.id, attended: true } });

    const updateData = await supabase.from('event_user_joins').upsert(update_data, { ignoreDuplicates: false, onConflict: 'user_id, event_id' });

    if (updateData.error)
        return Promise.reject(new Error('Could not update attendee status.'));

    const updateEvent = await supabase.from('events').update({ tracked: true }).eq('id', eventId);

    if (updateEvent.error)
        return Promise.reject(new Error('Could update event status.'));

    // Update chairing credit
    const chairData = await supabase.from('users').select('chairing').eq('uid', userAuth.data.user.id).maybeSingle();

    const pastValue = chairData.data.chairing;
    const newValue = pastValue + 1;
    const chairUpdate = await supabase.from('users').update({ chairing: newValue }).eq('uid', userAuth.data.user.id);
    if (chairUpdate.error) {
        return Promise.reject(chairUpdate.error);
    }

    const eventRes = await supabase.from('events').select('event_types (*), startDate, endDate, shifts').eq('id', eventId).maybeSingle();
    if (eventRes.error) {
        return Promise.reject(eventRes.error);
    }
    const eventData = eventRes.data;
    const eventTypeData: any = eventData.event_types

    const eventType = eventTypeData.name;
    let updateField: string;
    if (eventType == 'fellowship')
        updateField = 'fellowship';
    else if (eventType == 'family')
        updateField = 'familyCredit';
    else if (eventType == 'service')
        updateField = 'serviceHoursTerm';
    else {
        return Promise.reject(new Error('Event cannot be tracked'));
    }

    if (eventData.shifts && eventData.shifts.length == 0) {
        const hours = intervalToDuration({ start: eventData.startDate, end: eventData.endDate });
        for (const user of users) {
            const updateUser = await adminClient.from('users').select().eq('id', user.id).maybeSingle();
            const pastValue = updateUser.data[updateField];
            const newValue = pastValue + hours.hours;
            let data = {};
            data[updateField] = newValue;
            const res = await adminClient.from('users').update(data).eq('id', user.id);
            if (res.error) {
                return Promise.reject(res.error);
            }
        }
    } else {
        for (let i = 0; i < eventData.shifts.length; i++) {
            const hours = intervalToDuration({ start: eventData.shifts[i].startDate, end: eventData.shifts[i].endDate });
            const shiftRes = await supabase.from('shift_user_joins').select('event_user_joins ( users(*) )').eq('index', i).eq('event_id', eventId);
            if (shiftRes.data) {
                const shiftUsers = shiftRes.data.map(join => {
                    const eventJoin: any = join.event_user_joins;
                    return eventJoin.users;
                });
                for (const user of shiftUsers) {
                    const pastValue = user[updateField];
                    const newValue = pastValue + hours.hours;
                    let data = {};
                    data[updateField] = newValue;
                    const res = await adminClient.from('users').update(data).eq('id', user.id);
                    if (res.error) {
                        return Promise.reject(res.error);
                    }
                }
            }
        }
    }
}