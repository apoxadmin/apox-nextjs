import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList, 
    CommandSeparator
} from "@/components/ui/command";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";

import { FaWpforms } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaGoogleDrive, FaRegUser } from "react-icons/fa6";
import { navigate } from "@/lib/actions";
import { FaChessKnight } from "react-icons/fa6";
import { BsCalendar2CheckFill } from "react-icons/bs";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { SiGooglesheets, SiGoogleforms } from "react-icons/si";
import { MdOutlineMedicalServices } from "react-icons/md";
import { MdCasino } from "react-icons/md";
import { FaUber } from "react-icons/fa";
import { FaGasPump } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import { PiArmchairFill } from "react-icons/pi";
import { MdError } from "react-icons/md";
import { MdPermDeviceInformation } from "react-icons/md";
import { FaMapPin } from "react-icons/fa";

export function CommandListSearch({ user, searchOpen, setSearchOpen }) {
    return (
        <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
            {
                user?.roles && <>
                <CommandSeparator />
                <CommandItem onSelect={() => { navigate('/panel'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaChessKnight className="text-base"/>
                    <h1 className="text-base">ExComm Panel</h1>
                </CommandItem>
                </>
            }
            <CommandItem onSelect={() => { navigate('/calendar'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                <IoCalendarNumberOutline className="text-lg"/>
                <h1 className="text-base">Calendar</h1>
            </CommandItem>
            <CommandItem onSelect={() => { navigate('/request'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                <FaWpforms className="text-base"/>
                <h1 className="text-base">Request Event</h1>
            </CommandItem>
            <Link
                href="https://docs.google.com/forms/d/12b661PLFSB1OjCJdqfbWCkNwheecku7QL1mhI69AVno/edit"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <SiGoogleforms className="text-lg"/>
                    <h1 className="text-base">Tracker Form</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/spreadsheets/d/18wH_HM7tL7dOlKdBX_Q5ajdV7g5sgi5bTzEkLhcy1G0/edit?usp=sharing"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <SiGooglesheets className="text-lg"/>
                    <h1 className="text-base">Tracker Sheet</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://drive.google.com/drive/folders/11F5MDTmAYoC5Xo14I6lVtVwvxBRRjgeB?usp=sharing"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaGoogleDrive className="text-lg"/>
                    <h1 className="text-base">Collaborative Drive</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSffGJxd3b8ZcbAxPkmgGkK0aD7rRWZxe-6CVrQutVUBWHPQnA/viewform"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <MdOutlineMedicalServices className="text-lg"/>
                    <h1 className="text-base">Outside Service</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://forms.gle/PG2sms3xvExqKKHF8"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <GiMoneyStack className="text-lg"/>
                    <h1 className="text-base">Regular Reimbursement</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://forms.gle/qeAW96j7RGaJcDFF9"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaGasPump className="text-lg"/>
                    <h1 className="text-base">Gas Reimbursement</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://forms.gle/2s1tB1fFPAYBHwDV6"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaUber className="text-lg"/>
                    <h1 className="text-base">Uber/Lyft/Zipcar Reimbursement</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/spreadsheets/d/1L23dBnENkw42WH74zyYD-SJHFSCoZeVRsxQ06nkBsUs/edit?usp=sharing"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <MdCasino className="text-lg"/>
                    <h1 className="text-base">FAMBLING</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/document/d/1NIAmVc5yme_LJf0Mn5JywE2cG74meiMBYvCoUmAaMKw/edit"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <PiArmchairFill className="text-lg"/>
                    <h1 className="text-base">Chairing Guidelines</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/forms/d/1jGWF0i9-4-LmPOWYw6YI_QpRap36Nm088AmH-IgdnAA/edit"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <MdError className="text-lg"/>
                    <h1 className="text-base">Rule Violations</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/forms/d/1jbeOIRl14rA0U9VWPdED-JVkqIrnElnb_7t0LAdnvp4/edit"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <MdPermDeviceInformation className="text-lg"/>
                    <h1 className="text-base">Waiver</h1>
                </CommandItem>
            </Link>
            <Link
                href="https://docs.google.com/forms/d/13XsJq4FFcqMfFtpTjVNXaDe6NvaexsgD2aqIhtqeQH8/edit"
                target="_blank"
            >
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaMapPin className="text-lg"/>
                    <h1 className="text-base">Lost Pins Form</h1>
                </CommandItem>
            </Link>
            </CommandGroup>
        </CommandList>
    )
}

export default function SearchPopup({ searchOpen, setSearchOpen }) {
    const [open, setOpen] = React.useState(false);
    const [user, setUser] = React.useState<any>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const supabase = createClient();

    React.useEffect(() => {
        async function fetchUser() {
            const userAuth = await supabase.auth.getUser();
            const userQuery = await supabase.from('users').select('roles!users_role_fkey (name)').eq('uid', userAuth.data.user.id).maybeSingle();
            if (userQuery.data) {
                setUser(userQuery.data);
            }
        }
        fetchUser();
    }, []);
   
    if (isDesktop) {
      return (
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
            <CommandInput className="text-base" placeholder="Search..." />
            <CommandListSearch user={user} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
        </CommandDialog>
      )
    }
   
    return (
      <Drawer open={searchOpen} onOpenChange={setSearchOpen}>
        <DrawerContent className="h-3/5">
          <Command>
            <CommandInput className="text-[16px]" placeholder="Type a command or search..." />
            <CommandListSearch user={user} searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
          </Command>
        </DrawerContent>
      </Drawer>
    )
}