"use client"

import { Check, ChevronsUpDown, } from "lucide-react"

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
import { useEffect, useState } from "react"

const expenseTypes = [
    {
        value: "food & Drinks",
        label: "Food & Drinks",
    },
    {
        value: "shopping",
        label: "Shopping",
    },
    {
        value: "transportation",
        label: "Transportation",
    },
    {
        value: "entertainment",
        label: "Entertainment",
    },
    {
        value: "other",
        label: "Other",
    }, {
        value: "utilities",
        label: "Utilities",
    }
]

type Props = {
    type: (data: string) => void,
    expense?: {
        id: string;
        userId: string;
        createdAt: string;
        sum: number;
        type: string;
        description?: string;
    },
}

export default function ExpenseType(
    {
        type,
        expense

    }: Props) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    useEffect(() => {
        const exists = () => {
            if (expense) {
                type(expense.type)
                setValue(expense.type)
            }
        }
        exists()
    }, [])
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full"
                >
                    {value
                        ? expenseTypes.find((type) => type.value === value)?.label
                        : "Search type of expense..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search type of expense..." />
                    <CommandList>
                        <CommandEmpty>No types found.</CommandEmpty>
                        <CommandGroup>
                            {expenseTypes.map((expenseType) => (
                                <CommandItem
                                    key={expenseType.value}
                                    value={expenseType.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        type(currentValue);
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === expenseType.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {expenseType.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
