import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { RenderButtonToGoPage } from "./renderButtonGoToPage";
import { PageSize } from "./pageSize";

interface Props {
    isFetching: boolean;
    pageIndex: number;
    pageSize: number;
    pageCount: number;
}

export function Navigator({
    isFetching,
    pageIndex,
    pageSize,
    pageCount,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const createQueryString = useCallback(
        (data: Array<{ name: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach((item) => params.set(item.name, item.value));
            return params.toString();
        },
        [searchParams]
    );
    const disabledPrevButton = pageIndex === 1 || isFetching;
    const disabledNextButton = pageIndex >= pageCount || isFetching;

    const onPrev = () => {
        if (pageIndex !== 1) {
            const value = pageIndex - 1;
            router.push(
                pathname +
                    "?" +
                    createQueryString([
                        { name: "pageIndex", value: value.toString() },
                    ])
            );
        }
    };

    const onNext = () => {
        const value = pageIndex + 1;
        router.push(
            pathname +
                "?" +
                createQueryString([
                    { name: "pageIndex", value: value.toString() },
                ])
        );
    };

    // const onGoToPage = (page: number) => {
    //     router.push(
    //         pathname + "?" + createQueryString("pageIndex", page.toString())
    //     );
    // };

    useEffect(() => {
        if (pageIndex > pageCount) {
            router.push(
                pathname +
                    "?" +
                    createQueryString([
                        { name: "pageIndex", value: "1" },
                        { name: "pageSize", value: "10" },
                    ])
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, pageCount]);
    return (
        <div className="xl:flex xl:justify-between grid gap-3">
            <div className="w-full flex justify-center xl:justify-start">
                <PageSize
                    router={router}
                    pathname={pathname}
                    searchParams={searchParams}
                    isFetching={isFetching}
                    pageSize={pageSize}
                />
            </div>
            <div className="flex flex-wrap xl:flex-nowrap xl:justify-end justify-center gap-1">
                <Button
                    type="button"
                    size={"icon"}
                    onClick={onPrev}
                    disabled={disabledPrevButton}
                    className="hidden xl:flex"
                >
                    <ChevronLeftIcon />
                </Button>
                {RenderButtonToGoPage({
                    router,
                    searchParams,
                    pathname,
                    pageCount,
                    pageIndex,
                })}
                <Button
                    type="button"
                    size={"icon"}
                    onClick={onPrev}
                    disabled={disabledPrevButton}
                    className="xl:hidden"
                >
                    <ChevronLeftIcon />
                </Button>
                <Button
                    type="button"
                    size={"icon"}
                    onClick={onNext}
                    disabled={disabledNextButton}
                >
                    <ChevronRightIcon />
                </Button>
            </div>
        </div>
    );
}
