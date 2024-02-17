import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { chairEvent, getAttendees, getChairs, leaveEvent, signUpEvent, unchairEvent } from "@/lib/supabase/client";
import { format } from "date-fns";
import React from "react";


export default function EventDetail({ userData, event }) {
    const [attendees, setAttendees] = React.useState<Array<any>>([]);
    const [chairs, setChairs] = React.useState<Array<any>>([]);
    const [userInAttendees, setUserInAttendees] = React.useState<boolean>(false);

    async function fetchAttendees() {
        let attendees: any = await getAttendees(event.id);
        if (attendees) {
            attendees = attendees.map(a => a.users);
            setAttendees(attendees);
        }
    }

    async function fetchChairs() {
        let chairs: any = await getChairs(event.id);
        if (chairs) {
            chairs = chairs.map(c => c.users);
            setChairs(chairs);
        }
    }

    React.useEffect(() => {
        if (event) {
            fetchAttendees();
            fetchChairs();
        }
    }, [event]);

    return <DialogContent className="overflow-y-scroll max-h-screen">
    <DialogHeader>
        <div className="text-center space-y-1">
            <DialogTitle className="text-base md:text-2xl">
                {event.name}
            </DialogTitle>
            <DialogTitle className="text-base md:text-lg text-gray-400 font-normal">
                {format(event.startDate, 'p')} - {format(event.endDate, 'p')}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
                {event.label}
            </DialogDescription>
            <DialogDescription>
                {event.description}
            </DialogDescription>
        </div>
    </DialogHeader>
    <div className="flex flex-col items-center space-y-4">
        <div>
            <h1>Contact: {event.users.name}</h1>
        </div>
        <div className="flex flex-col items-center">
            <h1 className="font-bold">Chairs:</h1>
            {
                chairs.map((chair, i) => <h1 key={i}>{chair.name}</h1>)
            }
        </div>
        <div className="flex flex-col items-center">
            <h1 className="font-bold">Attendees:</h1>
            {
                attendees.map((attendee, i) => <h1 key={i}>{attendee.name}</h1>)
            }
        </div>
        <div className="space-x-2">
            {
                userData && attendees.map(a => a.id).includes(userData.id) ? 
                <Button onClick={() => { 
                    leaveEvent(event.id);
                    setAttendees(attendees.filter(a => a.id != userData.id));
                    unchairEvent(event.id);
                    setChairs(chairs.filter(a => a.id != userData.id));
                }}>
                    Leave
                </Button>
                :
                userData && <Button onClick={() => { 
                    signUpEvent(event.id)
                    .then(() => {
                        setAttendees([...attendees, { name: userData.name, id: userData.id }]);
                    })
                }}>
                    Sign up
                </Button>
            }
            
            {
                userData && attendees.map(a => a.id).includes(userData.id) && chairs.map(a => a.id).includes(userData.id) ? 
                <Button onClick={() => { 
                    unchairEvent(event.id);
                    setChairs(chairs.filter(a => a.id != userData.id));
                }}>
                    Unchair
                </Button>
                :
                userData && attendees.map(a => a.id).includes(userData.id) && <Button onClick={() => { 
                    chairEvent(event.id)
                    .then(() => {
                        setChairs([...chairs, { name: userData.name, id: userData.id }]);
                    })
                }}>Chair</Button>
            }
        </div>
    </div>
</DialogContent>
}