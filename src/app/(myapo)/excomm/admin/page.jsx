'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { uppercase } from '@/utils/utils';
import { createUser } from "@/supabase/user";

export default function AdminPage() {
    const [pledgeClasses, setPledgeClasses] = useState([]);
    const [standings, setStandings] = useState([]);
    const [userData, setUserData] = useState(null);
    const [toast, setToast] = useState(false);
    const supabase = createSupabaseClient();
    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();
    const pledgeClass = watch('class');
    const standing = watch('standing');
    register('class', { required: true });
    register('standing', { required: true });
    register('password', { required: true });
    register('emails', { required: true });
    register('names', { required: true });

    const onSubmit = (data) => {
        console.log(pledgeClass.id);
        const emails = data.emails.split('\n');
        const names = data.names.split('\n');
        let usersCreated = 0;
        for (let i = 0; i < emails.length; i++) {
            const newUserData = {
                email: emails[i],
                password: data.password,
                name: names[i],
                class: pledgeClass.id,
                standing: standing.id
            };
            let result = createUser(newUserData);
            if (result) {
                usersCreated++;
            }
            else {
                console.log('Error creating user: ' + emails[i]);
            }
        }
        if (usersCreated != 0) {
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 5000);
        }
    };

    useEffect(() => {
        async function getPledgeClasses() {
            const { data } = await supabase.from('class').select('*');
            if (data)
                setPledgeClasses(data);
        }
        async function getStandings() {
            const { data } = await supabase.from('standings').select('*');
            if (data)
                setStandings(data);
        }
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const user = await supabase.from('users').select('id, name, email').eq('auth_id', user_id).maybeSingle();
            setUserData(user.data);
        }

        getPledgeClasses();
        getStandings();
        getUser();
    }, []);

    useEffect(() => {
        function escape(e) {
            document.querySelectorAll('.dropdown').forEach(function (dropdown) {
                if (!dropdown.contains(e.target)) {
                    // Click was outside the dropdown, close it
                    dropdown.open = false;
                }
            });
        }
        window.addEventListener('click', escape);

        return () => {
            window.removeEventListener('click', escape);
        }

    }, [window]);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Add Users</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="form-control flex-col items-start">
                    <div className="label">
                        <span className="label-text">
                            Pledge Class
                        </span>
                    </div>
                    <details className="dropdown" id="pledgeClassDropdown">
                        <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">{pledgeClass == null ? 'Pledge Class' : uppercase(pledgeClass.name)}</summary>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {
                                pledgeClasses.map((pledge_class, i) => {
                                    return <li key={i} onClick={() => { setValue("class", pledge_class); document.querySelector('#pledgeClassDropdown').open = false; }}><a>{uppercase(pledge_class.name)}</a></li>
                                })
                            }
                        </ul>
                    </details>
                </label>
                <label className="form-control flex-col items-start">
                    <div className="label">
                        <span className="label-text">
                            Standing
                        </span>
                    </div>
                    <details className="dropdown" id="standingDropdown">
                        <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">{standing == null ? 'Standing' : uppercase(standing.name)}</summary>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {
                                standings.map((s, i) => {
                                    return <li key={i} onClick={() => { setValue("standing", s); document.querySelector('#standingDropdown').open = false; }}><a>{uppercase(s.name)}</a></li>
                                })
                            }
                        </ul>
                    </details>
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Default Password
                        </span>
                    </div>
                    <input {...register('password', { required: true })} type="textarea" placeholder="Password..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Names
                        </span>
                    </div>
                    <textarea {...register('names', { required: true })} type="textarea" placeholder="Names..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Emails
                        </span>
                    </div>
                    <textarea {...register('emails', { required: true })} type="textarea" placeholder="Emails..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <button type="submit" className="btn">Add Users</button>
            </form>
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Users Added!</h1>
                    </div>
                </div>
            }
        </div>
    )
}
