'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { InputPassword } from "@/components/ui/input-password"
import { login } from "@/utils/supabase/authServerActions"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient"
import { createClient } from "@/utils/supabase/client"
import { navigate } from "@/lib/actions"
import PasswordChangeForm from "@/components/PasswordChangeForm"
 
const FormSchema = z.object({
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email.")
});

export default function ResetPage() {
    const supabase = createClient();
    const [showReset, setShowReset] = React.useState<boolean>(false);

    React.useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                console.log('reset');
                setShowReset(true);
            }
        })
    }, []);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: ""
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log((process.env.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/') + 'reset')
        supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: (process.env.NEXT_PUBLIC_SITE_URL ?? process?.env?.NEXT_PUBLIC_VERCEL_URL ?? 'http://localhost:3000/') + 'reset'
        })
        .then(() => {
            toast({
                title: 'Reset sent! ✉️',
                description: 'Check your email.'
            });
        })
        .catch(() => {
            toast({
                variant: 'destructive',
                title: 'Too many requests! ⚠️',
                description: 'Try again in a bit.'
            });
        });
      }

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-24">
            <div className="flex flex-col space-y-8 items-center w-full max-w-md px-8 md:py-16 md:shadow-xl rounded-xl md:bg-white">
                <img className="h-[100px]" src="/logo.png" />
                {
                    showReset ? <PasswordChangeForm redirect/> : <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="flex flex-col items-center w-full md:w-2/3 space-y-6"
                    >   
                        <div className="flex flex-col items-center">
                            <h1 className="text-lg font-medium">Reset Password</h1>
                        </div>
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel className="text-base">Email</FormLabel>
                                <FormControl>
                                    <Input className="text-base" placeholder="Enter your email..." type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-center rounded-full w-full bg-indigo-600 hover:bg-indigo-300">Send to email</Button>
                    </form>
                </Form>
                }
            </div>
        </main>
    )
}