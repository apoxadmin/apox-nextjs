import { createSupabaseServer } from "@/supabase/server";
import Link from "next/link";
import LogoutButton from "@/components/logout";

export default async function MyAPONavbar() {
    const supabase = createSupabaseServer();
    const { data, error } = await supabase.auth.getUser();

    return (
        <div className="sticky top-0 z-25 flex items-center justify-between space-x-8 p-4 md:px-8 w-full border-b-[2px] shadow-sm z-10 bg-white">
            <Link href="/">
                <img className="h-[30px]" src="/logo_long.png" />
            </Link>
            <div className="flex items-center divide-x-[1.5px] [&>*]:px-4">
                <div className="flex space-x-4 items-center">
                    <Link className="text-sm hover:text-neutral-400" href="/family">
                        Family
                    </Link>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link className="text-sm hover:text-neutral-400" href="/">
                        Home
                    </Link>
                    {
                        error || !data?.user
                        ?
                        <></>
                        :
                        <Link className="text-sm hover:text-neutral-400" href="/myapo">
                            MyAPO
                        </Link>
                    }
                </div>
                <div className="flex space-x-4 items-center">
                    <button
                        className="btn btn-sm px-2 h-[5px] text-blue-600 bg-blue-100 border-none hover:bg-blue-400 hover:text-white"
                    >
                        Rush
                    </button>
                {
                    error || !data?.user
                    ?
                    <>
                    </>
                    :
                    <LogoutButton />
                }
                </div>
            </div>
        </div>
    )
}