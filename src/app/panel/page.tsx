'use client'

import { useAuth } from "@/lib/AuthProvider"
import { navigate } from "@/lib/actions";
import { stringToCapital } from "@/lib/utils";
import { useEffect } from "react";
import MVPPage from "./mvp";
import Navbar from "@/components/Navbar";
import FellowshipPage from "./fellowship";
import ServicePage from "./service";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PanelPage() {
    const { userData } = useAuth();

    return (
        userData ? 
        <div className="flex flex-col items-center space-y-8 w-full h-[90vh] py-8 px-1 md:p-8">
            <h1 className="text-center text-lg md:text-2xl">{stringToCapital(userData.roles.name)}</h1>
            <div className="flex flex-col items-center w-full h-full bg-white rounded-lg shadow-lg border border-gray-500">
                <ScrollArea>
                    {
                        userData.roles.name == 'membership vice president' && <MVPPage />
                    }
                    {
                        userData.roles.name == 'fellowship vice president' && <FellowshipPage />
                    }
                    {
                        userData.roles.name == 'service vice president' && <ServicePage />
                    }
                </ScrollArea>
            </div>
        </div>
        :
        <></>
    )
}