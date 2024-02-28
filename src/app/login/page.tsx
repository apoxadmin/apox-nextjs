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
import { ScrollArea } from "@/components/ui/scroll-area"
 
const FormSchema = z.object({
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email."),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
});

export default function LoginPage() {
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        login({ email: data.email, password: data.password})
        .catch((error) => {
            console.log(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Incorrect email or password.'
            })
        })
      }

    return (
        <ScrollArea>
            <main className="flex min-h-screen flex-col items-center space-y-8 py-10 md:py-24">
                <div className="flex flex-col space-y-8 items-center w-full max-w-md px-8 md:py-16 md:shadow-xl rounded-xl md:bg-white">
                    <img className="h-[70px] md:h-[100px]" src="/logo.png" />
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)} 
                            className="flex flex-col w-full md:w-2/3 space-y-6"
                        >
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
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="text-base">Password</FormLabel>
                                    <FormControl>
                                        <InputPassword 
                                            showPassword={showPassword}
                                            setShowPassword={setShowPassword} 
                                            type={ showPassword ? "text" : "password" }
                                            value={field.value}
                                            onChange={field.onChange}
                                            className="text-base"
                                        />
                                    </FormControl>
                                    <div className="flex">
                                        <Link className="text-sm text-neutral-500 hover:text-neutral-300 transition ease-in-out delay-50 duration-200" href="/reset">Forgot Password?</Link>
                                    </div>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="self-center rounded-full w-full bg-indigo-600 hover:bg-indigo-300">Login</Button>
                        </form>
                    </Form>
                </div>
            </main>
        </ScrollArea>
    )
}