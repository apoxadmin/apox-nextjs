'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { uppercase, sortById } from '@/utils/utils';
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

function lerp(start, end, t) {
    if (t > 1) t = 1;
    if (t < 0) t = 0;
    return start + (end - start) * t;
}

const Grid = ({ rows, cols, user, creditRequirements, eventRequirements, circleSize, padding }) => {
    const gridStyle = {
        display: 'grid',
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gridTemplateColumns: `repeat(${cols}, 1fr)`,      
        justifyItems: 'center', // Centers items horizontally
        alignItems: 'center',   // Centers items vertically
        gap: `${padding}px`
    };
  
    return (
      <div style={gridStyle}>
            {eventRequirements.map((req, i) => {
                let value = 0 
                if(user != null && req.name in user) value = user[ req.name ]
                const maxValue = req.value
                let t = value / maxValue
                return (
                    <div style={{ width: circleSize, height: circleSize }} key={i}>
                        <CircularProgressbarWithChildren value={value} minValue={0} maxValue={maxValue} 
                            styles={buildStyles({
                                pathColor: `rgb(${lerp(19, 239, t)}, ${lerp(49, 179, t)}, ${lerp(160, 61, t)})`
                            }                       
                        )}>
                            <h1>{uppercase(req.name)}</h1>
                            <h1>{value + '/' + maxValue}</h1>
                        </CircularProgressbarWithChildren>
                    </div>
                )
            })}        
            {creditRequirements.map((req, i) => {
                let value = 0 
                if(user != null && req.name in user) value = user[ req.name ]
                const maxValue = req.value
                let t = value / maxValue
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
                    </div>
                )
            })}        
      </div>
    );
  };

export default function ProfilePage() {
    const supabase = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [creditRequirements, setCreditRequirements] = useState([]);
    const [eventRequirements, setEventRequirements ] = useState([]);
    
    useEffect(() => {
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const userResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
                .eq('auth_id', user_id)
                .maybeSingle();
            if (userResponse.data) {
                let user = userResponse.data;
                console.log(creditRequirements.length)
                for (let credit of user.credit_users_requirements) {
                    user[credit.name] = credit.value;
                }
                for (let event_req of user.event_users_requirements) {
                    user[event_req.name] = event_req.value;
                }
                delete user.credit_users_requirements;                
                setUserData(user);
            }
        }
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
        getCreditRequirements();
        getEventRequirements();
        getUser();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">My Profile</h1>
            <Grid rows={4} cols={4} user={userData} creditRequirements={creditRequirements} eventRequirements={eventRequirements} circleSize={200} padding={25}>meow</Grid>
        </div>
    )
}