"use client";

import { AuthContext } from "@/supabase/client";
import { approveEvent, deleteEvent, unapproveEvent } from "@/supabase/event";
import { format, startOfToday } from "date-fns";
import { useContext, useEffect, useRef, useState } from "react";

function EventModal({ event, getEvents, nameStyle }) {
	const ref = useRef(null);

	function closeModal() {
		ref.current.close();
		setTimeout(getEvents, 250);
	}

	return (
		<div>
			<div className="flex space-x-4 justify-between">
				<button
					className={`flex space-x-4 p-3 ${event?.reviewed ? "bg-blue-400" : "bg-red-300"} text-black rounded-md`}
					onClick={() => {
						ref.current.showModal();
					}}>
					<h1 className={nameStyle}>
						{event?.event_types.abbreviation.toUpperCase()} {event?.name}
					</h1>
				</button>
			</div>
			<dialog ref={ref} className="modal">
				<div className="modal-box flex flex-col space-y-4 max-h-[90vh] overflow-y-hidden">
					<div className="flex justify-between">
						<h1 className="text-neutral-600">
							{event?.event_types.name
								.split(" ")
								.map(s => s.charAt(0).toUpperCase() + s.substring(1))
								.join()}
						</h1>
						<h1 className="text-neutral-600">{`${format(event?.start_time, "p")} - ${format(event?.end_time, "p")}`}</h1>
					</div>
					<div className="flex flex-col space-y-2">
						<div className="flex flex-col text-center">
							<h1 className="font-bold text-lg">{event?.name}</h1>
							<h1 className="font-bold">@ {event?.location}</h1>
						</div>
						<h1 className="text-center">{event?.description}</h1>
					</div>
					<div className="flex justify-evenly">
						<button
							onClick={() => {
								if (approveEvent(event?.id)) closeModal();
							}}>
							Approve
						</button>
						<button
							onClick={() => {
								if (unapproveEvent(event?.id)) closeModal();
							}}>
							Unapprove
						</button>
						<button
							onClick={() => {
								if (deleteEvent(event?.id)) closeModal();
							}}>
							Delete
						</button>
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
}

export default function ExCommEvents() {
	const supabase = useContext(AuthContext);
	const [events, setEvents] = useState([]);

	async function getEvents() {
		const eventsRequest = await supabase.from("events").select("*, event_types(*)");
		if (eventsRequest.data) {
			// Sort events by date (ascending)
			const sortedEvents = eventsRequest.data.sort((a, b) => new Date(a.date) - new Date(b.date));
			setEvents(sortedEvents);
		}
	}

	useEffect(() => {
		getEvents();
	}, []);

	// Group events by date
	const groupedEvents = events.reduce((acc, event) => {
		const eventDate = new Date(event.date).toDateString(); // Group by readable date
		if (!acc[eventDate]) acc[eventDate] = [];
		acc[eventDate].push(event);
		return acc;
	}, {});

	// Separate past and future events
	const today = new Date();
	const pastEvents = Object.entries(groupedEvents).filter(([date]) => new Date(date) < today);
	const futureEvents = Object.entries(groupedEvents).filter(([date]) => new Date(date) >= today);

	return (
		<div className="flex flex-col items-center w-full overflow-auto p-6 bg-white">
			<h1 className="text-xl text-neutral-600 mb-4">Events</h1>
			<div className="flex flex-row justify-between w-full max-w-2xl">
				{/* Past Events (Left Side) */}
				<div className="flex flex-col w-1/2 items-center">
					<h1 className="text-lg text-neutral-500">Past Events</h1>
					{pastEvents.map(([date, events]) => (
						<div key={date} className="w-full flex flex-col gap-2">
							<h2 className="text-md font-semibold text-neutral-700">{date}</h2>
							{events.map((event) => (
								<EventModal
									key={event.id}
									event={event}
									getEvents={getEvents}
									nameStyle="truncate max-w-[200px] inline-block"
								/>
							))}
						</div>
					))}
				</div>

				{/* Future Events (Right Side) */}
				<div className="flex flex-col w-1/2 items-center">
					<h1 className="text-lg text-neutral-500">Upcoming Events</h1>
					{futureEvents.map(([date, events]) => (
						<div key={date} className="w-full flex flex-col gap-2">
							<h2 className="text-md font-semibold text-neutral-700">{date}</h2>
							{events.map((event) => (
								<EventModal
									key={event.id}
									event={event}
									getEvents={getEvents}
									nameStyle="truncate max-w-[200px] inline-block"
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
