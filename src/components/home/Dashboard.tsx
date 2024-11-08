"use client"

import { PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import ExpenseEntry from "../expense-entry/ExpenseEntry"
import { getExpenses, listenToUserPreference } from "@/api/expenses"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { DialogTrigger } from "../ui/dialog"
import { Dialog } from "@radix-ui/react-dialog"
import { PlusCircle } from "lucide-react"
import AllTransactionDetails from "../all-transactions/all-transactions-details/AllTransactionDetails"

type Expenses = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}[]
type AggregatedData = {
    type: string;
    sum: number;
    color: string | undefined;
};
type Period = 1 | 3 | 6 | 12;

const timePeriods: Period[] = [1, 3, 6, 12]

export default function Dashboard() {
    const [totalSpending, setTotalSpending] = useState(0)
    const [selectedPeriod, setSelectedPeriod] = useState<Period>(1)
    const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>()
    const [recentTransactions, setRecentTransactions] = useState<Expenses>([])
    const [currency, setCurrency] = useState('BGN')
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getExpenses(selectedPeriod);
                if (!(response instanceof Error)) {
                    const spending = response.reduce((sum, item) => sum + item.sum, 0);
                    setTotalSpending(spending);
                    setAggregatedData(aggregateData(response));
                    setRecentTransactions(response.slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching data:');
            }
        };

        fetchData();
    }, [selectedPeriod]);
    useEffect(() => {
        listenToUserPreference()
            .then((response) => setCurrency(response))
    }, [])

    function checkColor(data: any) {
        //TODO the larger usage should be bigger
        switch (data.type) {
            case 'food & Drinks':
                return 'hsl(var(--chart-1))'
                break
            case "shopping":
                return 'hsl(var(--chart-2))'
                break
            case "transportation":
                return 'hsl(var(--chart-3))'
                break;
            case "entertainment":
                return 'hsl(var(--chart-4))'
                break;
            case "utilities":
                return 'hsl(var(--chart-5))'
                break
            case "other":
                //TODO add another color 
                return 'hsl(var(--chart-6))'
                break

        }
    }

    const aggregateData = (data: Expenses): AggregatedData[] => {
        const aggregatedData: Record<string, AggregatedData> = {};

        data.forEach(item => {
            const type = item.type;
            if (item.sum > 0) return
            const sum = -item.sum;
            if (aggregatedData[type])
                aggregatedData[type].sum += sum;
            else {
                aggregatedData[type] = {
                    type: type,
                    sum: sum,
                    color: checkColor(item)
                };
            }
        });
        return Object.values(aggregatedData);
    };
    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-4xl w-full mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold ">BudgetWebApp</h1>
                        <p className="text-gray-400">Your personal finance tracker</p>
                    </div>
                    <div className="">
                        <Dialog>
                            <DialogTrigger asChild>

                                <Button className="bg-primary hover:bg-primary/90">
                                    <PlusCircle />
                                    Add Expense
                                </Button>
                            </DialogTrigger>
                            <ExpenseEntry inputType="Create" />
                        </Dialog>
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending Overview</CardTitle>
                            <CardDescription >Your expenses by category for {selectedPeriod} months</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2 mb-3 ">
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
                            {aggregatedData
                                ?

                                <ChartContainer
                                    config={Object.fromEntries(aggregatedData.map(item => [item.type, { label: item.type.charAt(0).toUpperCase() + item.type.slice(1) }]))}
                                    className="mt-5"
                                >
                                    <PieChart>
                                        <Pie
                                            data={aggregatedData}
                                            dataKey="sum"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="68"
                                            label={({ type, percent }) => `${type.charAt(0).toUpperCase() + type.slice(1)} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {aggregatedData?.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                                : <Spinner />
                            }
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle >Total Balance</CardTitle>
                            {selectedPeriod == 1
                                ? <CardDescription>Your balance for this month</CardDescription>
                                : <CardDescription>Your balance for {selectedPeriod} months</CardDescription>
                            }
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{totalSpending?.toFixed(2)} {currency}</p>
                            <p className="text-sm text-gray-500 mt-2">Total spent across all categories</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-gray-200">
                            {recentTransactions.map((transaction) => (
                                <Dialog key={transaction.id}>
                                    <DialogTrigger asChild>
                                        <li key={transaction.id} className="py-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-medium truncate">{transaction.description
                                                    ? transaction.description
                                                    : 'No data'
                                                }</p>
                                                <p className="text-sm text-gray-500">{transaction.createdAt}</p>
                                            </div>
                                            <p className="font-semibold">{transaction.sum} {currency}</p>
                                        </li>
                                    </DialogTrigger>
                                    <AllTransactionDetails currency={currency} expense={transaction} />
                                </Dialog>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}