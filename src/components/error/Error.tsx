import { AlertCircle } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"

type Props = {
    message: string
}

export function Error({
    message
}: Props) {
    return (

        <div className="absolute top-16 left-1/2 transform -translate-x-1/2">
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