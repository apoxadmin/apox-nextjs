'use client'

import { Input } from "@/components/ui/input";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { FaRegUser } from "react-icons/fa6";
import React from "react";
import { FaWpforms } from "react-icons/fa";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
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
  import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "../ui/button";

  export function DrawerDialogDemo({ searchOpen, setSearchOpen }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")
   
    if (isDesktop) {
      return (
        <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <IoCalendarNumberOutline className="text-base"/>
                    <h1>Calendar</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaRegUser className="text-base"/>
                    <h1>Members</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaWpforms className="text-base"/>
                    <h1>Event Request Form</h1>
                </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
      )
    }
   
    return (
      <Drawer open={searchOpen} onOpenChange={setSearchOpen}>

        <DrawerContent className="h-1/2">
          <Command>
            <CommandInput className="text-[16px]" placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <IoCalendarNumberOutline className="text-lg"/>
                    <h1 className="text-base">Calendar</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaRegUser className="text-base"/>
                    <h1 className="text-base">Members</h1>
                </CommandItem>
                <CommandItem className="flex space-x-2 items-center text-neutral-400 transition ease-in-out delay-50 duration-200">
                    <FaWpforms className="text-base"/>
                    <h1 className="text-base">Event Request Form</h1>
                </CommandItem>
                </CommandGroup>
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    )
  }

export default function Navbar() {
    const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    return (
        <div className="flex items-center justify-between p-4 md:px-8 w-full border-b-[2px] shadow-sm z-10">
            <img className="h-[30px]" src="/logo.png" />
            <div className="hidden md:flex items-center space-x-4 md:space-x-8">
                <Input 
                    placeholder="Search"
                    onClick={() => { setSearchOpen(true)}}
                    readOnly
                    className="h-[28px] hover:cursor-pointer hover:ring-2 hover:ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-xs max-w-[150px] md:max-w-[200px] transition ease-in-out delay-50 duration-200"/>
                <FaUserCircle className="text-3xl text-indigo-400 hover:cursor-pointer hover:text-indigo-300"/>
            </div>
            <Input 
                placeholder="Search"
                onClick={() => { setSearchOpen(true)}}
                readOnly
                className="md:hidden h-[28px] hover:cursor-pointer hover:ring-2 hover:ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-xs max-w-[150px] md:max-w-[200px] transition ease-in-out delay-50 duration-200"/>
            <FaUserCircle className="md:hidden text-3xl text-indigo-400 hover:cursor-pointer hover:text-indigo-300"/>
            <DrawerDialogDemo searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            {/* <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Suggestions">
                        <CommandItem className="flex space-x-2 text-neutral-400 transition ease-in-out delay-50 duration-200">
                            <IoCalendarNumberOutline className="text-base"/>
                            <h1>Calendar</h1>
                        </CommandItem>
                        <CommandItem className="flex space-x-2 text-neutral-400 transition ease-in-out delay-50 duration-200">
                            <FaRegUser className="text-base"/>
                            <h1>Members</h1>
                        </CommandItem>
                        <CommandItem className="flex space-x-2 text-neutral-400 transition ease-in-out delay-50 duration-200">
                            <FaWpforms className="text-base"/>
                            <h1>Event Request Form</h1>
                        </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </CommandDialog> */}
        </div>
    )
}