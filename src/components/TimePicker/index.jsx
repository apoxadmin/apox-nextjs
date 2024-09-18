import { format, setHours, setMinutes, startOfToday } from "date-fns";
import { useEffect, useRef, useState } from "react"


export default function TimePicker({ set }) {
    const [date, setDate] = useState(startOfToday());
    const [hour, setHour] = useState(0);
    const [offset, setOffset] = useState(0);
    const timePickerRef = useRef(null);

    useEffect(() => {
        setDate(setHours(date, hour + offset));
    }, [hour, offset]);

    useEffect(() => {
        set(date);
    }, [date]);

    return (
        <details className="dropdown" ref={timePickerRef}>
            <summary className="btn flex items-center input input-bordered bg-neutral-50">
                <span>
                    <span className="select-none">{format(date, 'h')}</span>
                    :
                    <span className="select-none">{format(date, 'mm')}</span>
                </span>
                <span>
                    <span className="select-none">{offset == 0 ? 'AM' : 'PM'}</span>
                </span>
            </summary>
            <div className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl space-x-2">
                <div className="flex justify-between text-base text-right max-h-[200px] px-4 pb-4">
                    <ul className="overflow-y-scroll">
                        {
                            Array.from({ length: 12 }, (_, i) => i).map((num, i) =>
                                <h1 key={i} onClick={() => { setHour(num); }} className="text-center rounded-lg py-2 px-4 hover:bg-neutral-200 cursor-pointer">{num == 0 ? '12' : num}</h1>
                            )
                        }
                    </ul>
                    <ul className="overflow-y-scroll">
                        {
                            Array.from({ length: 60 }, (x, i) => i).map((num, i) =>
                                <h1 key={i} onClick={() => { setDate(setMinutes(date, num)); }} className="text-center rounded-lg py-2 px-4 hover:bg-neutral-200 cursor-pointer">{num}</h1>
                            )
                        }
                    </ul>
                    <ul className="overflow-y-scroll">
                        <h1 onClick={() => { setOffset(0); timePickerRef.current.open = false; }} className="text-center rounded-lg py-2 px-4 hover:bg-neutral-200 cursor-pointer">AM</h1>
                        <h1 onClick={() => { setOffset(12); timePickerRef.current.open = false; }} className="text-center rounded-lg py-2 px-4 hover:bg-neutral-200 cursor-pointer">PM</h1>
                    </ul>
                </div>
            </div>
        </details>
    )
}
