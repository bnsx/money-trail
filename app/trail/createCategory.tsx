"use client";

import FormInput from "@/components/FormInput";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import { categorySchema } from "@/zod/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { Cross2Icon, DiscIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@react-hook/media-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = categorySchema.create;

type ResponseCode =
    | "UNAUTHORIZED"
    | "INVALID_SCHEMA"
    | "MAX_CATEGORIES_REACHED"
    | "SUCCESS"
    | "INTERNAL_SERVER_ERROR";

interface ResponseData {
    message: string;
    code: ResponseCode;
    data?: { categoryID: string };
}

async function create(value: z.infer<typeof schema>) {
    return (
        (await axios.post(
            "/api/categories/create",
            JSON.stringify(value)
        )) as AxiosResponse<ResponseData>
    ).data;
}

export function CreateCategory() {
    const router = useRouter();
    const [isSubmit, setSubmit] = useState(false);
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();
    const { mutate } = useMutation({
        mutationKey: ["categories"],
        mutationFn: create,
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setSubmit(false);
            setOpen(false);
        },
        onError(error) {
            if (error instanceof AxiosError) {
                const r = error.response?.data as ResponseData;
                switch (r.code) {
                    case "MAX_CATEGORIES_REACHED":
                        toast.error("Limit 5 category per user!");
                        break;
                    case "UNAUTHORIZED":
                        toast.error("Maybe session expired!", {
                            description: "Page will reload again!",
                        });
                        router.refresh();
                        break;
                    default:
                        toast.error("Unexpected Error", {
                            description: "Page will reload again!",
                        });
                        router.refresh();
                        break;
                }
                setSubmit(false);
            }
        },
    });
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const onOpenChange = () => setOpen(!open);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
        },
    });
    const onSubmit = async (value: z.infer<typeof schema>) => {
        setSubmit(true);
        mutate(value);
    };
    useEffect(() => {
        if (open === false) {
            form.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    return (
        <div>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            className="flex items-center gap-3"
                        >
                            <PlusCircledIcon className="w-5 h-5" />
                            <span>Category</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Do you want create category?
                            </DialogTitle>
                        </DialogHeader>
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="space-y-3">
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"name"}
                                            label="Category Name"
                                        />
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"description"}
                                            label="Description (optional)"
                                            textArea={true}
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            className="space-x-1"
                                            disabled={isSubmit}
                                        >
                                            <span>Save</span>
                                            <DiscIcon />
                                        </Button>
                                        <DialogClose asChild>
                                            <Button
                                                type="reset"
                                                variant={"outline"}
                                                className="space-x-1"
                                            >
                                                <span>Drop</span>
                                                <Cross2Icon />
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </div>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            type="button"
                            className="flex items-center gap-3"
                        >
                            <PlusCircledIcon className="w-5 h-5" />
                            <span>Category</span>
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>
                                Do you want create category?
                            </DrawerTitle>
                        </DrawerHeader>
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-5"
                                >
                                    <div className="space-y-3 px-4">
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"name"}
                                            label="Category Name"
                                        />
                                        <FormInput
                                            control={form.control}
                                            schema={schema}
                                            name={"description"}
                                            label="Description (optional)"
                                            textArea={true}
                                        />
                                    </div>
                                    <DrawerFooter>
                                        <Button
                                            type="submit"
                                            className="space-x-1"
                                            disabled={isSubmit}
                                        >
                                            <span>Save</span>
                                            <DiscIcon />
                                        </Button>
                                        <DrawerClose asChild>
                                            <Button
                                                type="reset"
                                                variant={"outline"}
                                                className="space-x-1"
                                            >
                                                <span>Drop</span>
                                                <Cross2Icon />
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </form>
                            </Form>
                        </div>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}
