'use client'

import { isPrivileged } from "@/supabase/user"
import Link from "next/link"
import { useEffect, useState } from "react";

const buttonClassName = "px-8 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150"

const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }

function SidebarButton({ name, url = "/" }) {
    return (
        <Link href={url} className={buttonClassName}>
            {name}
        </Link>
    )
}
function SidebarLink({ name, url = "/" }) {
    return (
        <Link href={url} className={buttonClassName} rel="noopener noreferrer" target='_blank'>
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
                <SidebarButton name="Calendar" url="/myapo" />
                <SidebarButton name="Request Event" url="/request" />
                <SidebarButton name="Tracking" url="/tracking" />
                {
                    privileged &&
                    <SidebarButton name="ExComm" url="/excomm" />
                }
                <SidebarLink name="Gas Reimbursement" url="https://docs.google.com/forms/d/e/1FAIpQLScp47-NYgZm-Gp7XGkTf7jYeHHdinqfI2TZ9KkI4wQ1yXEexA/viewform?usp=sf_link" />
                <SidebarLink name="Regular Reimbursement" url="https://docs.google.com/forms/d/e/1FAIpQLSco5IJ_mG_dN8xNbPuDKF-P19KA1GXa88KaWgqoXysYMhsMvw/viewform?usp=sf_link" />
                <SidebarLink name="Rule Violations" url="https://docs.google.com/forms/d/e/1FAIpQLSfcZlkaLwu42CiQLi_9exH5A100DGQu5VPJWkzvhw0ChYWucA/viewform" />
                <SidebarLink name="Collaborative Drive" url="https://drive.google.com/drive/folders/1Ac2nRqfeRI00R3tc4-J9m3uTfOiyCrZY?usp=sharing" />
                <SidebarLink name="Outside Service" url="https://forms.gle/UuSLmX42myFNF8sx9" />
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
