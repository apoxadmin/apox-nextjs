'use client'

import { useAuth } from "@/lib/AuthProvider"
import { navigate } from "@/lib/actions";
import { stringToCapital } from "@/lib/utils";
import { useEffect } from "react";
import MVPPage from "./mvp";
import Navbar from "@/components/Navbar";

export default function PanelPage() {
    const { userData } = useAuth();

    return (
        userData ? 
        <div className="flex flex-col overflow-y-hidden space-y-8 w-full py-8 px-1 md:p-8">
            <h1 className="text-center text-lg md:text-2xl">{stringToCapital(userData.roles.name)}</h1>
            <div className="h-full overflow-x-scroll bg-white rounded-lg shadow-lg border border-gray-500">
                {
                    userData.roles.name == 'membership vice president' && <MVPPage />
                }
            </div>
        </div>
        :
        <></>
    )
}