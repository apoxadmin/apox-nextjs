'use client'

import { AuthContext } from "@/supabase/client";
import { sortByField } from "@/utils/utils";
import { endOfToday, format } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import { updateChair } from "@/supabase/event";

export function MyEvent({ event, users }) {
    const supabase = useContext(AuthContext);
    const ref = useRef(null);
    const [toast, setToast] = useState(false);
    const [ toastMessage, setToastMessage ] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [capacity, setCapacity] = useState('');
    const [location, setLocation] = useState('');
    const [startTime, setStartTime] = useState('');
    const [date, setDate] = useState('');
    const [endTime, setEndTime] = useState('');

    useEffect(() => {
        if (event) {
            setName(event.name || '');
            setDescription(event.description || '');
            setCapacity(event.capacity || '');
            setLocation(event.location || '');
            setDate(event.date || '');
            setStartTime(new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false  }) || '');
            setEndTime(new Date(event.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false  }) || '');
        }
    }, [event]);

    async function handleSubmit () {
        const updatedEvent = {
            id: event.id,
            name,
            description,
            capacity,
            location,
            date,
            start_time: new Date(`${new Date().toISOString().split('T')[0]}T${startTime}`).toISOString(),
            end_time: new Date(`${new Date().toISOString().split('T')[0]}T${endTime}`).toISOString()
        };
        console.log(updatedEvent);
        const updateResponse = await supabase.
            from('events').
            update(updatedEvent).
            eq('id', event.id);
        if (updateResponse.error)
        {
            setToastMessage('update event failed');
            setToast(true);
            setTimeout(() => { setToast(false); }, 3000);
        }
        else
        {
            setToastMessage('event updated');
            setToast(true);
            setTimeout(() => { setToast(false); }, 3000);    
        }
    }

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

    return (
        <div>
            <button className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full h-full" onClick={() => { ref.current.showModal(); }}>
                <div className="flex space-x-2">
                    <h1>{event?.event_types.abbreviation.toUpperCase()}</h1>
                    <h1 className="text-nowrap overflow-x-hidden">{event?.name}</h1>
                </div>
            </button>
            <dialog ref={ref} className="modal">
            <div className="flex flex-col space-y-4 modal-box">
                <div className="flex flex-col space-y-2">
                    <label className="font-bold text-lg">Event Name</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="font-bold">Location</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />

                    <label className="font-bold">Description</label>
                    <textarea
                        className="textarea textarea-bordered"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label className="font-bold">Capacity</label>
                    <input
                        type="number"
                        className="input input-bordered"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                    />

                    <label className="font-bold">Date</label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                        
                    <label className="font-bold">Start Time</label>
                    <input
                        type="time"
                        className="input input-bordered"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />

                    <label className="font-bold">End Time</label>
                    <input
                        type="time"
                        className="input input-bordered"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                </div>

                <div className="flex justify-center space-x-4">
                    <button
                        className="bg-blue-600 px-4 py-2 rounded-full text-white"
                        onClick={handleSubmit}
                    >
                        Save Changes
                    </button>
                    <form method="dialog">
                        <button className="bg-gray-400 px-4 py-2 rounded-full text-white">
                            Close
                        </button>
                    </form>
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
                .from('events')
                .select('tracked, *, event_types(*), event_chairs(*)')
            if (eventsResponse.data) 
            {
                events = eventsResponse.data.filter(event => event.creator == user.id);
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
        <h1 className="text-center text-xl text-neutral-700">My Events</h1>
        {
            events?.length == 0 ?
            <h1>
                you have not created any events!!
            </h1>
            :
            <div className="grid grid-cols-4 auto-rows-fr gap-x-2 gap-y-2">
            {
                events?.map((event, i) =>
                    <MyEvent event={event} key={i} users={users} />
                )
            }
        </div>
        }
    </div>
}
