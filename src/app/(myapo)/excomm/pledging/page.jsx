'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState } from "react";
import { sortByField } from "@/utils/utils";

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
        //<iframe style={{ height: '90vh', width: '100%' }} src="https://crosshare.org/embed/1F59rdwk1AWkuoWNqkxl/bwCzYQ572xSmI8eVVgTwbd2fe1Q2" frameborder="0" allowfullscreen="true" allowtransparency="true" allow="clipboard-write *"></iframe>
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
