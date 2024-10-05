import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, interval, isBefore, isSameDay, startOfMonth, startOfToday, startOfWeek, subMonths } from "date-fns";
import { useEffect, useState } from "react";

/**
 * @param { Function } setDay
 **/
export default function DatePicker({ setDay = () => { } }) {
    const [focusDay, setFocusDay] = useState(startOfToday());
    const [startDay, setStartDay] = useState(startOfWeek(startOfMonth(startOfToday())));
    const [endDay, setEndDay] = useState(endOfWeek(endOfMonth(startOfToday())));
    const [days, setDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(startOfToday());

    useEffect(() => {
        setDay(selectedDay);
    }, [selectedDay]);

    useEffect(() => {
        const start = startOfWeek(startOfMonth(focusDay));
        const end = endOfWeek(endOfMonth(focusDay));
        setStartDay(start);
        setEndDay(end);
        setDays(eachDayOfInterval(interval(start, end)));
    }, [focusDay]);

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex w-full space-x-4 justify-between">
                <button onClick={() => { setFocusDay(startOfMonth(subMonths(focusDay, 1))) }}>Prev</button>
                <h1 className="text-xl text-center">{format(focusDay, 'LLLL y')}</h1>
                <button onClick={() => { setFocusDay(startOfMonth(addMonths(focusDay, 1))) }}>Next</button>
            </div>
            <div className="grid grid-cols-7">
                {
                    days.map((day, i) => {
                        let style = '';
                        if (isBefore(day, startOfToday())) {
                            style = 'bg-gray-200';
                        } else if (isSameDay(selectedDay, day)) {
                            style = 'bg-blue-200 hover:bg-blue-300 shadow-xl rounded-xl cursor-pointer';
                        } else {
                            style = 'hover:bg-gray-100 rounded-xl cursor-pointer';
                        }
                        return (
                            <button
                                key={i}
                                onClick={(formData) => { setSelectedDay(day) }}
                                className={`text-center p-4 transition ease-out duration-150 ${style}`}
                                type="button"
                                disabled={isBefore(day, startOfToday())}
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
