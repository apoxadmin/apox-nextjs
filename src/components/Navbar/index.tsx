'use client'

import React from "react";
import NavbarAuthComponents from "./NavbarAuthComponents";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/lib/AuthProvider";

export default function Navbar() {
    const supabase = createClientComponentClient();
    const { user } = useAuth();
    
    return (
        <div className="sticky top-0 z-25 flex items-center justify-between p-4 md:px-8 w-full border-b-[2px] shadow-sm z-10 bg-white">
            <img className="h-[30px]" src="/logo.png" />
            { user && <NavbarAuthComponents /> }
        </div>
    );
}