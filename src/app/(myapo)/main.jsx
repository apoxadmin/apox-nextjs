'use client'

import { useContext, useEffect, useRef, useState } from "react"
import Sidebar from "./sidebar"
import Link from "next/link";
import { AuthContext } from "@/supabase/client";
import { logout } from "@/supabase/auth";
import { isPrivileged } from "@/supabase/user";

export default function Main({ children }) {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const profileRef = useRef(null);
    const supabase = useContext(AuthContext)
    const [ privileged, setPrivileged ] = useState(false);
    
    useEffect(() => {
        async function getPrivileged() {
            const priv = await isPrivileged();
            setPrivileged(priv);
        }
        getPrivileged();
    })

    useEffect(function mount() {
        function closeEscape(event) {
            if (event.key == "Escape") {
                // Escape key pressed
                profileRef.current.open = false;
            }
        };

        window.addEventListener("keydown", closeEscape);
        return function unmount() {
            window.removeEventListener("keydown", closeEscape);
        }

    }, []);

    useEffect(() => {
        function escape(e) {
            document.querySelectorAll('.dropdown').forEach(function (dropdown) {
                if (!dropdown.contains(e.target)) {
                    // Click was outside the dropdown, close it
                    dropdown.open = false;
                }
            });
        }
        window.addEventListener('click', escape);

        return () => {
            window.removeEventListener('click', escape);
        }

    }, []);

    useEffect(() => {
        async function getUser() {
            const authId = (await supabase.auth.getUser())?.data.user.id;
            const user = await supabase.from('users').select('name').eq('auth_id', authId).maybeSingle();
            if (user.data) {
                const name = user?.data?.name;
                let initials = name.split(' ');
                initials.forEach((subname, i) => initials[i] = subname[0]);
                initials = initials.join('');
                user.data.initials = initials;
                setUser(user.data);
            }
        }
        if (supabase)
            getUser();
    }, [ supabase ]);

    return (
        <div className="grow h-screen flex flex-col bg-neutral-50 w-full">
            <div className="flex py-3 px-8 justify-between items-center">
                <div className="flex flex-row gap-2 h-full items-center justify-center">
                    <Link href="/">
                        <img className="h-[30px] justify-center" src="/logo_long.png" />
                    </Link>
                    <Link href="/myapo" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>calendar</h1>
                    </Link>
                    <Link href="/myprofile" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>my tracking</h1>
                    </Link>
                    <Link href="/request" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>request</h1>
                    </Link>
                    {privileged && 
                        <Link href="/excomm" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                            <h1>excomm</h1>
                        </Link>
                    }
                    <Link href="/tracking" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>track an event</h1>
                    </Link>
                    <Link href="/myevents" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>my events</h1>
                    </Link>
                    <Link href="/family" className="flex items-center h-[30px] hover:bg-neutral-300 transition ease-out rounded-xl px-2">
                        <h1>family tree</h1>
                    </Link>
                </div>
                <div className="flex items-center space-x-8">
                    <label className="bg-neutral-200 input input-bordered flex justify-between items-center gap-2 h-[40px] drop-shadow-sm hover:drop-shadow-lg rounded-full transition ease-out delay-20 duration-150">
                        <input type="text" className="placeholder:text-neutral-400 text-neutral-600 text-sm grow w-[200px]" placeholder="Search" />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                clipRule="evenodd" />
                        </svg>
                    </label>
                    <div className="dropdown dropdown-end dropdown-hover" ref={profileRef}>
                        <div tabIndex={0} role="button" className="avatar placeholder cursor-pointer">
                            <div className="bg-blue-800 hover:bg-blue-700 text-neutral-200 w-8 h-8 rounded-full shadow-lg">
                                <span className="text-sm">{user?.initials}</span>
                            </div>
                        </div>
                        <div tabIndex={0} className="dropdown-content menu bg-white z-50 shadow-lg rounded-lg p-4">
                            <div className="flex flex-col space-y-2">
                                <h1 className="text-nowrap text-neutral-600">{user?.name}</h1>
                                <Link href="/myprofile" className="w-full text-neutral-600 text-start">Profile</Link>
                                <Link href="/settings" className="w-full text-neutral-600 text-start">Settings</Link>
                                <button onClick={() => { logout(); }} className="w-full text-neutral-600 text-start">Log out</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-screen grow overflow-y-auto">
                <Sidebar visible={open} />
                <div className="flex grow bg-white shadow-lg rounded-tl-lg border border-neutral-200 border-[1.5px]">
                    <div className="mx-2">
                        <button className="relative group" onClick={() => setOpen(!open)}>
                            <div className={`relative flex overflow-hidden items-center justify-center rounded-full w-[30px] h-[30px] bg-white transform transition-all ring-0 ring-gray-300 hover:ring-8 ring-opacity-30 duration-200`}>
                                <div className={`flex flex-col justify-between w-[15px] h-[15px] transform transition-all duration-300 origin-center overflow-hidden`}>
                                    <div className={`bg-neutral-700 h-[2px] w-7 transform transition-all duration-300 origin-left delay-150`}>
                                    </div>
                                    <div className={`bg-neutral-700 h-[2px] w-7 rounded transform transition-all duration-300 }`}>
                                    </div>
                                    <div className={`bg-neutral-700 h-[2px] w-7 transform transition-all duration-300 origin-left delay-150`}>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                    {children}
                </div>
            </div >
        </div >
    )
}
