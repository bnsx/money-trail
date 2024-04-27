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
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface FetcherProps {
    pageIndex: string;
    pageSize: string;
    fromDate: string;
    toDate: string;
    type: string;
    sortByDate: "asc" | "desc";
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
    sortByDate,
}: FetcherProps) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const r = await axios.get("/api/transactions", {
        params: { pageIndex, pageSize, fromDate, toDate, type, sortByDate },
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
    const sortByDate = (searchParams.get("sortByDate") || "desc") as
        | "asc"
        | "desc";
    const fromDate = searchParams.get("from") || "";
    const toDate = searchParams.get("to") || "";
    const type = (searchParams.get("type") || "all") as
        | "all"
        | "income"
        | "expense";
    const { data, isFetching, refetch } = useQuery({
        queryKey: ["transactions"],
        queryFn: () =>
            fetcher({
                pageIndex,
                pageSize,
                fromDate,
                toDate,
                type,
                sortByDate,
            }),
    });
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
                {isFetching || !data ? (
                    <Loading />
                ) : (
                    <RenderTransaction
                        onClicked={onOpenModal}
                        data={data.data}
                    />
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
            <div id="question">
                <h1>Questions</h1>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Why can&apos;t I update the data once one day has
                            elapsed?
                        </AccordionTrigger>
                        <AccordionContent>
                            To ensure accurate data, it&apos;s essential to
                            update it before the next day begins, as data
                            updates may not be possible after one day has
                            passed.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            How can I delete my account from the website?
                        </AccordionTrigger>
                        <AccordionContent>
                            To delete your account from the website, visit your
                            profile page by clicking{" "}
                            <Link href={"/profile"}>here</Link>, then click on
                            &apos;Deactivate.&apos; Afterward, the website will
                            redirect you to logging out.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
