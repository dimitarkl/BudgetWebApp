"use client"

import { PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ExpenseEntry } from "../expense-entry/ExpenseEntry"
import { getExpenses } from "@/api/expenses"
import { useEffect, useState } from "react"
import { Spinner } from "../ui/spinner"
import { Button } from "../ui/button"
import { DialogTrigger } from "../ui/dialog"
import { Dialog } from "@radix-ui/react-dialog"
import { PlusCircle } from "lucide-react"

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
export default function Dashboard() {
    const [totalSpending, setTotalSpending] = useState(0)
    const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>()
    const [recentTransactions, setRecentTransactions] = useState<Expenses>([])
    const currency = "BGN"
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getExpenses(1);
                if (!(response instanceof Error)) {
                    const spending = response.reduce((sum, item) => sum + item.sum, 0);
                    setTotalSpending(spending);
                    setAggregatedData(aggregateData(response));
                    setRecentTransactions(response.reverse().slice(0, 5));
                }
            } catch (error) {
                console.error('Error fetching data:');
            }
        };

        fetchData();
    }, []);

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
                return 'hsl(var(--chart-3))'
                break

        }
    }

    const aggregateData = (data: Expenses): AggregatedData[] => {
        const aggregatedData: Record<string, AggregatedData> = {};

        data.forEach(item => {
            const type = item.type;
            const sum = item.sum;
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
                            <CardDescription >Your expenses by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {aggregatedData
                                ?

                                <ChartContainer
                                    config={Object.fromEntries(aggregatedData.map(item => [item.type.toLowerCase(), { label: item.type }]))}
                                    className="mt-5"
                                >
                                    <PieChart>
                                        <Pie
                                            data={aggregatedData}
                                            dataKey="sum"
                                            nameKey="type"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius="75%"
                                            label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
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
                            <CardTitle>Total Spending</CardTitle>
                            <CardDescription>Your expenses this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">{totalSpending.toFixed(2)} {currency}</p>
                            <p className="text-sm text-gray-500 mt-2">Total spent across all categories</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                        <CardDescription>Your latest expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-gray-200">
                            {recentTransactions.map((transaction) => (
                                <li key={transaction.id} className="py-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-medium truncate">{transaction.description
                                            ? transaction.description
                                            : 'No data'
                                        }</p>
                                        <p className="text-sm text-gray-500">{transaction.createdAt}</p>
                                    </div>
                                    <p className="font-semibold">${transaction.sum.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}