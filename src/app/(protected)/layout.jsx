import { Rubik } from "next/font/google";
import MyAPONavbar from "@/components/MyAPONavbar";
import { createSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";

const textFont = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Alpha Phi Omega - Chi Chapter",
  description: "Be a leader. Be a friend. Be of service.",
};

export default async function RootLayout({ children }) {
  const supabase = createSupabaseServer();
  const { error, data } = await supabase.auth.getUser();
    if (error || !data?.user)
        redirect('/login');

  return (
    <>
     <MyAPONavbar />
     {children}
    </>
  );
}
