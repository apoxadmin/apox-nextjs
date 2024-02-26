import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import MemberTable from "./MemberTable";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ProtectedMembersPage() {
    const supabase = createClientServer();

    const authData = await supabase.auth.getUser();
    if (authData.error || !authData.data?.user)
        redirect('/login');

    return (
        <div className="flex flex-col items-center px-2 py-10 space-y-8">
            <h1 className="text-2xl md:text-3xl text-indigo-800 font-medium">Member Tracking</h1>
            <MemberTable />
        </div>
    )
}