"use client";

import sendEmail from "@/mailer/mailer";
import { AuthContext } from "@/supabase/client";
import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import EventCalendar, { DAYS, MonthDayComponent } from "./calendar";
import { addMonths, format, subMonths } from "date-fns";
import {
	eachDayOfInterval,
	endOfDay,
	endOfMonth,
	endOfToday,
	endOfWeek,
	getDate,
	interval,
	isAfter,
	isSameDay,
	isSameMonth,
	isThisMonth,
	isToday,
	startOfMonth,
	startOfToday,
	startOfWeek
} from "date-fns";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { EventModal } from "./eventmodal";
import { useSearchParams } from "next/navigation";

function send() {
	sendEmail({
		subject: "Hello world!",
		text: "I am sending an email using nodemailer",
		to: "andersonleetruong@gmail.com",
		from: process.env.NEXT_PUBLIC_EMAIL
	});
}

function compareTimeOfDay(date1, date2) {
	const time1 = date1.getHours() * 3600000 + date1.getMinutes() * 60000 + date1.getSeconds() * 1000 + date1.getMilliseconds();
	const time2 = date2.getHours() * 3600000 + date2.getMinutes() * 60000 + date2.getSeconds() * 1000 + date2.getMilliseconds();

	return time1 - time2;
}

async function getEvents(focusDay, supabase) {
	const start = startOfWeek(startOfMonth(focusDay));
	const end = endOfWeek(endOfMonth(focusDay));
	const eventsResponse = await supabase
		.from("events")
		.select("*, event_types(*), event_signups(*), event_chairs(*)")
		.gte("date", start.toISOString())
		.lte("date", end.toISOString())
		.eq("reviewed", true)
		.order("date", { ascending: false });
	let eventsList = eventsResponse?.data;
	let shiftList = eventsList.filter(x => x.event_of_shift != null);
	eventsList = eventsList.filter(x => x.event_of_shift == null); // filter out shifts
	return { events: eventsList, shiftList: shiftList };
}

export default function MyAPOPage() {
	const supabase = useContext(AuthContext);
	const [userData, setUserData] = useState(null);
	const [focusDay, setFocusDay] = useState(startOfToday());
	const [focusDays, setFocusDays] = useState([subMonths(focusDay, 1), focusDay, addMonths(focusDay, 1)]);
	const [monthEventMap, setMonthEventMap] = useState({});
	const [filter, setFilter] = useState([]);

	const searchParams = useSearchParams();

	async function getUserData() {
		const { data } = await supabase.auth.getUser();
		if (data) {
			const user = await supabase.from("users").select("*, privileged(*)").eq("auth_id", data.user.id).maybeSingle();
			setUserData(user.data);
		}
	}
	const search = searchParams.get("event_type");
	async function isValidEventType(event_type) {
		const typesResponse = await supabase.from("event_types").select("id, name");
		for (let i = 0; i < typesResponse["data"].length; i++) {
			if (typesResponse["data"][i].name === event_type) {
				setFilter([i])
				return
			}
		}
		setFilter([])
	}
	
	useEffect(() => {
		getUserData();
		isValidEventType(search)
	}, []);
	useEffect(() => {
		async function changeCache() {
			const newFocus = [subMonths(focusDay, 1), focusDay, addMonths(focusDay, 1)];
			setFocusDays(newFocus);

			// Create a new copy of monthEventMap (immutable update)
			let newMonthEventMap = { ...monthEventMap };

			// Fetch missing events in parallel
			const fetchPromises = newFocus.map(async date => {
				const dateStr = date.toISOString();
				if (!newMonthEventMap[dateStr]) {
					const eventsObj = await getEvents(date, supabase);
					newMonthEventMap[dateStr] = eventsObj;
				}
			});

			await Promise.all(fetchPromises); // Wait for all fetches to complete

			setMonthEventMap(newMonthEventMap); // Update state
		}

		changeCache();
	}, [focusDay]);

	return (
		<div className="flex grow">
			<EventTypeDropdown filter={filter} setFilter={setFilter} />
			<Swiper
				key={focusDay.toISOString()}
				className="w-0 flex bg-white rounded shadow-md flex-1"
				runCallbacksOnInit={false}
				initialSlide={1}
				speed={500}
				draggable={false}
				modules={[Navigation]}
				onSlideChangeTransitionEnd={swiper => {
					if (swiper.realIndex > swiper.previousIndex) {
						setFocusDay(addMonths(focusDay, 1));
					} else if (swiper.realIndex < swiper.previousIndex) {
						setFocusDay(subMonths(focusDay, 1));
					}
				}}
				navigation={{
					nextEl: ".custom-next",
					prevEl: ".custom-prev"
				}}>
				{focusDays.map(day => (
					<SwiperSlide key={day.toISOString()} className="w-full h-full">
						<EventCalendar
							focusDay={day}
							userData={userData}
							filter={filter}
							setFilter={setFilter}
							events={monthEventMap[day.toISOString()]?.events}
							shiftList={monthEventMap[day.toISOString()]?.shiftList}
						/>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

function EventTypeDropdown({ filter, setFilter }) {
	const supabase = useContext(AuthContext);
	const [eventTypes, setEventTypes] = useState([]);
	const [selectedValues, setSelectedValues] = useState([]);
	const dropdownRef = useRef(null);

	useEffect(() => {
		async function getEventTypes() {
			const typesResponse = await supabase.from("event_types").select("*");
			if (typesResponse.data) {
				let types = typesResponse.data;
				types.push({ id: 0, name: "none" });
				types.sort((a, b) => a.id - b.id);
				setEventTypes(types);
				// Initialize selected values based on filter indices
				setSelectedValues(types.filter((_, i) => filter.includes(i)));
			}
		}
		getEventTypes();
	}, [filter, supabase]);

	const handleSelect = (event_type, index) => {
		let updatedValues, updatedFilter;
		if (index == 0)
		{
			updatedFilter = [];
			updatedValues = [];
		}
		else if (filter.includes(index)) {
			// If already selected, remove it
			updatedFilter = filter.filter(i => i !== index);
			updatedValues = selectedValues.filter(e => e.id !== event_type.id);
		} else {
			// If not selected, add it
			updatedFilter = [...filter, index];
			updatedValues = [...selectedValues, event_type];
		}

		setSelectedValues(updatedValues);
		setFilter(updatedFilter);
	};

	return (
		<div className="relative">
			<div className="absolute top-[10px] left-[20px] z-[1000] flex items-center gap-2">
				<h1 className="hidden lg:block w-[100px]">filter events:</h1>
				<details ref={dropdownRef} className="dropdown">
					<summary className="btn border-px bg-neutral-50 border-gray-300 text-gray-400 font-normal">
						{selectedValues.length === 0 ? "none" : (selectedValues.length === 1 ? selectedValues[0].name : "mixed")}
					</summary>
					<ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-1 shadow left-0">
						{eventTypes.map((event_type, i) => (
							<li key={i}>
								<label className="items-center gap-2 cursor-pointer">
									<input
										type="checkbox"
										checked={filter.includes(i)}
										onChange={() => handleSelect(event_type, i)}
									/>
									{event_type.name}
								</label>
							</li>
						))}
					</ul>
				</details>
			</div>
		</div>
	);
}