'use client'

import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";

import {
    ColumnFiltersState,
    SortingState,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
  } from "@tanstack/react-table"
import { Button } from "@/components/ui/button";
import { FaArrowsAltV } from "react-icons/fa";
import { MoreHorizontal } from "lucide-react"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import EditForm from "./EditForm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";

export default function MVPPage() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [users, setUsers] = React.useState<Array<any>>([]);
    const [editOpen, setEditOpen] = React.useState<boolean>(false);
    const [editUser, setEditUser] = React.useState<any>(null);
    const [editUserI, setEditUserI] = React.useState<number>(null);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const supabase = createClient();
    const table = useReactTable({
        data: users,
        columns: [
            {
                accessorKey: 'id',
                header: 'ID'
            },
            {
                accessorKey: 'name',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-left w-full">Name</h1>
                        </Button>
                    )
                }
            },
            {
                accessorKey: 'email',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-left w-full">Email</h1>
                        </Button>
                    )
                }
            },
            {
                accessorKey: 'phoneNumber',
                header: 'Phone'
            },
            {
                accessorKey: 'pledgeTerm',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-left w-full">Term</h1>
                        </Button>
                    )
                }
            },
            {
                accessorKey: 'serviceHoursTerm',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-right w-full">Service</h1>
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    return <div className="text-right">{row.getValue('serviceHoursTerm')}</div>
                }
            },
            {
                accessorKey: 'fundraising',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-right w-full">Funds</h1>
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue('fundraising'));
                    const formatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(amount)
                    return <div className="text-right">{formatted}</div>
                }
            },
            {
                accessorKey: 'violations',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-right w-full">Violations</h1>
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    return <div className="text-right">{row.getValue('violations')}</div>
                }
            },
            {
                accessorKey: 'dues',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-right w-full">Dues</h1>
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const amount = parseFloat(row.getValue('dues'));
                    const formatted = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(amount)
                    return <div className="text-right">{formatted}</div>
                }
            },
            {
                accessorKey: 'flyering',
                header: ({ column }) => {
                    return (
                        <Button
                            variant="outline"
                            className="w-full text-left p-0 bg-indigo-100 hover:bg-indigo-100 hover:text-indigo-300"
                            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        >
                            <h1 className="text-right w-full">Flyering</h1>
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    return <div className="text-right">{row.getValue('flyering')}</div>
                }
            },
            {
                accessorKey: 'standing',
                header: 'Standing'
            },
            {
                id: 'actions',
                cell: ({ row }) => {
                    const payment = row.original
               
                    return (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>MVP Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => { setEditOpen(true); setEditUser(users[row.index]); setEditUserI(row.index) }}
                          >
                            Edit Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  },
            }
        ],
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        },
        initialState: {
            pagination: {
                pageSize: 5
            }
        }
    })

    React.useEffect(() => {
        async function fetchUsers() {
            let userList: any = (await supabase.from('users').select('*, roles ( name, shorthand ), standing ( name )')).data;
            userList = userList.map(user => {
                return { ...user, standing: userList.standing?.name || 'None' };
            });
            setUsers(userList);
        }
        fetchUsers()
    }, []);

    return (
        <div className="w-full px-2">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 py-4">
                <Input
                    placeholder="Filter names..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Input
                    placeholder="Filter emails..."
                    value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("email")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="w-full relative overflow-x-scroll">
                <Table className="">
                    <TableHeader className="sticky top-[-1px] bg-indigo-100">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-indigo-700">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                                className="bg-white hover:bg-neutral-100"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-neutral-600">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                            ))
                        ) : (
                            <TableRow>
                            <TableCell colSpan={table.getHeaderGroups().length} className="h-24 text-center">
                                No results.
                            </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
            {
                isDesktop ? (
                    <Sheet open={editOpen} onOpenChange={setEditOpen}>
                        <SheetContent className="w-2/3 md:w-1/3 flex flex-col space-y-4">
                            <SheetHeader>
                                <SheetTitle>
                                    {editUser?.name}
                                </SheetTitle>
                                <SheetDescription>
                                    Edit and save changes at the bottom.
                                </SheetDescription>
                            </SheetHeader>
                            <ScrollArea>
                                <div className="px-4">
                                <EditForm user={editUser} i={editUserI} />
                                </div>
                            </ScrollArea>
                        </SheetContent>
                    </Sheet>
                ) :
                <Drawer open={editOpen} onOpenChange={setEditOpen}>
                    <DrawerContent className="h-3/4">
                        <DrawerHeader className="py-8">
                            <DrawerTitle>
                                {editUser?.name}
                            </DrawerTitle>
                            <DrawerDescription>
                                Edit and save changes at the bottom.
                            </DrawerDescription>
                        </DrawerHeader>
                        <ScrollArea>
                            <div className="px-4">
                            <EditForm user={editUser} i={editUserI} />
                            </div>
                        </ScrollArea>
                    </DrawerContent>
                </Drawer>
            }
        </div>
    )
}