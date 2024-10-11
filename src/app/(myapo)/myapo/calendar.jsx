import { AuthContext } from "@/supabase/client";
import { chairEvent, joinEvent, leaveEvent, unchairEvent } from "@/supabase/event";
import { eachDayOfInterval, endOfMonth, endOfToday, endOfWeek, format, getDate, interval, isAfter, isSameDay, isSameMonth, isThisMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react"

function EventModal({ supabase, event, setEvent, userData }) {
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
                        {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                    </h1>
                    <h1 className="text-neutral-600">
                        {dateString}
                    </h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col text-center">
                        <h1 className="font-bold text-lg">
                            <span className="swiper-no-swiping">
                                {event?.name}
                            </span>
                        </h1>
                        <h1 className="font-bold">
                            <span className="swiper-no-swiping">
                                @ {event?.location}
                            </span>
                        </h1>
                    </div>
                    <h1 className="text-center">
                        <span className="swiper-no-swiping">
                            {event?.description}
                        </span>
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
                                        <h1 className="swiper-no-swiping">
                                            {user.name}
                                        </h1>
                                        <h1 className="text-xs">
                                            <span className="swiper-no-swiping">
                                                {user.email}
                                            </span>
                                        </h1>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="flex justify-center space-x-4">
                    {
                        (isAfter(event?.date, endOfToday()) || userData?.privileged.length > 0) &&
                        (
                            attendees?.some(user => user.id === userData?.id) ?
                                <button
                                    className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (leaveEvent(userData?.id, event)) { unchairEvent(userData?.id, event); setTimeout(getAttendees, 500); setTimeout(getChairs, 500) } }}
                                >
                                    Leave
                                </button>
                                :
                                <button
                                    className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (joinEvent(userData?.id, event)) setTimeout(getAttendees, 500); }}
                                >
                                    Sign up
                                </button>
                        )
                    }
                    {
                        attendees?.some(user => user.id === userData?.id) && (chairs?.some(user => user.id == userData?.id) ?
                            <button
                                className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (unchairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                            >
                                Unchair
                            </button>
                            :
                            chairs?.length < 2 &&
                            <button
                                className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                onClick={() => { if (chairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                            >
                                Chair
                            </button>
                        )
                    }
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => { setEvent(null); ref.current.close(); }}>close</button>
            </form>
        </dialog >
    )
}

function EventDay({ day, event, userData, setEvent }) {
    const includesUser = event?.event_signups?.some((signup) => signup.user_id === userData?.id);
    const isChairing = event?.event_chairs?.some((chair) => chair.user_id === userData?.id);
    const eventTypeId = event?.event_types.id;
    let style = '';
    if (includesUser) {
        style = 'hover:bg-green-500 hover:text-white bg-green-200';
        if (isChairing) {
            style += ' border border-purple-200 border-2'
        }
    } else if (isToday(day)) {
        style = 'hover:bg-blue-400 hover:text-white';
    } else {
        if(eventTypeId == 1)
            style = `hover:bg-lime-400 hover:text-white bg-lime-200`;
        if(eventTypeId == 2)
            style = `hover:bg-teal-400 hover:text-white bg-teal-100`;
        if(eventTypeId == 3)
            style = `hover:bg-fuschia-600 hover:text-white bg-fuschia-300`;
        if(eventTypeId == 4)
            style = `hover:bg-emerald-500 hover:text-white bg-emerald-200`;
        if(eventTypeId == 5)
            style = `hover:bg-orange-400 hover:text-white bg-orange-200`;
        if(eventTypeId == 6)
            style = `hover:bg-purple-500 hover:text-white bg-purple-300`;
        if(eventTypeId == 7)
            style = `hover:bg-yellow-600 hover:text-white bg-yellow-300`;
        if(eventTypeId == 8)
            style = `hover:bg-pink-600 hover:text-white bg-pink-300`;
        if(eventTypeId == 9)
            style = `hover:bg-lime-500 hover:text-white bg-lime-200`;
        if(eventTypeId == 10)
            style = `hover:bg-red-600 hover:text-white bg-red-300`;
        if(eventTypeId == 11)
            style = `hover:bg-stone-600 hover:text-white bg-stone-300`;
        if(eventTypeId == 12)
            style = `hover:bg-indigo-800 hover:text-white bg-indigo-300`;
    }
    return <button
        onClick={() => setEvent(event)}
        className={`text-xs text-stone-800 ${style} py-1 px-2 hover:shadow-lg transition ease-in delay-50 duration-100 w-full`}
    >
        <div className="flex space-x-2 text-xs overflow-x-hidden">
            <h1>
                {event?.event_types?.abbreviation.toUpperCase()}
            </h1>
            <h1 className="text-nowrap">
                {format(event?.start_time, 'p')}
            </h1>
            <h1 className="text-nowrap overflow-x-hidden">
                {event?.name}
            </h1>
        </div>
    </button>
}

function MonthDayComponent({ userData, focusDay, day, index, fiveRows, events, setEvent }) {
    const [color, setColor] = useState(isSameMonth(focusDay, day) ? (isToday(focusDay) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    useEffect(() => {
        setColor(isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    }, [focusDay]);

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
        <div className={`flex flex-col w-full pt-2 transition ease-out delay-20 duration-150 ${color}`} onMouseLeave={() => { setPopover(false); }}>
            <h1 className={`text-center text-sm ${textColor}`}>
                {
                    day && getDate(day)
                }
            </h1>
            <div className="flex flex-col items-center space-y-[1px] px-2 overflow-y-scroll">
                {
                    events?.map((event, i) =>
                        <EventDay key={i} userData={userData} event={event} setEvent={setEvent} day={day} />
                    )
                }
            </div>
        </div>
    )
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function EventCalendar({ focusDay, userData }) {
    const supabase = useContext(AuthContext);
    const [focusStartDay, setFocusStartDay] = useState(startOfWeek(startOfMonth(focusDay)));
    const [focusEndDay, setFocusEndDay] = useState(endOfWeek(endOfMonth(focusDay)));
    const [monthDays, setMonthDays] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventModal, setEventModal] = useState(null);

    useEffect(() => {
        const start = startOfWeek(startOfMonth(focusDay));
        const end = endOfWeek(endOfMonth(focusDay));
        const days = eachDayOfInterval(interval(start, end));
        setFocusStartDay(start);
        setFocusEndDay(end);
        setMonthDays(days);
    }, [focusDay]);

    async function getEvents() {
        const eventsResponse = await supabase
            .from('events')
            .select('*, event_types(*), event_signups(*), event_chairs(*)')
            .gte('date', focusStartDay.toISOString())
            .lte('date', focusEndDay.toISOString())
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

    useEffect(() => {
        getEvents();
    }, [focusDay]);

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} userData={userData} />
            <h1 className="text-center text-neutral-500 text-xl py-2">{format(focusDay, 'LLLL y').toUpperCase()}</h1>
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
            <div className="grow grid grid-cols-7 auto-rows-fr min-h-0">
                {
                    monthDays?.map((day, i) => {
                        return <MonthDayComponent
                            key={day.toISOString()}
                            userData={userData}
                            focusDay={focusDay}
                            day={day}
                            index={i}
                            fiveRows={monthDays.length > 28}
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
