'use client'

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllUsers } from "@/lib/supabase/client";
import React from "react";

export default function UserSearchbar({ attendees, flakeIns, setFlakeIns }) {
    const [searchValue, setSearchValue] = React.useState<string>("");
    const [users, setUsers] = React.useState<Array<any>>([]);
    const [filteredUsers, setFilteredUsers] = React.useState<Array<any>>([]);

    React.useEffect(() => {
        async function fetchUsers() {
            let users = await getAllUsers();
            users.sort((a, b) => {
                const names1 = a.name.split(' ');
                const names2 = b.name.split(' ');
                if (names1[0].startsWith(name) && names2[0].startsWith(name)) {
                    if (names1[0] < names2[0]) {
                        return -1;
                    } else {
                        return 1
                    }
                } else if (names1[0].startsWith(name)) {
                    return -1;
                } else if (names2[0].startsWith(name)) {
                    return 1;
                } else if (names1.length > 1 && names2.length > 1) {
                    if (names1[1] < names2[1])
                        return -1;
                    else if (names1[1] > names2[1])
                        return 1;
                }
        
                return 0;
            });
            setUsers(users);
        }
        fetchUsers();
    }, []);

    React.useEffect(() => {
        if (attendees && flakeIns) {
            const attendeeIds = attendees.map((attendee) => attendee.id);
            const flakeInIds = flakeIns.map((flakeIn) => flakeIn.id);
            setFilteredUsers(users.filter((user) => !attendeeIds.includes(user.id) && !flakeInIds.includes(user.id)));
        }
    }, [users, attendees, flakeIns]);

    return (
        <div className="flex flex-col space-y-4 items-center">
            <h1>Flake-ins</h1>
            <Command className="rounded-lg border hover:shadow-md max-w-[200px] transition ease-in-out delay-50 duration-200">
                <CommandInput className="group" value={searchValue} onValueChange={setSearchValue} placeholder="Search for users..." />
                
                <ScrollArea className="h-[200px]">
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                        { filteredUsers.map((user, i) => <CommandItem onSelect={() => { setFlakeIns([...flakeIns, user]); setFilteredUsers(filteredUsers.filter((u) => u.id != user.id)) }} key={i}>{user.name}</CommandItem>)}
                    </CommandGroup>
                    
                </ScrollArea>
            </Command>
        </div>
    )
}