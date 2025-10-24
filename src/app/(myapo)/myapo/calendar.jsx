import { AuthContext } from "@/supabase/client";
import { addMonths, eachDayOfInterval, endOfDay, endOfMonth, endOfToday, endOfWeek, format, getDate, interval, isAfter, isSameDay, isSameMonth, isThisMonth, isToday, startOfMonth, startOfToday, startOfWeek, subMonths } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react"
import { EventModal } from "./eventmodal";
import "swiper/css";
import 'swiper/css/navigation';
import React from "react";

function eventBgClass(event, userData) {
    const includesUser = event?.event_signups?.some((signup) => signup.user_id === userData?.id);
    const isChairing = event?.event_chairs?.some((chair) => chair.user_id === userData?.id);
    const eventTypeId = event?.event_types?.id;
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
        if (eventTypeId == 13)
            style = `hover:bg-emerald-300 hover:text-white bg-emerald-400`;
    }
    return style;
}

function MonthEventDay({ day, event, userData, setEvent }) {
    const includesUser = event?.event_signups?.some((signup) => signup.user_id === userData?.id);
    const isChairing = event?.event_chairs?.some((chair) => chair.user_id === userData?.id);
    const eventTypeId = event?.event_types.id;
    const style = eventBgClass(event, userData);
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

export function WeekDayComponent({ userData, focusDay, day, index, fiveRows, events, setEvent }) {
    const [color, setColor] = useState(isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    useEffect(() => {
        const newcolor = isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100';
        setColor(newcolor);
    }, [ focusDay ]);

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
        <div className={`flex flex-col w-full transition ease-out delay-20 duration-150 ${color}`} onMouseLeave={() => { setPopover(false); }}>
            {/* week view: position events by time of day (absolute within this cell) */}
            <div className="relative w-full flex-1 pr-[2px] md:px-2 overflow-hidden">
                {/* day number, positioned at the very top so it lines up with hour labels */}
                <div className={`absolute left-0 right-0 text-center text-sm ${textColor} pt-1 z-20`}>{day && getDate(day)}</div>
                {/* hour lines inside this day's timeline (aligns with labels) */}
                {
                    Array.from({ length: 24 }).map((_, hour) => {
                        const topPercent = (hour / 24) * 100;
                        return <div key={hour} style={{ position: 'absolute', left: 0, right: 0, top: `${topPercent}%` }} className="h-px bg-neutral-200 pointer-events-none z-0" />
                    })
                }
            {
                // Precompute layout for overlapping events so they render side-by-side
                (() => {
                    if (!events || events.length === 0) return null;
                    // map events to intervals with original index
                    const mapped = events.map((ev, idx) => {
                        const start = ev?.start_time ? new Date(ev.start_time) : null;
                        const end = ev?.end_time ? new Date(ev.end_time) : null;
                        const defaultDurationMinutes = 60;
                        let s = 0;
                        let e = defaultDurationMinutes;
                        if (start) s = start.getHours() * 60 + start.getMinutes() + start.getSeconds() / 60;
                        if (end) e = end.getHours() * 60 + end.getMinutes() + end.getSeconds() / 60;
                        if (!start && !end) { s = 0; e = defaultDurationMinutes; }
                        if (e <= s) e = s + defaultDurationMinutes;
                        return { ev, originalIndex: idx, s, e, startDate: start };
                    });

                    // sort by start then end
                    mapped.sort((a, b) => a.s - b.s || a.e - b.e);

                    // build overlap graph to find connected components
                    const n = mapped.length;
                    const adj = Array.from({ length: n }, () => []);
                    for (let i = 0; i < n; i++) {
                        for (let j = i + 1; j < n; j++) {
                            if (mapped[i].s < mapped[j].e && mapped[j].s < mapped[i].e) {
                                adj[i].push(j);
                                adj[j].push(i);
                            }
                        }
                    }

                    const compIndex = new Array(n).fill(-1);
                    let compId = 0;
                    for (let i = 0; i < n; i++) {
                        if (compIndex[i] !== -1) continue;
                        // bfs/dfs
                        const stack = [i];
                        compIndex[i] = compId;
                        while (stack.length) {
                            const u = stack.pop();
                            for (const v of adj[u]) {
                                if (compIndex[v] === -1) { compIndex[v] = compId; stack.push(v); }
                            }
                        }
                        compId++;
                    }

                    const comps = Array.from({ length: compId }, () => []);
                    for (let i = 0; i < n; i++) comps[compIndex[i]].push(i);

                    // results by mapped index
                    const layoutByMappedIndex = new Array(n);

                    for (let c = 0; c < compId; c++) {
                        const idxs = comps[c].slice().sort((a, b) => mapped[a].s - mapped[b].s || mapped[a].e - mapped[b].e);
                        const columnsEnd = []; // end times per column
                        for (const mi of idxs) {
                            const item = mapped[mi];
                            // find first available column
                            let col = columnsEnd.findIndex(endT => item.s >= endT);
                            if (col === -1) { col = columnsEnd.length; columnsEnd.push(item.e); }
                            else { columnsEnd[col] = item.e; }
                            layoutByMappedIndex[mi] = { col, totalCols: columnsEnd.length };
                        }
                    }

                    // render in original events order (but mapped contains startDate)
                    return mapped.map((m, mappedIdx) => {
                        const { ev, s, e, startDate } = m;
                        const layout = layoutByMappedIndex[mappedIdx] || { col: 0, totalCols: 1 };
                        const duration = e - s;
                        const topPercent = (s / 1440) * 100;
                        const heightPercent = (duration / 1440) * 100;
                        const col = layout.col;
                        const totalCols = layout.totalCols || 1;
                        const leftPercent = (col / totalCols) * 100;
                        const widthPercent = (1 / totalCols) * 100;

                        // small horizontal padding to separate overlapping events
                        const leftCalc = `calc(${leftPercent}% + 4px)`;
                        const widthCalc = `calc(${widthPercent}% - 8px)`;

                        return (
                            <button
                                key={m.originalIndex}
                                onClick={() => setEvent(ev)}
                                style={{ position: 'absolute', left: leftCalc, width: widthCalc, top: `${topPercent}%`, height: `${heightPercent}%` }}
                                className={`relative text-stone-800 ${eventBgClass(ev, userData)} gap-0 py-1 px-[8px] rounded-sm md:rounded-lg hover:shadow-lg transition ease-in delay-50 duration-100 overflow-hidden flex items-start justify-start z-10`}
                            >
                                    {/* absolute time in top-right */}
                                    <span className="absolute right-2 top-2 text-[9px] md:text-xs text-neutral-700">{startDate ? format(startDate, 'p') : ''}</span>
                                    <div className="flex flex-col items-start justify-start text-[9px] md:text-xs h-full pt-1 pr-8">
                                        <div className="flex items-center justify-start w-full">
                                            <span className="font-bold text-[10px] md:text-sm">{ev?.event_types?.abbreviation?.toUpperCase()}</span>
                                        </div>
                                        <div className="wrap text-[10px] md:text-sm w-full text-left">{ev?.name}</div>
                                    </div>
                            </button>
                        );
                    });
                })()
            }
            </div>
        </div>
    )
}

export function MonthDayComponent({ userData, focusDay, day, index, fiveRows, events, setEvent }) {
    const [color, setColor] = useState(isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    useEffect(() => {
        const newcolor = isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100';
        setColor(newcolor);
    }, [ focusDay ]);

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
                    <MonthEventDay key={i} userData={userData} event={event} setEvent={setEvent} day={day} />
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

export const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function EventCalendar({ focusDay, userData, filter, events, shiftList }) {
    const supabase = useContext(AuthContext);
    const [monthDays, setMonthDays] = useState([]);
    const [eventModal, setEventModal] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const start = startOfWeek(startOfMonth(focusDay));
        const end = endOfWeek(endOfMonth(focusDay));
        const days = eachDayOfInterval(interval(start, end));
        setMonthDays(days);
    }, [ focusDay ]);
    
    useEffect(() => {
        if(!events) return
        let eventsList = events;
        if (filter.length != 0)
        {
            eventsList = events.filter((event) => filter.includes(event.event_types.id))            
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
        setFilteredEvents(eventsMapSorted)
    }, [filter, events])

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} userData={userData} shiftList={shiftList} />
            
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
                            events={(filteredEvents[day.toLocaleDateString()] || [])}
                            setEvent={setEventModal}
                        />
                    }
                    )
                }
            </div>
        </div>
    )
}
export function WeekCalendar({ focusDay, userData, filter, events, shiftList }) {
    const supabase = useContext(AuthContext);
    const [monthDays, setMonthDays] = useState([]);
    const [eventModal, setEventModal] = useState(null);
    const [filteredEvents, setFilteredEvents] = useState([]);

    useEffect(() => {
        const start = startOfWeek(focusDay);
        const end = endOfWeek(focusDay);
        const days = eachDayOfInterval(interval(start, end));
        setMonthDays(days);
    }, [ focusDay ]);
    
    useEffect(() => {
        if(!events) return
        let eventsList = events;
        if (filter.length != 0)
        {
            eventsList = events.filter((event) => filter.includes(event.event_types.id))            
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
        setFilteredEvents(eventsMapSorted)
    }, [filter, events])

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} userData={userData} shiftList={shiftList} />
            
            <div className="flex items-center justify-center py-2 gap-4">
                <button className="text-center text-neutral-500 text-xl py-2 px-8 custom-prev hover:bg-stone-500 hover:text-white rounded-full transition">{ '<' }</button>
                <h1 className="text-center text-neutral-500 text-xl py-2">{format(focusDay, 'LLLL y').toUpperCase()}</h1>
                <button className="text-center text-neutral-500 text-xl py-2 px-8 custom-next hover:bg-stone-500 hover:text-white rounded-full transition">{ '>' }</button>
            </div>

            {/* Day titles: include left spacer to line up with hour labels in week view */}
            <div className="flex items-center">
                <div className="w-14 flex-shrink-0" />
                <div className="grid grid-cols-7 flex-1">
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
                <div className="w-4 flex-shrink-0" />
            </div>
            {/* Scrollable timeline with left hour labels and 7 day columns; both scroll together */}
            <div className="grow min-h-0">
                <div className="h-[640px] overflow-auto pb-6">
                    <div className="relative h-[1440px]">
                        <div className="flex">
                            {/* left column: hour labels */}
                            <div className="w-14 flex-shrink-0">
                                <div className="relative h-[1440px]">
                                    {
                                        Array.from({ length: 24 }).map((_, hour) => {
                                            const topPercent = (hour / 24) * 98.5;
                                            const label = `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'AM' : 'PM'}`;
                                            return (
                                                <div key={hour} style={{ position: 'absolute', left: 0, right: 0, top: `${topPercent}%`, transform: 'translateY(-50%)' }} className="text-xs text-neutral-400 text-right pr-2">
                                                    {label}
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            {/* right: 7 day columns */}
                            <div className="grid grid-cols-7 w-full min-h-[1440px] pb-6">
                                {
                                    monthDays?.map((day, i) => {
                                        return <WeekDayComponent
                                            key={day.toISOString()}
                                            userData={userData}
                                            focusDay={focusDay}
                                            day={day}
                                            index={i}
                                            fiveRows={monthDays.length > 28}
                                            events={(filteredEvents[day.toLocaleDateString()] || [])}
                                            setEvent={setEventModal}
                                        />
                                    }
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}