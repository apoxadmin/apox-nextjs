import { eachDayOfInterval, endOfMonth, endOfWeek, format, interval, isSameDay, startOfDay, startOfMonth, startOfToday, startOfWeek } from "date-fns";
import { useEffect, useState } from "react";

/**
 * @param { string } formField
 * @param { Function } setDay
 **/
export default function DatePicker({ setDay = () => { } }) {
    const [focusDay, setFocusDay] = useState((Date.now()));
    const start = startOfWeek(startOfMonth(focusDay));
    const end = endOfWeek(endOfMonth(focusDay));
    const days = eachDayOfInterval(interval(start, end));
    const [selectedDay, setSelectedDay] = useState(startOfToday());

    useEffect(() => {
        setDay(selectedDay);
    }, [selectedDay]);

    return (
        <div className="flex flex-col space-y-4">
            <h1 className="text-xl text-center">{format(focusDay, 'LLLL y')}</h1>
            <div className="grid grid-cols-7">
                {
                    days.map((day, i) => {
                        let style = `text-center rounded-xl p-4 cursor-pointer transition ease-out duration-150 ${isSameDay(selectedDay, day) ? 'bg-blue-200 hover:bg-blue-300 shadow-xl' : 'hover:bg-gray-200'}`;
                        return (
                            <button
                                key={i}
                                onClick={(formData) => { setSelectedDay(day) }}
                                className={style}
                                type="button"
                            >
                                {
                                    format(day, 'd')
                                }
                            </button>
                        )
                    })
                }
            </div>
        </div >
    )
}
