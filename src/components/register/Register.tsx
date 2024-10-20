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
import { register } from '../../api/auth'
import { UserCredential } from 'firebase/auth'
import { Error } from '../error/Error'

const formSchema = z.object({
    rePass: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export default function Register() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rePass: "",
            email: "",
            password: "",
        },
    })
    function isError(response: any): response is Error {
        return response instanceof Error ||
            (typeof response === 'object' && response !== null && 'message' in response);
    }
    async function onSubmit(data: z.infer<typeof formSchema>) {
        if (data.password != data.rePass) {
            setErrorMessage('Passwords dont match')
            return

        }
        const response: UserCredential = await register(data.email, data.password);
        if (!response) return
        if (isError(response)) {
            setErrorMessage(response.message)
            return
        } else {
            form.reset()
            navigate('/')
        }
    }


    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
            <div className="container px-4 md:px-6 flex flex-col items-center">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl ">
                        Register
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
                        <FormField
                            control={form.control}
                            name="rePass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repeat Password</FormLabel>
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
                        />{errorMessage && <Error message={errorMessage} />}
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