import { chairEvent, joinEvent, leaveEvent, unchairEvent, setDriver, removeDriver, unapproveEvent, deleteEvent } from "@/supabase/event";
import { eachDayOfInterval, endOfDay, endOfMonth, endOfToday, endOfWeek, format, getDate, interval, isAfter, isSameDay, isSameMonth, isThisMonth, isToday, startOfMonth, startOfToday, startOfWeek } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react"
import { atcb_action } from "add-to-calendar-button";
import { convertToPST } from "@/utils/utils";

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

function isTodayOrLater(dateString) {
    const today = new Date().toISOString().split('T')[ 0 ];
    return dateString >= today; // Check if the input date is today or later
}

function configureAddToCal(event, id) {
    if (event) {
        const date1 = new Date(`1970-01-01T${event.start_time.split("T")[ 1 ].split("+")[ 0 ]}Z`)
        const date2 = new Date(`1970-01-01T${event.end_time.split("T")[ 1 ].split("+")[ 0 ]}Z`)
        let endDate = event.date;
        if (isDayAfter(date1, date2)) endDate = new Date(new Date(event?.date).setDate(new Date(event?.date).getDate() + 1))
            .toISOString()
            .split("T")[ 0 ]
        
        const config = {
            name: event.name,
            startDate: event.date,
            startTime: event ? convertToPST(event?.start_time) : undefined,
            endTime: event ? convertToPST(event?.end_time) : undefined,
            endDate: endDate,
            location: event.location,
            options: [ 'Google' ],
            timeZone: "America/Los_Angeles"
        };

        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', () => atcb_action(config, button));
        }
    }
}

export function EventModal({ supabase, event, setEvent, userData, shiftList }) {
    const ref = useRef(null);
    const [ dateString, setDateString ] = useState('');
    const [ signups, setSignups ] = useState({});
    const [ drivers, setDrivers ] = useState([]);
    const [ chairs, setChairs ] = useState([]);
    const [ isCreator, setCreator ] = useState(false);
    const [ showTrackingInfo, setShowTrackingInfo ] = useState(false);
    const [ shifts, setShifts ] = useState([]);

    function getShifts() {
        let s = shiftList.filter(e => e.event_of_shift == event?.id);
        s.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
        setShifts(s);
    }

    async function getAttendees() {
        if (!event.has_shifts || shifts.length == 0) {
            const attendeesResponse = await supabase?.from('event_signups').select('*, users (*)').eq('event_id', event?.id);
            if (attendeesResponse?.data) {
                setSignups({ [ event.id ]: attendeesResponse.data });
            }
        }
        else {
            let signupList = {};

            await Promise.all(
                shifts.map(async (shift) => {
                    const attendeesResponse = await supabase?.from('event_signups')
                        .select('*, users (*)')
                        .eq('event_id', shift.id);

                    if (attendeesResponse?.data) {
                        signupList[ shift.id ] = attendeesResponse.data;
                    }
                })
            );

            setSignups(signupList);
        }
    }

    async function getChairs() {
        const chairsResponse = await supabase?.from('event_chairs').select('users (*)').eq('event_id', event?.id);
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
            if (event.has_shifts) {
                getShifts();
            }
            ref.current.showModal();
            setDateString(`${format(event.start_time, 'p')} - ${format(event.end_time, 'p')}`);
            getAttendees();
            getChairs();
            getDrivers();
            getCreator();
        } else {
            setChairs([]);
            setDrivers([])
            setDateString('');
            setCreator(false);
            setShifts([]);
        }
    }, [ event, ref ]);

    useEffect(() => {
        if (event) getAttendees();
    }, [ shifts ]);

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
        if (!event?.has_shifts) configureAddToCal(event, 'add-to-cal-btn');
        else {
            shifts.forEach((shift, i) => {
                configureAddToCal(shift, 'add-to-cal-btn' + (i + 1))
            })
        }
    }, [ event, shifts ]);
    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-hidden">
                {
                    showTrackingInfo ?
                        <TrackingInfoPage supabase={supabase} setShowTrackingInfo={setShowTrackingInfo} event={event} attendees={signups} shifts={shifts} />
                        :
                        <EventModalInfo shifts={shifts} event={event} setShowTrackingInfo={setShowTrackingInfo} dateString={dateString}
                            drivers={drivers} chairs={chairs} isCreator={isCreator} userData={userData} supabase={supabase} />
                }
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={() => { setEvent(null); ref.current.close(); setShowTrackingInfo(false); }}>close</button>
            </form>
        </dialog>
    )
}

function AttendeeInfo({ isShift, supabase, event, userData, shiftNum }) {
    const [ attendees, setAttendees ] = useState([]);
    const [ drivers, setDrivers ] = useState([]);
    const [ chairs, setChairs ] = useState([]);

    async function getAttendees() {
        const attendeesResponse = await supabase?.from('event_signups').select('*, users (*)').eq('event_id', event?.id);
        if (attendeesResponse?.data) {
            setAttendees(attendeesResponse.data.map((user) => user.users));
        }
    }

    async function getChairs() {
        const chairsResponse = await supabase?.from('event_chairs').select('users (*)').eq('event_id', event?.id);
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

    useEffect(() => {
        if (event) {
            getAttendees();
            getChairs();
            getDrivers();
        } else {
            setAttendees([]);
            setChairs([]);
            setDrivers([])
        }
    }, [ event ]);

    return (
        <div className={`swiper-no-swiping dark:bg-[#252a30] p-2 rounded-xl text-white dark:text-slate-300`}>
            <div className="flex flex-col space-y-2 overflow-auto max-h-[40vh]">
                {
                    isShift ?
                        <div className="flex-col">
                            <div className="flex justify-between">
                                <h1 className="text-left text-lg">
                                    shift {shiftNum}
                                </h1>
                                <div className="flex justify-center">
                                    <button
                                        className="text-white bg-slate-600 hover:bg-slate-700 py-1 px-4 rounded-xl select-none"
                                        id={'add-to-cal-btn' + shiftNum}
                                    >
                                        add to gcal
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <h1 className="text-left text-lg">
                                    attendees ({attendees?.length} / {event?.capacity})
                                </h1>
                                <h1 className="text-right text-lg">
                                    {new Date(event?.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - {new Date(event?.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                                </h1>
                            </div>
                        </div>
                        :
                        <h1 className="text-center text-lg">Attendees ({attendees?.length} / {event?.capacity})</h1>
                }
                {
                    attendees?.length == 0 && <h1 className="text-center text-neutral-500">None yet!</h1>
                }
                <div className="flex flex-col overflow-auto">
                    <div className="grid grid-cols-2 gap-1">
                        {
                            attendees?.map((user, i) => {
                                const isDriver = drivers?.some(driver => driver.id == user.id);
                                let bg = isDriver ? 'bg-purple-600 text-white' : '';
                                bg = chairs?.some(chair => chair.id == user.id) ? 'bg-green-600 text-white' : bg;
                                return <div key={i} className={`${bg} flex flex-col border border-black rounded-xl p-2 overflow-x-hidden`}>
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
                (isTodayOrLater(event?.date)) ?
                    <div className="flex justify-center space-x-4 py-2">
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
                    :
                    <div className="text-center text-neutral-500 p-2">
                        It is too late to sign up, contact the chairs to flake in!
                    </div>
            }
        </div>
    )
}

function EventModalInfo({ shifts, event, supabase, setShowTrackingInfo, dateString, isCreator, userData }) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
                <h1 className="text-neutral-600">
                    {event?.event_types.name.split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')}
                </h1>
                <h1 className="text-neutral-600">
                    {dateString}
                </h1>
            </div>
            <div className="flex justify-end gap-2">
                <button onClick={() => {
                    setShowTrackingInfo(true)
                }
                } className="text-green-500">tracking info</button>
                {
                    isCreator &&
                    <button onClick={() => {
                        unapproveEvent(event?.id);
                        window.location.reload();
                    }
                    } className="text-red-500">delete event</button>
                }
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
            </div>
            {
                (event && !event?.has_shifts) &&
                <div className="flex justify-center">
                    <button
                        className="text-white bg-green-600 hover:bg-green-800 py-2 px-4 rounded-xl select-none"
                        id='add-to-cal-btn'
                    >
                        add to gcal
                    </button>
                </div>
            }
            {
                shifts.length == 0 ?
                    <AttendeeInfo isShift={false} event={event} supabase={supabase} userData={userData} />
                    :
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[400px] pb-6">
                        {
                            shifts.map((shift, i) => {
                                return <AttendeeInfo shiftNum={i + 1} isShift={true} key={i} event={shift} supabase={supabase} userData={userData} />
                            })
                        }
                    </div>
            }
        </div >)
}

function TrackingInfo({ event, attendees, shiftNum, supabase }) {
    // State for categorized attendees
    const [ flakeOut, setFlakeOut ] = useState([]);
    const [ trackedUsers, setTrackedUsers ] = useState([]);
    const [ flakeIn, setFlakeIn ] = useState([]);
    const [ tracker, setTracker ] = useState("");

    // Categorize attendees when attendees change
    useEffect(() => {
        if (!attendees) return;

        const flakeOutGroup = attendees.filter(user => user?.attended === false);
        const trackedGroup = attendees.filter(user => user?.attended === true && user?.flake_in === false);
        const flakeInGroup = attendees.filter(user => user?.attended === true && user?.flake_in === true);

        setFlakeOut(flakeOutGroup);
        setTrackedUsers(trackedGroup);
        setFlakeIn(flakeInGroup);
    }, [ attendees ]);

    useEffect(() => {
        async function getTracker() {
            const trackerResponse = await supabase
                .from('audit_log')
                .select('*, user(*)')
                .eq('event', event.id)
                .neq('tracking_type', 3)
                .maybeSingle();
            if (trackerResponse.data) {
                setTracker(trackerResponse.data.user)
            }
        }
        if (event) getTracker();
    }, []);
    const checkboxID = "tracking-checkbox" + shiftNum ? shiftNum : "meow";

    return <div>
        <div>
            <h1>event id: {event?.id}</h1>
            {shiftNum && <h1>shift {shiftNum}</h1>}
        </div>
        <div className="flex items-center gap-2">
            <input
                type="checkbox"
                id={checkboxID}
                checked={event?.tracked}
                disabled={true}
                className="form-checkbox h-5 w-5 text-green-500"
            />
            {
                event?.tracked ?
                    <label htmlFor={checkboxID} className="text-lg font-medium">
                        tracked by { tracker ? tracker.name : "(unknown)" }
                    </label>
                    :
                    <label htmlFor={checkboxID} className="text-lg font-medium">
                        {shiftNum ? "shift" : "event"} has not been tracked yet (contact chair)
                    </label>
            }
        </div>

        {event?.tracked && (
            <div className="flex flex-col space-y-4 overflow-auto max-h-[60vh]">
                {
                    (trackedUsers.length + flakeIn.length == 0) &&
                    <h1>looks like nobody was tracked for this event! contact the admin vps please</h1>
                }
                <div>
                    <h2 className="text-xl font-bold">tracked ({trackedUsers.length})</h2>
                    {trackedUsers.length === 0 ? (
                        <p className="text-neutral-500">none</p>
                    ) : (
                        <ListTrackingUsers userList={trackedUsers} />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">flake ins! ({flakeIn.length})</h2>
                    {flakeIn.length === 0 ? (
                        <p className="text-neutral-500">none</p>
                    ) : (
                        <ListTrackingUsers userList={flakeIn} />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">flake outs! ({flakeOut.length})</h2>
                    {flakeOut.length === 0 ? (
                        <p className="text-neutral-500">none</p>
                    ) : (
                        <ListTrackingUsers userList={flakeOut} />
                    )}
                </div>
            </div>
        )}
    </div>
}

function TrackingInfoPage({ setShowTrackingInfo, event, attendees, shifts, supabase }) {
    return (
        <div className="flex flex-col space-y-4 swiper-no-swiping">
            <div className="flex justify-end gap-2">
                <button
                    onClick={() => setShowTrackingInfo(false)}
                    className="text-green-500"
                >
                    back
                </button>
            </div>
            {
                event?.has_shifts ?
                    <div className="flex flex-col gap-10 overflow-y-auto max-h-[400px]">
                        {
                            shifts.map((shift, i) => {
                                return <TrackingInfo supabase={supabase} key={i} shiftNum={i + 1} event={shift} attendees={attendees[ shift.id ]} />
                            })
                        }
                    </div>
                    :
                    <TrackingInfo supabase={supabase} event={event} attendees={attendees[ event?.id ]} />
            }
        </div>
    );
}

function ListTrackingUsers({ userList }) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {userList.map((user, i) => (
                <div
                    key={i}
                    className="border border-black p-2 rounded shadow-sm text-neutral-400"
                >
                    <h1>{user?.users.name}</h1>
                    <p className="text-xs">{user?.users.email}</p>
                </div>
            ))}
        </div>
    )
}