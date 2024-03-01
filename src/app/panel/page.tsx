import { navigate } from "@/lib/actions";
import { stringToCapital } from "@/lib/utils";
import { useEffect } from "react";
import MVPPage from "./mvp";
import Navbar from "@/components/Navbar";
import FellowshipPage from "./fellowship";
import ServicePage from "./service";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import FinancePage from "./finance";
import PPPage from "./pp";
import ICPage from "./ic";

export default async function PanelPage() {
    const supabase = createClientServer();

    const authData = await supabase.auth.getUser();
    if (authData.error || !authData.data?.user)
        redirect('/login');
    const userQuery = await supabase.from('users').select('roles!users_role_fkey (name)').eq('uid', authData.data.user.id).maybeSingle();
    if (userQuery.error || !userQuery.data || !userQuery.data.roles)
        redirect('/calendar');
    const roles: any = userQuery.data.roles;

    return (
        userQuery ? 
        <div className="flex flex-col items-center space-y-8 w-full h-[90vh] py-8 px-1 md:p-8">
            <div>
                <h1 className="text-center md:text-xl">Welcome back,</h1>
                <h1 className="text-center text-lg md:text-2xl font-medium">{stringToCapital(roles.name)}</h1>
            </div>
            <div className="w-full">
                {
                    roles.name == 'membership vice president' && <MVPPage />
                }
                {
                    roles.name == 'fellowship vice president' && <FellowshipPage />
                }
                {
                    roles.name == 'service vice president' && <ServicePage />
                }
                {
                    roles.name == 'finance vice president' && <FinancePage />
                }
                {
                    roles.name == 'pledge parent' && <PPPage />
                }
                {
                    roles.name == 'interchapter chair' && <ICPage />
                }
                {
                    roles.name == 'administrative vice president' && <MVPPage />
                }
            </div>
        </div>
        :
        <></>
    )
}