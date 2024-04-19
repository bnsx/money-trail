"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
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
import { NumberThousand } from "@/lib/number";
import { $Enums } from "@prisma/client";
import { useMediaQuery } from "@react-hook/media-query";
import { Sarabun } from "next/font/google";

const font = Sarabun({
    weight: ["100", "200", "300", "400", "600"],
    subsets: ["thai", "latin"],
    style: ["normal"],
});
interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    data: Transaction;
}
export function DialogInfo({ open, data, setOpen }: Props) {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const onOpenChange = () => setOpen(!open);

    return (
        <div>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{data.title}</DialogTitle>
                            <DialogDescription>
                                <Amount
                                    type={data.type}
                                    amount={data.amount}
                                    currencyCode={data.currencyCode}
                                />
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-1">
                            <p className={font.className}>
                                {data.description || "No Description"}
                            </p>
                        </div>
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
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-1">
                            <p className={font.className + " " + "text-center"}>
                                {data.description || "No Description"}
                            </p>
                        </div>
                        <DrawerFooter>
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
