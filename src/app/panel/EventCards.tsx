import TimeRangePicker from "@/components/ui/TimeRangePicker";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import DatePickerForm from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useMediaQuery } from "@/hooks/use-media-query";
import { deleteEvent, updateEvent } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import { format, getDayOfYear, getHours, setDayOfYear } from "date-fns";
import React from "react";

export function EventReviewForm({ closeDialog, focusEvent, setEvent, cachedEvent, setCachedEvent, setEvents, events }) {
    return (
        <ScrollArea>
            <div className="flex flex-col space-y-4 p-4 h-full">
                <div className="flex flex-col space-y-2 items-center space-y-2 pt-6">
                    <Label className="text-base">
                        {cachedEvent?.reviewed ? 'Approved' : 'Unapproved'}
                    </Label>
                    <div className="flex space-x-2">
                        <Switch
                            className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-700"
                            checked={cachedEvent?.reviewed}
                            onCheckedChange={(value) => {
                                const newCachedEvent = { ...cachedEvent, reviewed: value }
                                updateEvent({ id: newCachedEvent.id, eventType: newCachedEvent.event_types.name, reviewed: value })
                                .then(() => {
                                    setCachedEvent(newCachedEvent);
                                    setEvent({ ...focusEvent, event: newCachedEvent });
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>
                        Event Name
                    </Label>
                    <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row items-center space-x-2 md:space-x-8">
                        <Input className="text-base" value={cachedEvent?.name} onChange={(e) => setCachedEvent({ ...cachedEvent, name: e.target.value })} />
                        <Button className="w-min" onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, name: cachedEvent.name })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>
                        Description
                    </Label>
                    <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row items-center space-x-2 md:space-x-8">
                        <Textarea className="text-base" value={cachedEvent?.description} onChange={(e) => setCachedEvent({ ...cachedEvent, description: e.target.value })} />
                        <Button onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, description: cachedEvent.description })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>
                        Location
                    </Label>
                    <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row items-center space-x-2 md:space-x-8">
                        <Textarea className="text-base" value={cachedEvent?.location} onChange={(e) => setCachedEvent({ ...cachedEvent, location: e.target.value })} />
                        <Button onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, location: cachedEvent.location })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>
                        Date
                    </Label>
                    <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row items-center space-x-2 md:space-x-8 justify-between">
                        <DatePickerForm className="text-base"
                            value={new Date(Date.parse(cachedEvent?.startDate))}
                            onChange={(newDate: Date) => {
                                setCachedEvent({ ...cachedEvent, startDate: setDayOfYear(cachedEvent?.startDate, getDayOfYear(newDate)), endDate: setDayOfYear(cachedEvent?.endDate, getDayOfYear(newDate)) });
                            }}
                        />
                        <Button onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, startDate: cachedEvent.startDate.toISOString(), endDate: cachedEvent.endDate.toISOString() })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col justify-between space-y-2 md:space-y-0">
                    <Label>
                        Time
                    </Label>
                    <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8 justify-between">
                        <TimeRangePicker
                            value={{ startDate: new Date(Date.parse(cachedEvent?.startDate)), endDate: new Date(Date.parse(cachedEvent?.endDate)) }}
                            onChange={({ startDate, endDate }: { startDate: Date, endDate: Date }) => {
                                setCachedEvent({ ...cachedEvent, startDate: new Date(startDate), endDate: new Date(endDate) });
                            }}
                        />
                        <Button onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, startDate: cachedEvent.startDate.toISOString(), endDate: cachedEvent.endDate.toISOString() })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <Label>
                        Limit
                    </Label>
                    <div className="flex flex-col justify-between space-y-2 md:space-y-0 md:flex-row items-center space-x-2 md:space-x-8">
                        <Input className="text-base" type="number" value={cachedEvent?.limit} onChange={(e) => setCachedEvent({ ...cachedEvent, limit: e.target.value })} />
                        <Button onClick={() => {
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, limit: cachedEvent.limit })
                            .then(() => {
                                toast({
                                    title: 'Updated!',
                                    description: 'Successfully updated field.'
                                });
                                setEvent({ ...focusEvent, event: cachedEvent });
                            });
                            }}>
                            Update
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center space-y-2">
                    {
                        cachedEvent?.shifts &&
                        <Label>
                            Shifts
                        </Label>
                    }
                    {
                        cachedEvent?.shifts?.map((shift, i) => {
                            return (
                                <div key={i} className="flex flex-col space-y-2 w-full outline outline-1 rounded-lg outline-neutral-200 p-2">
                                    <div className="flex items-center w-full space-x-2 justify-between">
                                        <TimeRangePicker
                                            value={{ startDate: shift.startDate, endDate: shift.endDate }}
                                            onChange={(dateRange) => {
                                                const shifts = cachedEvent?.shifts;
                                                shifts[i] = { ...shift, ...dateRange };
                                                setCachedEvent({ ...cachedEvent, shifts: shifts });
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        <Label>Shift Limit</Label>
                                        <Input
                                            className="text-base"
                                            placeholder="Ex: 4"
                                            value={shift.limit ?? ''}
                                            type="number"
                                            onChange={(e) => {
                                                const shifts = cachedEvent?.shifts;
                                                shifts[i] = { ...shift, limit: e.target.value ? parseInt(e.target.value) : undefined };
                                                setCachedEvent({ ...cachedEvent, shift: shifts });
                                            }}
                                        />
                                        <h1 className="text-sm">Set to 0 for unlimited.</h1>
                                    </div>
                                    <div className="flex w-full justify-evenly">
                                        <Button type="button" onClick={_ => {
                                                updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, shifts: cachedEvent.shifts })
                                                .then(() => {
                                                    toast({
                                                        title: 'Updated!',
                                                        description: 'Successfully updated shift.'
                                                    });
                                                    setEvent({ ...focusEvent, event: cachedEvent });
                                                });
                                            }}
                                        >
                                            Update
                                        </Button>
                                        <Button type="button" onClick={_ => {
                                                let shifts = [...cachedEvent?.shifts];
                                                shifts = shifts.toSpliced(i, 1);
                                                updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, shifts: shifts })
                                                .then(() => {
                                                    toast({
                                                        variant: 'destructive',
                                                        title: 'Deleted shift.'
                                                    });
                                                    setCachedEvent({ ...cachedEvent, shift: shifts });
                                                    setEvent({ ...focusEvent, event: { ...cachedEvent, shifts: shifts } });
                                                })
                                            }}
                                            className="bg-red-700 hover:bg-red-600"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    }
                    <Button
                        className="bg-green-600"
                        onClick={() => {
                            let shifts = cachedEvent?.shifts;
                            shifts.push([...shifts,  { startDate: cachedEvent?.startDate, endDate: cachedEvent?.endDate, limit: 0 } ]);
                            updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, shifts: shifts })
                            .then(() => {
                                setCachedEvent({ ...cachedEvent, shifts: shifts });
                            })
                        }}
                    >
                        Add Shift
                    </Button>
                </div>
                <div className="flex w-full justify-center py-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-700 hover:bg-red-600">
                                Delete Event
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    Deleting an event cannot be reversed.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button
                                        onClick={() => {
                                            deleteEvent(cachedEvent);
                                            setEvents(events.filter(event => event.id != cachedEvent.id));
                                            closeDialog();
                                        }}
                                        className="bg-red-600 hover:bg-red-400"
                                    >
                                        Delete
                                    </Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </ScrollArea>
    )
}

export function EventReviewDialog({ closeDialog, focusEvent, setEvent, setEvents, events, ...props }) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [cachedEvent, setCachedEvent] = React.useState<any>(null);

    React.useEffect(() => {
        if (focusEvent) {
            setCachedEvent(focusEvent?.event);
        }
    }, [focusEvent]);

    if (isDesktop) {
        return (
            <Dialog {...props}>
                <DialogContent className="h-[80vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Event Editor
                        </DialogTitle>
                        <DialogDescription>
                            Modify the field and update.
                        </DialogDescription>
                    </DialogHeader>
                    <EventReviewForm focusEvent={focusEvent} setEvent={setEvent} cachedEvent={cachedEvent} setCachedEvent={setCachedEvent} setEvents={setEvents} events={events} closeDialog={closeDialog}/>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer {...props}>
            <DrawerContent className="h-3/4 px-2 sm:px-12">
                <DrawerHeader>
                    <DrawerTitle>
                        Event Editor
                    </DrawerTitle>
                    <DrawerDescription>
                        Modify the field and update.
                    </DrawerDescription>
                </DrawerHeader>
                <EventReviewForm focusEvent={focusEvent} setEvent={setEvent} cachedEvent={cachedEvent} setCachedEvent={setCachedEvent} setEvents={setEvents} events={events} closeDialog={closeDialog}/>
            </DrawerContent>
        </Drawer>
    )
}

export function EventReviewCard(props) {
    return (
        <div className={
            cn("hover:shadow-xl hover:cursor-pointer p-4 rounded-lg outline outline-1 transition ease-in-out delay-50 duration-200",
            props.event.reviewed ? 'bg-emerald-50 outline-emerald-400 hover:bg-emerald-100' : 'bg-red-50 outline-red-400 hover:outline-bg-100')
        } {...props}>
            <h1 className="text-center font-bold">{props.event.name}</h1>
            <h1 className="text-center text-gray-500">{format(props.event.startDate, 'PPPP')}</h1>
            <h1 className="text-center underline">{format(props.event.startDate, 'p')} - {format(props.event.endDate, 'p')}</h1>
        </div>
    )
}