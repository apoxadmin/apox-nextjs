import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsPage from "./SettingsPage";

export default async function ProtectedSettingsPage() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

    return <SettingsPage />
}