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
import { createUser } from "@/lib/supabase/actions"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const STANDING: any = ['pledge', 'good', 'probationary', 'bad', 'associate', 'leave']
 
const FormSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character"),
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email."),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number."),
    pledgeTerm: z.string(),
    standing: z.enum(STANDING, {
        required_error: "Standing is required."
    })
});

export default function SignUpPage() {
    const [showPassword, setShowPassword] = React.useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            phoneNumber: "",
            pledgeTerm: "",
            standing: "good"
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        createUser(data)
        .then(() => {
            console.log('Success!')
        })
        .catch((error) => {
            console.error(error);
        })
        // signupUser(data)
        // .then(() => {
        //     toast({
        //         title: "You submitted the following values:",
        //         description: (
        //             <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //                 <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        //             </pre>
        //         ),
        //     });
        // })
      }

    return (
        <main className="flex min-h-screen flex-col items-center space-y-8 p-24">
            <div className="flex flex-col items-center w-full max-w-lg">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="flex flex-col w-2/3 space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Thane S. Cooley" type="text" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: you@email.com" type="email" {...field} />
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
                                <FormDescription>
                                    At least 8 characters.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: (000) 000-0000" type="tel" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use the 2 letter term.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pledgeTerm"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pledge Term</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: BZ" type="text" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Use the 2 letter term.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="standing"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Standing</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="flex items-center justify-between p-2 rounded-md border text-sm w-[180px]">
                                                <SelectValue placeholder="Select an event type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="text-start">
                                                    <SelectLabel>Standing Type</SelectLabel>
                                                    {
                                                        STANDING.map((standingType: string, i: number) => {
                                                            const name = standingType.charAt(0).toUpperCase() + standingType.slice(1);
                                                            return <SelectItem key={i} value={standingType}>{name}</SelectItem>
                                                        }) 
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="self-center">Create User</Button>
                    </form>
                </Form>
            </div>
        </main>
    )
}