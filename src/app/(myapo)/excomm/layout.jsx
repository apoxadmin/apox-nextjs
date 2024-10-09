'use client'

import Link from "next/link";
export default function ExCommPage({ children }) {
    return (
        <div className="flex flex-col items-center space-y-4 w-full p-10">
            <Link href="/excomm" className="text-xl text-neutral-600">Excomm Panel</Link>
            {children}
        </div>
    )
}
