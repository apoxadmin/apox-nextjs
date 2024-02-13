'use client'

import React from "react";
import ProfileForm from "./ProfileForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function ProfilePage() {

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 p-24">
            <h1 className="text-4xl">My Profile</h1>
            <div className="w-full max-w-sm">
                { <ProfileForm /> }
            </div>
        </main>
    )
}