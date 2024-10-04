'use client'

import sendEmail from "@/mailer/mailer"
import { AuthContext } from "@/supabase/client";
import React, { useContext, useEffect, useState } from "react";
import EventCalendar from "./calendar";
import { addMonths, startOfToday, subMonths } from "date-fns";
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css";

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
    const [focusDays, setFocusDays] = useState([subMonths(focusDay, 1), startOfToday(), addMonths(focusDay, 1)]);

    async function getUserData() {
        const { data } = await supabase.auth.getUser();
        if (data) {
            const user = await supabase.from('users').select().eq('auth_id', data.user.id).maybeSingle();
            setUserData(user.data);
        }
    }
    useEffect(() => {
        getUserData();
    }, []);
    useEffect(() => {
        setFocusDays([subMonths(focusDay, 1), focusDay, addMonths(focusDay, 1)]);
    }, [focusDay]);

    return (
        <div className="flex grow">
            <Swiper
                className="w-0 w-full flex bg-white rounded shadow-md flex-1"
                runCallbacksOnInit={false}
                initialSlide={1}
                speed={150}
                onSlideChange={(swiper) => {
                    if (swiper.activeIndex < swiper.previousIndex) {
                        const newFocus = subMonths(focusDay, 1);
                        setFocusDay(newFocus);
                        swiper.activeIndex = 1;
                    } else if (swiper.activeIndex > swiper.previousIndex) {
                        const newFocus = addMonths(focusDay, 1);
                        setFocusDay(newFocus);
                        swiper.activeIndex = 1;
                    }
                }}
            >
                {
                    focusDays.map((day) => (
                        <SwiperSlide key={day.toISOString()} className="w-full h-full">
                            <EventCalendar focusDay={day} userData={userData} />
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}
