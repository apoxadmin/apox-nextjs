'use client'

import { useState, useEffect, forwardRef } from 'react';
import { createSupabaseClient } from '@/supabase/client';
import DatePickerModal from '@/components/DatePickerModal';
import TimePicker from '@/components/TimePicker';
import { useForm } from 'react-hook-form';
import { requestEvent } from '@/supabase/event';

/**
 * 
 **/
export default function RequestPage() {
    const [eventTypes, setEventTypes] = useState([]);
    const [userData, setUserData] = useState(null);
    const supabase = createSupabaseClient();
    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();
    const eventType = watch('event_type');
    register('event_type', { required: true });
    register('date', { required: true });
    register('start_time', { required: true });
    register('end_time', { required: true });

    const onSubmit = (data) => {
        requestEvent(userData.id, data);
    };

    useEffect(() => {
        async function getEventTypes() {
            const { data } = await supabase.from('event_types').select('*');
            if (data)
                setEventTypes(data);
        }
        async function getUser() {
            const authUser = await supabase.auth.getUser();
            const user_id = authUser.data.user.id;
            const user = await supabase.from('users').select('id, name, email').eq('auth_id', user_id).maybeSingle();
            setUserData(user.data);
        }

        getEventTypes();
        getUser();
    }, []);

    window.addEventListener('click', function (e) {
        document.querySelectorAll('.dropdown').forEach(function (dropdown) {
            if (!dropdown.contains(e.target)) {
                // Click was outside the dropdown, close it
                dropdown.open = false;
            }
        });
    }, [window]);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Event Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="form-control flex-col items-start">
                    <div className="label">
                        <span className="label-text">
                            Event Type
                        </span>
                    </div>
                    <details className="dropdown" id="eventTypeDropdown">
                        <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">{eventType == null ? 'Event Type' : eventType.name}</summary>
                        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                            {
                                eventTypes.map((event_type, i) => {
                                    return <li key={i} onClick={() => { setValue("event_type", event_type); document.querySelector('#eventTypeDropdown').open = false; }}><a>{event_type.name}</a></li>
                                })
                            }
                        </ul>
                    </details>
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Event Name
                        </span>
                    </div>
                    <input {...register('name', { required: true })} type="text" placeholder="Name..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Event Description
                        </span>
                    </div>
                    <textarea {...register('description', { required: true })} type="textarea" placeholder="Description..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <hr className="h-px my-12 bg-gray-200 border-0 dark:bg-gray-700" />
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Event Location
                        </span>
                    </div>
                    <input {...register('location', { required: true })} type="text" placeholder="Location..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="flex space-x-4 py-4">
                    <h1 className="label-text">Off-campus?</h1>
                    <input {...register('off_campus')} type="checkbox" className="checkbox" />
                </label>
                <div>
                    <div className="label">
                        <span className="label-text">
                            Event Date
                        </span>
                    </div>
                    <DatePickerModal set={(date) => { setValue('date', date); }} />
                </div>
                <div>
                    <div className="label">
                        <span className="label-text">
                            Time
                        </span>
                    </div>
                    <div className="flex space-x-2 items-center">
                        <TimePicker set={(date) => { setValue('start_time', date) }} />
                        <h1>to</h1>
                        <TimePicker set={(date) => { setValue('end_time', date) }} />
                    </div>
                </div>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Max Capacity
                        </span>
                    </div>
                    <input
                        {...register('capacity', { valueAsNumber: true, required: true })}
                        id="capacityInput"
                        type="number"
                        placeholder="10"
                        step="1"
                        min="0"
                        onInput={
                            (e) => {
                                let ref = document.querySelector('#capacityInput');
                                const value = e.target.value;
                                if (value == "")
                                    ref.value = null;
                                else
                                    ref.value = Math.max(1, Math.round(value))
                            }}
                        className="input input-bordered bg-neutral-50 h-[40px] text-base"
                    />
                </label>
                {
                    eventType && (eventType.name == 'service' || eventType.name == 'fundraising') ?
                        <label className="form-control">
                            <div className="label">
                                <span className="label-text">
                                    {eventType.name == 'service' ? 'Service Hours' : 'Fundraising Credit'}
                                </span>
                            </div>
                            <input {...register('credit')} type="number" placeholder="10" step="0.1" min="0" className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                        </label>
                        :
                        <></>
                }
                <input type="submit" className="btn" />
            </form>
            <div>
                <h1>Shifts?</h1>
                <h1>Create shifts</h1>
            </div>
        </div>
    )
}
