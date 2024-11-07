import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AllTransactionDetails from "../AllTransactionDetails"
import { ArrowDown, ArrowUp } from "lucide-react"

type Expense = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}
type Expenses = Expense[]


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
    currency,
    setSortDirection,
    sortColumn
}: Props) {

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        sortData(sortColumn);
    };

    const handleSort = (value: string) => {
        let newSortColumn: keyof Expense;

        switch (value) {
            case 'createdAt':
                newSortColumn = 'createdAt';
                break;
            case 'sum':
                newSortColumn = 'sum';
                break;
            case 'type':
                newSortColumn = 'type';
                break;
            default:
                newSortColumn = 'createdAt';
        }
        sortData(newSortColumn);
    }

    return (
        <div className="mt-4 space-y-4 md:hidden">
            <div className="flex flex-row  sm:flex-row justify-between items-start sm:items-center gap-2">
                <Select onValueChange={handleSort} defaultValue="createdAt">
                    <SelectTrigger className=" justify-center select-trigger-no-icon">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="createdAt">Date</SelectItem>
                        <SelectItem value="sum">Amount</SelectItem>
                        <SelectItem value="type">Type</SelectItem>
                    </SelectContent>
                </Select>
                <Button
                    className="p-3"
                    variant="outline"
                    size="icon"
                    onClick={toggleSortDirection}
                    aria-label={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                >
                    {sortDirection === 'asc'
                        ? <ArrowUp className=" h-5 w-5" />
                        : <ArrowDown className=" h-5 w-5" />
                    }
                </Button>
            </div>
            <div className="space-y-4">
                {spendingData.map((expense, index) => (
                    <Card key={expense.id || index}>
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