'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputPassword } from "@/components/ui/input-password";
import { toast } from "@/components/ui/use-toast";
import { navigate } from "@/lib/actions";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    })
});

export default function PasswordChangeForm({ redirect }: { redirect?: boolean }) {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    const supabase = createClient();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: ''
        }
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        supabase.auth.updateUser({ password: data.password })
        .then(() => {
            toast({
                title: 'Password updated! 🧐',
            });
            if (redirect) {
                navigate('/calendar');
            }
        })
        .catch(() => {
            toast({
                title: 'Error! Could not update password. 😓',
                description: 'Try again.'
            });
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col space-y-2 items-center">
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Update password</FormLabel>
                        <FormControl>
                            <InputPassword 
                                showPassword={showPassword}
                                setShowPassword={setShowPassword} 
                                type={ showPassword ? "text" : "password" }
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Enter a new password..."
                            />
                        </FormControl>
                        <FormDescription>
                            At least 8 characters.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="self-center">Update</Button>
            </form>
        </Form>
    )
}