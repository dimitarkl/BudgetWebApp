import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen ">
            <div className="container px-4 md:px-6 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl ">
                    404 - Page Not Found
                </h1>
                <p className="mt-4 max-w-[600px] text-muted-foreground text-lg sm:text-xl md:text-2xl">
                    Oops! It seems like you've wandered off the budget trail. Don't worry, even the best financial planners take a wrong turn sometimes.
                </p>
                <div className="w-full max-w-sm space-y-4 mt-8">

                    <Button asChild size="lg" className="w-full">
                        <Link to="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Homepage
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}