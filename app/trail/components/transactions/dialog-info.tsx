"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { formatDate } from "@/lib/date";
import { sarabunFont } from "@/lib/font";
import { NumberThousand } from "@/lib/number";
import { $Enums } from "@prisma/client";
import {
    ArchiveIcon,
    ClockIcon,
    Pencil2Icon,
    TrashIcon,
} from "@radix-ui/react-icons";
import { useMediaQuery } from "@react-hook/media-query";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    data: Transaction;
}
export function DialogInfo({ open, data, setOpen }: Props) {
    const queryClient = useQueryClient();
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const onOpenChange = () => setOpen(!open);
    async function deleteOperation() {
        try {
            const r = await axios.post(
                "/api/transactions/delete",
                JSON.stringify({ txid: data.txid })
            );
            if (r.status === 200) {
                queryClient.invalidateQueries({ queryKey: ["transactions"] });
                setOpen(false);
            }
        } catch (error) {
            alert(
                "We're unable to delete this transaction. Please refresh the page again!"
            );
            setOpen(false);
        }
    }
    return (
        <div>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="w-full">
                        <DialogHeader>
                            <DialogTitle className={sarabunFont.className}>
                                {data.title} {data.category?.name}
                            </DialogTitle>
                            <DialogDescription>
                                <Amount
                                    type={data.type}
                                    amount={data.amount}
                                    currencyCode={data.currencyCode}
                                />
                                {/* {formatDate(data.date)} */}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-1">
                            <p className={sarabunFont.className}>
                                {data.description || "No Description"}
                            </p>
                        </div>
                        <DialogFooter className="w-full">
                            <div className="flex items-center justify-between w-full">
                                <div className="text-muted-foreground flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <ClockIcon className="w-5 h-5" />
                                        <span className="text-xs">
                                            {formatDate(data.date)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <ArchiveIcon className="w-5 h-5" />
                                        <span className="text-xs">
                                            {formatDate(data.createdAt)}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-x-1">
                                    <Button
                                        type="button"
                                        size={"icon"}
                                        variant={"destructive"}
                                        onClick={() => {
                                            const v = confirm(
                                                "Do you want to delete?"
                                            );
                                            if (v) {
                                                deleteOperation();
                                            }
                                        }}
                                    >
                                        <TrashIcon />
                                    </Button>
                                    <Button type="button" size={"icon"}>
                                        <Pencil2Icon />
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>{data.title}</DrawerTitle>
                            <DrawerDescription>
                                <Amount
                                    type={data.type}
                                    amount={data.amount}
                                    currencyCode={data.currencyCode}
                                />
                                <div className="flex justify-evenly">
                                    <div className="flex gap-1">
                                        <ClockIcon className="w-5 h-5" />
                                        <p>{formatDate(data.date)}</p>
                                    </div>{" "}
                                    <div className="flex gap-1">
                                        <ArchiveIcon className="w-5 h-5" />
                                        <p>{formatDate(data.createdAt)}</p>
                                    </div>
                                </div>
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-1">
                            <p
                                className={`${sarabunFont.className} text-center`}
                            >
                                {data.description || "No Description"}
                            </p>
                        </div>
                        <DrawerFooter>
                            <div className="">
                                <Button type="button" className="w-full">
                                    Edit
                                </Button>
                            </div>
                            <DrawerClose asChild>
                                <Button type="button" variant={"outline"}>
                                    Close
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}

function Amount({
    type,
    amount,
    currencyCode,
}: {
    type: $Enums.TransactionType;
    amount: number;
    currencyCode: string;
}) {
    if (type === "expense") {
        return (
            <p className="text-red-600">
                -{NumberThousand(amount)}
                {currencyCode}
            </p>
        );
    }
    return (
        <p className="text-green-600">
            +{amount}
            {currencyCode}
        </p>
    );
}
