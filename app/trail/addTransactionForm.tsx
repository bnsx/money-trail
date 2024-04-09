"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import FormCalendar from "@/components/FormCalendar";
import FormInput from "@/components/FormInput";
import { FormNumber } from "@/components/FormNumber";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { transactionSchema } from "@/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { Cross2Icon, DiscIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
export function AddTransactionForm() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { data: categories, isPending: isPendingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetcher,
    });
    const [isSubmit, setSubmit] = useState(false);
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
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                // const r = error.response?.data as ResponseData;
                toast.error("Something Wrong", {
                    description: "Page will reload again!",
                });
                form.reset();
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
    return (
        <div className="hidden xl:block">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onReset={() => form.reset()}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle>Record Transaction</CardTitle>
                            <CardDescription>...</CardDescription>
                        </CardHeader>
                        <CardContent className="max-w-96 space-y-2">
                            <FormInput
                                control={form.control}
                                schema={schema}
                                name={"title"}
                                label="Title"
                                placeholder="eg. Internet bill, Hamburger ..."
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
                        </CardContent>
                        <CardFooter className="flex gap-1">
                            <Button type="submit" className="w-full space-x-1" disabled={isSubmit}>
                                <span>Save</span>
                                <DiscIcon />
                            </Button>
                            <Button
                                type="reset"
                                variant={"outline"}
                                className="space-x-1"
                            >
                                <span>Reset</span>
                                <Cross2Icon />
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>
    );
}
