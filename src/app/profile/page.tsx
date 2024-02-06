'use client'

import { useAuthContext } from "@/lib/firebaseAuth"
import { User } from "firebase/auth";
import React from "react";
import ProfileForm from "./ProfileForm";

export default function ProfilePage() {
    const { user }: { user: User } = useAuthContext();
    

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 p-24">
            <h1 className="text-4xl">My Profile</h1>
            <div className="w-full max-w-sm">
                <ProfileForm />
            </div>
        </main>
    )
}