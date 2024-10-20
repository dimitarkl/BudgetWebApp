import { Button } from "@/components/ui/button"

export default function Home() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl  ">
                            BudgetWebApp
                        </h1>
                        <p>
                            Description
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button size="lg">
                            Regisgter
                        </Button>
                    </div>
                </div>
                <div className="mx-auto flex items-center justify-center">
                    <img
                        src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                        alt="Team working on laptops in a modern office"
                        className="aspect-[3/2] w-full max-w-[550px] overflow-hidden rounded-xl object-cover shadow-lg"
                    />
                </div>
            </div>
        </section>


    )
}