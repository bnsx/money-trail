"use client";
import { Button } from "@/components/ui/button";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
    router: AppRouterInstance;
    pathname: string;
    searchParams: ReadonlyURLSearchParams;
    pageIndex: number;
    pageCount: number;
}
export function RenderButtonToGoPage({
    router,
    pathname,
    searchParams,
    pageCount,
    pageIndex,
}: Props) {
    const createQueryString = useCallback(
        (data: Array<{ name: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach((item) => params.set(item.name, item.value));
            return params.toString();
        },
        [searchParams]
    );
    const onGoToPage = (page: number) => {
        router.push(
            pathname +
                "?" +
                createQueryString([
                    { name: "pageIndex", value: page.toString() },
                ])
        );
    };
    const maxButtons = 4;
    const start = Math.max(1, pageIndex - Math.floor(maxButtons / 2));
    const end = Math.min(pageCount, start + maxButtons - 1);

    const numbers = [];
    for (let i = start; i <= end; i++) {
        numbers.push(
            <Button
                key={i}
                onClick={() => onGoToPage(i)}
                variant={i === pageIndex ? "default" : "secondary"}
                className=""
                size={"icon"}
            >
                {i}
            </Button>
        );
    }

    if (start > 1) {
        numbers.unshift(
            <Button
                key="first"
                onClick={() => onGoToPage(1)}
                variant="secondary"
                className=""
                size={"icon"}
            >
                1
            </Button>
        );
        // numbers.unshift(
        //     <Button
        //         key="ellipsis-start"
        //         variant="secondary"
        //         className=""
        //         disabled
        //     >
        //         ...
        //     </Button>
        // );
    }

    if (end < pageCount) {
        numbers.push(
            <Button
                key="ellipsis-end"
                variant="secondary"
                className=""
                size={"icon"}
                disabled
            >
                ...
            </Button>
        );
        numbers.push(
            <Button
                key="last"
                onClick={() => onGoToPage(pageCount)}
                variant="secondary"
                className=""
                size={"icon"}
            >
                {pageCount}
            </Button>
        );
    }

    return <div className="flex flex-wrap xl:flex-nowrap gap-1">{numbers}</div>;
}
