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
import { chairEvent, leaveEvent, leaveShift, signUpEvent, signUpShift, unchairEvent } from "@/lib/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/utils/supabase/client";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { updateEvent } from "@/lib/supabase/actions";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DEBUG = false;

function EventCardDetail({ event, chairs, attendees, userData, setAttendees, setChairs }) {
    const [allShifts, setAllShifts] = React.useState<Array<any>>([]);
    const supabase = createClient();

    React.useEffect(() => {
        async function fetchShifts() {
            const shift_joins = await supabase.from('shift_user_joins').select('index, users(*)').eq('event_id', event.id);
            if (shift_joins.data) {
                const newShifts = Array(event?.shifts.length).fill([]);
                for (let i = 0; i < shift_joins.data.length; i++) {
                    const shiftData: any = shift_joins.data[i];
                    const newShift = [...newShifts[shift_joins.data[i].index]];
                    newShift.push(shiftData?.users)
                    newShifts[shift_joins.data[i].index] = newShift;
                }
                setAllShifts(newShifts);
            }
        }
        if (event?.shifts?.length > 0) {
            fetchShifts();
        }
    }, [event]);

    return (
        <ScrollArea>
        <div className="w-full max-h-[95dvh] flex flex-col items-center space-y-4 px-8 md:px-4 py-8">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-neutral-500 text-sm">{event.label}</h1>
                <h1 className="text-lg md:text-xl font-bold">{event?.name}</h1>
                <h1 className="text-base md:text-xl font-medium">{format(event?.startDate, 'p')} - {format(event.endDate, 'p')}</h1>
                {
                    !event.event_types.name.endsWith('meeting') && !(event.event_types.name == 'pledge credit') &&
                    <h1 className="text-neutral-500">Contact: {event?.users?.name}</h1>
                }
                <h1 className="[overflow-wrap:anywhere] text-sm md:text-base">{event?.description}</h1>
                <div className="">
                    <h1 className="font-medium mr-2">
                        Location:
                    </h1>
                    <h1 className="text-sm md:text-base">{event?.location}</h1>
                </div>
                
                {
                    event.limit > 0 && <div className="flex space-x-1">
                        <h1 className="font-medium">Capacity: </h1>
                        <h1>
                            {`${attendees.length}/${event.limit}`}
                        </h1>
                        </div>
                }
            </div>
            <div className="space-x-2">
                {
                    userData && (isBefore(endOfToday(), subDays(event?.startDate, 3)) || DEBUG) && attendees?.map(a => a.id).includes(userData.id) ? 
                    <Button 
                        onClick={() => { 
                            leaveEvent(event?.id)
                            .then(() => {
                                setAttendees(attendees.filter(a => a.id != userData.id));
                                unchairEvent(event?.id);
                                setChairs(chairs.filter(a => a.id != userData.id));
                            });
                        }}
                        className="bg-red-600 hover:bg-red-400"
                    >
                        Leave
                    </Button>
                    :
                    userData && ((isBefore(endOfToday(), subDays(event?.startDate, 3)) && (attendees.length < event.limit || event?.limit == 0) ) || DEBUG) && 
                    <Button 
                        onClick={() => { 
                            signUpEvent(event?.id)
                            .then(() => {
                                setAttendees([...attendees, { name: userData?.name, id: userData?.id }]);
                            })
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500"
                    >
                        Sign up
                    </Button>
                }
                
                {
                    userData && attendees?.map(a => a.id).includes(userData.id) && chairs?.map(a => a.id).includes(userData.id) ? 
                    <Button
                        onClick={() => {
                            unchairEvent(event.id)
                            .then(() => {
                                setChairs(chairs.filter(a => a.id != userData.id));
                            });
                        }}
                        className="bg-red-600 hover:bg-red-400"
                    >
                        Unchair
                    </Button>
                    :
                    userData && !event.event_types.name.endsWith('meeting') && !(event.event_types.name == 'pledge credit') && (chairs?.length == 0 || (chairs.length == 1 && attendees.length > 5)) && attendees?.map(a => a.id).includes(userData.id) &&
                    <Button
                        onClick={() => { 
                            chairEvent(event.id)
                            .then(() => {
                                setChairs([...chairs, { name: userData.name, id: userData.id }]);
                            })
                        }}
                        className="bg-indigo-600 hover:bg-indigo-400"
                    >
                        Chair
                    </Button>
                }
            </div>
            {
                !event.event_types.name.endsWith('meeting') &&
                <div className="grid grid-cols-2 w-full">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="font-bold">Chairs:</h1>
                        
                        {
                            chairs?.map((chair, i) => <h1 key={i}>{chair.name}</h1>)
                        }
                        
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <h1 className="font-bold">Attendees:</h1>
                        <div className="flex flex-col space-y-2">
                        {
                            attendees?.map((attendee, i) => <div key={i}><h1 className="text-xs md:text-base">{attendee.name}</h1><h1 className="text-xs md:text-base text-neutral-500" key={i}>{attendee.email}</h1></div>)
                        }
                        </div>
                    </div>
                </div>
            }
            {
                userData && event?.shifts?.length > 0 && allShifts.length > 0 &&
                <div className="flex flex-col items-center space-y-4 w-full">
                    <h1 className="text-center font-bold">
                        Shifts:
                    </h1>
                    {
                        allShifts.map((usersInShift, i) => {
                            return (
                                <div key={i} className="flex flex-col items-center space-y-1">
                                    <h1 className="font-medium">
                                    {format(event?.shifts?.at(i)?.startDate, 'p')} - {format(event?.shifts?.at(i)?.endDate, 'p')}
                                    </h1>
                                    {
                                        allShifts[i].map((user, j) => {
                                            return (
                                                <div key={j}>
                                                    {user.name}
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !allShifts[i].map(user => user.id).includes(userData.id) ? attendees?.map(a => a.id).includes(userData?.id) && (event?.shifts?.at(i).limit == 0 || usersInShift.length < event?.shifts?.at(i).limit) &&
                                        <Button
                                            className="bg-emerald-600 hover:bg-emerald-500"
                                            onClick={() => {
                                                signUpShift(event.id, i)
                                                .then(() => {
                                                    const shifts = [...allShifts[i]];
                                                    shifts.push(userData);
                                                    const allShiftsNew = [...allShifts];
                                                    allShiftsNew[i] = shifts;
                                                    setAllShifts(allShiftsNew);
                                                });
                                            }}
                                        >
                                            Sign up
                                        </Button>
                                        :
                                        <Button
                                            className="bg-red-600 hover:bg-red-500"
                                            onClick={() => {
                                                leaveShift(event.id, i)
                                                .then(() => {
                                                    const shifts = [...allShifts[i]].filter(user => user.id != userData.id);
                                                    const allShiftsNew = [...allShifts];
                                                    allShiftsNew[i] = shifts;
                                                    setAllShifts(allShiftsNew);
                                                });
                                            }}
                                        >
                                            Leave
                                        </Button>
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
        </ScrollArea>
    );
}

const EVENT_COLORS = {
    'chapter meeting': 'bg-red-100 outline outline-1 outline-red-700',
    'pledge meeting': 'bg-yellow-100 outline outline-1 outline-yellow-700',
    'active credit': 'bg-red-100',
    'pledge credit': 'bg-yellow-100',
    'fellowship': 'bg-cyan-100',
    'service': 'bg-lime-100',
    'family': 'bg-orange-100',
    'fundraising': 'bg-green-100',
    'interchapter': 'bg-fuchsia-100',
    'leadership': 'bg-violet-200'
}

function EventCardTrigger({ event, attendees }) {
    return (
        <Card className={
            cn(
                "hover:shadow-lg transition delay-50 duration-200 ease-in-out overflow-hidden",
                EVENT_COLORS[event.event_types.name]
            )
        }>
            <div className="max-h-[30vh]">
                <CardHeader className="flex flex-col items-center">
                    <CardDescription>{event?.label}</CardDescription>
                    <CardTitle className="text-lg md:text-2xl">{event?.name}</CardTitle>
                    {/* <CardTitle className="text-base md:text-xl">{format(event?.startDate, 'p')} - {format(event?.endDate, 'p')}</CardTitle> */}
                    <div className="flex space-x-2 text-sm">
                        <p className="font-medium">Location:</p>
                        <p>{event.location}</p>
                    </div>
                    
                    {
                        event.limit > 0 && <div className="flex space-x-2 text-sm">
                            <p className="font-medium">Capacity:</p>
                            <p>{`${attendees.length}/${event.limit}`}</p>
                        </div>
                    }
                </CardHeader>
            </div>
        </Card>
    )
}
 
export default function EventCard({ userData, event }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [attendees, setAttendees] = React.useState<Array<any>>([]);
    const [chairs, setChairs] = React.useState<Array<any>>([]);

    const supabase = createClient();

    let eventLabel = event.event_types.name.split(" ");
    
    for (let i = 0; i < eventLabel.length; i++) {
        eventLabel[i] = eventLabel[i][0].toUpperCase() + eventLabel[i].substr(1);
    }
    let label = eventLabel.join(" ");
    if (!event.event_types.name.endsWith('meeting')) {
        label += " Event";
    }
    event.label = label;

    React.useEffect(() => {
        async function fetchChairsAttendees() {
            const chairsResponse = await supabase.from('chair_joins').select('users (*)').eq('event_id', event.id);
            if (chairsResponse.data)
                setChairs(chairsResponse.data?.map(join => join?.users));
            const attendeesResponse = await supabase.from('event_user_joins').select('users (*)').eq('event_id', event.id);
            if (attendeesResponse.data)
                setAttendees(attendeesResponse.data?.map(join => join?.users));
        }
        fetchChairsAttendees();
    }, []);

    return (
        isDesktop ? 
        <Dialog>
            <DialogTrigger>
                <EventCardTrigger event={event} attendees={attendees} />
            </DialogTrigger>
            <DialogContent className="h-[80dvh]">
                <EventCardDetail event={event} chairs={chairs} attendees={attendees} userData={userData} setAttendees={setAttendees} setChairs={setChairs} />
            </DialogContent>
        </Dialog>
        : <Drawer>
            <DrawerTrigger>
                <EventCardTrigger event={event} attendees={attendees} />
            </DrawerTrigger>
            <DrawerContent className="h-3/4">
                <EventCardDetail event={event} chairs={chairs} attendees={attendees} userData={userData} setAttendees={setAttendees} setChairs={setChairs} />
            </DrawerContent>
        </Drawer>
    );
}