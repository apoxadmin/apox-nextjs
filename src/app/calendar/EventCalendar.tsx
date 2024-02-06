'use client'

import { getEvents } from '@/lib/contenfulCDN';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import * as dateFns from 'date-fns';
import React from 'react';

export default function EventCalendar({ focusDate }: { focusDate: Date }) {
    const today = dateFns.set(dateFns.startOfToday(), { month: 1 });

    const [startOfMonth, setStartOfMonth] = React.useState<Date>(null);
    const [endOfMonth, setEndOfMonth] = React.useState<Date>(null);
    const [events, setEvents] = React.useState<Array<any>>([]);

    React.useEffect(() => {
        setStartOfMonth(dateFns.startOfWeek(dateFns.startOfMonth(focusDate), { weekStartsOn: 0 }));
        setEndOfMonth(dateFns.endOfWeek(dateFns.endOfMonth(focusDate), { weekStartsOn: 0 }));
    }, [focusDate]);

    React.useEffect(() => {
        async function setNewEvents() {
            const newEventsEntries = await getEvents({
                'fields.startDate[gte]': startOfMonth.toISOString(),
                'fields.endDate[lte]': endOfMonth.toISOString(),
            });
            const newEvents = newEventsEntries.map((entry) => entry.fields).sort((a: any, b: any) => {
                if (dateFns.isBefore(a.startDate, b.startDate))
                    return -1;
                else if (dateFns.isSameMinute(a.startDate, b.startDate))
                    return 0;
                else
                    return 1;
            });;
            setEvents(newEvents);
        }
        if (startOfMonth && endOfMonth)
            setNewEvents();
    }, [startOfMonth, endOfMonth])

    return (
        <div className="w-full flex flex-col space-y-2">
            <div className="w-full grid grid-cols-7 gap-4">
            {
                    dateFns.eachDayOfInterval({
                        start: dateFns.startOfWeek(today, { weekStartsOn: 0 }),
                        end: dateFns.endOfWeek(today, { weekStartsOn: 0 })
                    }).map((day, i) => (
                        <div key={i} className="">
                            <h1 className="text-center text-gray-500">
                                {dateFns.format(day, 'E').toUpperCase()}
                            </h1>
                        </div>
                    ))
                }
            </div>
            <div className="flex-1 w-full grid grid-cols-7 auto-rows-fr gap-1 sm:gap-4">
                {
                    dateFns.eachDayOfInterval({
                        start: startOfMonth,
                        end: endOfMonth
                    }).map((day, i) => 
                    {
                        const dayEvents = events.filter(event => dateFns.isSameDay(event.startDate, day))
                        return (
                            <Dialog>
                                <DialogTrigger asChild>
                                <div key={i} className={
                                    cn(
                                        "flex flex-col space-y-1 overflow-hidden rounded-lg p-2 hover:shadow-xl hover:outline outline-1 outline-gray-400 hover:cursor-pointer transition-all ease-in-out delay-50 duration-200",
                                        dateFns.isSameMonth(focusDate, day) ? 'bg-gray-100' : 'bg-gray-200 text-gray-400',
                                        dateFns.isSameDay(day, today) && 'bg-blue-100'
                                    )
                                }>
                                    {dateFns.getDate(day)}
                                    {
                                        dayEvents.slice(0, 2).map((event, i) => {
                                            const eventLabel = event.type.split('/')[0].toUpperCase();
                                            return (
                                                <div key={i} className="flex space-x-1 text-xs bg-gray-100 rounded p-1">
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
                                        { dayEvents.length > 2 && '...' }
                                    </h1>
                                </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            {dateFns.format(day, 'PPPP')}
                                        </DialogTitle>
                                        <DialogDescription className="flex flex-col space-y-2">
                                            {
                                                dayEvents.map((event, i) => {
                                                    const eventLabel = event.type.split('/')[0].toUpperCase();
                                                    return (
                                                        <div key={i} className="flex flex-col space-y-1">
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
                                        </DialogDescription>
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