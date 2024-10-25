'use client'

import { useContext, useEffect, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listenToUserPreference, savePreference } from '@/api/expenses'
import UserContext from '../contexts/UserContext'
import { error } from 'console'
import { Currency } from 'firebase/analytics'

const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'BGN', symbol: 'лв' },
]

export default function CurrencySelector() {
    const [currency, setCurrency] = useState(currencies[0])
    const user = useContext(UserContext)

    useEffect(() => {
        const fetchCurrency = async () => {
            try {
                const response = await listenToUserPreference();
                const preferredCurrency = currencies.find((c) => c.code === response);
                if (preferredCurrency) {
                    setCurrency(preferredCurrency);
                }
            } catch (error) {
                console.error('Error fetching user preference:', error);
            }
        };

        fetchCurrency();
    }, [currencies]);


    const handleCurrencyChange = (newCurrency: {
        code: string;
        symbol: string;
    }) => {
        setCurrency(newCurrency);
        if (user) {
            savePreference(user.uid, newCurrency.code);
        }
    }
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
                        onClick={() => handleCurrencyChange(item)}
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