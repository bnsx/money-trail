"use client";

import FormCalendar from "@/components/FormCalendar";
import FormInput from "@/components/FormInput";
import { FormNumber } from "@/components/FormNumber";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
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
import { transactionSchema } from "@/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
const schema = transactionSchema.create;
const TransactionType = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
];
async function fetcher() {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const data = await axios.get("/api/categories");
    return data.data as Category[];
}
type ResponseCode =
    | "UNAUTHORIZED"
    | "INVALID_SCHEMA"
    | "SUCCESS"
    | "INTERNAL_SERVER_ERROR";
interface ResponseData {
    message: string;
    code: ResponseCode;
}
export function AddTransactionButton() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: categories, isPending: isPendingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetcher,
    });
    const [isSubmit, setSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const onOpenChange = () => setOpen(!open);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            amount: 0.0,
        },
    });
    const onSubmit = async (value: z.infer<typeof schema>) => {
        try {
            setSubmit(true);
            // console.log(value);
            const r: AxiosResponse<ResponseData> = await axios.post(
                "/api/transactions/create",
                JSON.stringify(value)
            );
            if (r.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                form.reset();
                setSubmit(false);
                return router.refresh();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                // const r = error.response?.data as ResponseData;
                toast.error("Something Wrong", {
                    description: "Page will reload again!",
                });
                setSubmit(false);
                router.refresh();
            }
        }
    };
    const mapCategoriesData = categories
        ? categories.map((x) => ({
              label: x.name,
              value: x.categoryID,
          }))
        : [];
    useEffect(() => {
        if (open === false) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    return (
        <div className="">
            <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                    <Button
                        type="button"
                        className="xl:hidden fixed bottom-14 right-10"
                        size={"icon"}
                    >
                        <PlusIcon className="w-5 h-5" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Record Transaction</DrawerTitle>
                        <DrawerDescription>...</DrawerDescription>
                    </DrawerHeader>
                    <div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <div className="space-y-3 px-2">
                                    <FormInput
                                        control={form.control}
                                        schema={schema}
                                        name={"title"}
                                        label="Title"
                                    />
                                    <div className="grid grid-cols-2 gap-1">
                                        <FormCalendar
                                            control={form.control}
                                            schema={schema}
                                            name={"date"}
                                            label="Date"
                                        />
                                        <FormSelect
                                            control={form.control}
                                            schema={schema}
                                            name={"type"}
                                            label="Type"
                                            placeholder="Pick a type"
                                            data={TransactionType}
                                        />
                                    </div>
                                    <FormSelect
                                        control={form.control}
                                        schema={schema}
                                        name={"categoryID"}
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
                                        name={"amount"}
                                        label="Amount"
                                    />
                                    <FormInput
                                        control={form.control}
                                        schema={schema}
                                        name={"description"}
                                        label="Description (optional)"
                                        placeholder="Describe What do you do :)"
                                        textArea={true}
                                    />
                                </div>
                                <DrawerFooter>
                                    <Button
                                        type="submit"
                                        className="space-x-1"
                                        disabled={isSubmit}
                                    >
                                        Save
                                    </Button>
                                    <DrawerClose asChild>
                                        <Button
                                            type="reset"
                                            variant={"outline"}
                                            className="space-x-1"
                                        >
                                            Drop
                                        </Button>
                                    </DrawerClose>
                                </DrawerFooter>
                            </form>
                        </Form>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
