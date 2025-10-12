'use client';

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { createAuthClient } from "better-auth/client"
const authClient = createAuthClient()
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { IconBrandGoogle, IconBrandGithub } from "@tabler/icons-react"
import { signUp } from "@/server/users"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react";
import Link from "next/link";


const formSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),

})

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    async function signInWithGithub() {
        setIsLoading(true)
        try {
            const result = await authClient.signIn.social({
                provider: "github",
                callbackURL: `/workspaces`,
            })
            if ('error' in result && result.error) {
                toast.error(result.error.message || "An unknown error occurred.")
            } else {
                toast.success("Signin in progress!")
                router.push("/workspaces")
            }
        } catch (error) {
            const e = error as Error
            toast.error(e.message || "An unknown error occurred.")
        } finally {
            setIsLoading(false)
        }
    }
    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: `/workspaces`,
            })

            if ('error' in result && result.error) {
                toast.error(result.error.message || "An unknown error occurred.")
            } else {
                toast.success("Signin in progress!")
                router.push("/workspaces")
            }
        } catch (error) {
            const e = error as Error
            toast.error(e.message || "An unknown error occurred.")
        } finally {
            setIsLoading(false)
        }
    }


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        const { success, message } = await signUp(values.email, values.password, values.username)
        if (success) {
            toast.success(message)
            router.push("/workspaces")
        } else {
            toast.error(message)
        }
        setIsLoading(false)
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props} style={{ fontFamily: "Inter, sans-serif" }}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome to EraCrux</CardTitle>
                    <CardDescription>
                        Signup with your GitHub or Google account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6">
                                <div className="flex flex-col gap-4">
                                    <Button variant="outline" className="w-full" onClick={signInWithGithub} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <IconBrandGithub />}
                                        Signup with GitHub
                                    </Button>
                                    <Button variant="outline" className="w-full" type="button" onClick={signInWithGoogle} disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : <IconBrandGoogle />}
                                        Signup with Google
                                    </Button>
                                </div>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid gap-6">
                                    <div className="grid gap-3">
                                        <FormField
                                            control={form.control}
                                            name="username"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Username</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="john03" {...field} type="username" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="d@gmail.com" {...field} type="email" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex flex-col gap-1">
                                            <FormField
                                                control={form.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem >
                                                        <FormLabel>Password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="*********" {...field} type="password" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Signup"}
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Don&apos;t have an account?{" "}
                                    <Link href="/login" className="underline underline-offset-4">
                                        Login
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
