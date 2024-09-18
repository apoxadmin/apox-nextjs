'use client'

import { useState } from "react"
import Sidebar from "./sidebar"

export default function Main({ children }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="flex grow overflow-y-scroll">
            <Sidebar visible={open} />
            <div className="relative grow bg-white shadow-lg rounded-tl-lg border border-neutral-200 border-[1.5px]">
                <div className="absolute z-50 top-2 left-2">
                    <button className="relative group" onClick={() => setOpen(!open)}>
                        <div className="relative flex overflow-hidden items-center justify-center rounded-full w-[50px] bg-white h-[50px] transform transition-all ring-0 ring-gray-300 hover:ring-8 group-focus:ring-4 ring-opacity-30 duration-200">
                            <div className="flex flex-col justify-between w-[20px] h-[20px] transform transition-all duration-300 origin-center overflow-hidden group-focus:-translate-x-1.5 group-focus:rotate-180">
                                <div className="bg-neutral-700 h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:rotate-[42deg] group-focus:w-2/3 delay-150">
                                </div>
                                <div className="bg-neutral-700 h-[2px] w-7 rounded transform transition-all duration-300 group-focus:translate-x-10">
                                </div>
                                <div className="bg-neutral-700 h-[2px] w-7 transform transition-all duration-300 origin-left group-focus:-rotate-[42deg] group-focus:w-2/3 delay-150">
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
                {children}
            </div>
        </div >
    )
}
