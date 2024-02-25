import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const STANDING_TYPES: any = ['bad', 'associate', 'probationary', 'good', 'pledge', 'leave'];

const formSchema = z.object({
    name: z.string().min(1),
    email: z.string().min(5, {
        message: "Email must be at least 5 characters.",
    }).email("Invalid email."),
    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number."),
    pledgeTerm: z.string().min(1),
    serviceHoursTerm: z.number().nonnegative(),
    fundraising: z.number().nonnegative(),
    violations: z.number().nonnegative(),
    dues: z.number().nonnegative(),
    flyering: z.number().nonnegative(),
    standing: z.enum(STANDING_TYPES)
});

export default function EditForm({ i, user }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            pledgeTerm: '',
            serviceHoursTerm: 0,
            fundraising: 0,
            violations: 0,
            dues: 0,
            flyering: 0,
            standing: null
        }
    });

    React.useEffect(() => {
        if (user) {
            form.setValue('name', user.name);
            form.setValue('email', user.email);
            form.setValue('phoneNumber', user.phoneNumber);
            form.setValue('pledgeTerm', user.pledgeTerm);
            form.setValue('serviceHoursTerm', user.serviceHoursTerm);
            form.setValue('fundraising', user.fundraising);
            form.setValue('violations', user.violations);
            form.setValue('dues', user.dues);
            form.setValue('flyering', user.flyering);
            form.setValue('standing', user.standing);
        }
    }, [user]);

    return (
        <Form {...form}>
            <form className="flex flex-col space-y-4 pb-8">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: Thane S. Cooley" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
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
                        <Input className="text-base" placeholder="Ex: apox@gmail.com" type="email" {...field} />
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
                        <Input className="text-base" placeholder="Ex: (111) 111-1111" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
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
                        <Input className="text-base" placeholder="Ex: Beta Eta" type="text" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="serviceHoursTerm"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Service Hours</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: 15" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="fundraising"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fundraising</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: 100" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                        Don't prepend dollar sign $.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="violations"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Violations</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: 2" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="dues"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Dues</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: 100" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
                        Don't prepend dollar sign $.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="flyering"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Flyering Hours</FormLabel>
                    <FormControl>
                        <Input className="text-base" placeholder="Ex: 4" type="number" {...field} />
                    </FormControl>
                    <FormDescription>
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
                            <SelectTrigger className="flex items-center justify-between p-2 rounded-md border text-base w-full sm:max-w-[250px]">
                                <SelectValue placeholder="Select an event type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup className="text-start">
                                    <SelectLabel>Standing</SelectLabel>
                                    {
                                        STANDING_TYPES.map((standingType: string, i: number) => {
                                            const name = standingType.charAt(0).toUpperCase() + standingType.slice(1);
                                            return <SelectItem key={i} value={standingType}>{name}</SelectItem>
                                        }) 
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
            </form>
        </Form>
    )
}