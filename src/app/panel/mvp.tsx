'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

export default function MVPPage() {
    const [users, setUsers] = React.useState<Array<any>>([]);
    const supabase = createClientComponentClient();

    React.useEffect(() => {
        async function fetchUsers() {
            const userList = (await supabase.from('users').select('*, roles ( name, shorthand ), standing ( name )')).data;
            console.log(userList);
            setUsers(userList);
        }
        fetchUsers()
    }, [])

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Term Service</TableHead>
                    <TableHead>Fundraising</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Dues</TableHead>
                    <TableHead>Flyering</TableHead>
                    <TableHead>Standing</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((data, i) => (
                    <TableRow key={i}>
                        <TableCell>{data['name']}</TableCell>
                        <TableCell>{data['email']}</TableCell>
                        <TableCell>{data['phoneNumber']}</TableCell>
                        <TableCell>{data['pledgeTerm']}</TableCell>
                        <TableCell>{data['serviceHoursTerm']}</TableCell>
                        <TableCell>{data['fundraising']}</TableCell>
                        <TableCell>{data['violations']}</TableCell>
                        <TableCell>{data['dues']}</TableCell>
                        <TableCell>{data['flyering']}</TableCell>
                        <TableCell>{data['standing'] ? data['standing']['name'] : 'none'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}