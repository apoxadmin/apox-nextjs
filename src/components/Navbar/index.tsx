import React from "react";
import NavbarAuthComponents from "./NavbarAuthComponents";
import { createClientServer } from "@/utils/supabase/server";

async function ProtectedNavbar() {
    const supabase = createClientServer();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
        return <></>
    }
    
    return <NavbarAuthComponents />
}

export default async function Navbar() {
    
    return (
        <div className="sticky top-0 z-25 flex items-center justify-between p-4 md:px-8 w-full border-b-[2px] shadow-sm z-10 bg-white">
            <img className="h-[30px]" src="/logo.png" />
            <ProtectedNavbar />
        </div>
    );
}