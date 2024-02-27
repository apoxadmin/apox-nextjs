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
        <div className="flex-1 flex items-center justify-between lg:space-x-4 xl:space-x-8">
            <div className="flex items-center space-x-4 xl:space-x-8 text-neutral-700">
                <Link href="/calendar" className="text-nowrap hover:text-neutral-400 text-xs xl:text-base transition ease-in-out delay-50 duration-200">
                    Calendar
                </Link>
                <Link href="/request" className="text-nowrap hover:text-neutral-400 text-xs xl:text-base transition ease-in-out delay-50 duration-200">
                    Request Event
                </Link>
                <Link
                    href="https://docs.google.com/forms/d/12b661PLFSB1OjCJdqfbWCkNwheecku7QL1mhI69AVno/edit"
                    className="text-nowrap hover:text-neutral-400 text-xs xl:text-base transition ease-in-out delay-50 duration-200"
                    target="_blank"
                >
                    Tracker Form
                </Link>
                <Link
                    href="https://docs.google.com/spreadsheets/d/18wH_HM7tL7dOlKdBX_Q5ajdV7g5sgi5bTzEkLhcy1G0/edit?usp=sharing"
                    className="text-nowrap hover:text-neutral-400 text-xs xl:text-base transition ease-in-out delay-50 duration-200"
                    target="_blank"
                >
                    Tracker Sheet
                </Link>
                <Link
                    href="https://docs.google.com/forms/d/e/1FAIpQLSffGJxd3b8ZcbAxPkmgGkK0aD7rRWZxe-6CVrQutVUBWHPQnA/viewform"
                    className="text-nowrap hover:text-neutral-400 text-xs xl:text-base transition ease-in-out delay-50 duration-200"
                    target="_blank"
                >
                    Outside Service
                </Link>
            </div>
            <div className="flex space-x-8">
                <Input 
                    placeholder="Search"
                    onClick={() => { setSearchOpen(true)}}
                    readOnly
                    className="h-[32px] hover:cursor-pointer hover:ring-2 ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-sm max-w-[150px] lg:max-w-[400px] transition ease-in-out delay-50 duration-200"/>
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
                className="h-[32px] hover:cursor-pointer hover:ring-2 hover:ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-xs max-w-[150px] sm:max-w-[400px] transition ease-in-out delay-50 duration-200"/>
            <ProfileButton />
            <SearchPopup searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </>
    )
}