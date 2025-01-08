'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { uppercase, sortById, lerp } from '@/utils/utils';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { getUserReqs } from "@/supabase/tracking";
import { Tooltip } from 'react-tooltip';
import { endOfToday } from "date-fns";

function Profile({ user }) {
    const initials = user?.name
        .split(" ")                     // Split the name into words
        .filter(word => word)           // Remove any empty strings (e.g., extra spaces)
        .map(word => word[ 0 ].toUpperCase()) // Get the first character of each word and capitalize it
        .join("");

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 w-[300px] flex flex-col gap-5">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Profile Info</h1>
            <div className="avatar placeholder justify-center">
                <div className="bg-blue-800 hover:bg-blue-700 text-neutral-200 w-[150px] rounded-full shadow-lg flex items-center justify-center">
                    <span className="text-6xl font-bold">{initials}</span>
                </div>
            </div>
            <div className="text-gray-700 space-y-2">
                <p>
                    <strong>Name:</strong> {user?.name}
                </p>
                <p>
                    <strong>Pledge Class:</strong> {user?.class.symbol}
                </p>
                <p>
                    <strong>Standing:</strong> {user?.standings?.name}
                </p>
            </div>
        </div>
    );
}

function ReqCompletionBar({ completion })
{
    return (        
        <div className="mt-6 w-[900px]">
            <p className="font-medium text-gray-700">
                Requirements Completed: {(completion * 100).toFixed(1)}%
            </p>
            <div className="relative w-full h-6 bg-gray-200 rounded-full mt-2">
                <div
                    className="absolute top-0 left-0 h-6 bg-blue-500 rounded-full"
                    style={{ width: `${completion * 100}%` }}
                />
            </div>
        </div>
    )
}

function UpcomingEvents({ userData }) {
    const supabase = useContext(AuthContext);
    const [ upcomingEvents, setUpcomingEvents ] = useState({});

    useEffect(() => {
        async function getUpcomingEvents() {
            if (!userData) return;
            const upcomingEventData = await supabase
                .from('event_signups')
                .select('*, events(*)')
                .eq('user_id', userData?.id);
            if (upcomingEventData.data) {
                const today = new Date().toISOString().split('T')[ 0 ];
                let upcoming = upcomingEventData.data.filter(
                    (event) => event.events.date >= today
                );
                upcoming = upcoming.map((event) => event.events);
                upcoming = upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
                const eventsByDate = upcoming.reduce((acc, event) => {
                    const eventDate = event.date.split('T')[ 0 ]; // Extract the date part
                    if (!acc[ eventDate ]) {
                        acc[ eventDate ] = [];
                    }
                    acc[ eventDate ].push(event);
                    return acc;
                }, {});
                setUpcomingEvents(eventsByDate);
            }
        }
        getUpcomingEvents();
    }, [ userData ]);

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-'); // Extract parts of the date
        const date = new Date(year, month - 1, day); // Month is 0-indexed
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    }

    return (
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-xl font-bold text-gray-800 mb-4">Upcoming Events</h1>
            <div
                style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                }}
            >
                {Object.keys(upcomingEvents).map((date, dateIndex) => (
                    <div key={dateIndex}>
                        <h2 className="font-bold text-lg text-gray-700">{ formatDate(date) }</h2>
                        {upcomingEvents[ date ]?.map((event, eventIndex) => (
                            <div
                                key={eventIndex}
                                style={{ padding: '5px 0' }}
                                className={'upcoming-tooltip' + date + eventIndex}
                            >
                                <div className="flex justify-between space-x-10 p-2 bg-amber-500 rounded text-white w-full">
                                    <div className="flex space-x-4">
                                        <h1>{event.name}</h1>
                                        <Tooltip
                                            anchorSelect={'.upcoming-tooltip' + date + eventIndex}
                                            place="top"
                                            effect="float"
                                            className="z-50"
                                        >
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    maxWidth: '500px',
                                                }}
                                            >
                                                {event.date && <h1>{event.date}</h1>}
                                                <h1>{event.description}</h1>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

const Grid = ({ rows, cols, user, isPledge, reqData, creditRequirements, eventRequirements, circleSize, padding, trackedEvents }) => {
    const gridStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        justifyItems: 'center', // Centers items horizontally
        alignItems: 'start',   // Centers items vertically
        gap: `${padding}px`
    };

    return (
        <div style={gridStyle}>
            {eventRequirements.map((req, i) => {
                let value = 0
                if (user != null && req.name in reqData) value = reqData[ req.name ]
                let maxValue = req.value
                if(isPledge && i == 2) maxValue = 1
                let t = value / maxValue
                if (isPledge && req.actives_only) return null;
                return (
                    <div style={{ width: circleSize }} key={i}>
                        <CircularProgressbarWithChildren value={value} minValue={0} maxValue={maxValue}
                            styles={buildStyles({
                                pathColor: `rgb(${lerp(19, 239, t)}, ${lerp(49, 179, t)}, ${lerp(160, 61, t)})`
                            }
                            )}>
                            <h1>{uppercase(req.name)}</h1>
                            <h1>{value + '/' + maxValue}</h1>
                        </CircularProgressbarWithChildren>
                        <div
                            style={{
                                maxHeight: '100px', // Set to desired scrollable height
                                overflowY: 'auto',
                                marginTop: '10px', // Optional margin between progress bar and events list
                                paddingTop: '10px'
                            }}
                        >
                            {/* Display each tracked event under the progress bar */}
                            {trackedEvents[ req.name ]?.map((event, index) => (
                                <div key={index} style={{ padding: '5px 0' }} className={"my-anchor-element" + req.name.replace(/\s/g, "") + index}>
                                    <div className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full h-full">
                                        <div className="flex space-x-2">
                                            <h1>{event.name}</h1> {/* or event.name, depending on data structure */}
                                            <Tooltip anchorSelect={".my-anchor-element" + req.name.replace(/\s/g, "") + index} place="top" effect="float" className="z-50">
                                                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
                                                    {event.date && <h1>{event.date}</h1>}
                                                    <h1>{event.description}</h1>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
            {creditRequirements.map((req, i) => {
                let value = 0
                if (user != null && req.name in reqData) value = reqData[ req.name ]
                const maxValue = req.value
                let t = value / maxValue
                if (isPledge && req.actives_only) return null;
                return (
                    <div style={{ width: circleSize, height: circleSize }} key={i + eventRequirements.length}>
                        <CircularProgressbarWithChildren value={value} minValue={0} maxValue={maxValue}
                            styles={buildStyles({
                                pathColor: `rgb(${lerp(19, 239, t)}, ${lerp(49, 179, t)}, ${lerp(160, 61, t)})`
                            }
                            )}>
                            <h1>{uppercase(req.name)}</h1>
                            <h1>{value + '/' + maxValue}</h1>
                        </CircularProgressbarWithChildren>
                        <div
                            style={{
                                maxHeight: '100px', // Set to desired scrollable height
                                overflowY: 'auto',
                                marginTop: '10px', // Optional margin between progress bar and events list
                                paddingTop: '10px'
                            }}>
                            {trackedEvents[ req.name ]?.map((event, index) => (
                                <div key={index} style={{ padding: '5px 0' }} className={"my-anchor-element" + req.name.replace(/\s/g, "") + index}>
                                    <div className={`flex justify-between space-x-4 p-2 bg-${event.awarded ? 'blue' : 'red'}-500 rounded text-white w-full h-full`}>
                                        <div className="flex space-x-2">
                                            <h1>{event.name}</h1>
                                            <Tooltip anchorSelect={".my-anchor-element" + req.name.replace(/\s/g, "") + index} place="top" effect="float" className="z-50">
                                                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
                                                    {event.date && <h1>{event.date}</h1>}
                                                    <h1>credit: {event.credit}</h1>
                                                    <h1>{event.description}</h1>
                                                </div>
                                            </Tooltip>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export function RequirementsPage({ user_id }) {
    const supabase = useContext(AuthContext);
    const [ userData, setUserData ] = useState(null);
    const [ creditRequirements, setCreditRequirements ] = useState([]);
    const [ eventRequirements, setEventRequirements ] = useState([]);
    const [ trackedReqs, setTrackedReqs ] = useState([]);
    const [ reqData, setReqData ] = useState([]);
    const [ completion, setCompletion ] = useState(0);
    const isPledge = userData?.standing == 5;

    useEffect(() => {
        async function getCreditRequirements() {
            const response = await supabase
                .from('credit_requirements')
                .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setCreditRequirements(data);
            }
        }
        async function getEventRequirements() {
            const response = await supabase
                .from('event_requirements')
                .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setEventRequirements(data);
            }
        }
        async function getUser() {
            if (!user_id) return;
            const userResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
                .eq('auth_id', user_id)
                .maybeSingle();
            if (userResponse.data) {
                let user = userResponse.data;
                setUserData(user);
            }
        }
        getUser();
        getCreditRequirements();
        getEventRequirements();
    }, [ user_id ]);
    useEffect(() => {
        async function getTrackedReqs() {
            const userEvents = await getUserReqs(userData?.id);
            setTrackedReqs(userEvents);
        }
        getTrackedReqs();
        if (eventRequirements && eventRequirements.length > 0)
        {
            let data = eventRequirements;
            if (isPledge) data[ 2 ].value = 1;
            setEventRequirements(data);
        }
    }, [ userData ])

    useEffect(() => {
        async function getReqData() {
            if (!user_id) return;
            const userResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
                .eq('auth_id', user_id)
                .maybeSingle();
            if (userResponse.data) {
                let reqs = {};
                for (let credit of userResponse.data.credit_users_requirements) {
                    reqs[ credit.name ] = credit.value;
                }
                for (let event_req of userResponse.data.event_users_requirements) {
                    reqs[ event_req.name ] = event_req.value;
                }
                setReqData(reqs);

                let percent = 0;
                let count = 0;
                if (!reqData) return;
                creditRequirements.concat(eventRequirements)?.forEach(req => {
                    if (req.required && (!isPledge || !req.actives_only)) {
                        percent += Math.min(reqData[ req.name ] / req.value, 1)
                        count++;
                    }
                })
                setCompletion(percent / count);
            }
        }
        getReqData();
    }, [ trackedReqs ]);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">My Profile</h1>
            <div className="flex justify-center w-full gap-5">
                <Profile user={userData}/>
                <UpcomingEvents userData={userData} />
            </div>
            <ReqCompletionBar completion={completion} />
            <Grid rows={isPledge ? 2 : 3} cols={4} user={userData} isPledge={isPledge} reqData={reqData} creditRequirements={creditRequirements} eventRequirements={eventRequirements} circleSize={200} padding={25} trackedEvents={trackedReqs}>meow</Grid>
        </div>
    )
}

export default function Page() {
    const supabase = useContext(AuthContext);
    const [ userID, setUserID ] = useState(null);

    useEffect(() => {
        async function getUserID() {
            const authUser = await supabase.auth.getUser();
            const auth_id = authUser.data.user.id;
            setUserID(auth_id)
        }
        getUserID();
    }, [])

    return <RequirementsPage user_id={userID} />
}