"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ForgetPasswordDialog from "./ForgetPasswordDialog"

import { useState } from "react"
import { useLogin } from "../api/hooks"
import { useAuthStore } from "../store"

const FormSchema = z.object({
    email: z.string().email({
        message: "Invalid email address.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

export function InputFormLogin() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const navigate = useNavigate();
    const [passwordShow, setPasswordShow] = useState(false);
    const setTokens = useAuthStore((s) => s.setTokens);
    const {
        mutate: login,
        isPending,
        isError,
        error,
    } = useLogin();

    function onSubmit(data: z.infer<typeof FormSchema>) {
        login(
            { email: data.email, password: data.password },
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
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input type={passwordShow ? "text" : "password"} placeholder="**********" {...field} />
                                    <button type="button" className="absolute inset-y-0 right-0 px-3 text-gray-500" onClick={() => setPasswordShow(!passwordShow)}>
                                        {passwordShow ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                            <ForgetPasswordDialog />
                        </FormItem>
                    )}
                />
                {isError && (
                    <div className="text-red-500 text-sm">{error instanceof Error ? error.message : "Login failed"}</div>
                )}
                <Button disabled={isPending} type="submit" className="w-full">
                    {isPending && <Loader2 className="animate-spin" />}
                    Login
                </Button>
            </form>
        </Form>
    )
}
