"use client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback } from "react";

interface Props {
    router: AppRouterInstance;
    pathname: string;
    searchParams: ReadonlyURLSearchParams;
    pageSize: number;
    isFetching: boolean;
}
const size = [5, 10, 15, 20];
export function PageSize({
    router,
    pathname,
    searchParams,
    pageSize,
    isFetching,
}: Props) {
    const defaultValue = isFetching ? undefined : pageSize.toString();
    const createQueryString = useCallback(
        (data: Array<{ name: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach((item) => params.set(item.name, item.value));
            return params.toString();
        },
        [searchParams]
    );
    const onValueChange = (value: string) => {
        router.push(
            pathname +
                "?" +
                createQueryString([
                    { name: "pageSize", value: value.toString() },
                ])
        );
    };
    return (
        <Select
            disabled={isFetching}
            value={defaultValue}
            onValueChange={onValueChange}
        >
            <SelectTrigger className="max-w-36">
                <SelectValue placeholder="Page Size" />
            </SelectTrigger>
            <SelectContent>
                {size.map((x) => (
                    <SelectItem key={x} value={x.toString()}>
                        {x}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
