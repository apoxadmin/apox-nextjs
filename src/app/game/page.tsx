'use client'

import { differenceInMilliseconds, subMilliseconds } from 'date-fns';
import * as React from 'react';

export default function GamePage() {
    const [startTime, setStartTime] = React.useState<Date>(null);
    const [endTime, setEndTime] = React.useState<Date>(null);
    const [timeHeld, setTimeHeld] = React.useState<number>(0);

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-10 md:py-24">
            <h1>
                hi
            </h1>
            <h1>
                Longest Held: {timeHeld/1000}s
            </h1>

            <button
                className="bg-lime-300 hover:bg-lime-400 p-10 rounded-full shadow-md select-none"
                onMouseDown={(e) => {
                    e.preventDefault();
                    setStartTime(new Date());
                }}
                onMouseUp={(e) => {
                    e.preventDefault();
                    const end = new Date()
                    setEndTime(end);
                    setTimeHeld(differenceInMilliseconds(end, startTime));
                }}
                onTouchStart={(e) => {
                    e.preventDefault();
                    setStartTime(new Date());
                }}
                onTouchEnd={(e) => {
                    e.preventDefault();
                    const end = new Date()
                    setEndTime(end);
                    setTimeHeld(differenceInMilliseconds(end, startTime));
                }}
            >
                hold here ;)
            </button>
        </main>
    )
}