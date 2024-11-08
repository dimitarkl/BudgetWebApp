import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import DeleteTransaction from "./delete-transaction/DeleteTransaction";
import ExpenseEntry from "@/components/expense-entry/ExpenseEntry";

type Props = {
    currency: string,
    expense: Expense


}
type Expense = {
    id: string,
    userId: string,
    createdAt: string
    sum: number,
    type: string,
    description?: string,
}
type Transaction = Expense & {
    transactionType: "expense" | "income";
}
export default function AllTransactionDetails(
    {
        currency,
        expense
    }: Props) {
    const transaction: Transaction = {
        id: expense.id,
        userId: expense.userId,
        transactionType: expense.sum < 0 ? 'expense' : 'income',
        createdAt: expense.createdAt,
        sum: expense.sum,
        type: expense.type,
        description: expense.description
    }
    return (

        <DialogContent className="sm:max-w-[425px] ">
            <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
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
                    <span className="col-span-3">{expense.type.charAt(0).toUpperCase() + expense.type.slice(1)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-bold">Amount:</span>
                    <span className="col-span-3">{currency}{expense.sum.toFixed(2)}</span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <span className="font-bold">Description:</span>
                    <span className="col-span-3 ml-2 truncate">{expense.description}</span>
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
                <DeleteTransaction id={expense.id} />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="default"
                            className="w-full sm:w-auto"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <ExpenseEntry expense={transaction} inputType="Edit" />
                </Dialog>
            </div>
        </DialogContent>

    )
}