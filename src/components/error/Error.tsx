import { AlertCircle } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

type Props = {
    message: string,
    className?: string | undefined,
}

export function Error({
    message,
    className
}: Props) {
    return (
        <div className={className ? className : ''}>
            <Alert variant="destructive">
                < AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold text-xl">Error</AlertTitle>
                <AlertDescription >
                    {message}
                </AlertDescription>
            </Alert >
        </div >

    )
}