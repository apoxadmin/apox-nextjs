import { redirect } from "next/navigation";
import GamePage from "./GamePage";
import { createClientServer } from "@/utils/supabase/server";

export default async function ProtectedCalendar() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

    return <GamePage />
}