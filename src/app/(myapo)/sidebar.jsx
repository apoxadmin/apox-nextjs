'use client'

import { isPrivileged } from "@/supabase/user"
import Link from "next/link"
import { useEffect, useState } from "react";

const buttonClassName = "px-8 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150"

function SidebarButton({ name, url = "/" }) {
    return (
        <Link href={url} className={buttonClassName}>
            {name}
        </Link>
    )
}

export default function Sidebar({ visible = true }) {
    const [privileged, setPrivileged] = useState(false);

    useEffect(() => {
        async function getPrivileged() {
            const priv = await isPrivileged();
            setPrivileged(priv);
        }
        getPrivileged();
    })

    return (
        <div className={`min-w-[180px] ${visible ? '' : 'hidden'}`}>
            <div className="flex flex-col text-neutral-500">
                <SidebarButton name="Calendar" url="myapo" />
                <SidebarButton name="Request Event" url="request" />
                <SidebarButton name="Tracking" url="tracking" />
                {
                    privileged &&
                    <SidebarButton name="ExComm" url="excomm" />
                }
                {/*<SidebarButton name="My Status" />
                <SidebarButton name="My Family" />
                <SidebarButton name="My Class" />
                <SidebarButton name="Resources" />
                <SidebarButton name="APOChat" />
                <SidebarButton name="Settings" />
                */}
            </div>
        </div>
    )
}
