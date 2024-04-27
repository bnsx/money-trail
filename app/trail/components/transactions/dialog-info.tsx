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
import { ArchiveIcon, ClockIcon, TrashIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@react-hook/media-query";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { CategoryBadge } from "./category-badge";
import { DialogEdit } from "./dialog-edit";
import { th } from "date-fns/locale";

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
                            <DialogTitle
                                className={`${sarabunFont.className} space-x-3`}
                            >
                                <span>{data.title}</span>
                                <CategoryBadge data={data.category?.name} />
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
                                        <span
                                            className="text-xs"
                                            title={new Date(
                                                data.updatedAt
                                            ).toLocaleString(th.code)}
                                        >
                                            {new Date(
                                                data.updatedAt
                                            ).toLocaleString(th.code)}
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
                                    <DialogEdit
                                        isDesktop={isDesktop}
                                        data={data}
                                        setDialogInfo={setOpen}
                                    />
                                </div>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className={sarabunFont.className}>
                                {data.title}
                            </DrawerTitle>
                            <DrawerDescription className="space-y-1">
                                <Amount
                                    type={data.type}
                                    amount={data.amount}
                                    currencyCode={data.currencyCode}
                                />
                                <CategoryBadge data={data.category?.name} />

                                <div className="">
                                    <div className="flex justify-center gap-1">
                                        <ClockIcon className="w-4 h-4" />
                                        <span className="text-xs">
                                            {new Date(
                                                data.updatedAt
                                            ).toLocaleString(th.code)}
                                        </span>
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
                            <DialogEdit
                                isDesktop={isDesktop}
                                data={data}
                                setDialogInfo={setOpen}
                            />
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
