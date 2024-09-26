'use client'

import { AuthContext } from "@/supabase/client";
import { approveEvent, deleteEvent, unapproveEvent } from "@/supabase/event";
import { format, startOfToday } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";
import UserTable from "./UserTable";

function EventModal({ event, getEvents }) {
    const ref = useRef(null);

    function closeModal() {
        ref.current.close();
        setTimeout(getEvents, 250);
    }

    return (
        <div>
            <div className="flex space-x-4">
                <button className="flex space-x-4" onClick={() => { ref.current.showModal(); }}>
                    <h1>{event?.event_types.abbreviation.toUpperCase()} {event?.name}</h1>
                </button>
                {
                    !event.reviewed ?
                        <button onClick={() => { if (approveEvent(event?.id)) setTimeout(getEvents, 250) }}>Approve</button>
                        :
                        <button onClick={() => { if (unapproveEvent(event?.id)) setTimeout(getEvents, 250) }}>Unapprove</button>
                }
            </div>
            <dialog ref={ref} className="modal">
                <div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-y-hidden">
                    <div className="flex justify-between">
                        <h1 className="text-neutral-600">
                            {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join()}
                        </h1>
                        <h1 className="text-neutral-600">
                            {`${format(event?.start_time, 'p')} - ${format(event?.end_time, 'p')}`}
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
                    <div className="flex justify-evenly">
                        <button onClick={() => { if (approveEvent(event?.id)) closeModal(); }}>Approve</button>
                        <button onClick={() => { if (unapproveEvent(event?.id)) closeModal(); }}>Unapprove</button>
                        <button onClick={() => { if (deleteEvent(event?.id)) closeModal(); }}>Delete</button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog >
        </div >
    )
}


export default function ExcommPage() {
    const supabase = useContext(AuthContext);
    const [events, setEvents] = useState([]);

    async function getEvents() {
        const eventsRequest = await supabase
            .from('events')
            .select('*, event_types(*)')
            .gte('date', startOfToday().toISOString());
        if (eventsRequest.data)
            setEvents(eventsRequest.data);
    }

    useEffect(() => {

        getEvents();
    }, []);


    return (
        <div className="flex flex-col items-center space-y-4 w-full p-10">
            <h1 className="text-xl text-neutral-600">ExComm Panel</h1>
            <div className="flex flex-col items-center">
                <h1 className="text-xl text-neutral-600">Events</h1>
                <div className="flex flex-col items-center space-y-4">
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg text-neutral-500">Unapproved</h1>
                        <div>
                            {
                                events.map((event, i) => {
                                    if (!event.reviewed)
                                        return (
                                            <EventModal event={event} getEvents={getEvents} key={i} />
                                        )
                                    else return <div key={i}></div>
                                })
                            }
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h1 className="text-lg text-neutral-500">Approved</h1>
                        <div>
                            {
                                events.map((event, i) => {
                                    if (event.reviewed)
                                        return (
                                            <EventModal event={event} getEvents={getEvents} key={i} />
                                        )
                                    else return <div key={i}></div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center space-y-4 overflow-y-auto">
                <h1 className="text-center text-xl text-neutral-600">User Table</h1>
                <div className="grid grid-cols-7 w-full text-center">
                    <h1>Name</h1>
                    <h1>Email</h1>
                    <h1>Standing</h1>
                    <h1>Service Hours</h1>
                    <h1>Fundraising</h1>
                    <h1>Chairing</h1>
                    <h1>Rush</h1>
                </div>
                <div className="overflow-y-scroll">
                    <UserTable />
                </div>
            </div>
        </div>
    )
}
