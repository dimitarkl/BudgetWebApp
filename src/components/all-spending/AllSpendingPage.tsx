"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getExpenses } from "@/api/expenses"
import { Spinner } from "../ui/spinner"
import { Info } from "lucide-react"
type Period = 1 | 3 | 6 | 12;

type Expenses = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}[]

const timePeriods: Period[] = [1, 3, 6, 12]

export default function AllSpendingsPage() {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(1)
    const [spendingData, setSpendingData] = useState<Expenses>()
    const [totalSpending, setTotalSpending] = useState(0)
    const currency = '$'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getExpenses(selectedPeriod);
                if (!(response instanceof Error)) {
                    setSpendingData(response);
                    //TODO monthly spending
                    setTotalSpending((response.reduce((sum, item) => sum + item.sum, 0)))
                }
            } catch (error) {
                console.error('Error fetching data:');
            }
        };
        fetchData()
        return () => {
            fetchData()
        }
    }, [selectedPeriod])

    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-xl mx-auto">
                <div className="flextext-center justify-center">
                    <h1 className="text-5xl font-bold mb-2 ">All Spendings</h1>
                    <p className="text-gray-100">Everything you have spend</p>
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
                        <CardTitle >Total Spending</CardTitle>
                        <CardDescription >For the last {selectedPeriod} months</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold ">{currency}{totalSpending.toFixed(2)}</p>
                    </CardContent>
                </Card>

                <Card >
                    <CardHeader>
                        <CardTitle>All Expenses</CardTitle>
                        <CardDescription >Detailed list of all expenses for the last {selectedPeriod} months</CardDescription>
                    </CardHeader>
                    {spendingData ?
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead >Date</TableHead>
                                        <TableHead >Type</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="text-right">Details</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {spendingData.map((expense: any, index: any) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium ">{(expense.createdAt)}</TableCell>
                                            <TableCell >{expense.type}</TableCell>
                                            <TableCell className="text-right ">{currency}{expense.sum.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <Info className="h-4 w-4" />
                                                            <span className="sr-only">View details</span>
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] ">
                                                        <DialogHeader>
                                                            <DialogTitle>Expense Details</DialogTitle>
                                                            <DialogDescription >
                                                                Full information about this expense.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="font-bold">Date:</span>
                                                                <span className="col-span-3">{expense.createdAt}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="font-bold">Category:</span>
                                                                <span className="col-span-3">{expense.type}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="font-bold">Amount:</span>
                                                                <span className="col-span-3">{currency}{expense.sum.toFixed(2)}</span>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <span className="font-bold">Description:</span>
                                                                <span className="col-span-3">{expense.description}</span>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                        : <div><Spinner /></div>}
                </Card>
            </div>
        </div >
    )
}