import TimeRangePicker from "@/components/ui/TimeRangePicker";
import { Button } from "@/components/ui/button";
import DatePickerForm from "@/components/ui/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { updateEvent } from "@/lib/supabase/actions";
import { cn } from "@/lib/utils";
import { format, getDayOfYear, getHours, setDayOfYear } from "date-fns";
import React from "react";

export function EventReviewForm({ focusEvent, setEvent, cachedEvent, setCachedEvent }) {
    return (
        <div className="flex flex-col space-y-4 p-4">
            <div className="flex flex-col space-y-2">
                <Label>
                    Event Name
                </Label>
                <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8">
                    <Input className="text-base" value={cachedEvent?.name} onChange={(e) => setCachedEvent({ ...cachedEvent, name: e.target.value })} />
                    <Button className="w-min" onClick={() => {
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, name: cachedEvent.name });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <Label>
                    Description
                </Label>
                <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8">
                    <Input className="text-base" value={cachedEvent?.description} onChange={(e) => setCachedEvent({ ...cachedEvent, description: e.target.value })} />
                    <Button onClick={() => {
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, description: cachedEvent.description });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <Label>
                    Location
                </Label>
                <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8">
                    <Input className="text-base" value={cachedEvent?.location} onChange={(e) => setCachedEvent({ ...cachedEvent, location: e.target.value })} />
                    <Button onClick={() => {
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, location: cachedEvent.location });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
                <Label>
                    Date
                </Label>
                <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8 justify-between">
                    <DatePickerForm className="text-base"
                        value={new Date(Date.parse(cachedEvent?.startDate))}
                        onChange={(newDate: Date) => {
                            setCachedEvent({ ...cachedEvent, startDate: setDayOfYear(cachedEvent?.startDate, getDayOfYear(newDate)), endDate: setDayOfYear(cachedEvent?.endDate, getDayOfYear(newDate)) });
                        }}
                    />
                    <Button onClick={() => {
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, startDate: cachedEvent.startDate.toISOString(), endDate: cachedEvent.endDate.toISOString() });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2">
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
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, startDate: cachedEvent.startDate.toISOString(), endDate: cachedEvent.endDate.toISOString() });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2 md:space-y-0 space-y-2">
                <Label>
                    Limit
                </Label>
                <div className="flex flex-col space-y-2 md:flex-row items-center space-x-2 md:space-x-8">
                    <Input className="text-base" type="number" value={cachedEvent?.limit} onChange={(e) => setCachedEvent({ ...cachedEvent, limit: e.target.value })} />
                    <Button onClick={() => {
                        updateEvent({ id: cachedEvent.id, eventType: cachedEvent.event_types.name, limit: cachedEvent.limit });
                        setEvent({ ...focusEvent, event: cachedEvent });
                        }}>
                        Update
                    </Button>
                </div>
            </div>
            <div className="flex flex-col space-y-2 items-center space-y-2 pt-6">
                <Label>
                    Approved
                </Label>
                <div className="flex space-x-2">
                    <Switch
                        checked={cachedEvent?.reviewed}
                        onCheckedChange={(value) => {
                            const newCachedEvent = { ...cachedEvent, reviewed: value }
                            updateEvent({ id: newCachedEvent.id, eventType: newCachedEvent.event_types.name, reviewed: value });
                            setCachedEvent(newCachedEvent);
                            setEvent({ ...focusEvent, event: newCachedEvent });
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export function EventReviewDialog({ focusEvent, setEvent, ...props }) {
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
                <DialogContent className="overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>
                            Event Editor
                        </DialogTitle>
                        <DialogDescription>
                            Modify the field and update.
                        </DialogDescription>
                    </DialogHeader>
                    <EventReviewForm focusEvent={focusEvent} setEvent={setEvent} cachedEvent={cachedEvent} setCachedEvent={setCachedEvent} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer {...props}>
            <DrawerContent className="h-3/4">
                <ScrollArea className="border-none">
                    <DrawerHeader>
                        <DrawerTitle>
                            Event Editor
                        </DrawerTitle>
                        <DrawerDescription>
                            Modify the field and update.
                        </DrawerDescription>
                    </DrawerHeader>
                    <EventReviewForm focusEvent={focusEvent} setEvent={setEvent} cachedEvent={cachedEvent} setCachedEvent={setCachedEvent} />
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}

export function EventReviewCard(props) {
    return (
        <div className={
            cn("hover:shadow-xl hover:cursor-pointer p-4 rounded-lg outline outline-1 transition ease-in-out delay-50 duration-200",
            props.event.reviewed ? 'bg-lime-50 outline-lime-200 hover:outline-lime-500' : 'bg-red-100 outline-red-200 hover:outline-red-500')
        } {...props}>
            <h1 className="text-center font-bold">{props.event.name}</h1>
            <h1 className="text-center text-gray-500">{format(props.event.startDate, 'PPPP')}</h1>
            <h1 className="text-center underline">{format(props.event.startDate, 'p')} - {format(props.event.endDate, 'p')}</h1>
        </div>
    )
}