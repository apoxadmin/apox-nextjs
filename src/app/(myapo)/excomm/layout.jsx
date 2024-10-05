'use client'

import UserTable from "./UserTable";
import ExCommEvents from "./ExCommEvents";
import Link from "next/link";
export default function ExCommPage({ children }) {
    return (
        <div className="flex flex-col items-center space-y-4 w-full p-10">
            <Link href="/excomm" className="text-xl text-neutral-600">ExComm Panel</Link>
            {children}
        </div>
    )
}
