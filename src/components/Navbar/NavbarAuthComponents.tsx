'use client'

import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import ProfileButton from "@/components/Navbar/ProfileButton";
import React from "react";
import SearchPopup from "./SearchPopup";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function NavbarAuthComponents() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

    if (isDesktop) return (
        <div className="flex-1 flex items-center justify-between space-x-4 md:space-x-8">
            <div className="flex space-x-8 text-neutral-700">
                <Link href="/calendar" className="text-nowrap hover:text-neutral-400">
                    Calendar
                </Link>
                <Link href="/members" className="text-nowrap hover:text-neutral-400">
                    Members
                </Link>
                <Link href="/request" className="text-nowrap hover:text-neutral-400">
                    Request Event
                </Link>
                <Link href="/track" className="text-nowrap hover:text-neutral-400">
                    Event Tracker
                </Link>
            </div>
            <div className="flex space-x-8">
                <Input 
                    placeholder="Search"
                    onClick={() => { setSearchOpen(true)}}
                    readOnly
                    className="h-[32px] hover:cursor-pointer hover:ring-2 ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-sm max-w-[150px] md:max-w-[400px] transition ease-in-out delay-50 duration-200"/>
                <ProfileButton />
                <SearchPopup searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            </div>
        </div>
    )

    return (<>
            <Input 
                placeholder="Search"
                onClick={() => { setSearchOpen(true)}}
                readOnly
                className="h-[32px] hover:cursor-pointer hover:ring-2 hover:ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-xs max-w-[150px] md:max-w-[200px] transition ease-in-out delay-50 duration-200"/>
            <ProfileButton />
            <SearchPopup searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </>
    )
}