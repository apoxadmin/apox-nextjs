'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectTrigger, SelectGroup, SelectItem, SelectLabel, SelectValue } from "../ui/select";
import { Textarea } from "@/components/ui/textarea";
import DatePickerForm from "@/components/ui/date-picker";
import { getHours, getMinutes, isBefore, set, startOfToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import TimeRangePicker from "@/components/ui/TimeRangePicker";
import React from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "../ui/label";
import { createEvent } from "@/lib/supabase/client";
import { navigate } from "@/lib/actions";

const EVENT_TYPES: any = ['service', 'fellowship', 'fundraising', 'family', 'active credit', 'pledge credit', 'chapter meeting', 'pledge meeting'];

const formSchema = z.object({
    type: z.enum(EVENT_TYPES, {
        required_error: "Event type is required."
    }),
    name: z.string().min(1, {
        message: "Event name must be at least 1 character.",
    }),
    description: z.string().min(1, {
        message: "Description must be at least 1 character.",
    }),
    location: z.string().min(1, {
        message: "Location must be at least 1 character.",
    }),
    day: z.date(),
    dates: z.object({
        startDate: z.date(),
        endDate: z.date(),
    })
    .refine(({startDate, endDate}) => isBefore(startDate, endDate), {
        message: 'Ending time must be after starting time.',
    }),
    limit: z.coerce.number({
        invalid_type_error: "Limit must be a number."
    }).nonnegative({
        message: "Limit cannot be negative."
    }),
    shiftsEnabled: z.boolean(),
    shifts: z.object({ startDate: z.date().default(startOfToday()), endDate: z.date().default(startOfToday()), limit: z.number().nonnegative() }).array().default([])
    .refine((array) => array.every(({ startDate, endDate}) => isBefore(startDate, endDate)), {
        message: 'Ending times must be after starting times.',
    })
  })
  

export default function EventForm() {
    const [userData, setUserData] = React.useState<any>(null);
    const supabase = createClientComponentClient();
    const { toast } = useToast();

    React.useEffect(() => {
        async function fetchUserData() {
            const { data, error } = await supabase.auth.getUser();
            const result = await supabase.from('users').select().eq('uid', data.user.id).maybeSingle();
            const user = result.data;
            if (user != null) {
                setUserData(user);
            }
        }
        fetchUserData();
        
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            limit: 0,
            shiftsEnabled: false,
            shifts: []
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        createEvent(values)
        .then(() => {
            toast({
                title: 'Success!',
                description: 'You requested a new event.'
            });
            navigate('/calendar');
        })
        .catch(() => {
            toast({
                title: 'Error',
                description: 'Event could not be created.'
            })
        })
    }
    return <div className="w-full max-w-md text-gray-800">
        <Form {...form}>
            <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-8"
            >
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Type</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="flex items-center justify-between p-2 rounded-md border text-base w-full sm:max-w-[250px]">
                                        <SelectValue placeholder="Select an event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup className="text-start">
                                            <SelectLabel>Event Types</SelectLabel>
                                            {
                                                EVENT_TYPES.map((eventType: string, i: number) => {
                                                    const names = eventType.split(' ');
                                                    for (let i = 0; i < names.length; i++) {
                                                        names[i] = names[i].charAt(0).toUpperCase() + names[i].slice(1);
                                                    }
                                                    const name = names.join(' ');
                                                    return <SelectItem key={i} value={eventType}>{name}</SelectItem>
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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Event Name</FormLabel>
                            <FormControl>
                                <Input className="text-base" placeholder="Ex: Beach Cleanup" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className="text-base" 
                                    placeholder="What we'll be doing..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                                <Textarea className="text-base" 
                                    placeholder="Where the event takes place..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="day"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                                <DatePickerForm className="text-base" 
                                    value={field.value} 
                                    onChange={(newDate) => {
                                        field.onChange(newDate);
                                        const dates = form.getValues('dates');
                                        if (dates) {
                                            const { startDate, endDate } = dates;
                                            form.setValue('dates', { 
                                                startDate: set(newDate, { hours: getHours(startDate), minutes: getMinutes(startDate) }),
                                                endDate: set(newDate, { hours: getHours(endDate), minutes: getMinutes(endDate) }) 
                                            });
                                        }
                                        else {
                                            form.setValue('dates', { 
                                                startDate: newDate,
                                                endDate: newDate
                                            })
                                        }
                                    }}
                                    disabled={{before: startOfToday()}}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Time Range</FormLabel>
                            <FormControl>
                                
                                <TimeRangePicker value={field.value} onChange={field.onChange}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Person Limit</FormLabel>
                            <FormControl>
                                <Input className="text-base" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Leave as 0 or empty for unlimited.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="shiftsEnabled"
                    render={({ field }) => (
                        <div className="flex items-center space-x-2">
                            <FormLabel className="">Are there shifts?</FormLabel>
                            <FormControl>
                                <Checkbox className="text-base" 
                                    checked={field.value}
                                    onCheckedChange={(value) => {
                                        field.onChange(value);
                                        if (value && form.getValues('shifts').length == 0) {
                                            form.setValue('shifts', [ { startDate: form.getValues('day') ?? startOfToday(), endDate: form.getValues('day') ?? startOfToday(), limit: 0 } ]);
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    )}
                />
                { form.getValues('shiftsEnabled') &&
                <FormField
                    control={form.control}
                    name="shifts"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Shifts</FormLabel>
                            <FormControl>
                                <div className="flex flex-col w-full space-y-2">
                                    {field.value.map(
                                        (value, i) => 
                                        <div key={i} className="flex flex-col space-y-2 w-full outline outline-1 rounded-lg outline-neutral-200 p-2">
                                            <div className="flex items-center w-full space-x-2 justify-between">
                                                <TimeRangePicker
                                                    value={{ startDate: value.startDate, endDate: value.endDate }}
                                                    onChange={(dateRange) => {
                                                        const shifts = field.value;
                                                        shifts[i] = { ...dateRange, limit: value.limit };
                                                        form.setValue('shifts', shifts);
                                                    }}
                                                />
                                                <Button type="button" onClick={_ => {
                                                        const shifts = field.value;
                                                        shifts.splice(i, 1);
                                                        form.setValue('shifts', shifts);
                                                    }}
                                                    className="bg-red-700 hover:bg-red-600"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                            <div className="flex flex-col space-y-1">
                                                <Label>Shift Limit</Label>
                                                <Input
                                                    className="text-base"
                                                    placeholder="Ex: 4"
                                                    defaultValue={0}
                                                    value={value.limit ?? ''}
                                                    type="number"
                                                    onChange={(e) => {
                                                        const shifts = field.value;
                                                        shifts[i] = { ...value, limit: e.target.value ? parseInt(e.target.value) : null };
                                                        form.setValue('shifts', shifts);
                                                    }}
                                                />
                                                <h1 className="text-sm">Set to 0 for unlimited.</h1>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            <Button 
                                type="button" 
                                onClick={_ => { field.onChange([...field.value, { startDate: form.getValues('day') ?? startOfToday(), endDate: form.getValues('day') ?? startOfToday(), limit: 0 }]) }}
                                className="bg-green-700 hover:bg-green-600"
                            >
                                Add shift
                            </Button>
                        </FormItem>
                    )}
                />
                }
                
            <div className="self-center">
            <Button type="submit">Submit</Button>
            </div>
            </form>
        </Form>
    </div>
}