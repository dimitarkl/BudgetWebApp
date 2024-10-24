'use client'

import { useState } from 'react'
import { Check, ChevronDown, CreditCard } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'BGN', symbol: 'лв' },
]

export default function CurrencySelector() {
    const [currency, setCurrency] = useState(currencies[0])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-dashed">
                    {currency.code}
                    <ChevronDown className=" h-3 w-3 " />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {currencies.map((item) => (
                    <DropdownMenuItem
                        key={item.code}
                        onClick={() => setCurrency(item)}
                        className="flex items-center justify-between"
                    >
                        <span>
                            {item.symbol} {item.code}
                        </span>
                        {currency.code === item.code && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}