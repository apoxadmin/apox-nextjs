'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { uppercase, sortById } from '@/utils/utils';
import { updateUser } from "@/supabase/user";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';

const Grid = ({ rows, cols, creditRequirements}) => {
    const gridStyle = {
      display: 'grid',
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
    };
  
    return (
      <div style={gridStyle}>
            {creditRequirements.map((req, i) => {
                return (
                    <CircularProgressbar value={3} minValue={0} maxValue={20} text={uppercase(req.name)} />
                    // <h1 key={i} className="text-end">{uppercase(req.name)}</h1>
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
                .eq('id', user_id);
            if (userResponse.data) {
                let user = usersResponse.data;
                for (let credit of user.credit_users_requirements) {
                    user[credit.name] = credit.value;
                }
                for (let event_req of user.event_users_requirements) {
                    user[event_req.name] = event_req.value;
                }
                delete user.credit_users_requirements;                
                setUser(user);
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
        getUser();
        getCreditRequirements();
        getEventRequirements();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">My Profile</h1>
            {
                
            }
            <Grid rows = {1} cols = {5} creditRequirements={creditRequirements}>meow</Grid>
        </div>
    )
}