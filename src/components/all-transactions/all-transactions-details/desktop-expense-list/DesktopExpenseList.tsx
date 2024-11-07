import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import AllTransactionDetails from "../AllTransactionDetails";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button";
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
    sortColumn: keyof Expense
    sortDirection: "asc" | "desc";
    sortData: (column: keyof Expense) => void;
    spendingData: Expenses;
    currency: string;
}
export default function DesktopExpenseList({
    sortColumn,
    sortDirection,
    sortData,
    spendingData,
    currency
}: Props) {

    const renderSortArrow = (column: keyof Expense) => {
        if (column === sortColumn) {
            return sortDirection === 'asc' ? <ArrowUp className=" h-4 w-4" /> : <ArrowDown className=" h-4 w-4" />;
        }
        return <ArrowUpDown className=" h-4 w-4" />;
    };

    return (
        <div className="hidden md:flex ">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead >
                            <Button variant="ghost" onClick={() => sortData('createdAt')} className="p-0 h-auto font-bold">
                                Date

                                {renderSortArrow('createdAt')}
                            </Button>
                        </TableHead>
                        <TableHead >
                            <Button variant="ghost" onClick={() => sortData('type')} className="p-0 h-auto font-bold">
                                Type
                                {renderSortArrow('type')}
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">
                            <Button variant="ghost" onClick={() => sortData('sum')} className="p-0 h-auto font-bold">
                                Amount
                                {renderSortArrow('sum')}
                            </Button>
                        </TableHead>
                        <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spendingData.map((expense, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{expense.createdAt}</TableCell>
                            <TableCell>{expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}</TableCell>
                            <TableCell className="text-right">{expense.sum.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                                <AllTransactionDetails currency={currency} expense={expense} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}