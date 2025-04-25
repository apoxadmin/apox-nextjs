'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { createUser, resetPassword } from "@/supabase/user";
import { sortByField, uppercase} from "@/utils/utils";

function CustomCheckbox({ checked })
{  
    return (
      <div className="flex items-center space-x-4">
        {/* Custom styled checkbox container */}
        <div
          className={`w-4 h-4 border-2 rounded-md cursor-pointer transition-all
            ${checked ? 'bg-green-400 border-green-600' : 'border-gray-600'}
            flex items-center justify-center relative`}
        >
          {/* Checkmark inside the checkbox */}
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    );
}

function UserCheck({ user, submitted, new_pw, onComplete }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    async function updateAttended() {
        setAttended(!attended);
    }

    useEffect(() => {
        async function submitUser() {
            if (attended) {
                resetPassword(user?.email, new_pw);
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
            <h1 className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4 select-none`}>{user.name}</h1>
        </button>
    );
}

export default function ResetPasswordPage() {
    const [ toast, setToast ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);
    const [ users, setUsers ] = useState([]);
    const [ password, setPassword ] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();
    
    const eventType = watch('event_type');
    register('pw', { required: true });

    const supabase = createSupabaseClient();

    const onSubmit = (data) => {
        setPassword(data.pw);
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
                            New password
                        </span>
                    </div>
                    <input {...register('pw', { required: true })} type="text" placeholder="Name..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
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
                            return <UserCheck key={i} user={user}
                                submitted={submitted} new_pw={password} onComplete={() => setSubmitted(false)}/>
                        })
                    }
                </label>
                <button type="submit" className="btn">Reset</button>
            </form>
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Passwords reset!</h1>
                    </div>
                </div>
            }
        </div>
    )
}