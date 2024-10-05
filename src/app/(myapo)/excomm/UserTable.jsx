'use client'

import { AuthContext } from "@/supabase/client";
import { sortById, uppercase } from "@/utils/utils";
import { useContext, useEffect, useState } from "react";

const grid_cols_width = [
    'grid-cols-0',
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'grid-cols-6',
    'grid-cols-7',
    'grid-cols-8',
    'grid-cols-9',
    'grid-cols-10',
    'grid-cols-11',
    'grid-cols-12',
]

const col_span_width = [
    'col-span-0',
    'col-span-1',
    'col-span-2',
    'col-span-3',
    'col-span-4',
    'col-span-5',
    'col-span-6',
    'col-span-7',
    'col-span-8',
    'col-span-9',
    'col-span-10',
    'col-span-11',
    'col-span-12',
]

function UserRow({ user, creditRequirements }) {
    return (
        <div className={`[&>*]:px-2 [&>*]:overflow-x-auto grid grid-cols-subgrid ${col_span_width[creditRequirements.length + 3]} gap-x-1 divide-black text-center`}>
            <h1 className="text-start overflow-x-scroll text-nowrap">{user.name}</h1>
            <h1>{user.email}</h1>
            <h1 className="text-end">{uppercase(user.standings?.name || 'None')}</h1>
            {
                creditRequirements.map((req) => {
                    return (
                        <h1 className="text-end">
                            {
                                req.prefix
                            }
                            {
                                user[req.name] || '0'
                            }
                        </h1>
                    )
                })
            }
        </div>
    )
}

function compareName(a, b) {
    if (a.name < b.name) {
        return -1;
    } else if (a.name > b.name) {
        return 1;
    }
    return 0;
}

export default function UserTable() {
    const supabase = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [creditRequirements, setCreditRequirements] = useState([]);

    useEffect(() => {
        async function getUsers() {
            const usersResponse = await supabase
                .from('users')
                .select('*, standings!inner(*), class(*), credit_users_requirements(*), event_users_requirements(*)')
                .neq('standings.name', 'alumni');
            if (usersResponse.data) {
                let usersData = usersResponse.data;
                for (let user of usersData) {
                    for (let credit of user.credit_users_requirements) {
                        user[credit.name] = credit.value;
                    }
                    for (let event_req of user.event_users_requirements) {
                        user[event_req.name] = event_req.value;
                    }
                    delete user.credit_users_requirements;
                }
                usersData.sort(compareName);
                setUsers(usersData);
            }
        }
        async function getCreditRequirements() {
            const response = await supabase
                .from('credit_requirements')
                .select();
            if (response.data) {
                let data = response.data;
                data.sort(sortById);
                setCreditRequirements(data);
            }
        }
        getUsers();
        getCreditRequirements();
    }, []);

    return (
        <div className="flex flex-col items-center space-y-4 overflow-y-auto">
            <h1 className="text-center text-xl text-neutral-600">User Table</h1>
            <div className={`grid ${grid_cols_width[creditRequirements.length + 3]} w-full text-center`}>
                <h1 className="text-start">Name</h1>
                <h1>Email</h1>
                <h1 className="text-end">Standing</h1>
                {
                    creditRequirements.map((req, i) => {
                        return (
                            <h1 key={i} className="text-end">{uppercase(req.name)}</h1>
                        )
                    })
                }
            </div>
            <div className="overflow-y-scroll">
                <div className="flex flex-col items-center">
                    <div className={`grid ${grid_cols_width[creditRequirements.length + 3]}`}>
                        {
                            users.map((user, i) => {
                                return (
                                    <UserRow key={i} user={user} creditRequirements={creditRequirements} />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
