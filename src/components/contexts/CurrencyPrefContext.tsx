import { listenToUserPreference } from '@/api/expenses';
import { createContext, useEffect, useState } from 'react'


type Currency = 'USD' | 'BGN' | 'EUR'

type Props = {
    children: React.ReactNode
}

export const CurrencyContext = createContext<Currency | null>(null);



export const CurrencyProvider = (props: Props) => {
    const [currency, setCurrency] = useState<Currency>('BGN')

    useEffect(() => {
        const getCurrency = async () => {
            const response = await listenToUserPreference()
            if (response != undefined) setCurrency(response)
            console.log(response)
        }
        getCurrency()
        //TODO Too Consuming
    }, [props])
    return (
        <CurrencyContext.Provider value={currency}>
            {props.children}
        </CurrencyContext.Provider>
    )

}