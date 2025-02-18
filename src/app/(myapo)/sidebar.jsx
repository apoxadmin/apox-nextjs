"use client";

import { isPrivileged } from "@/supabase/user";
import Link from "next/link";
import { useEffect, useState } from "react";

const buttonClassName =
	"px-4 py-4 rounded-lg hover:text-neutral-800 hover:bg-neutral-200 hover:cursor-pointer transition ease-out delay-20 duration-150";

const openInNewTab = (url) => {
	const newWindow = window.open(url, "_blank", "noopener,noreferrer");
	if (newWindow) newWindow.opener = null;
};

function SidebarButton({ name, url = "/" }) {
	return (
		<Link href={url} className={buttonClassName}>
			{name}
		</Link>
	);
}
function SidebarLink({ name, url = "/" }) {
	return (
		<Link
			href={url}
			className={buttonClassName}
			rel="noopener noreferrer"
			target="_blank"
		>
			{name}
		</Link>
	);
}

export default function Sidebar({ links, visible = true }) {
	return (
		<div className={`min-w-[240px] ${visible ? "" : "hidden"}`}>
			<div className="flex flex-col text-neutral-500">
				{
					links?.map((link, i) => {
						return <SidebarLink
							key={i}
							name={link.display_name}
							url={link.url}
						/>
					})
				}
			</div>
		</div>
	);
}
