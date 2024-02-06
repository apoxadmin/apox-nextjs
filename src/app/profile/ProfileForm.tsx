'use client'

import { useAuthContext } from "@/lib/firebaseAuth"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import React from "react"
import { getProfile } from "@/lib/contenfulCDN"
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
import { updateDoc } from "@/lib/contentfulCMA"
import { toField } from "@/lib/contentfulClientUtils"
import { toast } from "@/components/ui/use-toast"
import DatePickerMonthYear from "@/components/ui/date-picker-month-year"

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email."),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number."),
    major: z.string().min(1, "Major must be at least 1 character").optional(),
    linkedIn: z.string().min(1, "LinkedIn must be at least 1 character").optional(),
    instagram: z.string().min(1, "Instagram must be at least 1 character").optional(),
    facebook: z.string().min(1, "Facebook must be at least 1 character").optional(),
    birthday: z.date().optional(),
    address: z.string().min(1, "Address must be at least 1 character").optional(),
});

export default function ProfileForm() {
    const { user } = useAuthContext();
    const [userData, setUserData] = React.useState<any>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            'email': '',
            'phoneNumber': '',
            'major': '',
            'linkedIn': '',
            'instagram': '',
            'facebook': '',
            'address': ''
        }
    });
    
    React.useEffect(() => {
        async function fetchUser() {
            const userData: any = await getProfile(await user.getIdToken());
            setUserData(userData);
            form.setValue('email', userData['email']);
            form.setValue('phoneNumber', userData['phoneNumber']);
            form.setValue('major', userData['major']);
            form.setValue('linkedIn', userData['linkedIn']);
            form.setValue('instagram', userData['instagram']);
            form.setValue('facebook', userData['facebook']);
            form.setValue('birthday', userData['birthday']);
            form.setValue('address', userData['address']);
        }

        fetchUser();
    }, [])

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        
        for (const value in values) {
            if (values[value] == undefined) {
                delete values[value];
            }
            else {
                values[value] = toField(values[value])
            }
        }
        updateDoc({ content_type: 'user' }, values)
        .then(() => {
            toast({
                title: "You updated your profile!",
            });
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: you@email.com" type="email" {...field} />
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
                            <Input placeholder="Ex: (000) 000-0000" type="tel" {...field} />
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
                            <Input placeholder="Ex: Biology" {...field} />
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
                            <Textarea {...field} />
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
                                    className="w-full"
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
                    name="linkedIn"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
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
                            <Input {...field} />
                        </FormControl>
                        <FormDescription>
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="self-center" type="submit">Update profile</Button>
            </form>
        </Form>
    )
}