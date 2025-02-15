'use client'

import { AuthContext } from "@/supabase/client";
import { sortByField } from "@/utils/utils";
import { endOfToday, format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { updateChair } from "@/supabase/event";
import { TrackingEvent } from "../../tracking/page";

export default function TrackingPage() {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [users, setUsers] = useState([]);
    const supabase = useContext(AuthContext);

    useEffect(() => {
        async function getUser() {
            const auth = await supabase.auth.getUser();
            const userResponse = await supabase.from('users').select().eq('auth_id', auth.data.user.id).maybeSingle();
            setUser(userResponse.data);
        }
        async function getUsers() {
            const usersResponse = await supabase
                .from('users')
                .select('*, standings!inner(name)')
                .neq('standings.name', 'alumni');
            let data = usersResponse.data;
            if (data) {
                const sortByName = (a, b) => sortByField(a, b, 'name');
                data.sort(sortByName);
                setUsers(data);
            }
        }
        getUser();
        getUsers();

    }, []);
    useEffect(() => {
        async function getEvents() {
            const eventsResponse = await supabase
                .from('events')
                .select('*, tracked, *, event_types(*), event_chairs(*)')
                .eq('tracked', false)
                .eq('reviewed', true)
                .eq('has_shifts', false)
                .lte('date', endOfToday().toISOString());
            if (eventsResponse.data) {
                let eventsData = eventsResponse.data//.map((chair) => chair.events);
                eventsData = eventsData.filter((event) => event !== null);
                const sortByStart = (a, b) => { return sortByField(a, b, 'date') };
                eventsData.sort(sortByStart);
                setEvents(eventsData);
            }
        }
        if (user)
            getEvents();

    }, [user]);

    return <div className="flex flex-col space-y-2 items-center w-full p-10 overflow-y-auto overflow-x-hidden">
        <h1 className="text-center text-xl text-neutral-700">excomm tracking</h1>
        <h2>
            quick note!
            use this page if someone asked you to track an event which nobody signed up for (or if they have issues with tracking
            this is usually the page to use). this page also bypasses the need for a drive link so if you
            can't find it you can submit without one.
        </h2>
        <h2>green events are shifts</h2>
        <h2>red events are full events</h2>
        <div className="grid grid-cols-4 auto-rows-fr gap-x-2 gap-y-2">
            {
                events?.map((event, i) =>
                    <TrackingEvent tracking_type={2} event={event} key={i} users={users} validateLink={false} user={user}/>
                )
            }
        </div>
    </div>
}