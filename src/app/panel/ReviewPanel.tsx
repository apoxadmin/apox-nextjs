'use client'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import React from "react";
import { EventReviewCard, EventReviewDialog } from "./EventCards";
import { endOfToday, startOfToday } from "date-fns";
import { stringToCapital } from "@/lib/utils";

export default function ReviewPanel({ eventTypes }: { eventTypes: Array<string> }) {
    const supabase = createClientComponentClient();
    const [unreviewedEvents, setUnreviewedEvents] = React.useState<Array<any>>([]);
    const [upcomingEvents, setUpcomingEvents] = React.useState<Array<any>>([]);
    const [unreviewedFocusEvent, setUnreviewedFocusEvent] = React.useState<any>(null);
    const [upcomingFocusEvent, setUpcomingFocusEvent] = React.useState<any>(null);
    const [unreviewedDialogOpen, setUnreviewedDialogOpen] = React.useState<boolean>(false);
    const [upcomingDialogOpen, setUpcomingDialogOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        async function fetchEvents() {
            const unreviewed = (await supabase.from('events').select('*, chair_joins ( users ( * ) ), event_user_joins ( users ( * ) ), event_types!inner(*)').eq('reviewed', false).order('startDate')).data;
            setUnreviewedEvents(unreviewed);
            const upcoming = (await supabase.from('events').select('*, chair_joins ( users ( * ) ), event_user_joins ( users ( * ) ), event_types!inner(*)').eq('reviewed', true).gte('startDate', startOfToday().toISOString()).order('startDate')).data;
            setUpcomingEvents(upcoming);
        }
        fetchEvents();
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4 pb-4 px-4">
            <EventReviewDialog 
                focusEvent={unreviewedFocusEvent}
                setEvent={(newEvent) => { 
                    const newEvents = [...unreviewedEvents];
                    newEvents[newEvent.i] = newEvent.event;
                    setUnreviewedEvents(newEvents);
                }}
                events={unreviewedEvents}
                setEvents={setUnreviewedEvents}
                open={unreviewedDialogOpen}
                onOpenChange={setUnreviewedDialogOpen}
                closeDialog={() => { setUnreviewedDialogOpen(false); }}
            />
            <h1 className="text-center text-xl pt-4 w-full font-medium underline">Unreviewed { eventTypes.length == 1 ? stringToCapital(eventTypes[0]) : 'Events' }</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
            {
                    unreviewedEvents?.length > 0 ?
                    unreviewedEvents?.map((event, i) => {
                        return (
                            <EventReviewCard 
                                key={i}
                                event={event}
                                onClick={() => { setUnreviewedFocusEvent({ event, i }); setUnreviewedDialogOpen(true); }}/>
                        )
                    })
                    : <h1 className="text-center text-neutral-500">Nothing here yet!</h1>
            }
            </div>
            
            <EventReviewDialog 
                focusEvent={upcomingFocusEvent}
                setEvent={(newEvent) => { 
                    const newEvents = [...upcomingEvents];
                    newEvents[newEvent.i] = newEvent.event;
                    setUpcomingEvents(newEvents);
                }}
                events={upcomingEvents}
                setEvents={setUpcomingEvents}
                open={upcomingDialogOpen}
                onOpenChange={setUpcomingDialogOpen}
                closeDialog={() => { setUpcomingDialogOpen(false); }}
            />
            <h1 className="text-center text-xl pt-4 w-full font-medium underline">Upcoming { eventTypes.length == 1 ? stringToCapital(eventTypes[0]) : 'Events' }</h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                {
                        upcomingEvents?.length > 0 ?
                        upcomingEvents?.map((event, i) => {
                            return (
                                <EventReviewCard 
                                    key={i}
                                    event={event}
                                    onClick={() => { setUpcomingFocusEvent({ event, i }); setUpcomingDialogOpen(true); }}/>
                            )
                        })
                        : <h1 className="text-center text-neutral-500">Nothing here yet!</h1>
                }
            </div>
        </div>
    )
}