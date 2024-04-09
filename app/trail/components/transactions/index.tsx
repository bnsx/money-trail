"use client";
import { Pagination } from "@/components/Pagination";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Loading } from "@/components/Loading";
import { RenderTransaction } from "./render";
import { Filter } from "./filter";

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
    const searchParams = useSearchParams();
    const pageIndex = parseInt(searchParams.get("pageIndex") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
    const sort = (searchParams.get("sort") || "newer") as "newer" | "older";
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: () => fetcher({ pageIndex, pageSize, sort }),
    });

    useEffect(() => {
        refetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sort]);

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

                {isFetching || !data ? (
                    <Loading />
                ) : (
                    <RenderTransaction
                        searchParams={searchParams}
                        data={data.data}
                    />
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
