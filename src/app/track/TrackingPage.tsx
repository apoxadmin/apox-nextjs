'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import getLatestDrive, { getMyEvents, trackEvent } from "@/lib/supabase/client";
import { stringToCapital } from "@/lib/utils";
import { format } from "date-fns";
import React from "react";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import UserSearchbar from "./UserSearchbar";
import { Button } from "@/components/ui/button";
import { MdDeleteForever } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

function EventTrackCard({ event, onClick }: { event: any, onClick?: any }) {
    return (
        <Card
            className="hover:cursor-pointer hover:outline hover:outline-1 hover:outline-indigo-400 hover:shadow-lg transition ease-in-out delay-50 duration-200"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="text-center truncate">
                    {event.name}
                </CardTitle>
                <div className="flex flex-col items-center text-sm">
                    <h1 className="text-gray-500">
                        {format(event.startDate, 'PPP')}
                    </h1>
                    <h1 className="text-gray-500">
                        {format(event.startDate, 'p')} - {format(event.endDate, 'p')}
                    </h1>
                </div>
            </CardHeader>
        </Card>
    )
}

function UserTrackCard({ user, trackedUsers, setTrackedUsers }) {

    return (
        <TableRow>
            <TableCell>
                {user.name}
            </TableCell>
            <TableCell className="text-right">
                <Switch defaultChecked={true} onCheckedChange={(value) => {
                    console.log('tracked users: ', trackedUsers);
                    const userIsTracked = trackedUsers.filter((tracked) => tracked.id == user.id).length >= 1;
                    // console.log(trackedUsers.filter((tracked) => tracked.id == user.id).length >= 1)
                    if (value && !userIsTracked) {
                        setTrackedUsers([...trackedUsers, user]);
                    } else if (userIsTracked) {
                        setTrackedUsers(trackedUsers.filter((tracked) => tracked.id != user.id));
                    }
                }} />
            </TableCell>
        </TableRow>
    )
}

function FlakeInCard({ user, flakeIns, setFlakeIns }) {

    return (
        <TableRow className="">
            <TableCell>
                {user.name}
            </TableCell>
            <TableCell className="flex justify-end">
                <MdDeleteForever className="text-3xl text-red-600 hover:text-red-300 hover:cursor-pointer transition ease-in-out delay-50 duration-200" onClick={() => {
                    const userIsTracked = flakeIns.filter((flakeIn) => flakeIn.id == user.id).length >= 1;
                    if (userIsTracked) {
                        setFlakeIns(flakeIns.filter((tracked) => tracked.id != user.id));
                    }
                }} />
            </TableCell>
        </TableRow>
    )
}

export default function TrackingPage() {
    const [events, setEvents] = React.useState<any>([]);
    const [focusEvent, setFocusEvent] = React.useState<any>(null);
    const [dialogEnabled, setDialogEnabled] = React.useState<boolean>(false);
    const [trackedUsers, setTrackedUsers] = React.useState<Array<any>>([]);
    const [flakeIns, setFlakeIns] = React.useState<Array<any>>([]);
    const [driveLink, setDriveLink] = React.useState<any>();
    const [alertEnabled, setAlertEnabled] = React.useState<boolean>(false);
    const [shifts, setShifts] = React.useState<Array<any>>([]);
    const [trackedUserShifts, setTrackedUserShifts] = React.useState<Array<any>>([]);
    const [flakeInShifts, setFlakeInShifts] = React.useState<Array<any>>([]);

    const supabase = createClient();

    function track() {
        const allUsers = trackedUsers.concat(flakeIns);
        trackEvent(focusEvent.id, allUsers)
        .then(() => {
            setEvents(events.filter(event => event.id != focusEvent.id));
            setDialogEnabled(false);
            setFocusEvent(null);
            toast({
                title: "Successfully tracked!",
                description: "Thanks for your leadership! 🥰"
            })
        })
        .catch((error) => {
            toast({
                variant: 'destructive',
                title: "Could not track event!",
                description: error.message
            })
        });
    }

    React.useEffect(() => {
        async function getEvents() {
            const myEvents = await getMyEvents(false, true, true);
            setEvents(myEvents);

            const driveLinkData = await getLatestDrive();
            if (driveLinkData) {
                setDriveLink(driveLinkData.url)
            }
        }
        getEvents();
    }, []);

    React.useEffect(() => {
        async function fetchShifts() {
            const shiftsRes = await supabase.from('shift_user_joins').select('index, users(*)').eq('event_id', focusEvent.id);
            if (shiftsRes.data) {
                const newShifts = Array(focusEvent?.shifts.length).fill([]);
                for (let i = 0; i < shiftsRes.data.length; i++) {
                    const shiftData: any = shiftsRes.data[i];
                    const newShift = [...newShifts[shiftsRes.data[i].index]];
                    newShift.push(shiftData.users)
                    newShifts[shiftsRes.data[i].index] = newShift;
                }
                setShifts(newShifts);
                setTrackedUserShifts(newShifts);
                setFlakeInShifts(Array(focusEvent?.shifts.length).fill([]));
            }
        }
        if (focusEvent)
            fetchShifts();
    }, [focusEvent]);

    return (
        <div className="flex flex-col items-center space-y-4 py-8 px-6 md:p-24">
            <h1 className="text-2xl md:text-4xl text-gray-800">
                Event Tracker
            </h1>
            <div className="inline-flex items-center justify-center w-full">
                <hr className="w-full max-w-lg h-1 my-8 bg-slate-600 border-0 rounded" />
                <div className="absolute px-2 -translate-x-1/2 bg-gray-100 text-slate-700 text-4xl left-1/2">
                    <IoMdCheckmarkCircleOutline />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,_40%)] xl:grid-cols-[repeat(auto-fit,_30%)] w-full justify-center md:gap-4">
                {
                    events.map((event, i) => <EventTrackCard key={i} event={event} onClick={() => { setFocusEvent(event); setDialogEnabled(true); setTrackedUsers(event.users_events); setFlakeIns([]); }}/>)
                }
            </div>
            <Dialog open={dialogEnabled} onOpenChange={setDialogEnabled}>
                <DialogContent>
                <ScrollArea className="max-h-[80vh]">
                    <div className="flex flex-col space-y-8">
                        <DialogHeader className="flex flex-col items-center">
                            <h1 className="text-sm text-indigo-400">
                                {stringToCapital(focusEvent?.event_types.name)}
                            </h1>
                            <DialogTitle className="text-xl">
                                {focusEvent?.name}
                            </DialogTitle>
                            <div className="flex flex-col items-center">
                                <h1 className="text-gray-500">
                                    {focusEvent && format(focusEvent?.startDate, 'PPP')}
                                </h1>
                                <h1>
                                    {focusEvent && format(focusEvent?.startDate, 'p')} - {focusEvent && format(focusEvent?.endDate, 'p')}
                                </h1>
                            </div>
                        </DialogHeader>
                        <div className="flex justify-center">
                            <a className="text-white bg-indigo-500 rounded-full hover:shadow-xl hover:bg-indigo-400 py-2 px-4 transition ease-in-out delay-50 duration-200" href={driveLink} target="_blank">Upload to the Collaborative Drive</a>
                        </div>
                        {
                            shifts && shifts.length > 0 ?
                            shifts.map((shift, i) => {
                                return (
                                    <div key={i} className="flex flex-col items-center">
                                        <h1>{format(focusEvent.shifts[i].startDate, 'p')} - {format(focusEvent.shifts[i].endDate, 'p')}</h1>
                                        <Table>
                                            <TableHeader>
                                                
                                                <TableRow>
                                                    <TableCell className="text-neutral-400">
                                                        Name
                                                    </TableCell>
                                                    <TableCell className="text-right text-neutral-400">
                                                        Attended
                                                    </TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            
                                            <TableBody>
                                                {
                                                    shift.map((user, j) => {
                                                        return (
                                                            <UserTrackCard key={j} user={user} trackedUsers={trackedUserShifts[i]} setTrackedUsers={(newUser) => {
                                                                // const newAllShifts = [...trackedUserShifts];
                                                                // const newShifts = [...newAllShifts[i]];
                                                                // newShifts[j] = newUser;
                                                                // newAllShifts[i] = newShifts;
                                                                console.log(trackedUserShifts);
                                                                console.log(newUser);
                                                                // newShifts[i][j] = newUser;
                                                                // setShifts(newShifts);
                                                            }} />
                                                        )
                                                    })
                                                }
                                            </TableBody>
                                        </Table>
                                    </div>
                                )
                            })
                            :
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell className="text-neutral-400">
                                            Name
                                        </TableCell>
                                        <TableCell className="text-right text-neutral-400">
                                            Attended
                                        </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        focusEvent?.users_events.map((user, i) => {
                                            return (
                                                <UserTrackCard key={i} user={user} trackedUsers={trackedUsers} setTrackedUsers={setTrackedUsers} />
                                            )
                                        })
                                    }
                                </TableBody>
                            </Table>
                        }
                        {
                            (!shifts || shifts.length == 0) && <UserSearchbar attendees={focusEvent?.users_events} flakeIns={flakeIns} setFlakeIns={setFlakeIns} />
                        }
                        {
                            (!shifts || shifts.length == 0) && flakeIns.length > 0 &&
                            <>
                                
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableCell className="text-neutral-400">
                                                Flake-In
                                            </TableCell>
                                            <TableCell className="text-neutral-400 text-right">
                                                Remove
                                            </TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            flakeIns.map((user, i) => {
                                                return (
                                                    <FlakeInCard key={i} user={user} flakeIns={flakeIns} setFlakeIns={setFlakeIns}/>
                                                )
                                            })
                                        }
                                    </TableBody>
                                </Table>
                            </>
                        }

                        <div className="flex justify-center">
                            <Button
                                onClick={() => { setAlertEnabled(true); }}
                            >
                                Track Event
                            </Button>
                        </div>
                    </div>

                    <AlertDialog open={alertEnabled} onOpenChange={setAlertEnabled}>
                        <AlertDialogContent className="flex flex-col space-y-4 items-center">
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Did you upload to our Collaborative Drive? 👀
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Help out our historians by uploading photos and videos!
                                </AlertDialogDescription>
                                <AlertDialogDescription>
                                    (Photos/videos are mandatory for chairing/attendance and credit can be taken away.)
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex justify-center">
                                <a className="text-white bg-indigo-500 rounded-full hover:shadow-xl hover:bg-indigo-400 py-2 px-4 transition ease-in-out delay-50 duration-200" href={driveLink} target="_blank">Access the Collaborative Drive</a>
                            </div>
                            <AlertDialogFooter className="flex flex-col space-y-2 md:space-y-0 items-center">
                                <AlertDialogCancel className="w-full order-last md:order-first">
                                    No... 😢
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={track} className="w-full bg-green-600 hover:bg-green-500">
                                    YES 🥰 Click to track!
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}