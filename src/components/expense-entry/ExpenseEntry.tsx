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
import { useState } from "react"

const formSchema = z.object({
    sum: z.string().min(1, {
        message: "Please enter a Number"
    }),
    description: z.string().optional()
})

export function ExpenseEntry() {
    const [type, setType] = useState('')
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
                    </form>
                </Form>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}
