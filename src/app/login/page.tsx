"use client"
 
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
import { toast } from "@/components/ui/use-toast"
import React from "react"
import { InputPassword } from "@/components/ui/input-password"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const STANDING: any = ['pledge', 'good', 'probationary', 'bad', 'associate', 'leave']
 
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
    const supabase = createClientComponentClient();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password
        })
        .then(() => {
            toast({
                title: "You submitted the following values:",
                description: (
                    <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
                ),
            });
        })
      }

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 py-24">
            <div className="flex flex-col items-center w-full max-w-md">
                <h1>Login Page</h1>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="flex flex-col w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@email.com" type="email" {...field} />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <InputPassword 
                                        showPassword={showPassword}
                                        setShowPassword={setShowPassword} 
                                        type={ showPassword ? "text" : "password" }
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-center">Login</Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}