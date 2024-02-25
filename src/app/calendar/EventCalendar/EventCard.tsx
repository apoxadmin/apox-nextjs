'use client'

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { endOfToday, format, isBefore, subDays } from "date-fns";
import React from "react";
import { chairEvent, leaveEvent, signUpEvent, unchairEvent } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";

export default function EventCard({ userData, event }) {
    const [attendees, setAttendees] = React.useState<Array<any>>([]);
    const [chairs, setChairs] = React.useState<Array<any>>([]);

    const supabase = createClient();

    let eventLabel = event.event_types.name.split(" ");
    for (let i = 0; i < eventLabel.length; i++) {
        eventLabel[i] = eventLabel[i][0].toUpperCase() + eventLabel[i].substr(1);
    }
    eventLabel.join(" ");
    if (!event.event_types.name.endsWith('meeting')) {
        eventLabel += " Event";
    }
    event.label = eventLabel;

    React.useEffect(() => {
        async function fetchChairsAttendees() {
            const chairsResponse = await supabase.from('chair_joins').select('users (*)').eq('event_id', event.id);
            if (chairsResponse.data)
                setChairs(chairsResponse.data.map(join => join.users));
            const attendeesResponse = await supabase.from('event_user_joins').select('users (*)').eq('event_id', event.id);
            if (attendeesResponse.data)
                setAttendees(attendeesResponse.data.map(join => join.users));
        }
        fetchChairsAttendees();
    }, []);

    return (
    <Card className="hover:shadow-lg transition delay-50 duration-200 ease-in-out overflow-hidden">
        <ScrollArea className="overflow-scroll-y">
            <div className="max-h-[30vh]">
                <CardHeader className="flex flex-col items-center">
                    <CardDescription>{event.label}</CardDescription>
                    <CardTitle className="text-lg md:text-2xl">{event.name}</CardTitle>
                    <CardTitle className="text-base md:text-xl">{format(event.startDate, 'p')} - {format(event.endDate, 'p')}</CardTitle>
                    <div className="flex space-x-2 text-sm">
                        <p className="font-medium">Location:</p>
                        <p>{event.location}</p>
                    </div>
                    <div className="flex space-x-2 text-sm">
                        <p className="font-medium">Contact:</p>
                        <p>{event.users.name}</p>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4 h-full">
                    
                    <h1>
                        {event.description}
                    </h1>
                    <div className="grid grid-cols-2 w-full">
                        <div className="flex flex-col items-center">
                            <h1 className="font-bold">Chairs:</h1>
                            
                            {
                                chairs?.map((chair, i) => <h1 key={i}>{chair.name}</h1>)
                            }
                            
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="font-bold">Attendees:</h1>
                            {
                                attendees?.map((attendee, i) => <h1 key={i}>{attendee.name}</h1>)
                            }
                        </div>
                    </div>
                    <div className="space-x-2">
                        {
                            userData && isBefore(endOfToday(), subDays(event.startDate, 3)) && attendees?.map(a => a.id).includes(userData.id) ? 
                            <Button onClick={() => { 
                                leaveEvent(event.id);
                                setAttendees(attendees.filter(a => a.id != userData.id));
                                unchairEvent(event.id);
                                setChairs(chairs.filter(a => a.id != userData.id));
                            }}>
                                Leave
                            </Button>
                            :
                            userData && isBefore(endOfToday(), subDays(event.startDate, 3)) && <Button onClick={() => { 
                                signUpEvent(event.id)
                                .then(() => {
                                    setAttendees([...attendees, { name: userData.name, id: userData.id }]);
                                })
                            }}>
                                Sign up
                            </Button>
                        }
                        
                        {
                            userData &&  attendees?.map(a => a.id).includes(userData.id) && chairs.map(a => a.id).includes(userData.id) ? 
                            <Button onClick={() => {
                                unchairEvent(event.id);
                                setChairs(chairs.filter(a => a.id != userData.id));
                            }}>
                                Unchair
                            </Button>
                            :
                            userData && (chairs?.length == 0 || (chairs.length == 1 && attendees.length > 5)) && attendees.map(a => a.id).includes(userData.id) && <Button onClick={() => { 
                                chairEvent(event.id)
                                .then(() => {
                                    setChairs([...chairs, { name: userData.name, id: userData.id }]);
                                })
                            }}>Chair</Button>
                        }
                    </div>
                </CardContent>
            </div>
        </ScrollArea>
        
    </Card>
    );
}