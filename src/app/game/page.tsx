'use client'

import { differenceInMilliseconds, subMilliseconds } from 'date-fns';
import * as React from 'react';

export default function GamePage() {
    const [startTime, setStartTime] = React.useState<Date>(null);
    const [endTime, setEndTime] = React.useState<Date>(null);
    const [longestTime, setLongestTime] = React.useState<number>(0);
    const [timeHeld, setTimeHeld] = React.useState<number>(0);
    const [pressing, setPressing] = React.useState<boolean>(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            if (pressing) {
                setTimeHeld(differenceInMilliseconds(new Date(), startTime));
            }
        }, 10);

        return () => clearInterval(interval);
    })

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-10 md:py-24">
            <h1>
                hi
            </h1>
            <h1>
                Longest Time: {longestTime/1000}s
            </h1>
            <h1>
                Current Time: {timeHeld/1000}s
            </h1>

            <button
                className="bg-lime-300 hover:bg-lime-400 p-10 rounded-full shadow-md select-none"
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
                    }
                }}
            >
                hold here ;)
            </button>
        </main>
    )
}