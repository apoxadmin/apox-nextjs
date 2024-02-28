'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FaUserCircle } from "react-icons/fa";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { IoMdSettings } from "react-icons/io";
import { FiLogOut } from "react-icons/fi";
import { navigate } from "@/lib/actions";
import { getMyUser } from "@/utils/supabase/userServerActions";
import React from "react";
import { logout } from "@/utils/supabase/authServerActions";

export default function ProfileButton({ className }: { className?: string }) {
    const [userData, setUserData] = React.useState<any>();

    React.useEffect(() => {
        async function fetchUserData() {
            setUserData(await getMyUser());
        }
        fetchUserData();
    }, [])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={
                cn("outline-none", className)
            }>
                <FaUserCircle className="text-3xl text-indigo-400 hover:cursor-pointer hover:text-indigo-300 transition ease-in-out delay-50 duration-200"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-indigo-500">
                    { userData?.name }
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {
                        navigate('/profile');
                    }}
                        className="flex items-center space-x-2 hover:cursor-pointer hover:bg-neutral-100 transition ease-in-out delay-50 duration-200">
                        <HiUser className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">My Profile</h1>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2 hover:cursor-pointer hover:bg-neutral-100 transition ease-in-out delay-50 duration-200">
                        <HiUserGroup className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">My Family</h1>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {
                        navigate('/settings');
                    }}
                        className="flex items-center space-x-2 hover:cursor-pointer hover:bg-neutral-100 transition ease-in-out delay-50 duration-200">
                        <IoMdSettings className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">Settings</h1>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {
                            logout();
                        }}
                        className="flex items-center space-x-2 hover:!cursor-pointer hover:cursor-pointer hover:bg-neutral-100 transition ease-in-out delay-50 duration-200">
                        <FiLogOut className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">Log out</h1>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}