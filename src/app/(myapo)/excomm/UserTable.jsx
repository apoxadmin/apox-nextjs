'use client'

import { AuthContext } from "@/supabase/client";
import { uppercase } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";

function UserRow({ user }) {
    return (
        <div className="[&>*]:px-2 [&>*]:overflow-x-auto grid grid-cols-subgrid col-span-7 gap-x-1 divide-black text-center">
            <h1 className="text-start overflow-x-scroll text-nowrap">{user.name}</h1>
            <h1>{user.email}</h1>
            <h1>{uppercase(user.standings?.name || 'None')}</h1>
            <h1>
                {
                    user.service || '0'
                }
                &nbsp;hours
            </h1>
            <h1>
                $
                {
                    user.fundraising || '0'
                }
            </h1>
            <h1>
                {
                    user.chairing || '0'
                }
                &nbsp;chairs
            </h1>
            <h1>
                {
                    user.rush || '0'
                }
                &nbsp;rush
            </h1>
        </div>
    )
}

export default function UserTable() {
    const supabase = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {
            const usersResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*)')
                .neq('standings.name', 'alumni')
            if (usersResponse.data) {
                let usersData = usersResponse.data;
                for (let user of usersData) {
                    for (let credit of user.credit_users_requirements) {
                        user[credit.name] = credit.value;
                    }
                    delete user.credit_users_requirements;
                }
                setUsers(usersData);
            }
        }
        getUsers();
    });

    return (
        <div className="flex flex-col items-center">
            <div className="grid grid-cols-7">
                {
                    users.map((user, i) => {
                        return (
                            <UserRow user={user} key={i} />
                        )
                    })
                }
            </div>
        </div>
    )
}
