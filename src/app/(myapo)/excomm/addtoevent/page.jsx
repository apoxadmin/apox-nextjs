'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { createUser } from "@/supabase/user";
import { sortByField, uppercase} from "@/utils/utils";
import { CustomCheckbox } from "../../tracking/page";

function UserCheck({ user, submitted, onComplete, eventid }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    async function updateAttended() {
        setAttended(!attended);
    }

    useEffect(() => {
        async function submitUser() {
            if (attended) {
                let row = {
                    user_id: user?.id,
                    event_id: eventid,
                    attended: true,
                    flake_in: true
                }
                const { data, error } = await supabase
                    .from('event_signups')
                    .insert(row)
                onComplete();
            }
            setAttended(false);
        }
        if (submitted) {
            submitUser();
        }
    }, [submitted, attended]);

    return (
        <button
            className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4`}
            onClick={updateAttended}
            type="button"
        >
            <CustomCheckbox checked={attended}/>
            <h1 className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4 select-none`}>{user?.name}</h1>
        </button>
    );
}

export default function AddToEventPage() {
    const [ toast, setToast ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);
    const [ eventId, setEventID ] = useState(-1);
    const [ users, setUsers ] = useState([]);
    
    const {
        register,
        handleSubmit,
    } = useForm();

    register('eventid', { required: true });

    const supabase = createSupabaseClient();

    const onSubmit = (data) => {
        console.log("meow")
        setEventID(data.eventid)
        setToast(true)
        setSubmitted(true)
        setTimeout(() => { setToast(false); }, 3000);
    };

    useEffect(() => {
        async function getUsers() {
            const usersResponse = await supabase
                .from('users')
                .select('*, standings!inner(name)')
                .neq('standings.name', 'alumni');
            let data = usersResponse.data;
            if (data) {
                const sortByName = (a, b) => sortByField(a, b, 'name');
                data.sort(sortByName);
                setUsers(data);
            }
        }
        getUsers();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Award Credit</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Event ID (go to event/tracking info in the calendar to get the id)
                        </span>
                    </div>
                    <input {...register('eventid', { required: true })} placeholder="id..." step="1"
                        id="capacityInput"
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Users
                        </span>
                    </div>
                    {
                        users.map((user, i) =>
                        {
                            return <UserCheck key={i} eventid={eventId} user={user} submitted={submitted} onComplete={() => setSubmitted(false)}/>
                        })
                    }
                </label>
                <button type="submit" className="btn">Add User</button>
            </form>
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">User Added!</h1>
                    </div>
                </div>
            }
        </div>
    )
}
