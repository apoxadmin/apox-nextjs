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

const EVENT_TYPES: any = ['service', 'fellowship', 'fundraising', 'family'];

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
    shifts: z.object({ startDate: z.date().default(startOfToday()), endDate: z.date().default(startOfToday()) }).array().default([])
    .refine((array) => array.every(({ startDate, endDate}) => isBefore(startDate, endDate)), {
        message: 'Ending times must be after starting times.',
    })
  })
  

export default function EventForm() {
    const [userData, setUserData] = React.useState<any>(null);
    const supabase = createClientComponentClient();

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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values.type);
        const eventTypeResponse = await supabase.from('event_types').select().eq('name', values.type).maybeSingle();

        if (eventTypeResponse.error) {
            console.error("Invalid event type.");
            return;
        }

        const eventTypeKey = eventTypeResponse.data.id;

        const eventResponse = await supabase.from('events').insert({
            type: eventTypeKey,
            name: values.name,
            description: values.description,
            location: values.location,
            startDate: values.dates.startDate,
            endDate: values.dates.endDate,
            limit: values.limit,
            shifts: values?.shifts,
            creator: userData.id
        })
        
        if (eventResponse.error) {
            console.error('Could not create event: ', eventResponse.error);
        }
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
                                    <SelectTrigger className="flex items-center justify-between p-2 rounded-md border text-sm w-[180px]">
                                        <SelectValue placeholder="Select an event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup className="text-start">
                                            <SelectLabel>Event Types</SelectLabel>
                                            {
                                                EVENT_TYPES.map((eventType: string, i: number) => {
                                                    const name = eventType.charAt(0).toUpperCase() + eventType.slice(1);
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
                                <Input placeholder="Ex: Beach Cleanup" {...field}/>
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
                                <Textarea 
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
                                <Textarea 
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
                                <DatePickerForm 
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
                                <Input {...field}/>
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
                                <Checkbox 
                                    checked={field.value}
                                    onCheckedChange={(value) => {
                                        field.onChange(value);
                                        if (value && form.getValues('shifts').length == 0) {
                                            form.setValue('shifts', [ { startDate: form.getValues('day') ?? startOfToday(), endDate: form.getValues('day') ?? startOfToday() } ]);
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
                                        <div key={i} className="flex items-center w-full space-x-2">
                                            <TimeRangePicker value={value} onChange={(dateRange) => {
                                                const shifts = field.value;
                                                console.log('change time');
                                                console.log(shifts);
                                                shifts[i] = dateRange;
                                                form.setValue('shifts', shifts);
                                            }}/>
                                            <Button type="button" onClick={_ => {
                                                    const shifts = field.value;
                                                    console.log('splice')
                                                    console.log(shifts);
                                                    const sub = shifts.splice(i, 1);
                                                    console.log(sub);
                                                    form.setValue('shifts', shifts);
                                                }}
                                                className="bg-red-700 hover:bg-red-600"
                                            >
                                                Del
                                                </Button>
                                            {}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            <Button 
                                type="button" 
                                onClick={_ => { console.log('hi'); field.onChange([...field.value, { startDate: form.getValues('day') ?? startOfToday(), endDate: form.getValues('day') ?? startOfToday() }]) }}
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