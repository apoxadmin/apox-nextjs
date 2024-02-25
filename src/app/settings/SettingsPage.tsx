'use client'

import PasswordChangeForm from "@/components/PasswordChangeForm"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SettingsPage() {
    
    return (
        <ScrollArea className="max-h-screen">
            <div className="flex flex-col items-center space-y-8 py-8 px-4 md:py-12">
                <h1 className="text-2xl md:text-4xl">Settings</h1>
                <PasswordChangeForm />
            </div>
        </ScrollArea>
    )
}