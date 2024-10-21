import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import { ExpenseType } from "./expense-type/ExpenseType"
import { useContext, useState } from "react"
import { createExpense } from "@/api/expenses"
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

export function ExpenseEntry() {
    const [errorMessage, setErrorMessage] = useState('')
    const [type, setType] = useState('')
    const navigate = useNavigate()
    const user = useContext(UserContext)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sum: "",
            description: "",

        },
    })

    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log(data)
        console.log(type)
        if (!type) return
        if (user?.uid) {
            const response = createExpense(user?.uid, data.sum, type, data.description)
            if (isError(response)) {
                setErrorMessage(response.message)
                return
            } else {
                form.reset()
                navigate('/')
            }
        }
    }
    function Type(currentValue: string) {
        setType(currentValue)
    }

    return (
        <Dialog>
            <div className="flex justify-center items-center h-screen">
                <DialogTrigger asChild>
                    <Button variant="outline">Expense</Button>
                </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-[425px]">
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
                        <ExpenseType type={Type} />

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
            </DialogContent>
        </Dialog >
    )
}
