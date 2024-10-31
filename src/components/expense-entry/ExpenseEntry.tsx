import { Button } from "@/components/ui/button"
import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import ExpenseType from "./expense-type/ExpenseType"
import { useContext, useState } from "react"
import { createExpense, editExpense } from "@/api/expenses"
import UserContext from "../contexts/UserContext"
import { isError } from "@/lib/errorCheck"
import { useNavigate } from "react-router-dom"
import { Error } from "../error/Error"
import { Switch } from "../ui/switch"
import { Minus, Plus } from "lucide-react"

const formSchema = z.object({
    //TODO add validation
    sum: z.string().min(1, {
        message: "Please enter a Number"
    }),
    description: z.string().optional(),
    transactionType: z.enum(["expense", "income"]),
})
type Props = {
    expense?: {
        id: string;
        userId: string;
        createdAt: string;
        sum: number;
        type: string;
        description?: string;
    },
    inputType: 'Create' | 'Edit'
}
export default function ExpenseEntry({
    expense,
    inputType
}: Props) {
    const [errorMessage, setErrorMessage] = useState('')
    const [type, setType] = useState('')
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sum: expense ? String(expense?.sum) : '',
            transactionType: 'expense',
            description: expense ? expense?.description : '',

        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        switch (inputType) {
            case 'Create':
                if (type && user?.uid) {
                    const response = createExpense(user?.uid, data.sum, type, data.transactionType, data.description)
                    if (isError(response)) {
                        setErrorMessage(response.message)
                        return
                    } else {
                        form.reset()
                    }
                }
                break;
            case 'Edit':
                if (type && user?.uid && expense) {
                    const response = editExpense(expense.id, user?.uid, data.sum, type, data.description)
                    if (isError(response)) {
                        setErrorMessage(response.message)
                        return
                    } else {
                        form.reset()
                        navigate('/')
                    }
                }
                break;
        }
    }
    function Type(currentValue: string) {
        setType(currentValue)
    }

    return (
        <>
            <DialogContent className="min-w-fit" >
                <DialogHeader>
                    <DialogTitle>Expense</DialogTitle>
                    <DialogDescription>
                        Input Expenses
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 ">
                        <FormField
                            control={form.control}
                            name="transactionType"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Type</FormLabel>
                                        <FormDescription>
                                            Switch between expense and income
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <div className="flex items-center space-x-2">
                                            {field.value === 'expense' ? (
                                                <Minus className="h-4 w-4 text-destructive" />
                                            ) : (
                                                <Plus className="h-4 w-4 text-green-500" />
                                            )}
                                            <Switch
                                                checked={field.value === 'income'}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? 'income' : 'expense')
                                                }}
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className=" flex flex-row">
                            <FormField
                                control={form.control}
                                name="sum"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className='text-2xl' type="number" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <ExpenseType type={Type} expense={expense} />
                        </div>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input type="description" {...field} className="h-24" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}

                        />

                        <Button type="submit">Save changes</Button>
                        {errorMessage && <Error message={errorMessage} />}
                    </form>
                </Form>
                <DialogFooter>
                </DialogFooter>
            </DialogContent >
        </>)
}
