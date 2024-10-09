'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { uppercase } from '@/utils/utils';
import { updateUser } from "@/supabase/user";

export default function SettingsPage() {
    const [userData, setUserData] = useState(null);
    const [toast, setToast] = useState(false);
    const supabase = createSupabaseClient();
    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();

    useEffect(() => {
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const user = await supabase.from('users').select('*').eq('auth_id', user_id).maybeSingle();
            setUserData(user.data);
        }
        getUser();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">My Profile</h1>
           
        </div>
    )
}