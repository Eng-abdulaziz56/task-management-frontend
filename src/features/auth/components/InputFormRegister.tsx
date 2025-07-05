"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useState } from "react";
import { useRegister } from "../api/hooks";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router-dom"; 

const FormSchema = z
    .object({
        email: z.string().email({
            message: "Invalid email address.",
        }),
        password: z.string().min(8, {
            message: "Password must be at least 8 characters.",
        }),
        name: z.string().min(2, {
            message: "Name must be at least 2 characters.",
        }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export function InputFormRegister() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
        },
    });

    const [passwordShow, setPasswordShow] = useState(false);
    const setTokens = useAuthStore((s) => s.setTokens);
    const navigate = useNavigate();
    const {
        mutate: registerUser,
        isPending,
        isError,
        error,
    } = useRegister();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        registerUser(
            { email: data.email, password: data.password, name: data.name },
            {
                onSuccess: (res) => {
                    if (res.status === "success" && res.data) {
                        setTokens(res.data.access_token, res.data.refresh_token);
                        navigate("/dashboard");
                    }
                },
            }
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="example@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Full Name" {...field} />
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
                                    <Input type={passwordShow ? "text" : "password"} placeholder="**********" {...field} />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 text-gray-500"
                                        onClick={() => setPasswordShow(!passwordShow)}
                                    >
                                        {passwordShow ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={passwordShow ? "text" : "password"} placeholder="**********" {...field} />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 px-3 text-gray-500"
                                        onClick={() => setPasswordShow(!passwordShow)}
                                    >
                                        {passwordShow ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isError && (
                    <div className="text-red-500 text-sm">{error instanceof Error ? error.message : "Register failed"}</div>
                )}
                <Button disabled={isPending} type="submit" className="w-full">
                    {isPending && <Loader2 className="animate-spin" />}
                    Register
                </Button>
            </form>
        </Form>
    );
}
