import { AuthContext } from "@/supabase/client";
import { chairEvent, joinEvent, leaveEvent, unchairEvent, setDriver, removeDriver, unapproveEvent } from "@/supabase/event";
import { eachDayOfInterval, endOfDay, endOfMonth, endOfToday, endOfWeek, format, getDate, interval, isAfter, isSameDay, isSameMonth, isThisMonth, isToday, startOfMonth, startOfToday, startOfWeek } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react"
import { atcb_action } from "add-to-calendar-button";
import { convertToPST } from "@/utils/utils";
import { resetPassword } from "@/supabase/user";

function AddUserModal({ supabase, event, userData }) {
    const ref = useRef(null);
    const [dateString, setDateString] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [isCreator, setCreator] = useState(false);

    async function getAttendees() {
        const attendeesResponse = await supabase?.from('event_signups').select('users (*) ').eq('event_id', event?.id);
        if (attendeesResponse?.data) {
            setAttendees(attendeesResponse.data.map((user) => user.users));
        }
    }

    async function getChairs() {
        const chairsResponse = await supabase?.from('event_chairs').select('users (*) ').eq('event_id', event?.id);
        if (chairsResponse?.data) {
            setChairs(chairsResponse.data.map((user) => user.users));
        }
    }

    async function getDrivers() {
        const driversResponse = await supabase?.from('event_signups').select('users (*)').eq('driving', true).eq('event_id', event?.id);
        if (driversResponse?.data) {
            setDrivers(driversResponse.data.map((user) => user.users));
        }
    }

    async function getCreator() {
        const creatorResponse = await supabase?.from('events').select('*').eq('id', event?.id).maybeSingle();
        if (creatorResponse?.data) {
            setCreator(creatorResponse.data.creator == userData?.id);
        }
    }

    useEffect(() => {
        if (event) {
            ref.current.showModal();
            setDateString(`${format(event.start_time, 'p')} - ${format(event.end_time, 'p')}`);
            getAttendees();
            getChairs();
            getDrivers();
            getCreator();
        } else {
            setAttendees([]);
            setChairs([]);
            setDrivers([])
            setDateString('');
            setCreator(false);
        }
    }, [event, ref]);

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                setEvent(null);
                ref.current.close();
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }

    });

    useEffect(() => {
        if (event) {
            const config = {
                name: event.name,
                startDate: event.date,
                startTime: event ? convertToPST(event?.start_time) : undefined,
                endTime: event ? convertToPST(event?.end_time) : undefined,
                endDate: endDate,
                location: event.location,
                options: ['Google'],
                timeZone: "America/Los_Angeles"
            };
    
            const button = document.getElementById('add-to-cal-btn');
            if (button) {
                button.addEventListener('click', () => atcb_action(config, button));
            }
        }
    }, [event]);

    function convertToLink(inputString) {
        // Regular expression to match text wrapped in < and >
        const regex = /(https?:\/\/[^\s]+)/g;
    
        // Split the string by the regex and create an array
        const parts = inputString?.split(regex);
    
        // Map the parts to JSX elements
        return parts?.map((part, index) => {
            // If the part is a URL, return an anchor element
            if (index % 2 === 1) { // URL parts are in odd indices
                return (
                    <a key={index} href={part} className="text-emerald-500" target="_blank" rel="noopener noreferrer">
                        link
                    </a>
                );
            }
            // Otherwise, return the plain text part
            return part;
        });
    }
    function isDayAfter(date1, date2) {    
        // Ensure valid dates
        if (isNaN(date1) || isNaN(date2)) {
            throw new Error("Invalid date format");
        }
    
        // Extract only the date parts by zeroing out the time
        const date1UTC = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()));
        const date2UTC = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()));
    
        // Calculate the difference in days
        const differenceInDays = (date2UTC - date1UTC) / (1000 * 60 * 60 * 24);
    
        // Return true if time2 is exactly one calendar day after time1
        return differenceInDays === 1;
    }
    
    let endDate = event?.date;
    if (event)
    {
        const date1 = new Date(`1970-01-01T${event.start_time.split("T")[1].split("+")[0]}Z`)
        const date2 = new Date(`1970-01-01T${event.end_time.split("T")[1].split("+")[0]}Z`)
        if(isDayAfter(date1, date2)) endDate = new Date(new Date(event?.date).setDate(new Date(event?.date).getDate() + 1))
            .toISOString()
            .split("T")[0]
    }

    function isTodayOrLater(dateString) {
        const today = new Date().toISOString().split('T')[ 0 ];
        return dateString >= today; // Check if the input date is today or later
    }

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-y-hidden">
                {
                    isCreator && 
                    <div className="flex justify-end">
                        <button onClick={() => 
                            {
                                unapproveEvent(event?.id);
                                window.location.reload();
                            }
                        } className="text-red-500">Delete event</button>
                    </div>
                }
                <div className="flex justify-between">
                    <h1 className="text-neutral-600">
                        {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                    </h1>
                    <h1 className="text-neutral-600">
                        {dateString}
                    </h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col text-center">
                        <h1 className="font-bold text-lg">
                            <span className="swiper-no-swiping">
                                {event?.name}
                            </span>
                        </h1>
                        <h1 className="font-bold">
                            <span className="swiper-no-swiping">
                                @ {event?.location}
                            </span>
                        </h1>
                    </div>
                    <h1 className="text-center">
                        <span className="swiper-no-swiping">
                        {
                            (() => {
                                const formatted = convertToLink(event?.description);
                                return (
                                    <span className="swiper-no-swiping">
                                        {formatted}
                                    </span>
                                );
                            })()
                        }
                        </span>
                    </h1>                    
                    {
                        event &&
                        <div className="flex justify-center">
                            <button
                                className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-xl select-none"
                                id='add-to-cal-btn'                                    
                            >
                                add to gcal
                            </button>
                        </div>
                    }
                </div>
                <div className="flex flex-col space-y-2 overflow-auto">
                    <h1 className="text-center text-lg">Attendees ({attendees?.length} / {event?.capacity})</h1>
                    {
                        attendees?.length == 0 && <h1 className="text-center text-neutral-500">None yet!</h1>
                    }
                    <div className="flex flex-col overflow-auto">
                        <div className="grid grid-cols-2">
                            {
                                attendees?.map((user, i) => {
                                    const isDriver = drivers?.some(driver => driver.id == user.id);
                                    let bg = isDriver ? 'bg-purple-600 text-white' : '';
                                    bg = chairs?.some(chair => chair.id == user.id) ? 'bg-green-600 text-white' : bg;
                                    return <div key={i} className={`${bg} flex flex-col border border-black p-2 overflow-x-hidden`}>
                                        <h1 className="swiper-no-swiping">
                                            {user.name + (isDriver ? ' (driver)' : '')}
                                        </h1>
                                        <h1 className="text-xs">
                                            <span className="swiper-no-swiping">
                                                {user.email}
                                            </span>
                                        </h1>
                                        {
                                            user.phone_number != null &&
                                            <h1 className="text-xs">
                                                <span className="swiper-no-swiping">
                                                    {user.phone_number}
                                                </span>
                                            </h1>
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                {
                    (isTodayOrLater(event?.date)) &&
                    <div className="flex justify-center space-x-4">
                        {
                            (isAfter(event?.date, startOfToday()) || userData?.privileged.length > 0) &&
                            (
                                attendees?.some(user => user.id === userData?.id) ?
                                    (isAfter(event?.date, endOfToday()) || userData?.privileged.length > 0) &&
                                    <button
                                        className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full min-w-[100px]"
                                        onClick={() => { if (leaveEvent(userData?.id, event)) { unchairEvent(userData?.id, event); setTimeout(getAttendees, 500); setTimeout(getChairs, 500) } }}
                                    >
                                        leave
                                    </button>
                                    :
                                    <button
                                        className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full min-w-[100px]"
                                        onClick={() => { if (joinEvent(userData?.id, event)) setTimeout(getAttendees, 500); }}
                                    >
                                        sign up
                                    </button>
                            )
                        }
                        {
                            attendees?.some(user => user.id === userData?.id) && (chairs?.some(user => user.id == userData?.id) ?
                                <button
                                    className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (unchairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                                >
                                    unchair
                                </button>
                                :
                                chairs?.length < 2 &&
                                <button
                                    className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (chairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                                >
                                    chair
                                </button>
                            )
                        }
                        {
                            attendees?.some(user => user.id === userData?.id) && (drivers?.some(user => user.id == userData?.id) ?
                                <button
                                    className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (removeDriver(userData?.id, event?.id)) setTimeout(getDrivers, 500); }}
                                >
                                    remove driver
                                </button>
                                :
                                <button
                                    className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (setDriver(userData?.id, event?.id)) setTimeout(getDrivers, 500); }}
                                >
                                    set driver
                                </button>
                            )
                        }
                    </div>
                }
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => { setEvent(null); ref.current.close(); }}>close</button>
            </form>
        </dialog >
    )
}

function EventModal({ supabase, event, setEvent, userData }) {
    const ref = useRef(null);
    const [dateString, setDateString] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [chairs, setChairs] = useState([]);
    const [isCreator, setCreator] = useState(false);

    async function getAttendees() {
        const attendeesResponse = await supabase?.from('event_signups').select('users (*) ').eq('event_id', event?.id);
        if (attendeesResponse?.data) {
            setAttendees(attendeesResponse.data.map((user) => user.users));
        }
    }

    async function getChairs() {
        const chairsResponse = await supabase?.from('event_chairs').select('users (*) ').eq('event_id', event?.id);
        if (chairsResponse?.data) {
            setChairs(chairsResponse.data.map((user) => user.users));
        }
    }

    async function getDrivers() {
        const driversResponse = await supabase?.from('event_signups').select('users (*)').eq('driving', true).eq('event_id', event?.id);
        if (driversResponse?.data) {
            setDrivers(driversResponse.data.map((user) => user.users));
        }
    }

    async function getCreator() {
        const creatorResponse = await supabase?.from('events').select('*').eq('id', event?.id).maybeSingle();
        if (creatorResponse?.data) {
            setCreator(creatorResponse.data.creator == userData?.id);
        }
    }

    useEffect(() => {
        if (event) {
            ref.current.showModal();
            setDateString(`${format(event.start_time, 'p')} - ${format(event.end_time, 'p')}`);
            getAttendees();
            getChairs();
            getDrivers();
            getCreator();
        } else {
            setAttendees([]);
            setChairs([]);
            setDrivers([])
            setDateString('');
            setCreator(false);
        }
    }, [event, ref]);

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                setEvent(null);
                ref.current.close();
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }
    });

    useEffect(() => {
        if (event) {
            const config = {
                name: event.name,
                startDate: event.date,
                startTime: event ? convertToPST(event?.start_time) : undefined,
                endTime: event ? convertToPST(event?.end_time) : undefined,
                endDate: endDate,
                location: event.location,
                options: ['Google'],
                timeZone: "America/Los_Angeles"
            };
    
            const button = document.getElementById('add-to-cal-btn');
            if (button) {
                button.addEventListener('click', () => atcb_action(config, button));
            }
        }
    }, [event]);

    function convertToLink(inputString) {
        // Regular expression to match text wrapped in < and >
        const regex = /(https?:\/\/[^\s]+)/g;
    
        // Split the string by the regex and create an array
        const parts = inputString?.split(regex);
    
        // Map the parts to JSX elements
        return parts?.map((part, index) => {
            // If the part is a URL, return an anchor element
            if (index % 2 === 1) { // URL parts are in odd indices
                return (
                    <a key={index} href={part} className="text-emerald-500" target="_blank" rel="noopener noreferrer">
                        link
                    </a>
                );
            }
            // Otherwise, return the plain text part
            return part;
        });
    }
    function isDayAfter(date1, date2) {    
        // Ensure valid dates
        if (isNaN(date1) || isNaN(date2)) {
            throw new Error("Invalid date format");
        }
    
        // Extract only the date parts by zeroing out the time
        const date1UTC = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()));
        const date2UTC = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()));
    
        // Calculate the difference in days
        const differenceInDays = (date2UTC - date1UTC) / (1000 * 60 * 60 * 24);
    
        // Return true if time2 is exactly one calendar day after time1
        return differenceInDays === 1;
    }
    
    let endDate = event?.date;
    if (event)
    {
        const date1 = new Date(`1970-01-01T${event.start_time.split("T")[1].split("+")[0]}Z`)
        const date2 = new Date(`1970-01-01T${event.end_time.split("T")[1].split("+")[0]}Z`)
        if(isDayAfter(date1, date2)) endDate = new Date(new Date(event?.date).setDate(new Date(event?.date).getDate() + 1))
            .toISOString()
            .split("T")[0]
    }

    function isTodayOrLater(dateString) {
        const today = new Date().toISOString().split('T')[ 0 ];
        return dateString >= today; // Check if the input date is today or later
    }

    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-y-hidden">
                <div className="flex justify-end gap-2">
                    <button onClick={() => 
                        {
                            unapproveEvent(event?.id);
                            window.location.reload();
                        }
                    } className="text-green-500">tracking info</button>
                    {
                        isCreator &&
                        <button onClick={() => 
                            {
                                unapproveEvent(event?.id);
                                window.location.reload();
                            }
                        } className="text-red-500">delete event</button>
                    }
                </div>
                <div className="flex justify-between">
                    <h1 className="text-neutral-600">
                        {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                    </h1>
                    <h1 className="text-neutral-600">
                        {dateString}
                    </h1>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col text-center">
                        <h1 className="font-bold text-lg">
                            <span className="swiper-no-swiping">
                                {event?.name}
                            </span>
                        </h1>
                        <h1 className="font-bold">
                            <span className="swiper-no-swiping">
                                @ {event?.location}
                            </span>
                        </h1>
                    </div>
                    <h1 className="text-center">
                        <span className="swiper-no-swiping">
                        {
                            (() => {
                                const formatted = convertToLink(event?.description);
                                return (
                                    <span className="swiper-no-swiping">
                                        {formatted}
                                    </span>
                                );
                            })()
                        }
                        </span>
                    </h1>                    
                    {
                        event &&
                        <div className="flex justify-center">
                            <button
                                className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-xl select-none"
                                id='add-to-cal-btn'                                    
                            >
                                add to gcal
                            </button>
                        </div>
                    }
                </div>
                <div className="flex flex-col space-y-2 overflow-auto">
                    <h1 className="text-center text-lg">Attendees ({attendees?.length} / {event?.capacity})</h1>
                    {
                        attendees?.length == 0 && <h1 className="text-center text-neutral-500">None yet!</h1>
                    }
                    <div className="flex flex-col overflow-auto">
                        <div className="grid grid-cols-2">
                            {
                                attendees?.map((user, i) => {
                                    const isDriver = drivers?.some(driver => driver.id == user.id);
                                    let bg = isDriver ? 'bg-purple-600 text-white' : '';
                                    bg = chairs?.some(chair => chair.id == user.id) ? 'bg-green-600 text-white' : bg;
                                    return <div key={i} className={`${bg} flex flex-col border border-black p-2 overflow-x-hidden`}>
                                        <h1 className="swiper-no-swiping">
                                            {user.name + (isDriver ? ' (driver)' : '')}
                                        </h1>
                                        <h1 className="text-xs">
                                            <span className="swiper-no-swiping">
                                                {user.email}
                                            </span>
                                        </h1>
                                        {
                                            user.phone_number != null &&
                                            <h1 className="text-xs">
                                                <span className="swiper-no-swiping">
                                                    {user.phone_number}
                                                </span>
                                            </h1>
                                        }
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
                {
                    (isTodayOrLater(event?.date)) &&
                    <div className="flex justify-center space-x-4">
                        {
                            (isAfter(event?.date, startOfToday()) || userData?.privileged.length > 0) &&
                            (
                                attendees?.some(user => user.id === userData?.id) ?
                                    (isAfter(event?.date, endOfToday()) || userData?.privileged.length > 0) &&
                                    <button
                                        className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full min-w-[100px]"
                                        onClick={() => { if (leaveEvent(userData?.id, event)) { unchairEvent(userData?.id, event); setTimeout(getAttendees, 500); setTimeout(getChairs, 500) } }}
                                    >
                                        leave
                                    </button>
                                    :
                                    <button
                                        className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full min-w-[100px]"
                                        onClick={() => { if (joinEvent(userData?.id, event)) setTimeout(getAttendees, 500); }}
                                    >
                                        sign up
                                    </button>
                            )
                        }
                        {
                            attendees?.some(user => user.id === userData?.id) && (chairs?.some(user => user.id == userData?.id) ?
                                <button
                                    className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (unchairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                                >
                                    unchair
                                </button>
                                :
                                chairs?.length < 2 &&
                                <button
                                    className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (chairEvent(userData?.id, event)) setTimeout(getChairs, 500); }}
                                >
                                    chair
                                </button>
                            )
                        }
                        {
                            attendees?.some(user => user.id === userData?.id) && (drivers?.some(user => user.id == userData?.id) ?
                                <button
                                    className="text-white bg-purple-500 hover:bg-purple-700 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (removeDriver(userData?.id, event?.id)) setTimeout(getDrivers, 500); }}
                                >
                                    remove driver
                                </button>
                                :
                                <button
                                    className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-full min-w-[100px]"
                                    onClick={() => { if (setDriver(userData?.id, event?.id)) setTimeout(getDrivers, 500); }}
                                >
                                    set driver
                                </button>
                            )
                        }
                    </div>
                }
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => { setEvent(null); ref.current.close(); }}>close</button>
            </form>
        </dialog >
    )
}

function EventDay({ day, event, userData, setEvent }) {
    const includesUser = event?.event_signups?.some((signup) => signup.user_id === userData?.id);
    const isChairing = event?.event_chairs?.some((chair) => chair.user_id === userData?.id);
    const eventTypeId = event?.event_types.id;
    let style = '';
    if (includesUser) {
        style = 'hover:bg-blue-500 hover:text-white bg-blue-300';
        if (isChairing) {
            style += ' border border-purple-200 border-2'
        }
        else style += ' border border-slate-700 border-2'
    } else {
        if (eventTypeId == 1)
            style = `hover:bg-lime-300 hover:text-white bg-lime-200`;
        if (eventTypeId == 2)
            style = `hover:bg-teal-200 hover:text-white bg-teal-100`;
        if (eventTypeId == 3)
            style = `hover:bg-fuchsia-500 hover:text-white bg-fuchsia-300`;
        if (eventTypeId == 4)
            style = `hover:bg-indigo-300 hover:text-white bg-indigo-200`;
        if (eventTypeId == 5)
            style = `hover:bg-orange-400 hover:text-white bg-orange-200`;
        if (eventTypeId == 6)
            style = `hover:bg-purple-500 hover:text-white bg-purple-300`;
        if (eventTypeId == 7)
            style = `hover:bg-yellow-600 hover:text-white bg-yellow-300`;
        if (eventTypeId == 8)
            style = `hover:bg-pink-600 hover:text-white bg-pink-300`;
        if (eventTypeId == 9)
            style = `hover:bg-lime-500 hover:text-white bg-lime-200`;
        if (eventTypeId == 10)
            style = `hover:bg-red-500 hover:text-white bg-red-300`;
        if (eventTypeId == 11)
            style = `hover:bg-stone-600 hover:text-white bg-stone-300`;
        if (eventTypeId == 12)
            style = `hover:bg-indigo-800 hover:text-white bg-indigo-300`;
    }
    return <button
        onClick={() => setEvent(event)}
        className={`text-stone-800 ${style} gap-0 py-1 px-[2px] rounded-sm md:rounded-lg md:px-2 hover:shadow-lg transition ease-in delay-50 duration-100 w-full`}
    >
        <div className="flex space-x-1 text-[8px] md:text-xs overflow-x-hidden">
        {event?.tracked && <span className="text-black-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg></span>}
            <h1 className="text-nowrap overflow-x-hidden">
                {event?.event_types?.abbreviation.toUpperCase()}
                {' '}
                <span className="hidden md:inline">
                    {format(event?.start_time, 'p')}
                    {' '}
                </span>
                {event?.name}
            </h1>
        </div>
    </button>
}

function MonthDayComponent({ userData, focusDay, day, index, fiveRows, events, setEvent }) {
    const [color, setColor] = useState(isSameMonth(focusDay, day) ? (isToday(focusDay) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    useEffect(() => {
        setColor(isSameMonth(focusDay, day) ? (isToday(day) ? 'bg-blue-100' : '') : 'bg-neutral-200 hover:bg-neutral-100');
    }, [focusDay]);

    const [popover, setPopover] = useState(false);

    switch (Math.floor(index / 7)) {
        case 0:
            position = "top-[0%]"; break;
        case 3:
            if (fiveRows) position = "top-[-10%]";
            else position = "bottom-[0%]";
            break;
        case 4:
            position = "bottom-data && [0%]";
    }

    switch (index % 7) {
        case 0:
            position += " left-[0%]"; break;
        case 6:
            position += " right-[0%]"; break;
    }

    return (
        <div className={`flex flex-col w-full pt-2 transition ease-out delay-20 duration-150 ${color}`} onMouseLeave={() => { setPopover(false); }}>
            <h1 className={`text-center text-sm ${textColor}`}>
                {
                    day && getDate(day)
                }
            </h1>
            <div className="flex flex-col items-center space-y-[4px] md:space-y-[1px] pr-[2px] md:px-2 overflow-y-scroll">
                {
                    events?.map((event, i) =>
                        <EventDay key={i} userData={userData} event={event} setEvent={setEvent} day={day} />
                    )
                }
            </div>
        </div>
    )
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function EventCalendar({ focusDay, userData }) {
    const supabase = useContext(AuthContext);
    const [focusStartDay, setFocusStartDay] = useState(startOfWeek(startOfMonth(focusDay)));
    const [focusEndDay, setFocusEndDay] = useState(endOfWeek(endOfMonth(focusDay)));
    const [monthDays, setMonthDays] = useState([]);
    const [events, setEvents] = useState([]);
    const [eventModal, setEventModal] = useState(null);

    useEffect(() => {
        const start = startOfWeek(startOfMonth(focusDay));
        const end = endOfWeek(endOfMonth(focusDay));
        const days = eachDayOfInterval(interval(start, end));
        setFocusStartDay(start);
        setFocusEndDay(end);
        setMonthDays(days);
    }, [focusDay]);

    async function getEvents() {
        const eventsResponse = await supabase
            .from('events')
            .select('*, event_types(*), event_signups(*), event_chairs(*)')
            .gte('date', focusStartDay.toISOString())
            .lte('date', focusEndDay.toISOString())
            .eq('reviewed', true)
            .order('date', { ascending: false });
        const eventsList = eventsResponse?.data;
        const eventsMap = new Map();
        for (const event of eventsList) {
            var [YYYY, MM, DD] = event.date.split('-')
            const date = new Date(YYYY, MM - 1, DD).toLocaleDateString();
            if (date in eventsMap) {
                eventsMap[date].push(event);
            } else {
                eventsMap[date] = [event];
            }
        }
        setEvents(eventsMap);
    }

    useEffect(() => {
        getEvents();
    }, [ focusDay ]);

    return (
        <div className="flex flex-col h-full w-full">
            <EventModal supabase={supabase} event={eventModal} setEvent={setEventModal} userData={userData} />
            <div className="flex items-center justify-center">
                <button className="text-center text-neutral-500 text-xl py-2 px-10 custom-prev hover:bg-stone-500 hover:text-white rounded-full">{ '<' }</button>
                <h1 className="text-center text-neutral-500 text-xl py-2">{format(focusDay, 'LLLL y').toUpperCase()}</h1>
                <button className="text-center text-neutral-500 text-xl py-2 px-10 custom-next hover:bg-stone-500 hover:text-white rounded-full">{ '>' }</button>
            </div>
            <div className="grid grid-cols-7">
                {
                    DAYS.map(day => {
                        return (
                            <h1
                                key={day}
                                className="text-neutral-300 text-center py-2"
                            >
                                {day.toUpperCase()}
                            </h1>
                        )
                    })
                }
            </div>
            <div className="grow grid grid-cols-7 auto-rows-fr min-h-0">
                {
                    monthDays?.map((day, i) => {
                        return <MonthDayComponent
                            key={day.toISOString()}
                            userData={userData}
                            focusDay={focusDay}
                            day={day}
                            index={i}
                            fiveRows={monthDays.length > 28}
                            events={events[day.toLocaleDateString()] || []}
                            setEvent={setEventModal}
                        />
                    }
                    )
                }
            </div>
        </div>
    )
}
