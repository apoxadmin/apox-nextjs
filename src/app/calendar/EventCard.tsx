import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import EventDetail from "./EventDetail";

export default function EventCard({ userData, event }) {
    let eventLabel = event.event_types.name.split(" ");
    for (let i = 0; i < eventLabel.length; i++) {
        eventLabel[i] = eventLabel[i][0].toUpperCase() + eventLabel[i].substr(1);

    }
    eventLabel.join(" ");

    if (!event.event_types.name.endsWith('meeting')) {
        eventLabel += " Event";
    }

    event.label = eventLabel;

    return (
    <Dialog>
        <DialogTrigger asChild>
            <Card className="hover:shadow-lg hover:scale-105 transition delay-50 duration-200 ease-in-out">
                <CardHeader>
                    <div className="flex flex-col md:flex-row w-full justify-between items-center">
                        <CardTitle className="text-lg md:text-2xl">{event.name}</CardTitle>
                        <CardTitle className="text-base md:text-xl">{format(event.startDate, 'p')} - {format(event.endDate, 'p')}</CardTitle>
                    </div>
                    
                    <CardDescription>{event.label}</CardDescription>
                </CardHeader>
                <CardContent>
                    {event.description}
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p>Contact: {event.users.name}</p>
                </CardFooter>
            </Card>
        </DialogTrigger>
        <EventDetail userData={userData} 
        event={event} />
    </Dialog>
    );
}