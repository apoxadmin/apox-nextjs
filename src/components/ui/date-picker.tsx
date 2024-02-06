"use client"

import * as React from "react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { cn } from "@/lib/utils"
import { CalendarPicker } from "@/components/ui/calendar-picker"

export default function DatePickerForm({ value, onChange, ...props }: { value: any, onChange: any, disabled?: any, className?: string }) {
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
            <CalendarPicker
              mode="single"
              selected={value}
              onSelect={onChange}
              initialFocus
              disabled={props.disabled}
            />
          </PopoverContent>
        </Popover>
      )
}