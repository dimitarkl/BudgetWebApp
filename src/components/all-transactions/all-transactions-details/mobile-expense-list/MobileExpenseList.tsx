import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import AllTransactionDetails from "../AllTransactionDetails"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

type Expense = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}
type Expenses = Expense[]

type SortOption = 'Date' | 'Amount' | 'Type'

type Props = {
    sortData: (column: keyof Expense) => void;
    sortDirection: "asc" | "desc";
    spendingData: Expenses;
    currency: string;
    setSortDirection: React.Dispatch<React.SetStateAction<"asc" | "desc">>
    sortColumn: keyof Expense
}


export default function MobileExpenseList({
    sortData,
    sortDirection,
    spendingData,
    currency,//
    setSortDirection,
    sortColumn

}: Props) {
    const [sortOption, setSortOption] = useState<SortOption>('Date')

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        sortData(sortColumn);
    };

    return (

        <div className="mt-4 space-y-4">
            <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <span>Sort by: {sortOption}</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => {
                            sortData('createdAt')
                            setSortOption('Date')
                        }}>Date</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            sortData('sum')
                            setSortOption('Amount')
                        }}>Amount</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                            sortData('type')
                            setSortOption('Type')
                        }}>Type</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button onClick={toggleSortDirection} className="sm:w-auto">
                    {sortDirection === 'asc' ? (

                        <ChevronUp className=" h-4 w-4" />

                    ) : (

                        <ChevronDown className=" h-4 w-4" />

                    )}
                </Button>
            </div>
            <div className="space-y-4">
                {spendingData.map((expense, index) => (
                    <Card key={index}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-small">{expense.createdAt}</span>
                                <span className="font-bold text-xl">{expense.sum.toFixed(2)} {currency}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>{expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}</span>
                                <AllTransactionDetails currency={currency} expense={expense} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}