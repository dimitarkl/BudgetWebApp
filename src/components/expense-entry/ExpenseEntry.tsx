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

const formSchema = z.object({
    //TODO add validation
    sum: z.string().min(1, {
        message: "Please enter a Number"
    }),
    description: z.string().optional()
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


export function ExpenseEntry({
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
            description: expense ? expense?.description : '',

        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {

        switch (inputType) {
            case 'Create':
                if (type && user?.uid) {
                    const response = createExpense(user?.uid, data.sum, type, data.description)
                    if (isError(response)) {
                        setErrorMessage(response.message)
                        return
                    } else {

                        setTimeout(() => {
                            form.reset()
                            navigate(0)
                        }, 400)

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
                            name="sum"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Sum Spend</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <ExpenseType type={Type} expense={expense} />

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
