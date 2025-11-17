import { Rubik } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { createSupabaseServer } from "@/supabase/server";

const textFont = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Alpha Phi Omega - Chi Chapter",
  description: "Be a leader. Be a friend. Be of service.",
};

export default async function RootLayout({ children }) {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <body className={textFont.className}>
        <Navbar user={data?.user} error={error} />
        {children}
      </body>
    </html>
  );
}