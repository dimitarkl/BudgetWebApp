import { deleteExpense } from "@/api/expenses";
import { ErrorContext } from "@/components/contexts/ErrorContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button";
import { isError } from "@/lib/errorCheck";
import { Trash2 } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
type Props = {
    id: string
}

export default function DeleteTransaction({ id }: Props) {
    const navigate = useNavigate()
    const errorContext = useContext(ErrorContext)
    async function handleDelete() {
        try {
            const response = await deleteExpense(id)
            if (isError(response)) return errorContext?.setError('Error Deleting Item')
            navigate('/')
        } catch (error) {
            errorContext?.setError('Error Deleting Item')
            console.log('Error Deleting Item:' + (error as Error).message)
        }
    }

    return (
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone.
                            This will permanently delete this expense.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}