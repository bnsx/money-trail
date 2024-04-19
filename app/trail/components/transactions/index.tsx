"use client";
import { Pagination } from "@/components/Pagination";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import RenderTransaction from "./render";
import { Filter } from "./filter";
import { DialogInfo } from "./dialog-info";

interface FetcherProps {
    pageIndex: string;
    pageSize: string;
    fromDate: string;
    toDate: string;
    type: string;
}

interface ResponseData {
    data: Transaction[];
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}
async function fetcher({
    pageIndex,
    pageSize,
    fromDate,
    toDate,
    type,
}: FetcherProps) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const r = await axios.get("/api/transactions", {
        params: { pageIndex, pageSize, fromDate, toDate, type },
    });
    return r.data as ResponseData;
}
export function TransactionsDisplay() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageIndex = parseInt(
        searchParams.get("pageIndex") || "1",
        10
    ).toString();
    const pageSize = parseInt(
        searchParams.get("pageSize") || "10",
        10
    ).toString();
    const sortByDate = (searchParams.get("sortByDate") || "newer") as
        | "newer"
        | "older";
    const fromDate = searchParams.get("from") || "";
    const toDate = searchParams.get("to") || "";
    const type = (searchParams.get("type") || "all") as
        | "all"
        | "income"
        | "expense";
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => fetcher({ pageIndex, pageSize, fromDate, toDate, type }),
    });
    const isData = SortByDateFn(sortByDate);
    const [currentValue, setCurrentValue] = useState<Transaction | null>(null);
    const [open, setOpen] = useState(false);
    const onOpenModal = (index: number) => {
        const d = data?.data.find((_, i) => i === index);
        if (d) {
            setCurrentValue(d);
            setOpen(true);
        } else {
            router.refresh();
        }
    };
    function SortByDateFn(by: "newer" | "older") {
        if (by === "older") {
            return data?.data.sort(
                (a, b) =>
                    new Date(a.date).getTime() -
                    new Date(b.date).getTime()
            );
        }
        return data?.data.sort(
            (a, b) =>
                new Date(b.date).getTime() -
                new Date(a.date).getTime()
        );
    }
    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, fromDate, toDate, type, sortByDate]);
    useEffect(() => {
        if (open === false) {
            setCurrentValue(null);
        }
    }, [open]);
    return (
        <div className="xl:w-2/4 space-y-3">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Transactions</h1>
                <Filter />
            </div>
            <div
                className={
                    "min-h-[480px] max-h-[480px] overflow-y-scroll overflow-hidden"
                }
            >
                {currentValue && (
                    <DialogInfo
                        open={open}
                        setOpen={setOpen}
                        data={currentValue}
                    />
                )}
                {isFetching || !isData ? (
                    <Loading />
                ) : (
                    <RenderTransaction onClicked={onOpenModal} data={isData} />
                )}
            </div>
            <div className="space-y-1">
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
