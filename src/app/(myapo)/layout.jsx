import { Rubik } from "next/font/google";
import MyAPONavbar from "@/components/MyAPONavbar";
import { createSupabaseServer } from "@/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Sidebar from "./myapo/sidebar";

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
  
  const user  = await supabase.from('users').select('name').eq('uid', data?.user.id).maybeSingle();
  if (user.error || !user?.data) {
    redirect('/login');
  }
  const name = user.data.name;
  let initials = name.split(' ');
  initials.forEach((subname, i) => initials[i] = subname[0]);
  initials = initials.join('');

  return (
    <div className="grow flex flex-col bg-neutral-50">
      <div className="flex py-3 px-8 justify-between items-center">
        <Link href="/">
          <img className="h-[30px]" src="/logo_long.png" />
        </Link>
        <div className="flex items-center space-x-8">
          <label className="bg-neutral-200 input input-bordered flex justify-between items-center gap-2 h-[40px] drop-shadow-sm hover:drop-shadow-lg rounded-full transition ease-out delay-20 duration-150">
            <input type="text" className="placeholder:text-neutral-400 text-neutral-600 text-sm grow w-[200px]" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70">
              <path
                fillRule="evenodd"
                d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                clipRule="evenodd" />
            </svg>
          </label>
          <div className="avatar placeholder cursor-pointer">
            <div className="bg-blue-800 hover:bg-blue-700 text-neutral-200 w-8 h-8 rounded-full shadow-lg">
              <span className="text-sm">{initials}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex grow">
        <div className="min-w-[180px]">
          <Sidebar />
        </div>
        <div className="grow bg-white shadow-lg rounded-tl-lg border border-neutral-200 border-[1.5px]">
          {children}
        </div>
      </div>
    </div>
  );
}
