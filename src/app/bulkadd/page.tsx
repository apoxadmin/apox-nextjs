import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import BulkAddPage from "./BulkAdd";

export default async function ProtectedPage() {
    const supabase = createClientServer();

    const authData = await supabase.auth.getUser();
    if (authData.error || !authData.data?.user)
        redirect('/login');
    const userData = await supabase.from('users').select('roles(*)').eq('uid', authData.data.user.id).maybeSingle();
    if (userData.error || !userData?.data?.roles) {
        redirect('/calendar');
    }

    return (
        <BulkAddPage />
    )
}