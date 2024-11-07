"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getExpenses, listenToUserPreference } from "@/api/expenses"
import { Spinner } from "../ui/spinner"
import AllTransactionDetails from "./all-transactions-details/AllTransactionDetails"
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react"
import { Error } from "../error/Error"
import { isError } from "@/lib/errorCheck"
import MobileExpenseList from "./all-transactions-details/mobile-expense-list/MobileExpenseList"
type Period = 1 | 3 | 6 | 12;

type Expense = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}
type Expenses = Expense[]

const timePeriods: Period[] = [1, 3, 6, 12]
export default function AllTransactionsPage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(1)
    const [spendingData, setSpendingData] = useState<Expenses>([])
    const [totalSpending, setTotalSpending] = useState(0)
    const [currency, setCurrency] = useState('BGN')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
    const [sortColumn, setSortColumn] = useState<keyof Expense>('createdAt')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getExpenses(selectedPeriod);
                if (!isError(response)) {
                    setSpendingData(response);
                    setTotalSpending((response.reduce((sum, item) => sum + item.sum, 0)))
                } else {
                    setErrorMessage('Error fetching transaction data')
                }
            } catch (error) {
                setErrorMessage('Error fetching transaction data')
                console.log('Error fetching transaction data:' + (error as Error).message)

            }
        };
        fetchData()
        return () => {
            fetchData()
        }
    }, [selectedPeriod])
    useEffect(() => {
        listenToUserPreference()
            .then((response) => setCurrency(response))
            .catch((err) => console.log('Error fetching currency data:' + (err as Error).message))
    }, [])

    const sortData = (column: keyof Expense) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
        const sortedData = [...spendingData].sort((a, b) => {
            const aValue = a[column];
            const bValue = b[column];

            if (typeof aValue === 'string' && typeof bValue === 'string')
                return sortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            else if (typeof aValue === 'number' && typeof bValue === 'number')
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;


            return 0;
        });

        setSpendingData(sortedData);
    }

    const renderSortArrow = (column: keyof Expense) => {
        if (column === sortColumn) {
            return sortDirection === 'asc' ? <ArrowUp className=" h-4 w-4" /> : <ArrowDown className=" h-4 w-4" />;
        }
        return <ArrowUpDown className=" h-4 w-4" />;
    };

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-xl mx-auto">
                <div className="flextext-center justify-center">
                    <h1 className="text-5xl font-bold mb-2 ">All Transactions</h1>
                    <p>Everything you have spend and earned</p>
                    <div className="flex flex-wrap gap-2 mb-6 mt-6">
                        {timePeriods.map((period) => (
                            <Button
                                key={period}
                                onClick={() => setSelectedPeriod(period)}
                                variant={selectedPeriod === period ? "default" : "outline"}
                                className={selectedPeriod === period ? "bg-primary" : "bg-gray-800 text-gray-100"}
                                size="sm"
                            >
                                {period}
                            </Button>
                        ))}
                    </div>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle >Total Balance</CardTitle>
                        <CardDescription >For the last {selectedPeriod} months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold ">{totalSpending.toFixed(2)} {currency}</p>
                    </CardContent>
                </Card>

                <Card >
                    <CardHeader>
                        <CardTitle>All Transactions</CardTitle>
                        <CardDescription >Detailed list of all transactions for the last {selectedPeriod} months</CardDescription>
                    </CardHeader>
                    {errorMessage
                        ? <Error message={errorMessage} className="fixed top-16 left-1/2 transform bg-black -translate-x-1/2 z-50" />
                        : spendingData ?
                            <CardContent>
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
                                <MobileExpenseList
                                    sortData={sortData}
                                    sortDirection={sortDirection}
                                    spendingData={spendingData}
                                    currency={currency}
                                    setSortDirection={setSortDirection}
                                    sortColumn={sortColumn}
                                />

                            </CardContent>
                            : <div><Spinner /></div>
                    }
                </Card >
            </div >
        </div >
    )
}