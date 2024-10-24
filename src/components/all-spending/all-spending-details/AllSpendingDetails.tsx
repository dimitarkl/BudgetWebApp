import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import DeleteExpense from "./delete-expense/DeleteExpense";


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
                    <div>
                        <DeleteExpense id={expense.id} />
                        <Button className="bg-primary hover:bg-primary/90  min-w-36  ml-9">
                            Edit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog >
        </>
    )
}