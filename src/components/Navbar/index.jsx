import { createSupabaseServer } from "@/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/logout";

export default async function Navbar() {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();

  return (
    <div className="sticky top-0 z-10 flex items-center justify-between space-x-8 p-4 md:px-8 w-full border-b-[2px] shadow-sm bg-white">
      <Link href="/">
        <img className="h-[30px]" src="/logo_long.png" alt="APO Logo" />
      </Link>

      <div className="flex items-center divide-x-[1.5px] [&>*]:px-4">
        {/* Left nav links */}
        <div className="flex space-x-4 items-center">
          <Link className="text-sm hover:text-neutral-400" href="/">
            Home
          </Link>
          <Link className="text-sm hover:text-neutral-400" href="/Excomm">
            Excomm
          </Link>
          {error || !data?.user ? null : (
            <Link className="text-sm hover:text-neutral-400" href="/myapo">
              MyAPO
            </Link>
          )}
        </div>

        {/* Right buttons */}
        <div className="flex space-x-4 items-center">
          {/* Rush button as a Link */}
          <Link
            href="/Rush"
            className="btn btn-sm px-2 h-[5px] text-blue-600 bg-blue-100 border-none hover:bg-blue-400 hover:text-white"
          >
            Rush
          </Link>

          {error || !data?.user ? (
            <Link className="text-sm hover:text-neutral-400" href="/login">
              Log in
            </Link>
          ) : (
            <LogoutButton />
          )}
        </div>
      </div>
    </div>
  );
}