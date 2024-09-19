'use client'

import { AuthContext, createSupabaseClient } from "@/supabase/client";
import { useContext, useEffect, useRef, useState } from "react";

function AttendeeCheck({ event_id, user }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    async function updateAttended() {
        const { error } = await supabase.from('event_signups').upsert({ user_id: user.id, event_id: event_id, attended: !attended }, { onConflict: 'user_id, event_id' }).select();
        if (!error) {
            setAttended(!attended);
        }
    }
    useEffect(() => {
        setAttended(user.attended);
    }, [user]);
    return (
        <h1
            className={`${attended ? 'text-green-400' : ''}`}
            onClick={updateAttended}
        >
            {user.name}
        </h1>
    )
}

function TrackingEvent({ event, users }) {
    const [attendees, setAttendees] = useState([]);
    const supabase = useContext(AuthContext);
    const ref = useRef(null);

    useEffect(() => {
        async function getAttendees() {
            const attendeesResponse = await supabase.from('event_signups').select('*, users(*)').eq('event_id', event.id);
            setAttendees(attendeesResponse.data.map(attendee => { return { ...attendee.users, attended: attendee.attended } }));
        }
        getAttendees();
    }, []);

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                ref.current.close();
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }
    });

    return (
        <div>
            <button className="flex space-x-4" onClick={() => { ref.current.showModal(); }}>
                <h1>{event.name}</h1>
                <h1>{attendees?.length} / {event.capacity}</h1>
            </button>
            <dialog ref={ref} className="modal">
                <div className="modal-box">
                    <h1>{event.name}</h1>
                    <div>
                        {
                            attendees.map((user, i) => {
                                return (
                                    <AttendeeCheck key={i} user={user} event_id={event.id} />
                                )
                            })
                        }
                    </div>
                    <h1>Flake-ins?</h1>
                    <div>
                        {
                            users?.map((user, i) => {
                                return <h1 key={i}>{user.name}</h1>
                            })
                        }
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => { }}>close</button>
                </form>
            </dialog>
        </div>
    )
}

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
            const usersResponse = await supabase.from('users').select();
            setUsers(usersResponse.data);
        }
        getUser();
        getUsers();

    }, []);
    useEffect(() => {
        async function getEvents() {
            const eventsResponse = await supabase
                .from('event_chairs')
                .select('*, events ( * )')
                .eq('user_id', user.id)
                .eq('events.tracked', false)
            const eventsData = eventsResponse.data.map((chair) => chair.events);
            setEvents(eventsData);
        }
        if (user)
            getEvents();

    }, [user]);

    return <div className="flex flex-col items-center w-full p-10 overflow-y-auto">
        <h1 className="text-center text-xl text-neutral-700">Tracking</h1>
        {
            events?.map((event, i) =>
                <TrackingEvent event={event} key={i} users={users} />
            )
        }
    </div>
}
