"use client";
import { Pagination } from "@/components/Pagination";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import RenderTransaction from "./render";
import { Filter } from "./filter";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { $Enums } from "@prisma/client";
import { NumberThousand } from "@/lib/number";
import { Label } from "@/components/ui/label";
import { DialogInfo } from "./dialog-info";

interface FetcherProps {
    pageIndex: number;
    pageSize: number;
    sort: "newer" | "older";
}

interface ResponseData {
    data: Transaction[];
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}
async function fetcher({ pageIndex, pageSize, sort }: FetcherProps) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const r = await axios.get("/api/transactions", {
        params: { pageIndex, pageSize, sort },
    });
    return r.data as ResponseData;
}
export function TransactionsDisplay() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageIndex = parseInt(searchParams.get("pageIndex") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const sort = (searchParams.get("sort") || "newer") as "newer" | "older";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => fetcher({ pageIndex, pageSize, sort }),
    });
    const [currentValue, setCurrentValue] = useState<Transaction | null>(null);
    const [open, setOpen] = useState(false);
    const onOpenChange = () => setOpen(!open);
    const onClicked = (index: number) => {
        const d = data?.data.find((x, i) => i === index);
        if (d) {
            setCurrentValue(d);
            setOpen(true);
        } else {
            router.refresh();
        }
    };
    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort]);
    useEffect(() => {
        if (open === false) {
            setCurrentValue(null);
        }
    }, [open]);
    return (
        <div className="xl:w-2/4 space-y-3">
            <div className="xl:flex justify-between items-center">
                <h1 className="text-xl font-semibold">Transactions</h1>
            </div>
            <div
                className={
                    "min-h-[480px] max-h-[480px] overflow-y-scroll overflow-hidden"
                }
            >
                {/* <Loading /> */}
                {currentValue && (
                    <DialogInfo
                        open={open}
                        onOpenChange={onOpenChange}
                        data={currentValue}
                    />
                )}
                {isFetching || !data ? (
                    <Loading />
                ) : (
                    <RenderTransaction onClicked={onClicked} data={data.data} />
                )}
            </div>
            <div className="space-y-1">
                <Filter />

                <Pagination.Navigator
                    isFetching={isFetching}
                    pageIndex={data?.pageIndex as number}
                    pageSize={data?.pageSize as number}
                    pageCount={data?.pageCount as number}
                />
            </div>
        </div>
    );
}
