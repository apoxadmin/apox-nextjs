'use client'

import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import ProfileButton from "@/components/Navbar/ProfileButton";
import React from "react";
import SearchPopup from "./SearchPopup";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function NavbarAuthComponents() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

    if (isDesktop) return (
        <div className="flex-1 flex items-center justify-between lg:space-x-4 xl:space-x-8">
            <div className="flex items-center space-x-4 xl:space-x-8 text-neutral-700">
                <Link href="/calendar" className="text-nowrap hover:text-neutral-400 text-xs xl:text-sm transition ease-in-out delay-50 duration-200">
                    Calendar
                </Link>
                <Link href="/request" className="text-nowrap hover:text-neutral-400 text-xs xl:text-sm transition ease-in-out delay-50 duration-200">
                    Request Event
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h1 className="hover:cursor-pointer text-nowrap hover:text-neutral-400 text-xs xl:text-sm transition ease-in-out delay-50 duration-200">
                            Tracking
                        </h1>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <Link
                                href="https://docs.google.com/forms/d/12b661PLFSB1OjCJdqfbWCkNwheecku7QL1mhI69AVno/edit"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                    Tracker Form
                                </DropdownMenuItem>
                            </Link>
                            <Link
                                href="https://docs.google.com/spreadsheets/d/18wH_HM7tL7dOlKdBX_Q5ajdV7g5sgi5bTzEkLhcy1G0/edit?usp=sharing"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                    Tracker Sheet
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h1 className="hover:cursor-pointer text-nowrap hover:text-neutral-400 text-xs xl:text-sm transition ease-in-out delay-50 duration-200">
                            Other Links
                        </h1>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>
                            Service
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link
                                href="https://docs.google.com/forms/d/e/1FAIpQLSffGJxd3b8ZcbAxPkmgGkK0aD7rRWZxe-6CVrQutVUBWHPQnA/viewform"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Outside Service
                                </DropdownMenuItem>
                                
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                            Finance
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link
                                href="https://forms.gle/PG2sms3xvExqKKHF8"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                    Regular Reimbursement
                                </DropdownMenuItem>
                                
                            </Link>
                            <Link
                                href="https://forms.gle/qeAW96j7RGaJcDFF9"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                    Gas Reimbursement
                                </DropdownMenuItem>
                                
                            </Link>
                            <Link
                                href="https://forms.gle/2s1tB1fFPAYBHwDV6"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                    Uber/Lyft/Zipcar Reimbursement
                                </DropdownMenuItem>
                                
                            </Link>
                            
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                            Membership
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link
                                href="https://docs.google.com/spreadsheets/d/1L23dBnENkw42WH74zyYD-SJHFSCoZeVRsxQ06nkBsUs/edit?usp=sharing"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                FAMBLING
                                </DropdownMenuItem>
                                
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>
                            Sergeant-at-Arms
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link
                                href="https://docs.google.com/document/d/1NIAmVc5yme_LJf0Mn5JywE2cG74meiMBYvCoUmAaMKw/edit"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Chairing Guidelines
                                </DropdownMenuItem>
                                
                            </Link>
                            <Link
                                href="https://docs.google.com/forms/d/1jGWF0i9-4-LmPOWYw6YI_QpRap36Nm088AmH-IgdnAA/edit"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Rule Violations
                                </DropdownMenuItem>
                                
                            </Link>
                            <Link
                                href="https://docs.google.com/forms/d/1jbeOIRl14rA0U9VWPdED-JVkqIrnElnb_7t0LAdnvp4/edit"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Off-Campus Waiver
                                </DropdownMenuItem>
                                
                            </Link>
                            <Link
                                href="https://docs.google.com/forms/d/13XsJq4FFcqMfFtpTjVNXaDe6NvaexsgD2aqIhtqeQH8/edit"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Lost Pins Form
                                </DropdownMenuItem>
                                
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuLabel>
                            Historian
                        </DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <Link
                                href="https://drive.google.com/drive/folders/11F5MDTmAYoC5Xo14I6lVtVwvxBRRjgeB?usp=sharing"
                                className="text-nowrap text-xs xl:text-sm transition ease-in-out delay-50 duration-200"
                                target="_blank"
                            >
                                <DropdownMenuItem className="hover:cursor-pointer hover:bg-neutral-100">
                                Collaborative Drive
                                </DropdownMenuItem>
                                
                            </Link>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex space-x-8">
                <Input 
                    placeholder="Search"
                    onClick={() => { setSearchOpen(true)}}
                    readOnly
                    className="h-[32px] hover:cursor-pointer hover:ring-2 ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-sm max-w-[150px] lg:max-w-[400px] transition ease-in-out delay-50 duration-200"/>
                <ProfileButton />
                <SearchPopup searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
            </div>
        </div>
    )

    return (<>
            <Input 
                placeholder="Search"
                onClick={() => { setSearchOpen(true)}}
                readOnly
                className="h-[32px] hover:cursor-pointer hover:ring-2 hover:ring-indigo-400 focus:!ring-transparent shadow-sm hover:drop-shadow-md text-xs max-w-[150px] sm:max-w-[400px] transition ease-in-out delay-50 duration-200"/>
            <ProfileButton />
            <SearchPopup searchOpen={searchOpen} setSearchOpen={setSearchOpen} />
    </>
    )
}