'use client'

import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createUser } from "@/lib/supabase/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters"
    }),
});

export default function BulkAddPage() {
    const [bulkUsers, setBulkUsers] = React.useState<Array<any>>([]);
    const [alertOpen, setAlertOpen] = React.useState<boolean>(false);
    const [submittedData, setSubmittedData] = React.useState<any>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            password: ""
        },
    });

    const handleChange = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();

        reader.onload = (e) => {
            const file = e.target.result as string;
            const lines = file.split('\r\n');
            let data = []
            for (let i = 0; i < lines.length; i++) {
                data.push(lines[i].split(','));
            }
            setBulkUsers(data);
        }

        reader.readAsText(file);
    }

    function bulkAddUsers() {
        if (submittedData && bulkUsers) {
            for (const userData of bulkUsers) {
                const data = {
                    name: userData[0],
                    phoneNumber: userData[1],
                    email: userData[2],
                    pledgeTerm: userData[3],
                    password: submittedData.password
                };
                createUser(data);
            }
        }
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setSubmittedData(data);
        setAlertOpen(true);
    }

    return (
        <div className="h-full flex flex-col items-center py-8 space-y-8 bg-gray-100">
            <h1 className="text-4xl">Bulk Add Users</h1>
            <div className="flex flex-col space-y-4">
                <div>
                    <Label>User data file</Label>
                    <Input 
                        type="file"
                        placeholder="File submit"
                        onChange={handleChange}
                        className="max-w-[250px] hover:bg-gray-100 hover:cursor-pointer transition ease-in-out delay-50 duration-200"
                    />
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>General Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="12345678" type="text" {...field} />
                                </FormControl>
                                <FormDescription>
                                    At least 8 characters.
                                </FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    <Button type="submit" className="self-center">Bulk Add</Button>
                    </form>
                </Form>
            </div>
            <div className="h-1/2 w-full md:w-1/2 overflow-y-scroll p-2 bg-white rounded-lg drop-shadow-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Phone Number</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Term</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bulkUsers.map((data, i) => (
                            <TableRow key={i}>
                                <TableCell>{data[0]}</TableCell>
                                <TableCell>{data[1]}</TableCell>
                                <TableCell>{data[2]}</TableCell>
                                <TableCell>{data[3]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. Make sure to verify all users.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={bulkAddUsers}>Bulk Add</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}