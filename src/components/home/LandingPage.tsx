import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useTheme } from "../contexts/theme-provider"

export default function LandingPage() {
    const { theme } = useTheme();
    return (
        <section className="flex flex-col items-center justify-center min-h-screen ">
            <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
                <div className="flex flex-col justify-center space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl  ">
                            BudgetWebApp
                        </h1>
                        <p>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos voluptatibus quisquam eum eveniet ea reiciendis repellat nemo asperiores vero soluta accusantium quibusdam ad ab nesciunt, illo facere aperiam quod aliquam?
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button size="lg">
                            <Link to='/register'>Register</Link>
                        </Button>
                    </div>
                </div>

                <div className="mx-auto flex items-center justify-center">
                    {theme === 'dark'
                        ?
                        <img
                            src="/LightPhoto.png"
                            alt="Showcase of the app"
                            className="aspect-[3/2] w-full  overflow-hidden rounded-xl object-cover shadow-lg"
                        />
                        : <img
                            src="/DarkPhoto.png"
                            alt="Showcase of the app"
                            className="aspect-[3/2] w-full  overflow-hidden rounded-xl object-cover shadow-lg"
                        />
                    }
                </div>
            </div>
        </section>


    )
}