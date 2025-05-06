import * as React from "react"
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
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
import { ArrowDown, CheckCheckIcon } from "lucide-react"

export type ComboboxOption = {
  value: string
  label?: string
}

type ComboboxProps = {
  options: ComboboxOption[]
  placeholder?: string
  defaultValue?: string | ComboboxOption
  onSelect?: (value: string) => void
  className?: string
  emptyMessage?: string
}

export function ReusableCombobox({
  options,
  placeholder = "Select an option...",
  defaultValue,
  onSelect,
  className,
  emptyMessage = "No option found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  React.useEffect(() => {
    if (defaultValue) {
      if (typeof defaultValue === "string") {
        const option = options.find(opt => opt.value === defaultValue || opt.label === defaultValue)
        if (option) {
          setValue(option.value)
        }
      } else {
        setValue(defaultValue.value)
      }
    }
  }, [defaultValue, options])

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue
    setValue(newValue)
    setOpen(false)
    if (onSelect) {
      onSelect(newValue)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                >
                  {option.label}
                  <CheckCheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}