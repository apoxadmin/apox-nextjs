'use client'

import sendEmail from "@/mailer/mailer"
import { AuthContext, createSupabaseClient } from "@/supabase/client";
import { joinEvent, leaveEvent, chairEvent, unchairEvent } from "@/supabase/event";
import { eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, interval, isSameMonth, isThisMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import React, { useContext, useEffect, useRef, useState } from "react";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function send() {
    sendEmail({
        subject: "Hello world!",
        text: "I am sending an email using nodemailer",
        to: "andersonleetruong@gmail.com",
        from: process.env.NEXT_PUBLIC_EMAIL
    });
}

function EventModal({ supabase, event, setEvent, user_id }) {
    const ref = useRef(null);
    const [dateString, setDateString] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [chairs, setChairs] = useState([]);


    async function getAttendees() {
        const attendeesResponse = await supabase?.from('event_signups').select('users (*) ').eq('event_id', event?.id);
        if (attendeesResponse?.data) {
            setAttendees(attendeesResponse.data.map((user) => user.users));
        }
    }

    async function getChairs() {
        const chairsResponse = await supabase?.from('event_chairs').select('users (*) ').eq('event_id', event?.id);
        if (chairsResponse?.data) {
            setChairs(chairsResponse.data.map((user) => user.users));
        }
    }

    useEffect(() => {
        if (event) {
            ref.current.showModal();
            setDateString(`${format(event.start_time, 'p')} - ${format(event.end_time, 'p')}`);
            getAttendees();
            getChairs();
        } else {
            setAttendees([]);
            setChairs([]);
            setDateString('');
        }
    }, [event, ref]);

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                setEvent(null);
                ref.current.close();
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }

    });


    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-y-hidden">
                <div className="flex justify-between">
                    <h1 className="text-neutral-600">
                        {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join()}
                    </h1>
                    <h1 className="text-neutral-600">
                        {dateString}
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
                <div className="flex flex-col space-y-2 overflow-auto">
                    <h1 className="text-center text-lg">Attendees ({attendees?.length} / {event?.capacity})</h1>
                    {
                        attendees?.length == 0 && <h1 className="text-center text-neutral-500">None yet!</h1>
                    }
                    <div className="flex flex-col overflow-auto">
                        <div className="grid grid-cols-2">
                            {
                                attendees?.map((user, i) => {
                                    let bg = chairs?.some(chair => chair.id == user.id) ? 'bg-green-600 text-white' : '';
                                    return <div key={i} className={`${bg} flex flex-col border border-black p-2 overflow-x-hidden`}>
                                        <h1>
                                            {user.name}
                                        </h1>
                                        <h1 className="text-xs">
                                            {user.email}
                                        </h1>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4">
                    {
                        attendees?.some(user => user.id === user_id) ?
                            <button
                                className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (leaveEvent(user_id, event)) { unchairEvent(user_id, event); setTimeout(getAttendees, 500); setTimeout(getChairs, 500) } }}
                            >
                                Leave
                            </button>
                            :
                            <button
                                className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (joinEvent(user_id, event)) setTimeout(getAttendees, 500); }}
                            >
                                Sign up
                            </button>
                    }
                    {
                        attendees?.some(user => user.id === user_id) && (chairs?.some(user => user.id == user_id) ?
                            <button
                                className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (unchairEvent(user_id, event)) setTimeout(getChairs, 500); }}
                            >
                                Unchair
                            </button>
                            :
                            chairs?.length < 2 &&
                            <button
                                className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (chairEvent(user_id, event)) setTimeout(getChairs, 500); }}
                            >
                                Chair
                            </button>
                        )
                    }
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => { setEvent(null); }}>close</button>
            </form>
        </dialog >
    )
}

function MonthDayComponent({ day, index, fiveRows, events, setEvent }) {
    let color = isToday(day) ? 'bg-blue-100' : '';
    color = isThisMonth(day) ? color : 'bg-neutral-200 hover:bg-neutral-100';
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    const [popover, setPopover] = useState(false);

    switch (Math.floor(index / 7)) {
        case 0:
            position = "top-[0%]"; break;
        case 3:
            if (fiveRows) position = "top-[-10%]";
            else position = "bottom-[0%]";
            break;
        case 4:
            position = "bottom-data && [0%]";
    }

    switch (index % 7) {
        case 0:
            position += " left-[0%]"; break;
        case 6:
            position += " right-[0%]"; break;
    }

    return (
        //<div className="flex justify-center items-center relative group" onClick={() => { setPopover(true); }} onMouseLeave={() => { setPopover(false); }}>
        <div className="flex justify-center items-center relative group" onMouseLeave={() => { setPopover(false); }}>
            {/*            <div className={`${popover ? 'visible' : 'invisible'} drop-shadow-xl bg-white absolute flex flex-col items-center z-50 min-w-[120%] min-h-[120%] rounded-sm p-4 ${position}`}>
                <h1 className="text-xl">
                    {day && getDate(day)}
                </h1>
                {
                    events?.map((event, i) => {
                        return <button key={i} onClick={() => setEvent(event)}>
                            {format(event?.start_time, 'p')} {event?.name}
                        </button>
                    })
                }
            </div>
            */}
            <div className={`flex flex-col h-full w-full py-2 transition ease-out delay-20 duration-150 ${color}`}>
                <h1 className={`text-center text-sm ${textColor}`}>
                    {
                        day && getDate(day)
                    }
                </h1>
                <div className="flex flex-col items-center space-y-[1px]">
                    {
                        events?.map((event, i) => {
                            return <button
                                key={i}
                                onClick={() => setEvent(event)}
                                className={`text-xs ${isToday(day) ? 'hover:bg-blue-400 hover:text-white' : 'hover:bg-neutral-100'} py-1 px-2 hover:shadow-lg transition ease-in delay-50 duration-100`}
                            >
                                <div className="flex space-x-2">
                                    <h1>
                                        {format(event?.start_time, 'p')}
                                    </h1>
                                    <h1>
                                        {event?.name}
                                    </h1>
                                </div>
                            </button>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default function MyAPOPage() {
    const supabase = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [events, setEvents] = useState([]);
    const start = startOfWeek(startOfMonth(Date.now()));
    const end = endOfWeek(endOfMonth(Date.now()));
    const days = eachDayOfInterval(interval(start, end));
    const [eventModal, setEventModal] = useState(null);

    async function getEvents() {
        const eventsResponse = await supabase
            .from('events')
            .select('*, event_types(*)')
            .gte('date', start.toISOString())
            .lte('date', end.toISOString())
            .eq('reviewed', true)
            .order('date', { ascending: false });
        const eventsList = eventsResponse?.data;
        const eventsMap = new Map();
        for (const event of eventsList) {
            var [YYYY, MM, DD] = event.date.split('-')
            const date = new Date(YYYY, MM - 1, DD).toLocaleDateString();
            if (date in eventsMap) {
                eventsMap[date].push(event);
            } else {
                eventsMap[date] = [event];
            }
        }
        setEvents(eventsMap);
    }
    async function getUserData() {
        const { error, data } = await supabase.auth.getUser();
        const user = await supabase.from('users').select().eq('auth_id', data.user.id).maybeSingle();
        setUserData(user.data);
    }

    useEffect(() => {
        getUserData();
        getEvents();
    }, []);

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} user_id={userData?.id} />
            <h1 className="text-center text-neutral-500 text-xl py-2">{format(start, 'LLLL').toUpperCase()}</h1>
            <div className="grid grid-cols-7">
                {
                    DAYS.map(day => {
                        return (
                            <h1
                                key={day}
                                className="text-neutral-300 text-center py-2"
                            >
                                {day.toUpperCase()}
                            </h1>
                        )
                    })
                }
            </div>
            <div className="grow grid grid-cols-7 auto-rows-fr">
                {
                    days?.map((day, i) => {
                        return <MonthDayComponent
                            key={day.toISOString()}
                            day={day}
                            index={i}
                            fiveRows={days.length > 28}
                            events={events[day.toLocaleDateString()] || []}
                            setEvent={setEventModal}
                        />
                    }
                    )
                }
            </div>
        </div>
    )
}
