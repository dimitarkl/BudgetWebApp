import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Edit, Info } from "lucide-react";
import DeleteExpense from "./delete-expense/DeleteExpense";
import { ExpenseEntry } from "@/components/expense-entry/ExpenseEntry";


type Props = {
    currency: string,
    expense: {
        id: string;
        userId: string;
        createdAt: string;
        sum: number;
        type: string;
        description?: string;
    },


}
export default function AllSpendingDetails(
    {
        currency,
        expense
    }: Props) {

    return (
        <>
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
                            {/* TODO to upperCase */}
                            <span className="col-span-3">{expense.type}</span>
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
                        <DeleteExpense id={expense.id} />
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
                            <ExpenseEntry expense={expense} inputType="Edit" />
                        </Dialog>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}