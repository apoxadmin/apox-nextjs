import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FaUserCircle } from "react-icons/fa";
import { HiUser, HiUserGroup } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { navigate } from "@/lib/actions";
import { useAuth } from "@/lib/AuthProvider";

export default function ProfileButton({ className }: { className?: string }) {
    const supabase = createClientComponentClient();
    const { userData } = useAuth();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={
                cn("outline-none", className)
            }>
                <FaUserCircle className="text-3xl text-indigo-400 hover:cursor-pointer hover:text-indigo-300"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel className="text-indigo-500">
                    { userData?.name }
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {
                        navigate('/profile');
                    }}
                        className="flex items-center space-x-2">
                        <HiUser className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">My Profile</h1>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center space-x-2">
                        <HiUserGroup className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">My Family</h1>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => {
                        console.log('signed out');
                            supabase.auth.signOut();
                            
                            navigate('/login');
                        }}
                        className="flex items-center space-x-2 hover:!cursor-pointer">
                        <FiLogOut className="text-lg text-gray-600"/>
                        <h1 className="text-gray-600">Log out</h1>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}