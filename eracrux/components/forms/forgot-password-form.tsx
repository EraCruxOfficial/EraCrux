"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
    email: z.string().email(),
});

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false);
    const [cooldownSeconds, setCooldownSeconds] = useState(0);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    // Cooldown timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        
        if (cooldownSeconds > 0) {
            interval = setInterval(() => {
                setCooldownSeconds((prev) => prev - 1);
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [cooldownSeconds]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (cooldownSeconds > 0) {
            toast.error(`Please wait ${cooldownSeconds} seconds before sending another request.`);
            return;
        }

        setIsLoading(true);

        const { error } = await authClient.forgetPassword({
            email: values.email,
            redirectTo: "/reset-password",
        });

        if (error) {
            // Customize known errors
            if (
                error.message?.toLowerCase().includes("user not found") ||
                error.message?.toLowerCase().includes("no user")
            ) {
                toast.error("No user found with this email.");
            } else {
                toast.error(error.message || "Something went wrong.");
            }
        } else {
            toast.success("Password reset email sent.");
            // Start 30-second cooldown on successful request
            setCooldownSeconds(30);
        }

        setIsLoading(false);
    }

    const isButtonDisabled = isLoading || cooldownSeconds > 0;

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid gap-6">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="m@example.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isButtonDisabled}>
                                    {isLoading ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : cooldownSeconds > 0 ? (
                                        `Wait ${cooldownSeconds}s`
                                    ) : (
                                        "Reset Password"
                                    )}
                                </Button>
                                {cooldownSeconds > 0 && (
                                    <p className="text-sm text-muted-foreground text-center">
                                        You can send another request in {cooldownSeconds} seconds
                                    </p>
                                )}
                            </div>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="underline underline-offset-4">
                                    Sign up
                                </Link>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our{" "}
                <Link href="#">Terms of Service</Link> and{" "}
                <Link href="#">Privacy Policy</Link>.
            </div> */}
        </div>
    );
}