'use client'

import { isPrivileged } from "@/supabase/user"
import Link from "next/link"
import { useEffect, useState } from "react";

const buttonClassName = "px-4 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150"

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
    return (
        <div className={`min-w-[240px] ${visible ? '' : 'hidden'}`}>
            <div className="flex flex-col text-neutral-500">
                {/* <SidebarButton name="Crossword" url="/crossword" /> */}
                {/* <SidebarLink name="Gas Reimbursement" url="https://docs.google.com/forms/d/e/1FAIpQLScp47-NYgZm-Gp7XGkTf7jYeHHdinqfI2TZ9KkI4wQ1yXEexA/viewform?usp=sf_link" />
                <SidebarLink name="Regular Reimbursement" url="https://docs.google.com/forms/d/e/1FAIpQLSco5IJ_mG_dN8xNbPuDKF-P19KA1GXa88KaWgqoXysYMhsMvw/viewform?usp=sf_link" />
                <SidebarLink name="Rule Violations" url="https://docs.google.com/forms/d/e/1FAIpQLSfcZlkaLwu42CiQLi_9exH5A100DGQu5VPJWkzvhw0ChYWucA/viewform" /> */}
                <SidebarLink name="Collaborative Drive" url="https://drive.google.com/drive/folders/1qBdA5DpNJLhywhIyjHTC-lY3FZVVcmZ0?usp=sharing" />
                {/* <SidebarLink name="Outside Service" url="https://forms.gle/UuSLmX42myFNF8sx9" />
                <SidebarLink name="Big/Little Comp" url="https://docs.google.com/spreadsheets/d/12U-2avpz5loeUF7Wf4trf_xXwhSaTnVukvJsh0COvfs/edit?usp=sharing" /> */}
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
