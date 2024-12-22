import { AuthContext } from "@/supabase/client";
import { eachDayOfInterval, endOfDay, endOfMonth, endOfToday, endOfWeek, format, getDate, interval, isAfter, isSameDay, isSameMonth, isThisMonth, isToday, startOfMonth, startOfToday, startOfWeek } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react"
import { EventModal } from "./eventmodal";
import "swiper/css";
import 'swiper/css/navigation';

function EventDay({ day, event, userData, setEvent }) {
    const includesUser = event?.event_signups?.some((signup) => signup.user_id === userData?.id);
    const isChairing = event?.event_chairs?.some((chair) => chair.user_id === userData?.id);
    const eventTypeId = event?.event_types.id;
    let style = '';
    if (includesUser) {
        style = 'hover:bg-blue-500 hover:text-white bg-blue-300';
        if (isChairing) {
            style += ' border border-purple-200 border-2'
        }
        else style += ' border border-slate-700 border-2'
    } else {
        if (eventTypeId == 1)
            style = `hover:bg-lime-300 hover:text-white bg-lime-200`;
        if (eventTypeId == 2)
            style = `hover:bg-teal-200 hover:text-white bg-teal-100`;
        if (eventTypeId == 3)
            style = `hover:bg-fuchsia-500 hover:text-white bg-fuchsia-300`;
        if (eventTypeId == 4)
            style = `hover:bg-indigo-300 hover:text-white bg-indigo-200`;
        if (eventTypeId == 5)
            style = `hover:bg-orange-400 hover:text-white bg-orange-200`;
        if (eventTypeId == 6)
            style = `hover:bg-purple-500 hover:text-white bg-purple-300`;
        if (eventTypeId == 7)
            style = `hover:bg-yellow-600 hover:text-white bg-yellow-300`;
        if (eventTypeId == 8)
            style = `hover:bg-pink-600 hover:text-white bg-pink-300`;
        if (eventTypeId == 9)
            style = `hover:bg-lime-500 hover:text-white bg-lime-200`;
        if (eventTypeId == 10)
            style = `hover:bg-red-500 hover:text-white bg-red-300`;
        if (eventTypeId == 11)
            style = `hover:bg-stone-600 hover:text-white bg-stone-300`;
        if (eventTypeId == 12)
            style = `hover:bg-indigo-800 hover:text-white bg-indigo-300`;
    }
    return <button
        onClick={() => setEvent(event)}
        className={`text-stone-800 ${style} gap-0 py-1 px-[2px] rounded-sm md:rounded-lg md:px-2 hover:shadow-lg transition ease-in delay-50 duration-100 w-full`}
    >
        <div className="flex space-x-1 text-[8px] md:text-xs overflow-x-hidden">
        {event?.tracked && <span className="text-black-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></span>}
            <h1 className="text-nowrap overflow-x-hidden">
                {event?.event_types?.abbreviation.toUpperCase()}
                {' '}
                <span className="hidden md:inline">
                    {format(event?.start_time, 'p')}
                    {' '}
                </span>
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
            <div className="flex flex-col items-center space-y-[4px] md:space-y-[1px] pr-[2px] md:px-2 overflow-y-auto">
            {
                events?.map((event, i) =>
                    <EventDay key={i} userData={userData} event={event} setEvent={setEvent} day={day} />
                )
            }
            </div>
        </div>
    )
}

function compareTimeOfDay(date1, date2) {
    const time1 = date1.getHours() * 3600000 + date1.getMinutes() * 60000 + date1.getSeconds() * 1000 + date1.getMilliseconds();
    const time2 = date2.getHours() * 3600000 + date2.getMinutes() * 60000 + date2.getSeconds() * 1000 + date2.getMilliseconds();

    return time1 - time2;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function EventCalendar({ focusDay, userData, filter }) {
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
        let eventsList = eventsResponse?.data;

        if (filter != 0)
        {
            eventsList = eventsList.filter((event) => event.event_types.id == filter)
        }

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
        const eventsMapSorted = Object.fromEntries(
            Object.entries(eventsMap).map(([key, val]) => {
                // Sort the array of events by `start_time`
                const sortedValues = val.sort((a, b) => compareTimeOfDay(new Date(a.start_time), new Date(b.start_time)));
                // Return the key with the sorted array
                return [key, sortedValues];
            })
        );
        setEvents(eventsMapSorted);
    }

    useEffect(() => {
        getEvents();
    }, [ focusDay, filter ]);

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} userData={userData} />
            
            <div className="flex items-center justify-center py-2 gap-4">
                <button className="text-center text-neutral-500 text-xl py-2 px-8 custom-prev hover:bg-stone-500 hover:text-white rounded-full transition">{ '<' }</button>
                <h1 className="text-center text-neutral-500 text-xl py-2">{format(focusDay, 'LLLL y').toUpperCase()}</h1>
                <button className="text-center text-neutral-500 text-xl py-2 px-8 custom-next hover:bg-stone-500 hover:text-white rounded-full transition">{ '>' }</button>
            </div>

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
