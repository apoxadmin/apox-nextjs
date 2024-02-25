'use client'

import PasswordChangeForm from "@/components/PasswordChangeForm";
import { createClient } from "@/utils/supabase/client";
import React from "react";

export default function ResetPasswordPage() {
    const supabase = createClient();
    const [showReset, setShowReset] = React.useState<boolean>(false);
    
    React.useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event == 'PASSWORD_RECOVERY') {
                setShowReset(true);
            }
        })
    }, []);

    return (
        showReset ? <PasswordChangeForm /> : <></>
    )
}