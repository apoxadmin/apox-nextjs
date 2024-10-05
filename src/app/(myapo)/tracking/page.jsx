'use client'

import { AuthContext } from "@/supabase/client";
import { sortByField } from "@/utils/utils";
import { endOfToday, format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";

/**
 *  Button component for Attendees
 *  Click on the name to mark as "attended"
 *  Once `submitted` is True, upserts "attended" status
 */
function AttendeeCheck({ event, user, submitted, attendee = false }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    async function updateAttended() {
        setAttended(!attended);
    }
    useEffect(() => {
        setAttended(user.attended);
    }, [user]);

    useEffect(() => {
        async function submitUser() {
            if (attended) {
                const { error } = await supabase.from('event_signups').upsert({ user_id: user.id, event_id: event.id, attended: attended, flake_in: !attendee }, { onConflict: 'user_id, event_id' }).select();
                const event_req_name = event?.event_types?.requirement;
                const credit_req_name = event?.event_types?.credit;
                if (!error && event_req_name) {
                    const checkReq = await supabase
                        .from('event_users_requirements')
                        .select('value')
                        .eq('user_id', user.id)
                        .eq('name', event_req_name)
                        .maybeSingle();
                    let value = 1;
                    if (!checkReq.error && checkReq.data) {
                        value = checkReq.data.value + 1;
                    }
                    const { error } = await supabase
                        .from('event_users_requirements')
                        .upsert({ user_id: user.id, value: value, name: event_req_name }, { onConflict: 'user_id, name' });
                    console.log(error);
                }
                if (!error && credit_req_name) {
                    const checkReq = await supabase
                        .from('credit_users_requirements')
                        .select('value')
                        .eq('user_id', user.id)
                        .eq('name', credit_req_name)
                        .maybeSingle();
                    let value = event?.credit;
                    if (!checkReq.error && checkReq.data) {
                        value += checkReq.data.value;
                    }
                    const { error } = await supabase
                        .from('credit_users_requirements')
                        .upsert({ user_id: user.id, value: value, name: credit_req_name }, { onConflict: 'user_id, name' });
                    console.log(error);
                }
            }
        }
        if (submitted) {
            submitUser();
        }
    }, [submitted, attended]);

    return (
        <button
            className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'}`}
            onClick={updateAttended}
        >
            {user.name}
        </button>
    )
}

function TrackingEvent({ event, users }) {
    const [attendees, setAttendees] = useState([]);
    const supabase = useContext(AuthContext);
    const ref = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [mediaURL, setMediaURL] = useState('');

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
            <button className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full" onClick={() => { ref.current.showModal(); }}>
                <div className="flex space-x-2">
                    <h1>{event.event_types.abbreviation.toUpperCase()}</h1>
                    <h1>{event.name}</h1>
                </div>
                <h1>{attendees?.length} / {event.capacity}</h1>
            </button>
            <dialog ref={ref} className="modal">
                <div className="modal-box">
                    <div className="flex justify-between">
                        <h1 className="text-neutral-600">
                            {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join()}
                        </h1>
                        <h1 className="text-neutral-600">
                            {`${format(event.start_time, 'p')} - ${format(event.end_time, 'p')}`}
                        </h1>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <div className="flex flex-col text-center">
                            <h1 className="font-bold text-lg">
                                {event?.name}
                            </h1>
                            <h1 className="font-bold">
                                @ {event?.location}
                            </h1>
                        </div>
                        <h1 className="text-center">
                            {event?.description}
                        </h1>
                    </div>
                    <div className="grid grid-cols-2">
                        <div className="flex flex-col items-center">
                            <h1 className="font-bold">Attendees:</h1>
                            {
                                attendees.map((user, i) => {
                                    return (
                                        <AttendeeCheck key={i} user={user} event={event} submitted={submitted} attendee={true} />
                                    )
                                })
                            }
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="font-bold">Flake-ins?</h1>
                            <div className="overflow-x-auto max-h-[200px] flex flex-col">
                                {
                                    users?.filter(user => !attendees.includes(user)).map((user, i) => {
                                        return <AttendeeCheck key={i} user={user} event={event} submitted={submitted} />
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label>Submit link to your photos/videos:</label>
                        <input value={mediaURL} onChange={(e) => setMediaURL(e.target.value)} placeholder="https://drive.google.com/***" />
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-green-600 px-4 py-2 rounded-full"
                            onClick={() => { if (mediaURL !== '') { setSubmitted(true); ref.current.close(); } }}
                        >
                            <h1 className="text-white">
                                Submit
                            </h1>
                        </button>
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
            const usersResponse = await supabase.from('users').select('*, standings!inner(name)').neq('standings.name', 'alumni');
            setUsers(usersResponse.data);
        }
        getUser();
        getUsers();

    }, []);
    useEffect(() => {
        async function getEvents() {
            const eventsResponse = await supabase
                .from('event_chairs')
                .select('*, events ( *, event_types(*) )')
                .eq('user_id', user.id)
                .eq('events.tracked', false)
                .lte('events.date', endOfToday().toISOString());
            if (eventsResponse.data) {
                let eventsData = eventsResponse.data.map((chair) => chair.events);
                const sortByStart = (a, b) => { return sortByField(a, b, 'date') };
                eventsData.sort(sortByStart);
                setEvents(eventsData);
            }
        }
        if (user)
            getEvents();

    }, [user]);

    return <div className="flex flex-col space-y-8 items-center w-full p-10 overflow-y-auto">
        <h1 className="text-center text-xl text-neutral-700">Tracking</h1>
        <div className="grid grid-cols-4 gap-x-2 gap-y-2">
            {
                events?.map((event, i) =>
                    <TrackingEvent event={event} key={i} users={users} />
                )
            }
        </div>
    </div>
}
