'use client'

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as dateFns from 'date-fns';
import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { signUpEvent } from '@/lib/supabase/client';
import EventCard from './EventCard';

export default function EventCalendar({ focusDate }: { focusDate: Date }) {
    const supabase = createClientComponentClient();
    const [userData, setUserData] = React.useState<any>();

    const today = dateFns.set(dateFns.startOfToday(), { month: 1 });

    const [startOfMonth, setStartOfMonth] = React.useState<Date>(null);
    const [endOfMonth, setEndOfMonth] = React.useState<Date>(null);
    const [events, setEvents] = React.useState<Array<any>>([]);

    React.useEffect(() => {
        setStartOfMonth(dateFns.startOfWeek(dateFns.startOfMonth(focusDate), { weekStartsOn: 0 }));
        setEndOfMonth(dateFns.endOfWeek(dateFns.endOfMonth(focusDate), { weekStartsOn: 0 }));
    }, [focusDate]);

    React.useEffect(() => {
        async function getEvents() {
            const events = (await supabase.from('events').select('id, name, description, location, startDate, endDate, limit, shifts, users!events_creator_fkey ( name, email ), event_types ( name, abbreviation )').eq('reviewed', true).gte('startDate', startOfMonth.toISOString()).lte('endDate', endOfMonth.toISOString()));
            if (events.data) {
                setEvents(events.data);
            }
        }
        if (startOfMonth && endOfMonth)
            getEvents();
    }, [startOfMonth, endOfMonth])

    React.useEffect(() => {
        async function getUser() {
            const supabase = createClientComponentClient();
            const user = (await supabase.auth.getUser()).data.user;

            if (user == null) return;

            const userData = (await supabase.from('users').select('id, name').eq('uid', user.id).maybeSingle()).data;
            if (userData != null)
                setUserData(userData);
        }
        getUser();
    }, []);

    return (
        <div className="h-full w-full flex flex-col md:space-y-2">
            <div className="w-full grid grid-cols-7 gap-2">
            {
                    dateFns.eachDayOfInterval({
                        start: dateFns.startOfWeek(today, { weekStartsOn: 0 }),
                        end: dateFns.endOfWeek(today, { weekStartsOn: 0 })
                    }).map((day, i) => (
                        <div key={i} className="py-2 md:py-0">
                            <h1 className="text-xs md:text-base text-center text-gray-500">
                                {dateFns.format(day, 'E').toUpperCase()}
                            </h1>
                        </div>
                    ))
                }
            </div>
            <div className="flex-1 w-full grid grid-cols-7 auto-rows-fr sm:gap-2 divide-x divide-y md:divide-x-0 md:divide-y-0">
                {
                    dateFns.eachDayOfInterval({
                        start: startOfMonth,
                        end: endOfMonth
                    }).map((day, i) => 
                    {
                        const dayEvents = events.filter(event => dateFns.isSameDay(event.startDate, day))
                        return (
                            <Dialog key={i}>
                                <DialogTrigger asChild>
                                <div className={
                                    cn(
                                        "flex flex-col overflow-hidden md:rounded-lg p-[3px] md:p-2 md:hover:z-50 md:hover:shadow-xl md:hover:outline md:outline-1 outline-gray-400 hover:cursor-pointer transition-all ease-in-out delay-50 duration-200",
                                        dateFns.isSameMonth(focusDate, day) ? 'bg-white' : 'bg-gray-200 text-gray-400',
                                        dateFns.isSameDay(day, today) && 'bg-sky-200'
                                    )
                                }>
                                    
                                    <p className="text-xs md:text-base">{dateFns.getDate(day)}</p>
                                    {
                                        dayEvents.slice(0, 2).map((event, i) => {
                                            const eventLabel = event.event_types.name[0].toUpperCase();
                                            return (
                                                <div key={i} className={
                                                    cn(
                                                        "flex space-x-1 text-xs rounded",
                                                        dateFns.isSameDay(day, today) ? 'bg-sky-50' : 'bg-gray-100'
                                                    )
                                                }>
                                                    <h1 className="font-bold">
                                                        {eventLabel}
                                                    </h1>
                                                    <h1 className="truncate">
                                                        {event.name}
                                                    </h1>
                                                </div>
                                            )
                                        })
                                    }
                                    <h1 className="font-bold text-xs text-center">
                                        { dayEvents.length > 1 && '...' }
                                    </h1>
                                </div>
                                </DialogTrigger>
                                <DialogContent className="overflow-y-scroll max-h-screen bg-gray-100">
                                    <DialogHeader>
                                        <DialogTitle>
                                            {dateFns.format(day, 'PPPP')}
                                        </DialogTitle>
                                        <DialogDescription className="flex flex-col space-y-2">
                                            
                                        </DialogDescription>
                                        <div className="flex flex-col space-y-4">
                                            {
                                                dayEvents.map((event, i) => <EventCard key={i} userData={userData} event={event} />)
                                            }
                                        </div>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )
                    })
                }
            </div>
        </div>
    )
}