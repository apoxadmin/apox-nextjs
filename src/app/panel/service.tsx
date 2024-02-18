import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import React from "react";
import { EventReviewCard, EventReviewDialog } from "./EventCards";



export default function ServicePage() {
    const supabase = createClientComponentClient();
    const [events, setEvents] = React.useState<Array<any>>([]);
    const [focusEvent, setFocusEvent] = React.useState<any>(null);
    const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);

    React.useEffect(() => {
        async function fetchEvents() {
            const eventList = (await supabase.from('events').select('*, chair_joins ( users ( * ) ), event_user_joins ( users ( * ) ), event_types!inner(*)').eq('event_types.name', 'service').eq('reviewed', false)).data;
            setEvents(eventList);
        }
        fetchEvents()
    }, [])

    return (
        <div className="flex flex-col space-y-4 pb-4 px-4">
            <EventReviewDialog 
                focusEvent={focusEvent}
                setEvent={(newEvent) => { 
                    const newEvents = [...events];
                    newEvents[newEvent.i] = newEvent.event;
                    setEvents(newEvents);
                }}
                open={dialogOpen}
                onOpenChange={setDialogOpen} />
            <h1 className="text-center text-xl pt-4 bg-white w-full">Unreviewed Service Events</h1>
            {
                    events?.map((event, i) => {
                        return (
                            <EventReviewCard 
                                key={i}
                                event={event}
                                
                                onClick={() => { setFocusEvent({ event, i }); setDialogOpen(true); }}/>
                        )
                    })
                }
        </div>
    )
}