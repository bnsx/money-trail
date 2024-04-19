"use client";
import { Badge } from "@/components/ui/badge";
import { formatDateAndTime } from "@/lib/date";
import { NumberThousand } from "@/lib/number";
import { Sarabun } from "next/font/google";

const font = Sarabun({
    weight: ["100", "200", "300", "400", "600"],
    subsets: ["thai", "latin"],
    style: ["italic"],
});
interface Props {
    data: Transaction[];
    onClicked: (index: number) => void;
}
export default function RenderTransaction({ data, onClicked }: Props) {
    if (data.length === 0) {
        return <p className="text-center pt-5">Data not found.</p>;
    }

    return (
        <div className="space-y-3">
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
                            id="_amount"
                            className={
                                (x.type === "income"
                                    ? "text-green-600"
                                    : "text-red-600") + " text-xs"
                            }
                        >
                            {x.type === "income" ? "+" : "-"}
                            {NumberThousand(x.amount)}
                            {x.currencyCode}
                        </p>
                        {x.description && (
                            <p
                                id="_description"
                                className={
                                    font.className +
                                    " " +
                                    "line-clamp-2 xl:line-clamp-3"
                                }
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
