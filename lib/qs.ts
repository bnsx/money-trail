// query string

import { ReadonlyURLSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CreateQueryStringProps {
    data: Array<{ name: string; value: string }>;
    searchParams: ReadonlyURLSearchParams;
    deps?: any[];
}
export const createQueryString = ({
    data,
    searchParams,
    deps,
}: CreateQueryStringProps) =>
    useCallback(() => {
        const params = new URLSearchParams(searchParams.toString());
        data.forEach((item) => params.set(item.name, item.value));
        return params.toString();
    }, [deps]);
