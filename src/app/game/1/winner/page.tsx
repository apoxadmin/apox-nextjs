'use client'

import { TimePicker } from "@/components/ui/TimeRangePicker";
import { createClient } from "@/utils/supabase/client"
import { getMyUser } from "@/utils/supabase/userServerActions";
import { differenceInMilliseconds, isBefore, startOfDay, subMilliseconds } from 'date-fns';
import { difference } from "next/dist/build/utils";
import * as React from 'react';

export default function GamePage() {
    const supabase = createClient();
    const [entries, setEntries] = React.useState<Array<any>>([]);
    const [endTime, setEndTime] = React.useState<Date>(startOfDay(new Date()));

    React.useEffect(() => {
        async function fetchEntries() {
            const allEntries = await supabase.from('game').select('*, users(name)');
            setEntries(allEntries.data);
        }
        fetchEntries();
    }, []);

    const updateTimes = (end) => {
        let newEntries = [...entries];
        newEntries = newEntries.map((entry) => {
            console.log(entry);
            if (isBefore(end, entry.endTime)) {
                let newTime = differenceInMilliseconds(end, entry.startTime);
                if (newTime < 0)
                    newTime = 0;
                return { ...entry, time: newTime };
            }
            else {
                const newTime = differenceInMilliseconds(entry.endTime, entry.startTime);
                return { ...entry, time: newTime };
            }
        });
        setEntries(newEntries);
    }

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-10 md:py-24">
            <h1>
                leaderboard
            </h1>

            {
                entries.sort((a, b) => {
                    if (a.time < b.time) return -1;
                    else if (a.time > b.time) return 1;
                    return 0;
                }).reverse().map((entry, i) => <h1 key={i}>{entry.users.name}: {entry.time/1000}s</h1>)
            }

            <TimePicker value={endTime} onChange={value => { setEndTime(value); updateTimes(value); }}/>
        </main>
    )
}