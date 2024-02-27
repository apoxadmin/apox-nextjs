import React from "react";
import ProfileForm from "./ProfileForm";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProfilePage() {
    return (
        <main className="flex flex-col items-center space-y-8 py-8 px-4 md:py-12">
            <div className="w-full max-w-sm">
                { <ProfileForm /> }
            </div>
        </main>
    )
}