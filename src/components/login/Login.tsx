import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { Link, useNavigate } from 'react-router-dom'
import { UserCredential } from 'firebase/auth'
import { login } from '../../api/auth'
const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})
export default function Login() {
    const [showPassword, setShowPassword] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const navigate = useNavigate();

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const response: UserCredential | Error = await login(data.email, data.password);
        if (!response) return
        form.reset()
        navigate('/')
    }
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <div className="container px-4 md:px-6 flex flex-col items-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl ">
                        Login
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-4 mt-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="john@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                {...field}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" size="lg">
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </form>
                </Form>
                <p className="mt-4 text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-2 hover:text-primary">
                        Log in
                    </Link>
                </p>
            </div>
        </section>
    )
}