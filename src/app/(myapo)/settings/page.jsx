'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { uppercase } from '@/utils/utils';
import { updateUser } from "@/supabase/user";

export default function SettingsPage() {
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [toast, setToast] = useState(false);
    const supabase = createSupabaseClient();
    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();
    register('name', { required: true });
    register('email', { required: true });
    register('password', { required: true });

    const onSubmit = (data) => {
        if (data.name == 'Name') data.name = userData.name;
        if (data.email == 'Email') data.email = userData.email;
        if (data.phone_number == '') data.phone_number = userData.phone_number;
        data.auth_id = userData.auth_id;
        if (updateUser(userData.id, data)) {
            setToast(true);
            setTimeout(() => {
                setToast(false);
            }, 5000);
        }
    };

    useEffect(() => {
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const user = await supabase.from('users').select('*').eq('auth_id', user_id).maybeSingle();
            setUserData(user.data);
            setName(user.data.name);
            setEmail(user.data.email);
        }
        getUser();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Settings</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Name
                        </span>
                    </div>
                    <input {...register('name', { required: true })} type="text" defaultValue={name} className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Email
                        </span>
                    </div>
                    <input {...register('email', { required: true })} type="text" defaultValue={email} className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Phone Number
                        </span>
                    </div>
                    <input {...register('phone_number', { required: false })} type="text" defaultValue={userData == null ? "" : userData.phone_number} className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Password
                        </span>
                    </div>
                    <input {...register('password', { required: true })} type="text" defaultValue="" className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <button type="submit" className="btn">Update Profile</button>
            </form>
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Profile Updated!</h1>
                    </div>
                </div>
            }
        </div>
    )
}