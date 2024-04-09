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
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { transactionSchema } from "@/zod/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    PlusIcon,
} from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
const schema = transactionSchema.create;
const TransactionType = [
    { label: "Income", value: "income" },
    { label: "Expense", value: "expense" },
];
export function AddTransactionButton() {
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
        console.log(value);
    };
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
                    <Button type="button" className="xl:hidden fixed bottom-10 left-10" size={'icon'}>
                        <PlusIcon className="w-5 h-5" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader className="text-left">
                        <DrawerTitle>Fill Detail 💸</DrawerTitle>
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
                                    <Button type="submit" className="space-x-1">
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
