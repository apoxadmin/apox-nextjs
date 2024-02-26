import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TrackingPage from "./TrackingPage";

export default async function ProtectedTrackingPage() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

    return <TrackingPage />
}