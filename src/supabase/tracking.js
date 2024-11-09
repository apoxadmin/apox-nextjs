'use server'

import { createSupabaseAdmin, supabaseAdmin } from "@/supabase/admin";
import { isPrivileged } from "@/supabase/user";

export async function validateRequirements(events_list, user_id) {
    const supabase = createSupabaseAdmin();

    // validate events
    const { data: event_reqs, error: error_event_reqs } = await supabase
        .from('event_requirements')
        .select('name');
    const { data: credit_reqs, error: error_credit_reqs } = await supabase
        .from('credit_requirements')
        .select('name');
    const event_req_values = event_reqs.reduce((acc, req) => {
        acc[req.name] = req.name in events_list ? events_list[req.name].length : 0;
        return acc;
    }, {});
    const credit_req_values = credit_reqs.reduce((acc, req) => {
        if (req.name == 'chairing') acc[req.name] = req.name in events_list ? events_list[req.name].length : 0;
        else acc[ req.name ] = req.name in events_list ? events_list[ req.name ].reduce((sum, event) => sum + event.credit, 0) : 0;
        return acc;
    }, {});
    
    const eventUpsertPromises = Object.entries(event_req_values).map(async ([event_req_name, value]) => {
        const { error } = await supabase
            .from('event_users_requirements')
            .upsert(
                { user_id: user_id, value, name: event_req_name },
                { onConflict: ['user_id', 'name'] }  // onConflict can also take an array
            );
    
        if (error) {
            console.error(`Error upserting for ${event_req_name}:`, error);
        }
    });
    const creditUpsertPromises = Object.entries(credit_req_values).map(async ([credit_req_name, value]) => {
        const { error } = await supabase
            .from('credit_users_requirements')
            .upsert(
                { user_id: user_id, value, name: credit_req_name },
                { onConflict: ['user_id', 'name'] }  // onConflict can also take an array
            );
    
        if (error) {
            console.error(`Error upserting for ${credit_req_name}:`, error);
        }
    });
    
    // Wait for all upsert operations to complete
    await Promise.all(eventUpsertPromises);
    await Promise.all(creditUpsertPromises);
}

export async function getUserReqs(user_id) {
    if (!user_id) return [];
    const supabase = createSupabaseAdmin();

    // First, get all the event IDs where the user has signed up
    const { data: signups, error: signupError } = await supabase
        .from('event_signups')
        .select('event_id')
        .eq('user_id', user_id)
        .eq('attended', true);

    if (signupError) {
        console.error('Error fetching event signups:', signupError);
        return [];
    }

    // Extract event IDs from the signup data
    const eventIds = signups.map((signup) => signup.event_id);

    // Now, get all tracked events that match the event IDs
    const { data, error } = await supabase
        .from('events')
        .select('tracked, *, event_types(*), event_chairs(*)')
        .eq('tracked', true)
        .in('id', eventIds); // Use .in() to filter by event IDs

    if (error) {
        console.error('Error fetching tracked events:', error);
        return [];
    }

    const { data: awardedData, error: awardedError } = await supabase
        .from('awarded_credit')
        .select('*')
        .eq('user_id', user_id);
    
    if (awardedError)
    {
        console.error('awarded credit issue could not return');
        return [];
    }
    
    const grouped = {};

    function addReq(reqName, val)
    {
        if (!grouped[reqName]) {
            grouped[reqName] = [];
        }
        grouped[reqName].push(val);
    }
  
    data.forEach((event) => {
        const event_type = event.event_types.requirement;
        const credit_type = event.event_types.credit;

        // Initialize an empty array at the event_type index if it doesn't exist
        if (event_type)
        {
            addReq(event_type, event)
        }
        if (credit_type)
        {
            addReq(credit_type, event)
        }
        if (event.event_chairs.some(chair => chair.user_id === user_id))
        {
            addReq('chairing', event)
        }
    });
    const awardedCredit = awardedData.map((credit) => {
        let updatedCredit = credit;
        updatedCredit.awarded = true;
        return updatedCredit;
    });
    awardedCredit.forEach((credit) => {
        const event_type = credit.event_requirement;
        const credit_type = credit.credit_requirement;        

        // Initialize an empty array at the event_type index if it doesn't exist
        if (event_type)
        {
            addReq(event_type, credit)
        }
        if (credit_type)
        {
            addReq(credit_type, credit)
            if(credit_type == 'outside service') addReq('service', credit)
        }
    })

    await validateRequirements(grouped, user_id);

    return grouped;
}

export async function revalidateAllUsers()
{
    const supabase = createSupabaseAdmin();
    const userIds = await supabase
        .from('users')
        .select('id');
    if (userIds.data)
    {
        const ids = userIds.data.map((d) => d.id);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            await getUserReqs(id)
        }
    }
}