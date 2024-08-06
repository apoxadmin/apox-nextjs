'use client'

import sendEmail from "@/mailer/mailer"
import { eachDayOfInterval, endOfMonth, endOfWeek, format, getDate, interval, isSameMonth, isThisMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import React from "react";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function send() {
    console.log(process.env.NEXT_PUBLIC_EMAIL);
    sendEmail({
        subject: "Hello world!",
        text: "I am sending an email using nodemailer",
        to: "andersonleetruong@gmail.com",
        from: process.env.NEXT_PUBLIC_EMAIL
    });
}

function MonthDayComponent({ day, index, fiveRows }) {
    let color = isToday(day) ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-neutral-100';
        color = isThisMonth(day) ? color : 'bg-neutral-200 hover:bg-neutral-100';
    let textColor = isToday(day) ? 'text-neutral-600' : '';
    let position = "";

    const [popover, setPopover] = React.useState(false);

    switch(Math.floor(index / 7)) {
        case 0:
            position = "top-[0%]";break;
        case 3:
            if (fiveRows) position = "top-[-10%]";
            else position = "bottom-[0%]";
            break;
        case 4:
            position = "bottom-[0%]";
    }

    switch(index % 7) {
        case 0:
            position += " left-[0%]";break;
        case 6:
            position += " right-[0%]";break;
    }

    return (
        <div className="flex justify-center items-center relative group" onClick={() => { setPopover(true); }} onMouseLeave={() => { setPopover(false); }}>
            <div className={`${popover ? 'visible' : 'invisible'} drop-shadow-xl bg-white absolute flex flex-col items-center z-50 min-w-[120%] min-h-[120%] rounded-sm p-4 ${position}`}>
                <h1 className="text-xl">
                    {getDate(day)}
                </h1>
            </div>
            <div className={`flex flex-col h-full w-full py-2 hover:cursor-pointer transition ease-out delay-20 duration-150 ${color}`}>
                <h1 className={`text-center text-sm ${textColor}`}>
                {
                    getDate(day)
                }
                </h1>
            </div>
        </div>
    )
}

export default function MyAPOPage() {
    const start = startOfWeek(startOfMonth(Date.now()));
    const end = endOfWeek(endOfMonth(Date.now()));
    const days = eachDayOfInterval(interval(start, end));

    return (
        <div className="flex flex-col h-full">
            <div className="grid grid-cols-7">
                {
                    DAYS.map(day => {
                        return (
                            <h1 key={day} className="text-neutral-300 text-center py-2">
                                {day.toUpperCase()}
                            </h1>
                        )
                    })
                }
            </div>
            <div className="grow grid grid-cols-7">
                {
                    days.map((day, i) => <MonthDayComponent key={day.toISOString()} day={day} index={i} fiveRows={days.length > 28} />)
                }
            </div>
        </div>
    )
}