"use client";
import FormCalendar from "@/components/FormCalendar";
import FormInput from "@/components/FormInput";
import { FormNumber } from "@/components/FormNumber";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { isOneDayLeft } from "@/lib/date";
import { transactionSchema } from "@/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

async function fetcher() {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const data = await axios.get("/api/categories");
    return data.data as Category[];
}
const TransactionType = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
];
const schema = transactionSchema.patch;

interface Props {
    isDesktop: boolean;
    data: Transaction;
    setDialogInfo: (value: boolean) => void;
}

type ResponseCode =
    | "TRANSACTION_404"
    | "UNAUTHORIZED"
    | "INVALID_SCHEMA"
    | "SUCCESS"
    | "INTERNAL_SERVER_ERROR";
interface ResponseData {
    message: string;
    code: ResponseCode;
}
export function DialogEdit({ isDesktop, data, setDialogInfo }: Props) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const onOpenChange = () => setOpen(!open);

    const { data: categories, isPending: isPendingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetcher,
    });
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            txid: data.txid,
            data: {
                ...data,
                categoryID: data.category?.id,
            },
        },
    });
    const mapCategoriesData = categories
        ? [
              ...categories.map((x) => ({
                  label: x.name,
                  value: x.categoryID,
              })),
              { label: "Uncategory", value: "null" },
          ]
        : [];

    const onSubmit = async (value: z.infer<typeof schema>) => {
        try {
            setSubmit(true);
            const r = await axios.patch(
                "/api/transactions/patch",
                JSON.stringify(value)
            );
            if (r.status === 200) {
                setSubmit(false);
                setOpen(false);
                setDialogInfo(false);
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const r = error.response?.data as ResponseData;
                switch (r.code) {
                    case "TRANSACTION_404":
                        toast.error("Transaction not found!");
                        setSubmit(false);
                        setOpen(false);
                        setDialogInfo(false);
                        queryClient.invalidateQueries({
                            queryKey: ["transactions"],
                        });
                        break;
                    case "UNAUTHORIZED":
                        router.refresh();
                        break;
                    default:
                        toast.error("Something wrong!", {
                            description: "Please contact WebAdmin!",
                        });
                        break;
                }
            }
        }
    };
    const disabled = isOneDayLeft(data.createdAt);
    return (
        <>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button type="button" size={"icon"} disabled={disabled}>
                            <Pencil2Icon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                            <DialogDescription>{data.txid}</DialogDescription>
                        </DialogHeader>
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-2"
                                >
                                    <FormInput
                                        control={form.control}
                                        schema={schema}
                                        name={"data.title"}
                                        label="Title"
                                    />
                                    <div className="grid grid-cols-2 gap-1">
                                        <FormCalendar
                                            control={form.control}
                                            schema={schema}
                                            name={"data.date"}
                                            label="Date"
                                        />
                                        <FormSelect
                                            control={form.control}
                                            schema={schema}
                                            name={"data.type"}
                                            label="Type"
                                            placeholder="Pick a type"
                                            data={TransactionType}
                                        />
                                    </div>
                                    <FormSelect
                                        control={form.control}
                                        schema={schema}
                                        name={"data.categoryID"}
                                        label="Category (optional)"
                                        placeholder={
                                            isPendingCategories
                                                ? "Loading..."
                                                : "Pick Category"
                                        }
                                        data={mapCategoriesData}
                                        disabled={isPendingCategories}
                                    />
                                    <FormNumber
                                        control={form.control}
                                        schema={schema}
                                        name={"data.amount"}
                                        label="Amount"
                                        defaultValue={data.amount}
                                    />
                                    <FormInput
                                        control={form.control}
                                        schema={schema}
                                        name={"data.description"}
                                        label="Description (optional)"
                                        placeholder="Describe What do you do :)"
                                        textArea={true}
                                    />
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={isSubmit}
                                        >
                                            Submit
                                        </Button>
                                        <DialogClose>
                                            <Button
                                                type="reset"
                                                variant={"outline"}
                                            >
                                                Drop
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer>
                    <DrawerTrigger asChild>
                        <Button type="button" className="w-full" disabled={disabled}>
                            Edit
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Edit Transaction</DrawerTitle>
                            <DrawerDescription>{data.txid}</DrawerDescription>
                        </DrawerHeader>
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-2"
                                >
                                    <div className="space-y-3 px-4">
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"data.title"}
                                            label="Title"
                                        />
                                        <div className="grid grid-cols-2 gap-1">
                                            <FormCalendar
                                                control={form.control}
                                                schema={schema}
                                                name={"data.date"}
                                                label="Date"
                                            />
                                            <FormSelect
                                                control={form.control}
                                                schema={schema}
                                                name={"data.type"}
                                                label="Type"
                                                placeholder="Pick a type"
                                                data={TransactionType}
                                            />
                                        </div>
                                        <FormSelect
                                            control={form.control}
                                            schema={schema}
                                            name={"data.categoryID"}
                                            label="Category (optional)"
                                            placeholder={
                                                isPendingCategories
                                                    ? "Loading..."
                                                    : "Pick Category"
                                            }
                                            data={mapCategoriesData}
                                            disabled={isPendingCategories}
                                        />
                                        <FormNumber
                                            control={form.control}
                                            schema={schema}
                                            name={"data.amount"}
                                            label="Amount"
                                            defaultValue={data.amount}
                                        />
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"data.description"}
                                            label="Description (optional)"
                                            placeholder="Describe What do you do :)"
                                            textArea={true}
                                        />
                                    </div>
                                    <DrawerFooter>
                                        <Button
                                            type="submit"
                                            disabled={isSubmit}
                                        >
                                            Submit
                                        </Button>
                                        <DrawerClose asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                            >
                                                Cancel
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </form>
                            </Form>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </>
    );
}
