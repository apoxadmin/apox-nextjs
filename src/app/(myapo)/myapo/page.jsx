'use client'

import sendEmail from "@/mailer/mailer"
import { AuthContext } from "@/supabase/client";
import React, { useContext, useEffect, useState, useRef } from "react";
import EventCalendar from "./calendar";
import { addMonths, startOfToday, subMonths } from "date-fns";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

function send() {
    sendEmail({
        subject: "Hello world!",
        text: "I am sending an email using nodemailer",
        to: "andersonleetruong@gmail.com",
        from: process.env.NEXT_PUBLIC_EMAIL
    });
}

export default function MyAPOPage() {
    const supabase = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [focusDay, setFocusDay] = useState(startOfToday());
    const [focusDays, setFocusDays] = useState([ subMonths(focusDay, 2), subMonths(focusDay, 1), focusDay, addMonths(focusDay, 1), addMonths(focusDay, 2)]);
    const [filter, setFilter] = useState(0);

    async function getUserData() {
        const { data } = await supabase.auth.getUser();
        if (data) {
            const user = await supabase
                .from('users')
                .select('*, privileged(*)')
                .eq('auth_id', data.user.id)
                .maybeSingle();
            setUserData(user.data);
        }
    }
    useEffect(() => {
        getUserData();
    }, []);
    useEffect(() => {
        setFocusDays([ subMonths(focusDay, 2), subMonths(focusDay, 1), focusDay, addMonths(focusDay, 1), addMonths(focusDay, 2)]);
    }, [focusDay]);

    return (
        <div className="flex grow">
            <EventTypeDropdown setFilter={setFilter}/>
            <Swiper
                className="w-0 flex bg-white rounded shadow-md flex-1"
                runCallbacksOnInit={false}
                initialSlide={2}
                speed={500}
                draggable = {false}
                modules={[ Navigation ]}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',                    
                }}
            >
                {
                    focusDays.map((day) => (
                        <SwiperSlide key={day.toISOString()} className="w-full h-full">
                            <EventCalendar focusDay={day} userData={userData} filter={filter} setFilter={setFilter} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

function EventTypeDropdown({ setFilter }) {
    const supabase = useContext(AuthContext);
    const [selectedValue, setSelectedValue] = useState(null);
    const [eventTypes, setEventTypes] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        async function getEventTypes()
        {
            const typesResponse = await supabase
                .from('event_types')
                .select('*');
            if (typesResponse.data) 
            {
                let types = typesResponse.data;
                types.push({ id: 0, name: 'none' })
                types.sort((a, b) => a.id - b.id)
                setEventTypes(types);
            }
        }
        getEventTypes();
    }, [])

    const handleSelect = (event_type) => {
        setSelectedValue(event_type);
        setFilter(event_type.id);
        // Close the dropdown
        dropdownRef.current.open = false;
    };

    return (
        <div className="absolute top-[75px] left-[60px] z-[1000] flex items-center gap-2">
            <h1 className="">filter events:</h1>
            <details ref={dropdownRef} className="dropdown">
                <summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">
                    {selectedValue == null ? 'none' : selectedValue.name}
                </summary>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow left-0">
                    {eventTypes.map((event_type, i) => (
                        <li key={i} onClick={() => handleSelect(event_type)}>
                            <a>{event_type.name}</a>
                        </li>
                    ))}
                </ul>
            </details>
        </div>
    );    
}