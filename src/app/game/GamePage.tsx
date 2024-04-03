'use client'

import { createClient } from "@/utils/supabase/client"
import { getMyUser } from "@/utils/supabase/userServerActions";
import { differenceInMilliseconds, subMilliseconds } from 'date-fns';
import * as React from 'react';

export default function GamePage() {
    const [startTime, setStartTime] = React.useState<Date>(null);
    const [endTime, setEndTime] = React.useState<Date>(null);
    const [longestTime, setLongestTime] = React.useState<number>(0);
    const [timeHeld, setTimeHeld] = React.useState<number>(0);
    const [pressing, setPressing] = React.useState<boolean>(false);
    const supabase = createClient();
    const [userData, setUserData] = React.useState<any>(null);

    React.useEffect(() => {
        async function fetchData() {
            const data = await getMyUser();
            setUserData(data);
            const entry: any = await supabase.from('game').select().eq('user_id', data.id).maybeSingle();
            if (entry.data) {
                setLongestTime(entry.data.time);
            }
        }
        fetchData();
    }, []);

    async function upsertEntry(start, end, time) {
        await supabase.from('game').upsert({ user_id: userData.id, startTime: start, endTime: end, time: time });
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (pressing) {
                setTimeHeld(differenceInMilliseconds(new Date(), startTime));
            }
        }, 10);

        return () => clearInterval(interval);
    });

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-10 px-6 md:py-24">
            <div
                className="flex flex-col space-y-2 items-center"
            >
                <h1 className="text-xl font-bold text-center">
                    hold and win something? game
                </h1>
                <h1 className="italic">
                    chat is this real?
                </h1>
            </div>
            <div className="flex flex-col items-center max-w-sm text-center">
                <h1 className="underline">
                    Rules:
                </h1>
                <h1 className="text-neutral-600">
                    Your time gets logged once you release.
                </h1>
                <h1 className="text-neutral-600">
                    The time will be capped at end of meeting. Any time after that is discarded.
                </h1>
                <h1 className="text-neutral-600">
                    You can have multiple tries, but they will not add.
                </h1>
            </div>
            <div
                className="flex flex-col items-center space-y-2"
            >
                <h1 className="underline">
                    Your longest time: {longestTime/1000}s
                </h1>
                <h1>
                    Current time: {timeHeld/1000}s
                </h1>
            </div>

            <button
                className="bg-lime-300 hover:bg-lime-400 p-10 shadow-md select-none"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setStartTime(new Date());
                    setPressing(true);
                }}
                onMouseUp={(e) => {
                    setPressing(false);
                    e.preventDefault();
                    const end = new Date()
                    setEndTime(end);
                    if (timeHeld > longestTime) {
                        setLongestTime(timeHeld);
                        upsertEntry(startTime, end, timeHeld);
                    }
                }}
                onTouchStart={(e) => {
                    setPressing(true);
                    e.preventDefault();
                    setStartTime(new Date());
                }}
                onTouchEnd={(e) => {
                    setPressing(false);
                    e.preventDefault();
                    const end = new Date()
                    setEndTime(end);
                    if (timeHeld > longestTime) {
                        setLongestTime(timeHeld);
                        upsertEntry(startTime, end, timeHeld);
                    }
                }}
            >
                hold me ;)
            </button>
        </main>
    )
}