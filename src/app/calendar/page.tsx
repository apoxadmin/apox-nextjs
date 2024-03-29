import { createClientServer } from "@/utils/supabase/server"
import { redirect } from "next/navigation";
import CalendarPage from "./CalendarPage";

export default async function ProtectedCalendar() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

    return <CalendarPage />
}