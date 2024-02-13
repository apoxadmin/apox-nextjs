'use client'

import * as dateFns from 'date-fns';
import EventCalendar from './EventCalendar';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import "swiper/css";
import Image from 'next/image';

export default function CalendarPage() {
    const [focusDate, setFocusDate] = React.useState<Date>(dateFns.startOfToday());
    const [todaysEvents, setTodaysEvents] = React.useState<Array<any>>([]);
    const [focusMonths, setFocusMonths ] = React.useState<Array<Date>>([dateFns.subMonths(dateFns.startOfToday(), 1), dateFns.startOfToday(), dateFns.addMonths(dateFns.startOfToday(), 1)]);

    React.useEffect(() => {
        const supabase = createClientComponentClient();
        async function getEvents() {
            const events = (await supabase.from('events').select('name, description, location, startDate, endDate, limit, shifts, creator, event_types ( name, abbreviation )').eq('reviewed', true).gte('startDate', dateFns.startOfToday().toISOString()).lte('endDate', dateFns.endOfToday().toISOString())).data;
            if (events) {
                setTodaysEvents(events);
            }
        }
        getEvents();
    }, []);

    React.useEffect(() => {
        setFocusMonths([dateFns.subMonths(focusDate, 1), focusDate, dateFns.addMonths(focusDate, 1)])
    }, [focusDate]);

    return (
    <main className="flex h-screen flex-col items-center divide-y md:divide-y-0 md:space-y-4 bg-gray-100 md:p-4">
        <div className="flex items-center justify-between w-full p-4 bg-white rounded shadow-lg">
            <div className="flex items-center space-x-4">
                <img className="h-[50px]" src="/logo.png" />
                <h1 className="text-sm md:text-lg">
                    {dateFns.format(dateFns.startOfToday(), 'PPPP')}
                </h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
                <h1 className="text-sm md:text-lg select-none">
                    {dateFns.format(focusDate, 'LLLL')}
                </h1>
                <IoIosArrowBack 
                    className="hidden md:block text-2xl hover:cursor-pointer hover:text-gray-500"
                    onClick={() => setFocusDate(dateFns.addMonths(focusDate, -1))} 
                />
                <IoIosArrowForward 
                    className="hidden md:block text-2xl hover:cursor-pointer hover:text-gray-500"
                    onClick={() => setFocusDate(dateFns.addMonths(focusDate, 1))} 
                />
            </div>
        </div>
        <div className="flex w-full flex-1 lg:space-x-4">
            <div className="hidden bg-white lg:flex flex-col space-y-4 p-6 rounded shadow-lg">
                <h1 className="text-center text-xl">
                    Today's Events
                </h1>
                <div className="flex flex-col space-y-2">
                    {
                        todaysEvents.map((event, i) => {
                            const eventLabel = event.event_types.name[0].toUpperCase();
                            return (
                                <div key={i} className="flex flex-col text-sm space-y-1">
                                    <div className="flex space-x-1 bg-gray-100 rounded p-1">
                                        <h1 className="font-bold">
                                            {eventLabel}
                                        </h1>
                                        <h1 className="truncate">
                                            {event.name}
                                        </h1>
                                    </div>
                                    <h1 className="line-clamp-1">
                                        {event.description}
                                    </h1>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <Swiper className="h-full flex bg-white rounded shadow-lg flex-1" runCallbacksOnInit={false} initialSlide={1} 
            onSlideChange={(swiper) => { 
                console.log(swiper.activeIndex, swiper.previousIndex)
                if (swiper.activeIndex < swiper.previousIndex) {
                    const newFocus = dateFns.subMonths(focusDate, 1);
                    setFocusDate(newFocus);
                    swiper.activeIndex = 1;
                } else if (swiper.activeIndex > swiper.previousIndex) {
                    const newFocus = dateFns.addMonths(focusDate, 1);
                    setFocusDate(newFocus);
                    
                    swiper.activeIndex = 1;
                }
            }}>
                { 
                    focusMonths
                    .map((day, i) => (
                        <SwiperSlide key={day.toISOString()} className="h-full md:p-6">
                            <EventCalendar focusDate={day}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
        {/* <h1 className="text-[0.5rem] md:text-xs md:text-sm text-gray-400 text-center py-2 md:py-0">
            © All Copyright Reserved | Alpha Phi Omega - University of California, Los Angeles 
        </h1> */}
    </main>
    )
}