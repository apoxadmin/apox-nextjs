import { cn } from "@/lib/utils";
import * as dateFns from 'date-fns';
import EventCard from "./EventCard";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const EVENT_COLORS = {
    'chapter meeting': 'bg-red-100 outline outline-1 outline-red-700',
    'pledge meeting': 'bg-yellow-100 outline outline-1 outline-yellow-700',
    'active credit': 'bg-red-100',
    'pledge credit': 'bg-yellow-100',
    'fellowship': 'bg-cyan-100',
    'service': 'bg-lime-100',
    'family': 'bg-orange-100',
    'fundraising': 'bg-green-100',
    'interchapter': 'bg-fuschia-100'
}

export function EventDayDesktop({ focusDate, day, events, today, userData }) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className={
                    cn(
                        "flex flex-col space-y-[1px] overflow-hidden md:rounded-lg p-[3px] md:p-1 md:hover:z-50 md:hover:shadow-xl md:hover:outline md:outline-1 outline-gray-400 hover:cursor-pointer transition-all ease-in-out delay-50 duration-200",
                        dateFns.isSameMonth(focusDate, day) ? 'bg-white' : 'bg-gray-200 text-gray-400',
                        dateFns.isSameDay(day, today) && 'bg-indigo-200'
                    )
                }>
                    
                    <p className="text-xs md:text-base">{dateFns.getDate(day)}</p>
                    {
                        events.slice(0, 3).map((event, i) => {
                            const names = event.event_types.name.split(' ');
                            for (let i = 0; i < names.length; i++) {
                                names[i] = names[i][0].toUpperCase();
                            }
                            const eventLabel = names.join('');
                            return (
                                <div key={i} className={
                                    cn(
                                        "flex space-x-1 px-1 rounded",
                                        EVENT_COLORS[event.event_types.name]
                                    )
                                }>
                                    <h1 className="text-[0.7rem] font-bold">
                                        {event.event_types.abbreviation.toUpperCase()}
                                    </h1>
                                    <h1 className="text-[0.7rem] truncate">
                                        {event.name}
                                    </h1>
                                </div>
                            )
                        })
                    }
                    <h1 className="font-bold text-xs text-center">
                        { events.length > 3 && '. . .' }
                    </h1>
                </div>
            </SheetTrigger>
            <SheetContent className="h-screen md:w-[60vw] lg:w-[40vw] xl:w-[30vw] bg-gray-100">
                <SheetHeader>
                    <SheetTitle>
                        {dateFns.format(day, 'PPPP')}
                    </SheetTitle>
                    <SheetDescription className="flex flex-col space-y-2">
                        
                    </SheetDescription>
                </SheetHeader>
                <div className="h-full">
                    <ScrollArea className="h-full">
                        <div className="flex flex-col space-y-4 p-1 h-full">
                            {
                                events.map((event, i) => <EventCard key={i} userData={userData} event={event} />)
                            }
                        </div>
                    </ScrollArea>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function EventDayMobile({ focusDate, day, events, today, userData }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className={
                    cn(
                        "flex flex-col space-y-[1px] overflow-hidden md:rounded-lg p-[3px] md:p-1 md:hover:z-50 md:hover:shadow-xl md:hover:outline md:outline-1 outline-gray-400 hover:cursor-pointer transition-all ease-in-out delay-50 duration-200",
                        dateFns.isSameMonth(focusDate, day) ? 'bg-white' : 'bg-gray-200 text-gray-400',
                        dateFns.isSameDay(day, today) && 'bg-indigo-200'
                    )
                }>
                    
                    <p className="text-xs md:text-base">{dateFns.getDate(day)}</p>
                    {
                        events.map((event, i) => {
                            const names = event.event_types.name.split(' ');
                            for (let i = 0; i < names.length; i++) {
                                names[i] = names[i][0].toUpperCase();
                            }
                            const eventLabel = names.join('');
                            return (
                                <div key={i} className={
                                    cn(
                                        "flex space-x-1 px-1 rounded",
                                        EVENT_COLORS[event.event_types.name]
                                    )
                                }>
                                    <h1 className="text-[0.7rem] font-bold">
                                        {eventLabel}
                                    </h1>
                                    <h1 className="text-[0.7rem] text-clip">
                                        {event.name}
                                    </h1>
                                </div>
                            )
                        })
                    }
                    <h1 className="font-bold text-xs text-center">
                        { events.length > 3 && '. . .' }
                    </h1>
                </div>
            </DrawerTrigger>
            <DrawerContent className="h-3/4 bg-gray-100">
                <ScrollArea>
                    <DrawerHeader>
                        <DrawerTitle>
                            {dateFns.format(day, 'PPPP')}
                        </DrawerTitle>
                        <DrawerDescription className="flex flex-col space-y-2">
                            
                        </DrawerDescription>
                        <div className="flex flex-col space-y-4">
                            {
                                events.map((event, i) => <EventCard key={i} userData={userData} event={event} />)
                            }
                        </div>
                    </DrawerHeader>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    )
}