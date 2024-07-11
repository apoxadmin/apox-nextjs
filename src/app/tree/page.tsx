import { createClientServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import TreePage from "./TreePage";

export default async function ProtectedTreePage() {
    const supabase = createClientServer();
    const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

    return <TreePage />
}