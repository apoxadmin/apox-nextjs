'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { uppercase, sortById, lerp } from '@/utils/utils';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { getUserEvents } from "@/supabase/tracking";
import {Tooltip} from 'react-tooltip';

const Grid = ({ rows, cols, user, reqData, creditRequirements, eventRequirements, circleSize, padding, trackedEvents}) => {
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
                if(user != null && req.name in reqData) value = reqData[ req.name ]
                const maxValue = req.value
                let t = value / maxValue
                const isPledge = user?.standing == 5;
                if (isPledge && req.actives_only) return null;
                return (
                    <div style={{ width: circleSize}} key={i}>
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
                            {trackedEvents[req.name]?.map((event, index) => (
                                <div key={index} style={{ padding: '5px 0' }} className={"my-anchor-element" + req.name + index}>
                                    <div className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full h-full">
                                        <div className="flex space-x-2">
                                            <h1>{event.name}</h1> {/* or event.name, depending on data structure */}
                                            <Tooltip anchorSelect={".my-anchor-element" + req.name + index} place="top" effect="float" className="z-50">
                                                <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px'}}>
                                                    <h1>{event.date}</h1>
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
                if(user != null && req.name in reqData) value = reqData[ req.name ]
                const maxValue = req.value
                let t = value / maxValue
                const isPledge = user?.standing == 5;
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
                        {trackedEvents[req.name]?.map((event, index) => (
                            <div key={index} style={{ padding: '5px 0' }} className={"my-anchor-element" + req.name + index}>
                                <div className="flex justify-between space-x-4 p-2 bg-red-500 rounded text-white w-full h-full">
                                    <div className="flex space-x-2">
                                        <h1>{event.name}</h1> {/* or event.name, depending on data structure */}
                                        <Tooltip anchorSelect={".my-anchor-element" + req.name + index} place="top" effect="float" className="z-50">
                                            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '500px'}}>
                                                <h1>{event.date}</h1>
                                                <h1>{event.description}</h1>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            })}        
      </div>
    );
  };

export function ProfilePage({ user_id }) {
    const supabase = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [creditRequirements, setCreditRequirements] = useState([]);
    const [eventRequirements, setEventRequirements] = useState([]);
    const [trackedEvents, setTrackedEvents] = useState([]);
    const [reqData, setReqData] = useState([]);
    
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
    }, [user_id]);
    useEffect(() => {        
        async function getTrackedEvents()
        {
            const userEvents = await getUserEvents(userData?.id);
            setTrackedEvents(userEvents);
            console.log(userEvents)
        }
        getTrackedEvents();
    }, [ userData ])
    
    useEffect(() => {
        async function getReqData()
        {
            if (!user_id) return;
            const userResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
                .eq('auth_id', user_id)
                .maybeSingle();
            if (userResponse.data) {
                let reqs = {};
                for (let credit of userResponse.data.credit_users_requirements) {
                    reqs[credit.name] = credit.value;
                }
                for (let event_req of userResponse.data.event_users_requirements) {
                    reqs[event_req.name] = event_req.value;
                }
                setReqData(reqs);
            }            
        }
        getReqData();
    }, [trackedEvents]);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">My Profile</h1>
            <Grid rows={4} cols={4} user={userData} reqData={reqData} creditRequirements={creditRequirements} eventRequirements={eventRequirements} circleSize={200} padding={25} trackedEvents={trackedEvents}>meow</Grid>
        </div>
    )
}

export default function Page()
{
    const supabase = useContext(AuthContext);
    const [ userID, setUserID ] = useState(null);
    
    useEffect(() => {
        async function getUserID()
        {            
            const authUser = await supabase.auth.getUser();
            const auth_id = authUser.data.user.id;
            setUserID(auth_id)
        }
        getUserID();
    }, [])

    return <ProfilePage user_id={ userID } />
}