"use client"

import * as React from "react"
import { format, getYear, startOfToday } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { cn } from "@/lib/utils"
import { CalendarPickerMonthYear } from "@/components/ui/calendar-picker-month-year"
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select"

export default function DatePickerMonthYear({ value, onChange, ...props }: { value: any, onChange: any, disabled?: any, className?: string }) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        props.className
                    )}
                >
                    {/* <CalendarIcon className="mr-2 h-4 w-4" /> */}
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <CalendarPickerMonthYear
                    mode="single"
                    captionLayout="dropdown-buttons"
                    selected={value}
                    onSelect={onChange}
                    fromYear={1960}
                    toYear={getYear(startOfToday())}
                    initialFocus
                    disabled={props.disabled}
                />
            </PopoverContent>
        </Popover>
      )
}