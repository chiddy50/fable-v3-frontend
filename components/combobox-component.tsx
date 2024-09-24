"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Status = {
  value: string
  label: string
}

type Combobox = { label: string, data: Status[], setValue: any, value: any, className: string }

export function ComboboxComponent({ label, data, value, setValue, className = '' }: Combobox) {
  const [open, setOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(
    null
  )

  return (
    //space-x-4
    <div className="flex items-center"> 
      {/* <p className="text-sm text-gray-200">{label}</p> */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn(className, "min-w-[150px] justify-start")}>
            {value ? <>{value.label}</> : <>+ Choose {label}</>}
            {/* {<>+ Set {label}</>} */}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder={`Change ${label}...`} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {data.map((status, index) => (
                  <CommandItem
                    key={`${status.value}_${index}`}
                    value={status.value}
                    onSelect={(value) => {
                      console.log(value);
                      
                      setValue(
                        data.find((priority) => priority.value === value) ||
                          null
                      )
                      setOpen(false)
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
