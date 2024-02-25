'use client'

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import DatePickerMonthYear from "@/components/ui/date-picker-month-year"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { createClient } from "@/utils/supabase/client"
import { getMyUser } from "@/utils/supabase/userServerActions"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email."),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number."),
    major: z.string().min(1, "Major must be at least 1 character").optional().or(z.literal('')),
    linkedin: z.string().min(1, "LinkedIn must be at least 1 character").optional().or(z.literal('')),
    instagram: z.string().min(1, "Instagram must be at least 1 character").optional().or(z.literal('')),
    facebook: z.string().min(1, "Facebook must be at least 1 character").optional().or(z.literal('')),
    birthday: z.date().nullable(),
    address: z.string().min(1, "Address must be at least 1 character").optional().or(z.literal('')),
});

export default function ProfileForm() {
    const { toast } = useToast();
    const supabase = createClient();
    const [userData, setUserData] = React.useState<any>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            phoneNumber: '',
            major: '',
            linkedin: '',
            instagram: '',
            facebook: '',
            birthday: null,
            address: ''
        }
    });

    React.useEffect(() => {
        async function fetchUserData() {
            setUserData(await getMyUser());
        }
        fetchUserData();
    }, []);

    React.useEffect(() => {
        
        if (userData != null) {
            form.setValue('email', userData['email']);
            form.setValue('phoneNumber', userData['phoneNumber']);
            form.setValue('major', userData['major']);
            form.setValue('linkedin', userData['linkedin']);
            form.setValue('instagram', userData['instagram']);
            form.setValue('facebook', userData['facebook']);
            form.setValue('birthday', userData['birthday']);
            form.setValue('address', userData['address']);
        }
        
    }, [userData])

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // console.log(values);
        // console.log(userData)
        const { error } = await supabase.from('users').update(values).eq('id', userData.id);
        if (!error) {
            toast({
                title: 'Success!',
                description: 'Your changes were saved.'
            })
        }
    }

    return <>
        {
            userData ? <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
                <h1 className="text-2xl md:text-4xl font-medium text-center">{userData?.name}</h1>
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input className="text-base" placeholder="Ex: you@email.com" type="email" {...field} />
                        </FormControl>
                        <FormDescription>
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
                            <Input className="text-base" placeholder="Ex: (000) 000-0000" type="tel" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="major"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Major</FormLabel>
                        <FormControl>
                            <Input className="text-base" placeholder="Ex: Biology" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                            <Textarea className="text-base" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="birthday"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Birthday</FormLabel>
                        <FormControl>
                            <DatePickerMonthYear 
                                    value={field.value} 
                                    onChange={field.onChange}
                                    className="text-base w-full"
                                />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                            <Input  className="text-base" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                            <Input  className="text-base" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                            <Input  className="text-base" {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="self-center" type="submit">Update profile</Button>
            </form>
        </Form> : <SkeletonCard />
        }
    </>
}