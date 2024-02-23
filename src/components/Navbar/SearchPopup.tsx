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
    CommandList 
} from "@/components/ui/command";
import { useMediaQuery } from "@/hooks/use-media-query";
import React from "react";

import { FaWpforms } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa6";
import { navigate } from "@/lib/actions";
import { FaChessKnight } from "react-icons/fa6";
import { BsCalendar2CheckFill } from "react-icons/bs";

export function SearchPopup({ searchOpen, setSearchOpen }) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
   
    if (isDesktop) {
      return (
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
            <CommandInput className="text-base" placeholder="Search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => { navigate('/calendar'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <IoCalendarNumberOutline className="text-lg"/>
                    <h1 className="text-base">Calendar</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaRegUser className="text-lg"/>
                    <h1 className="text-base">Members</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/request'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaWpforms className="text-lg"/>
                    <h1 className="text-base">Event Request Form</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/track'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <BsCalendar2CheckFill className="text-lg"/>
                    <h1 className="text-base">Tracker Form</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/panel'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaChessKnight className="text-base"/>
                    <h1 className="text-base">ExComm Panel</h1>
                </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
      )
    }
   
    return (
      <Drawer open={searchOpen} onOpenChange={setSearchOpen}>
        <DrawerContent className="h-3/5">
          <Command>
            <CommandInput className="text-[16px]" placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                <CommandItem onSelect={() => { navigate('/calendar'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <IoCalendarNumberOutline className="text-lg"/>
                    <h1 className="text-base">Calendar</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaRegUser className="text-base"/>
                    <h1 className="text-base">Members</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/request'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaWpforms className="text-base"/>
                    <h1 className="text-base">Request Event</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/track'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <BsCalendar2CheckFill className="text-lg"/>
                    <h1 className="text-base">Event Tracker</h1>
                </CommandItem>
                <CommandItem onSelect={() => { navigate('/panel'); setSearchOpen(false); }} className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaChessKnight className="text-base"/>
                    <h1 className="text-base">ExComm Panel</h1>
                </CommandItem>
                </CommandGroup>
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    )
}