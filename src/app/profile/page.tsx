'use client'

import React from "react";
import ProfileForm from "./ProfileForm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SkeletonCard } from "@/components/ui/skeleton-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/lib/AuthProvider";

export default function ProfilePage() {
    const { userData } = useAuth();

    return (
        <ScrollArea className="max-h-screen">
            <main className="flex flex-col items-center space-y-8 py-8 px-4 md:p-24">
                <h1 className="text-2xl md:text-4xl font-medium">{userData.name}</h1>
                <div className="w-full max-w-sm">
                    { <ProfileForm /> }
                </div>
            </main>
        </ScrollArea>
    )
}