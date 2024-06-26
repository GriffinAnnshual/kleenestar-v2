"use client";

import Link from "next/link";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/assets/icons";
import { PasswordInput } from "@/components/custom/PasswordInput";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/lib/zod/schemas/schema";
import { LoginFormSchemaTypes } from "../../lib/types/types";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import useUserStore from "@/lib/store/UserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
    const form = useForm<LoginFormSchemaTypes>({
        resolver: zodResolver(LoginFormSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { watch } = form;
    const email = watch("email");
    const password = watch("password");

    const router = useRouter();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data: LoginFormSchemaTypes) => {
            try {
                const response = await axios.post(
                    `/api/auth/login/`,
                    {
                        email: data.email,
                        password: data.password,
                    },
                    {
                        withCredentials: true,
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": Cookies.get("csrftoken"),
                        },
                    },
                );
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            Cookies.set("logged_in", "yes");
            toast.success("Login Successfull!");
            setTimeout(() => {
                router.push("/chat");
            }, 200);
        },
        onError: (error) => {
            form.reset({
                email: "",
                password: "",
            });
            const err = error as AxiosError<{ detail: string }>;
            if (err.response?.data) toast.error(err.response.data.detail);
        },
    });

    return (
        <Card className="mx-auto max-w-sm z-10 rounded-3xl drop-shadow-xl outline-none border-none">
            <CardHeader>
                <CardTitle className="text-2xl font-mainhead">Login</CardTitle>
                <CardDescription>Enter your details below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
                        className="mb-4"
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="mail@example.com"
                                                disabled={mutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="flex gap-[5px] items-center text-[10px]">
                                            <InfoCircledIcon className="h-[10px] w-[10px] text-foreground" />
                                            <span className="text-[10px] text-foreground">
                                                enter the email address you used to login / register
                                            </span>
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Password</FormLabel>
                                            {/* add forgot password page */}
                                            <Link
                                                href="/forgot-password"
                                                className="ml-auto inline-block text-sm underline"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                        <FormControl>
                                            <PasswordInput
                                                id="password"
                                                type="password"
                                                placeholder="password"
                                                disabled={mutation.isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[10px]" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={
                                    Object.keys(form.formState.errors).length > 0 ||
                                    mutation.isPending ||
                                    !email ||
                                    !password
                                }
                                type="submit"
                                className="w-full"
                            >
                                {mutation.isPending && (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Login
                            </Button>
                        </div>
                    </form>
                </Form>
                {/* <div className="relative mb-4">
					<div className="absolute inset-0 flex items-center">
						<span className="w-full border-t" />
					</div>
					<div className="relative flex justify-center text-xs uppercase">
						<span className="bg-background px-2 text-muted-foreground">
							Or continue with
						</span>
					</div>
				</div>
				<Button
					variant="outline"
					type="button"
					disabled={mutation.isPending}
					className="flex items-center w-full">
					{mutation.isPending ? (
						<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
					) : (
						<Icons.google className="mr-2 h-4 w-4" />
					)}{" "}
					Login with Google
				</Button> */}
            </CardContent>
            <CardFooter>
                <p className="text-center text-sm text-muted-foreground">
                    By clicking continue, you agree to our{" "}
                    <Link
                        target="_blank"
                        href="https://star-clam-c0d.notion.site/Terms-of-Service-for-Kleenestar-9d9af56399da48b797a1e2d262c78e94"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        target="_blank"
                        href="https://star-clam-c0d.notion.site/Kleenestar-Privacy-Policy-fe317d080ca34f7985b0911b4ade8529"
                        className="underline underline-offset-4 hover:text-primary"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
            </CardFooter>
        </Card>
    );
}
