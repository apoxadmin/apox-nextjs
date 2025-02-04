'use client'

import { AuthContext } from "@/supabase/client";
import { sortByField } from "@/utils/utils";
import { endOfToday, format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { updateChair } from "@/supabase/event";

export function CustomCheckbox({ checked }) {
    return (
        <div className="flex items-center space-x-4">
            {/* Custom styled checkbox container */}
            <div
                className={`w-4 h-4 border-2 rounded-md cursor-pointer transition-all
            ${checked ? 'bg-green-400 border-green-600' : 'border-gray-600'}
            flex items-center justify-center relative`}
            >
                {/* Checkmark inside the checkbox */}
                {checked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                )}
            </div>
        </div>
    );
}

export function AttendeeCheck({ event, user, submitted, attendee = false }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    function updateAttended() {
        setAttended(!attended);
    }
    useEffect(() => {
        setAttended(user.attended);
    }, [user]);

    useEffect(() => {
        async function submitUser() {
            if (attended) {
                const { error } = await supabase
                    .from('event_signups').upsert({ user_id: user.id, event_id: event.id, attended: attended, flake_in: !attendee }, { onConflict: 'user_id, event_id' }).select();
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
                }
            }
        }
        if (submitted) {
            submitUser();
        }
    }, [submitted, attended]);

    return (
        <button
            className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4`}
            onClick={updateAttended}
        >
            <CustomCheckbox checked={attended}/>

            <h1 className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4 select-none`}>{user.name}</h1>
        </button>
    );
}

export function TrackingEvent({ event, users, validateLink }) {
    const [attendees, setAttendees] = useState([]);
    const supabase = useContext(AuthContext);
    const ref = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [driveURL, setDriveURL] = useState('');
    const [mediaURL, setMediaURL] = useState('');
    const [toast, setToast] = useState(false);
    const [ toastMessage, setToastMessage ] = useState('');
    
    function submitTracking() {
        console.log('Submitting')
        if (validateLink)
        {
            if (mediaURL.startsWith('https://drive.google.com/drive/folders/')) {
                setSubmitted(true);
                for (const chair of event?.event_chairs) {
                    updateChair(chair.id, event?.id);
                }
                updateEvent();
                ref.current.close();
                window.location.reload(); // to remove the event
            } else {
                setToastMessage('Invalid drive folder link!');
                setToast(true);
                setTimeout(() => { setToast(false); }, 3000);
            }
        }
        else
        {
            setSubmitted(true);
            for (const chair of event?.event_chairs) {
                updateChair(chair.id, event?.id);
            }
            updateEvent();
            ref.current.close();
            if (!mediaURL.startsWith('https://drive.google.com/drive/folders/')) {
                setToastMessage('Submitted with invalid drive link');
                setToast(true);
                setTimeout(() => { setToast(false); }, 3000);
            }
        }
    }

    useEffect(() => {
        if (event?.drive_link) {
            setMediaURL(event?.drive_link);
        }
    }, [event]);

    useEffect(() => {
        async function getAttendees() {
            const attendeesResponse = await supabase.from('event_signups').select('*, users(*)').eq('event_id', event.id);
            setAttendees(attendeesResponse.data.map(attendee => { return { ...attendee.users, attended: attendee.attended } }));
        }
        async function getDriveURL() {
            const response = await supabase
                .from('urls')
                .select()
                .eq('name', 'drive')
                .maybeSingle();
            if (response.data) {
                setDriveURL(response.data?.url);
            }
        }
        getAttendees();
        getDriveURL();
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
    }, []);
    async function updateEvent() {
        const { error } = await supabase
            .from('events')
            .update({ tracked: true, drive_link: mediaURL })
            .eq('id', event?.id);
    }

    return (
        <div>
            <button className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full h-full" onClick={() => { ref.current.showModal(); }}>
                <div className="flex space-x-2">
                    <h1>{event?.event_types.abbreviation.toUpperCase()}</h1>
                    <h1 className="text-nowrap overflow-x-hidden">{event?.name}</h1>
                </div>
                <h1 className="text-nowrap">{attendees?.length} / {event?.capacity}</h1>
            </button>
            <dialog ref={ref} className="modal">
                <div className="flex flex-col space-y-4 modal-box">
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
                            <div className="overflow-x-auto max-h-[200px] flex flex-col">
                                {
                                    attendees.map((user, i) => {
                                        return (
                                            <AttendeeCheck key={i} user={user} event={event} submitted={submitted} attendee={true} />
                                        )
                                    })
                                }
                            </div>
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
                        <h1>Collaborative Drive URL:</h1>
                        <a className="text-xs text-blue-400" target="_blank" href={driveURL}>{driveURL}</a>
                    </div>
                    <div className="flex flex-col">
                        <label>Submit link to the folder with photos/videos:</label>
                        <input value={mediaURL} onChange={(e) => setMediaURL(e.target.value)} placeholder="https://drive.google.com/drive/folders/***"/>
                    </div>
                    <div className="flex justify-center">
                        <button
                            className="bg-green-600 px-4 py-2 rounded-full"
                            onClick={() => { submitTracking(); }}
                        >
                            <h1 className="text-white">
                                Submit
                            </h1>
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={() => { }}>close</button>
                    {
                        toast &&
                        <div className="toast z-[1000]">
                            <div className="alert alert-error shadow-lg text-center">
                                <h1 className="text-white">{toastMessage}</h1>
                            </div>
                        </div>
                    }
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
            let events = []
            const eventsResponse = await supabase
                .from('event_signups')
                .select('*, events(tracked, *, event_types(*), event_chairs(*))')
                .eq('user_id', user.id)
                .eq('events.tracked', false)
                .eq('events.reviewed', true)
                .lte('events.date', endOfToday().toISOString());
            const chairedEventsResponse = await supabase
                .from('event_chairs')
                .select('*, events(tracked, *, event_types(*), event_chairs(*))')
                .eq('user_id', user.id)
                .eq('events.tracked', false)
                .eq('events.reviewed', true)
                .lte('events.date', endOfToday().toISOString());
            if (eventsResponse.data)
            {
                let eventsData = eventsResponse.data.map((signup) => signup.events);
                eventsData = eventsData.filter((event) => event !== null && event.event_chairs.length == 0);
                events = events.concat(eventsData)
            }
            if (chairedEventsResponse.data) {
                let eventsData = chairedEventsResponse.data.map((chair) => chair.events);
                eventsData = eventsData.filter((event) => event !== null);
                events = events.concat(eventsData)
            }
            if (events.length != 0)
            {
                const sortByStart = (a, b) => { return sortByField(a, b, 'date') };
                events.sort(sortByStart);
                setEvents(events);
            }
        }
        if (user)
            getEvents();

    }, [user]);

    return <div className="flex flex-col space-y-8 items-center w-full p-10 overflow-y-auto">
        <h1 className="text-center text-xl text-neutral-700">Tracking</h1>
        {
            events?.length == 0 ?
            <h1>
                no events to track oops!!
            </h1>
            :
            <div className="grid grid-cols-4 auto-rows-fr gap-x-2 gap-y-2">
            {
                events?.map((event, i) =>
                    <TrackingEvent event={event} key={i} users={users} validateLink={true} />
                )
            }
        </div>
        }
    </div>
}
