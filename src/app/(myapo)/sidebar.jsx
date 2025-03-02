"use client";

import { isPrivileged } from "@/supabase/user";
import Link from "next/link";
import { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "@/supabase/client";
import { logout } from "@/supabase/auth";

const buttonClassName =
	"px-4 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150 lowercase";
const mobileButtonClassName =
	"md:hidden px-4 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150 lowercase";

const openInNewTab = url => {
	const newWindow = window.open(url, "_blank", "noopener,noreferrer");
	if (newWindow) newWindow.opener = null;
};
function SidebarLink({ name, url = "/" }) {
	return (
		<Link href={url} className={buttonClassName} rel="noopener noreferrer" target="_blank">
			{name}
		</Link>
	);
}

export default function Sidebar({ links, visible = true }) {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const profileRef = useRef(null);
	const supabase = useContext(AuthContext);
	const [privileged, setPrivileged] = useState(false);

	useEffect(() => {
		async function getPrivileged() {
			const priv = await isPrivileged();
			setPrivileged(priv);
		}
		getPrivileged();
	});

	useEffect(function mount() {
		function closeEscape(event) {
			if (event.key == "Escape") {
				// Escape key pressed
				profileRef.current.open = false;
			}
		}

		window.addEventListener("keydown", closeEscape);
		return function unmount() {
			window.removeEventListener("keydown", closeEscape);
		};
	}, []);

	useEffect(() => {
		async function getUser() {
			const authId = (await supabase.auth.getUser())?.data.user.id;
			const user = await supabase.from("users").select("name").eq("auth_id", authId).maybeSingle();
			if (user.data) {
				const name = user?.data?.name;
				let initials = name.split(" ");
				initials.forEach((subname, i) => (initials[i] = subname[0]));
				initials = initials.join("");
				user.data.initials = initials;
				setUser(user.data);
			}
		}
		if (supabase) getUser();
	}, [supabase]);

	return (
		<div className={`min-w-[240px] ${visible ? "" : "hidden"}`}>
			<div className="flex flex-col text-neutral-500">
				<div className="flex items-center justify-end space-x-8 mr-5 mt-5 md:hidden">
					<Link href="/">
						<img className="h-[30px] justify-center" src="/logo_long.png" />
					</Link>
					<div className="dropdown dropdown-end dropdown-hover" ref={profileRef}>
						<div tabIndex={0} role="button" className="avatar placeholder cursor-pointer">
							<div className="bg-blue-800 hover:bg-blue-700 text-neutral-200 w-8 h-8 rounded-full shadow-lg">
								<span className="text-sm">{user?.initials}</span>
							</div>
						</div>
						<div tabIndex={0} className="dropdown-content menu bg-white z-50 shadow-lg rounded-lg p-4">
							<div className="flex flex-col space-y-2">
								<h1 className="text-nowrap text-neutral-600">{user?.name}</h1>
								<Link href="/myprofile" className="w-full text-neutral-600 text-start">
									Profile
								</Link>
								<Link href="/settings" className="w-full text-neutral-600 text-start">
									Settings
								</Link>
								<button
									onClick={() => {
										logout();
									}}
									className="w-full text-neutral-600 text-start">
									Log out
								</button>
							</div>
						</div>
					</div>
				</div>
				{links?.map((link, i) => {
					return <SidebarLink key={i} name={link.display_name} url={link.url} />;
				})}
				<Link className={mobileButtonClassName} href="/myapo">
					<h1>calendar</h1>
				</Link>
				<Link className={mobileButtonClassName} href="/myprofile">
					<h1>my tracking</h1>
				</Link>
				<Link className={mobileButtonClassName} href="/request">
					<h1>Request</h1>
				</Link>
				{privileged && (
					<Link className={mobileButtonClassName} href="/excomm">
						<h1>Excomm</h1>
					</Link>
				)}
				<Link className={mobileButtonClassName} href="/tracking">
					<h1>Track Event</h1>
				</Link>
				<Link className={mobileButtonClassName} href="/myevents">
					<h1>My Events</h1>
				</Link>
				<Link className={mobileButtonClassName} href="/family">
					<h1>Family Tree</h1>
				</Link>
			</div>
		</div>
	);
}
