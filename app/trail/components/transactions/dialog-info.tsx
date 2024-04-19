"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { NumberThousand } from "@/lib/number";
import { $Enums } from "@prisma/client";
import { Sarabun } from "next/font/google";

const font = Sarabun({
    weight: ["100", "200", "300", "400", "600"],
    subsets: ["thai", "latin"],
    style: ["normal"],
});
interface Props {
    open: boolean;
    onOpenChange: () => void;
    data: Transaction;
}
export function DialogInfo({ open, onOpenChange, data }: Props) {
    return (
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
