'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState } from "react";

function PledgeItem({ user }) {
    return (
        <div>
            <h1>{user?.name}</h1>
        </div>
    )
}

export default function ExCommPledgingPage() {
    const supabase = useContext(AuthContext);
    const [pledges, setPledges] = useState([]);

    async function getPledges() {
        const response = await supabase
            .from('users')
            .select('*, standings!inner(*)')
            .eq('standings.name', 'pledge');
        if (response.data) {
            const sortByName = (a, b) => sortByField(a, b, 'name')
            let data = response.data;
            data.sort(sortByName);
            setPledges(data);
        }
    }

    useEffect(() => {
        getPledges();
    }, [])

    return (
        <div>
            <h1 className="text-neutral-500 text-lg">Pledging Manager</h1>
            <div className="flex flex-col">
                {
                    pledges.map((user, i) => <PledgeItem key={i} user={user} />)
                }
            </div>
        </div>
    );
}
