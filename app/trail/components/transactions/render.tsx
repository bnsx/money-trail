"use client";
import { Badge } from "@/components/ui/badge";
import { formatDateAndTime } from "@/lib/date";
import { ReadonlyURLSearchParams, useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { $Enums } from "@prisma/client";

interface Props {
    searchParams: ReadonlyURLSearchParams;
    data: Transaction[];
}
export function RenderTransaction({ data }: Props) {
    const router = useRouter();
    if (data.length === 0) {
        return <p className="text-center pt-5">Data not found.</p>;
    }
    const [value, setValue] = useState<Transaction | null | undefined>(null);
    const [open, setOpen] = useState(false);
    const onOpenChange = () => setOpen(!open);
    const onClicked = (index: number) => {
        const d = data.find((x, i) => i === index);
        if (d === undefined) {
            router.refresh();
        } else {
            setValue(d);
            setOpen(true);
        }
    };
    useEffect(() => {
        if (open === false) {
            setValue(null);
        }
    }, [open]);
    return (
        <div className="space-y-3">
            <div>
                {value && (
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>{value?.title}</DialogTitle>
                                <DialogDescription>
                                    {value.description || "No Comment"}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-1">
                                <div>
                                    <TypeTranslator type={value.type} />
                                </div>
                                <div className="flex gap-3">
                                    <p>Amount</p>
                                    {value.type === "expense" ? (
                                        <p className="text-red-600">
                                            -{value.amount}
                                            {value.currencyCode}
                                        </p>
                                    ) : (
                                        <p className="text-green-600">
                                            +{value.amount}
                                            {value.currencyCode}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
            {data.map((x, i) => (
                <div
                    key={x.txid}
                    className={
                        "border-b xl:flex items-center hover:bg-slate-100 py-10 space-y-3 xl:space-y-0 rounded-md cursor-pointer"
                    }
                    onClick={() => onClicked(i)}
                >
                    <div className="pl-3 xl:pl-5 w-full space-y-0.5">
                        <p id="_date" className="text-xs text-muted-foreground">
                            {formatDateAndTime(x.date)}
                        </p>
                        <p id="_title" className="text-sm font-semibold">
                            {x.title}
                        </p>
                        <p
                            id="_type"
                            className={
                                (x.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600") + " text-xs"
                            }
                        >
                            {x.type === "income" ? "+" : "-"}
                            {x.amount}
                            {x.currencyCode}
                        </p>
                        {x.description && (
                            <p
                                id="_description"
                                className="text-xs font-light line-clamp-2 xl:line-clamp-3"
                            >
                                {x.description}
                            </p>
                        )}
                    </div>

                    <div className="pr-3 xl:pr-5 flex justify-end items-center ">
                        <Badge className="w-fit h-fit" variant={"secondary"}>
                            {x.category?.name || "Uncategory"}
                        </Badge>

                        {/* <p className="text-sm">{formatDateAndTime(x.date)}</p> */}
                        {/* <p className="text-muted-foreground text-xs">
                                Recorded at {formatDateAndTime(x.createdAt)}
                            </p> */}
                    </div>
                </div>
            ))}
        </div>
    );
}

function TypeTranslator({ type }: { type: $Enums.TransactionType }) {
    switch (type) {
        case "income":
            return (
                <Badge variant={"outline"} className="text-green-600">
                    Income
                </Badge>
            );
        case "expense":
            return (
                <Badge variant={"outline"} className="text-red-600">
                    Expense
                </Badge>
            );
        default:
            return (
                <Badge variant={"outline"} className="text-green-600">
                    Income
                </Badge>
            );
    }
}
