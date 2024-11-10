'use client'

import { AuthContext } from "@/supabase/client";
import { useContext, useEffect, useState, forwardRef } from "react";
import { createSupabaseClient } from '@/supabase/client';
import { useForm } from 'react-hook-form';
import { createUser } from "@/supabase/user";
import { sortByField, uppercase} from "@/utils/utils";

function CustomCheckbox({ checked })
{  
    return (
      <div className="flex items-center space-x-4">
        {/* Custom styled checkbox container */}
        <div
          className={`w-4 h-4 border-2 rounded-md cursor-pointer transition-all
            ${checked ? 'bg-green-400 border-green-600' : 'border-gray-600'}
            flex items-center justify-center relative`}
        >
          {/* Checkmark inside the checkbox */}
          {checked && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    );
}

function UserCheck({ user, submitted, description, name, credit, isEventReq, reqName, onComplete }) {
    const [attended, setAttended] = useState(false);
    const supabase = useContext(AuthContext);
    async function updateAttended() {
        setAttended(!attended);
    }

    useEffect(() => {
        async function submitUser() {
            if (attended) {
                let row = {
                    user_id: user.id,
                    description: description,
                    name: name,
                    credit: parseInt(credit)
                }
                if(isEventReq) row.event_requirement = reqName.name
                else row.credit_requirement = reqName.name
                // console.log(row)
                const { data, error } = await supabase
                    .from('awarded_credit')
                    .insert(row)
                onComplete();
            }
            setAttended(false);
        }
        if (submitted) {
            submitUser();
        }
    }, [submitted, attended]);

    return (
        <button
            className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4`}
            onClick={updateAttended}
            type="button"
        >
            <CustomCheckbox checked={attended}/>
            <h1 className={`${attended ? 'text-green-400' : 'hover:text-neutral-400'} flex items-center space-x-4 select-none`}>{user.name}</h1>
        </button>
    );
}

export default function AwardCreditPage() {
    const [ toast, setToast ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);
    const [ creditName, setCreditName ] = useState(false);
    const [ description, setDescription ] = useState(false);
    const [ credit, setCredit ] = useState(false);
    const [ users, setUsers ] = useState([]);
    const [ eventTypes, setEventTypes ] = useState([]);
    const [ creditTypes, setCreditTypes ] = useState([]);
    const [ useEvent, setUseEvent ] = useState(false)

    const {
        register,
        handleSubmit,
        watch,
        setValue
    } = useForm();
    
    const eventType = watch('event_type');
    register('name', { required: true });
    register('description', { required: true });
    register('credit', { required: true });

    const supabase = createSupabaseClient();

    const onSubmit = (data) => {
        console.log("MEPOW")
        setCreditName(data.name)
        setCredit(data.credit)
        setDescription(data.description)
        setToast(true)
        setSubmitted(true)
    };

    useEffect(() => {
        async function getUsers() {
            const usersResponse = await supabase
                .from('users')
                .select('*, standings!inner(name)')
                .neq('standings.name', 'alumni');
            let data = usersResponse.data;
            if (data) {
                const sortByName = (a, b) => sortByField(a, b, 'name');
                data.sort(sortByName);
                setUsers(data);
            }
        }
        getUsers();
    }, []);

    useEffect(() => {
        async function getEventTypes() {
            const { data } = await supabase.from('event_requirements').select('*');
            if (data)
                setEventTypes(data);
        }
        async function getCreditTypes() {
            const { data } = await supabase.from('credit_requirements').select('*');
            if (data)
                setCreditTypes(data);
        }
        getEventTypes();
        getCreditTypes();
    }, []);

    return (
        <div className="flex flex-col h-full items-center p-10 space-y-10 overflow-y-auto w-full">
            <h1 className="text-center text-xl text-neutral-700">Award Credit</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2 w-2/3 lg:w-1/3">
                <label className="flex space-x-4 py-4">
                    <h1 className="label-text">Event Credit?</h1>
                    <input {...register('eventCredit')} type="checkbox" className="checkbox" checked={useEvent} onClick={(m) => setUseEvent(!useEvent)}/>
                </label>
                {
                    useEvent ?                         
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
                        :
                        <label className="form-control flex-col items-start">
                            <div className="label">
                                <span className="label-text">
                                    Credit Type
                                </span>
                            </div>
                            <details className="dropdown" id="eventTypeDropdown">
                                <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">{eventType == null ? 'Credit Type' : eventType.name}</summary>
                                <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                    {
                                        creditTypes.map((event_type, i) => {
                                            return <li key={i} onClick={() => { setValue("event_type", event_type); document.querySelector('#eventTypeDropdown').open = false; }}><a>{event_type.name}</a></li>
                                        })
                                    }
                                </ul>
                            </details>
                        </label>
                }
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Credit Name (eg. Outside Hours)
                        </span>
                    </div>
                    <input {...register('name', { required: true })} type="text" placeholder="Name..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Description (why the credit is being awarded)
                        </span>
                    </div>
                    <input {...register('description', { required: true })} type="text" placeholder="Description..." className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Amount of credit (eg num hours)
                        </span>
                    </div>
                    <input {...register('credit', { required: true })} placeholder="Credit..." step="1"
                        id="capacityInput"
                        type="number"
                        onInput={
                            (e) => {
                                let ref = document.querySelector('#capacityInput');
                                const value = e.target.value;
                                if (value == "")
                                    ref.value = null;
                                else
                                    ref.value = Math.round(value)
                            }} className="input input-bordered bg-neutral-50 h-[40px] text-base" />
                </label>
                <label className="form-control">
                    <div className="label">
                        <span className="label-text">
                            Users
                        </span>
                    </div>
                    {
                        users.map((user, i) =>
                        {
                            return <UserCheck key={i} isEventReq={useEvent} user={user} description={description}
                                credit={credit} name={creditName} submitted={submitted}
                                reqName={eventType} onComplete={() => setSubmitted(false)}/>
                        })
                    }
                </label>
                <button type="submit" className="btn">Award Credit</button>
            </form>
            {
                toast &&
                <div className="toast">
                    <div className="alert alert-success shadow-lg text-center">
                        <h1 className="text-white">Credit Awarded!</h1>
                    </div>
                </div>
            }
        </div>
    )
}
