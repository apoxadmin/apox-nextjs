'use client'

import * as dateFns from 'date-fns';
import EventCalendar from './EventCalendar';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from 'react';
import { getEvents } from '@/lib/contenfulCDN';

export default function CalendarPage() {
    const [focusDate, setFocusDate] = React.useState<Date>(dateFns.startOfToday());
    const [todaysEvents, setTodaysEvents] = React.useState<Array<any>>([]);

    React.useEffect(() => {
        async function setNewEvents() {
            const newEventsEntries = await getEvents({
                'fields.startDate[gte]': dateFns.startOfToday().toISOString(),
                'fields.endDate[lte]': dateFns.endOfToday().toISOString(),
            });
            const newEvents = newEventsEntries.map((entry) => entry.fields).sort((a: any, b: any) => {
                if (dateFns.isBefore(a.startDate, b.startDate))
                    return -1;
                else if (dateFns.isSameMinute(a.startDate, b.startDate))
                    return 0;
                else
                    return 1;
            });;
            setTodaysEvents(newEvents);
        }
        setNewEvents();
    }, [])

    return (
    <main className="flex h-screen flex-col items-center space-y-4 bg-gray-100 pt-8 px-8 pb-4">
        <div className="flex items-center justify-between w-full p-4 bg-white rounded shadow-lg">
            <h1 className="text-lg">
                {dateFns.format(dateFns.startOfToday(), 'PPPP')}
            </h1>
            <div className="flex items-center space-x-4">
                <h1 className="text-lg select-none">
                    {dateFns.format(focusDate, 'LLLL')}
                </h1>
                <IoIosArrowBack 
                    className="text-2xl hover:cursor-pointer hover:text-gray-500"
                    onClick={() => setFocusDate(dateFns.addMonths(focusDate, -1))} 
                />
                <IoIosArrowForward 
                    className="text-2xl hover:cursor-pointer hover:text-gray-500"
                    onClick={() => setFocusDate(dateFns.addMonths(focusDate, 1))} 
                />
            </div>
        </div>
        <div className="flex w-full flex-1 sm:space-x-4">
            <div className="flex flex-col space-y-4 hidden sm:block bg-white p-6 rounded shadow-lg">
                <h1 className="text-center text-xl">
                    Today's Events
                </h1>
                <div className="flex flex-col space-y-2">
                    {
                        todaysEvents.map((event, i) => {
                            const eventLabel = event.type.split('/')[0].toUpperCase();
                            return (
                                <div key={i} className="flex flex-col text-sm space-y-1">
                                    <div className="flex space-x-1 bg-gray-100 rounded p-1">
                                        <h1 className="font-bold">
                                            {eventLabel}
                                        </h1>
                                        <h1 className="truncate">
                                            {event.name}
                                        </h1>
                                    </div>
                                    <h1 className="line-clamp-1">
                                        {event.description}
                                    </h1>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="flex bg-white flex-1 p-6 rounded  shadow-lg">
                <EventCalendar focusDate={focusDate}/>
            </div>
        </div>
        <h1 className="text-sm text-gray-400">
            © All Copyright Reserved | Alpha Phi Omega - University of California, Los Angeles 
        </h1>
    </main>
    )
}