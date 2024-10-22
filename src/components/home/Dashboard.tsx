"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "../ui/button"
import { PlusCircle } from "lucide-react"
import { ExpenseEntry } from "../expense-entry/ExpenseEntry"
import { getExpenses } from "@/api/expenses"

const data = [
    { name: "Housing", value: 1200, color: "hsl(var(--chart-1))" },
    { name: "Food", value: 450, color: "hsl(var(--chart-2))" },
    { name: "Transportation", value: 300, color: "hsl(var(--chart-3))" },
    { name: "Utilities", value: 200, color: "hsl(var(--chart-4))" },
    { name: "Entertainment", value: 150, color: "hsl(var(--chart-5))" },
    { name: "Other", value: 100, color: "hsl(var(--chart-6))" },
]

const recentTransactions = [
    { id: 1, description: "Grocery Shopping", amount: 85.50, date: "2023-05-15" },
    { id: 2, description: "Electric Bill", amount: 120.00, date: "2023-05-14" },
    { id: 3, description: "Netflix Subscription", amount: 14.99, date: "2023-05-13" },
    { id: 4, description: "Gas Station", amount: 45.00, date: "2023-05-12" },
]
export default function Dashboard() {
    const totalSpending = data.reduce((sum, item) => sum + item.value, 0)

    return (
        <div className="min-h-screen p-3 md:p-8 min-w-fit">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Budget Buddy</h1>
                        <p className="text-gray-400">Your personal finance tracker</p>
                    </div>
                    <ExpenseEntry />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Spending Overview</CardTitle>
                            <CardDescription >Your expenses by category</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer
                                config={Object.fromEntries(data.map(item => [item.name.toLowerCase(), { label: item.name, color: item.color }]))}
                                className="h-[200px] mt-5"
                            >
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="75%"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Total Spending</CardTitle>
                            <CardDescription>Your expenses this month</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold">${totalSpending.toFixed(2)}</p>
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
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-gray-500">{transaction.date}</p>
                                    </div>
                                    <p className="font-semibold">${transaction.amount.toFixed(2)}</p>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}