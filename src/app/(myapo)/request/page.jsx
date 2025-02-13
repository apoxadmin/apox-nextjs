'use client'

import { useState, useEffect, forwardRef } from 'react';
import { createSupabaseClient } from '@/supabase/client';
import DatePickerModal from '@/components/DatePickerModal';
import TimePicker from '@/components/TimePicker';
import { useForm } from 'react-hook-form';
import { requestEvent } from '@/supabase/event';
import { uppercase } from '@/utils/utils';

export default function RequestPage() {
    const [eventTypes, setEventTypes] = useState([]);
    const [userData, setUserData] = useState(null);
    const [toast, setToast] = useState(false);
    const [shiftsEnabled, setShiftsEnabled] = useState(false);
    const [shifts, setShifts] = useState([{ start: "", end: "" }, { start: "", end: "" }]); // Default 2 shifts
    const supabase = createSupabaseClient();

    const { register, handleSubmit, watch, setValue } = useForm();
    const eventType = watch("event_type");

    register("event_type", { required: true });
    register("date", { required: true });

    async function onSubmit (data) {
        if (shiftsEnabled) {
            let main_event = {...data};
            main_event.start_time = shifts[0].start;
            main_event.end_time = shifts.at(-1).end;
            main_event.has_shifts = true;
            let response = await requestEvent(userData.id, main_event);
            const main_event_id = response.data[ 0 ].id;
            let events = shifts.map(shift =>
            {
                let s = {...data};
                s.start_time = shift.start;
                s.end_time = shift.end;
                s.event_of_shift = main_event_id;
                s.has_shifts = false;
                return s;
            })
            events.forEach(async s => await requestEvent(userData.id, s));
        } else {
            data.start_time = shifts[0].start;
            data.end_time = shifts[ 0 ].end;
            data.has_shifts = false;
            if (requestEvent(userData.id, data)) {
                setToast(true);
                setTimeout(() => {
                    setToast(false);
                }, 5000);
            }
        }
    };

    useEffect(() => {
        async function getEventTypes() {
            const { data } = await supabase.from("event_types").select("*");
            if (data) setEventTypes(data);
        }
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const user = await supabase.from("users").select("id, name, email").eq("auth_id", user_id).maybeSingle();
            setUserData(user.data);
        }

        getEventTypes();
        getUser();
    }, []);

    const addShift = () => {
        setShifts([...shifts, { start: "", end: "" }]);
    };
    const removeShift = (index = shifts.length-1) => {
        let p = shifts.filter((_, i) => i !== index)
        setShifts(p);
        console.log(p)
    };

    const updateShift = (index, field, value) => {
        const updatedShifts = [...shifts];
        updatedShifts[index][field] = value;
        setShifts(updatedShifts);
    };

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Event Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="form-control flex-col items-start">
                    <div className="label">
                        <span className="label-text">Event Type</span>
                    </div>
                    <details className="dropdown" id="eventTypeDropdown">
                        <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">{eventType == null ? 'Event Type' : uppercase(eventType.name)}</summary>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {
                                eventTypes.map((event_type, i) => {
                                    return <li key={i} onClick={() => { setValue("event_type", event_type); document.querySelector('#eventTypeDropdown').open = false; }}><a>{uppercase(event_type.name)}</a></li>
                                })
                            }
                        </ul>
                    </details>
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Event Name</span>
                    </div>
                    <input {...register("name", { required: true })} type="text" placeholder="Name..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Event Description</span>
                    </div>
                    <textarea {...register("description", { required: true })} placeholder="Description..." className="textarea textarea-bordered bg-neutral-50 text-base" />
                </label>
                <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Event Location</span>
                    </div>
                    <input {...register("location", { required: true })} type="text" placeholder="Location..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="flex space-x-4 py-4">
                    <h1 className="label-text">Off-campus?</h1>
                    <input {...register("off_campus")} type="checkbox" className="checkbox" />
                </label>
                <div>
                    <div className="label">
                        <span className="label-text">Event Date</span>
                    </div>
                    <DatePickerModal set={(date) => setValue("date", date)} />
                </div>
                <label className="flex space-x-4 py-4">
                    <h1 className="label-text">Shifts?</h1>
                    <input type="checkbox" className="checkbox" checked={shiftsEnabled} onChange={() => setShiftsEnabled(!shiftsEnabled)} />
                </label>
                {shiftsEnabled ? (
                    <div className="flex flex-col space-y-2">
                        {shifts.map((shift, index) => (
                            <div key={index} className="flex space-x-2 items-center">
                                <TimePicker value={shifts[index].start} set={(date) => updateShift(index, "start", date)} />
                                <h1>to</h1>
                                <TimePicker value={shift.end} set={(date) => updateShift(index, "end", date)} />
                            </div>
                        ))}
                        <button type="button" className="btn btn-outline" onClick={addShift}>
                            + Add Shift
                        </button>
                        <button type="button" className="btn btn-outline" onClick={() => removeShift()}>
                            X Remove Shift
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="label">
                            <span className="label-text">Time</span>
                        </div>
                        <div className="flex space-x-2 items-center">
                            <TimePicker set={(date) => updateShift(0, "start", date)} />
                            <h1>to</h1>
                            <TimePicker set={(date) => updateShift(0, "end", date)} />
                        </div>
                    </div>
                )}
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">Max Capacity</span>
                    </div>
                    <input {...register("capacity", { valueAsNumber: true, required: true })} type="number" placeholder="" step="1" min="1" className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                {eventType && (eventType.name === "service" || eventType.name === "fundraising" || eventType.name == "flyering") && (
                    <label className="form-control">
                        <div className="label">
                            <span className="label-text">{eventType === "service" ? "Service Hours" : "Credit"}</span>
                        </div>
                        <input {...register("credit")} type="number" placeholder="" step="0.1" min="0" className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                    </label>
                )}
                <button type="submit" className="btn">
                    Request Event
                </button>
            </form>
            {toast && (
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Event created!</h1>
                    </div>
                </div>
            )}
        </div>
    );
}
