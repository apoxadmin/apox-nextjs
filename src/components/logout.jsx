'use client'

const { logout } = require("@/supabase/auth");

export default function LogoutButton() {
    return (
        <button className="text-sm hover:text-neutral-400" onClick={() => { logout(); }}>
            Log out
        </button>
    )
}