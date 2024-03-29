import { cn } from "@/lib/utils";
import { getHours, getMinutes, set, startOfToday } from "date-fns";
import React, { useEffect } from "react";



export function TimePicker({ value, onChange }: { value: Date, onChange: (date: Date) => void }) {
    const [hoursInternal, setHoursInternal] = React.useState<number>(getHours(value));
    const [hoursCache, setHoursCache] = React.useState<number>(getHours(value));

    const [minutesCache, setMinutesCache] = React.useState<number>(getMinutes(value));

    const [meridian, setMeridian] = React.useState<'AM'|'PM'>(getHours(value) < 12 ? 'AM' : 'PM');

    const setHours = () => {
        const hours24 = meridian == 'AM' ? hoursInternal%12 : hoursInternal%12 + 12;
        onChange(set(value, { hours: hours24 }));
    }

    const setMinutes = (minutes: number) => {
        onChange(set(value, { minutes: minutes }));
    }

    React.useEffect(() => {
        setHours();
    }, [hoursInternal, meridian]);

    // React.useEffect(() => {
    //     setMeridian(getHours(value) < 12 ? 'AM' : 'PM')
    // }, [value])

    return (
        <div
            className="w-[100px] bg-white flex justify-end items-center space-x-2 h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
        >
            <div className="flex items-center">
                <span role="textbox"
                    onFocus={(e) => { setHoursCache(null); }}
                    onKeyDown={e => {
                        e.preventDefault();
                        if (e.key >= '0' && e.key <= '9') {
                            if (!hoursCache) {
                                if (e.key != '0') {
                                    const num = parseInt(e.key);
                                    setHoursInternal(num);
                                    setHoursCache(num);
                                }
                            }
                            else {
                                const timeString = parseInt(hoursCache.toString() + e.key);
                                if (timeString <= 12) {
                                    setHoursInternal(timeString);
                                    setHoursCache(timeString);
                                } else if (e.key != '0') {
                                    setHoursInternal(parseInt(e.key));
                                    setHoursCache(parseInt(e.key));
                                }
                            }
                        }
                    }} 
                    className="font-mono text-lg caret-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    contentEditable
                    suppressContentEditableWarning
                >
                    {value ? (getHours(value) % 12 == 0 ? '12' : getHours(value) % 12) : '――'}
                </span>
                :
                <span role="textbox" 
                    onFocus={(e) => { setMinutesCache(null); }}
                    onKeyDown={e => {
                        e.preventDefault();
                        if (e.key >= '0' && e.key <= '9') {
                            if (!minutesCache) {
                                const num = parseInt(e.key);
                                setMinutes(num);
                                setMinutesCache(num);
                            }
                            else {
                                const timeString = parseInt(minutesCache.toString() + e.key);
                                if (timeString <= 59) {
                                    setMinutes(timeString);
                                    setMinutesCache(timeString);
                                } else {
                                    setMinutes(parseInt(e.key));
                                    setMinutesCache(parseInt(e.key));
                                }
                            }
                        }
                    }} 
                    className="font-mono text-lg caret-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    contentEditable
                    suppressContentEditableWarning
                >
                    {value != null ? getMinutes(value).toString().padStart(2, '0') : '――'}
                </span>
            </div>

            <span role="textbox" 
                onKeyDown={e => {
                    e.preventDefault();
                    if (e.key.toLowerCase() == 'a') {
                        setMeridian('AM');
                    }
                    else if (e.key.toLowerCase() == 'p') {
                        setMeridian('PM');
                    }
                }} 
                className="font-mono text-lg caret-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                contentEditable
                suppressContentEditableWarning
            >
                {meridian}
            </span>
        </div>
    )
}

export default function TimeRangePicker({ value, onChange }: { value: any, onChange: (value: any) => void }) {
    return (<div className="flex items-center space-x-2">
        <TimePicker value={value?.startDate ?? startOfToday() } onChange={(newDate) => { onChange({startDate: newDate, endDate: value?.endDate ?? startOfToday() }) }} />
        <h1>to</h1>
        <TimePicker value={value?.endDate ?? startOfToday()} onChange={(newDate) => { onChange({startDate: value?.startDate ?? startOfToday(), endDate: newDate }) }} />
    </div>)
}