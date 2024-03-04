'use client'

import * as dateFns from 'date-fns';
import React from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import { createClient } from '@/utils/supabase/client';
import { EventDayDesktop, EventDayMobile } from './EventDay';

export default function EventCalendar({ focusDate, userData }: { focusDate: Date, userData: any }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const supabase = createClient();
    const today = dateFns.startOfToday();
    const [startOfMonth, setStartOfMonth] = React.useState<Date>(null);
    const [endOfMonth, setEndOfMonth] = React.useState<Date>(null);
    const [events, setEvents] = React.useState<Array<any>>([]);

    // When focus date changes, update start/end of month, fetch data
    React.useEffect(() => {
        const start = dateFns.startOfWeek(dateFns.startOfMonth(focusDate), { weekStartsOn: 0 });
        const end = dateFns.endOfWeek(dateFns.endOfMonth(focusDate), { weekStartsOn: 0 });
        setStartOfMonth(start);
        setEndOfMonth(end);

        async function getEvents() {
            const events = (await supabase.from('events').select('id, name, description, location, startDate, endDate, limit, shifts, users!events_creator_fkey ( name, email ), event_types ( name, abbreviation )').eq('reviewed', true).gte('startDate', start.toISOString()).lte('endDate', end.toISOString()).order('startDate'));
            if (events.data) {
                setEvents(events.data);
            }
        }
        if (startOfMonth && endOfMonth)
            getEvents();
    }, [focusDate]);

    return (
        <div className="h-full w-full flex flex-col md:space-y-2">
            {
                /*
                This is the days of the week row
                */
            }
            <div className="w-full grid grid-cols-7 gap-2">
            {
                    dateFns.eachDayOfInterval({
                        start: dateFns.startOfWeek(today, { weekStartsOn: 0 }),
                        end: dateFns.endOfWeek(today, { weekStartsOn: 0 })
                    }).map((day, i) => (
                        <div key={i} className="py-2 md:py-0">
                            <h1 className="text-xs md:text-base text-center text-gray-400">
                                {dateFns.format(day, 'E').toUpperCase()}
                            </h1>
                        </div>
                    ))
                }
            </div>
            {
                /*
                This is the actual month calendar grid
                */
            }
            <div className="flex-1 w-full grid grid-cols-7 auto-rows-fr sm:gap-2 divide-x divide-y md:divide-x-0 md:divide-y-0">
                {
                    dateFns.eachDayOfInterval({
                        start: startOfMonth,
                        end: endOfMonth
                    }).map((day, i) => 
                    {
                        const dayEvents = events.filter(event => dateFns.isSameDay(event.startDate, day))
                        if (isDesktop) {
                            return (
                                <EventDayDesktop
                                    key={i}
                                    focusDate={focusDate}
                                    day={day}
                                    events={dayEvents}
                                    today={today}
                                    userData={userData}
                                />
                            )
                        }
                        return (
                            <EventDayMobile
                                key={i}
                                focusDate={focusDate}
                                day={day}
                                events={dayEvents}
                                today={today}
                                userData={userData}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}