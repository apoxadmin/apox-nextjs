import { Rubik } from "next/font/google";
import MyAPONavbar from "@/components/MyAPONavbar";
import { createSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "./sidebar";
import Main from "./main";

const textFont = Rubik({ subsets: ["latin"] });

export const metadata = {
    title: "Alpha Phi Omega - Chi Chapter",
    description: "Be a leader. Be a friend. Be of service.",
};

export default async function RootLayout({ children }) {
    const supabase = createSupabaseServer();
    let { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');


    return (
        <Main>
            {children}
        </Main>
    );
}
