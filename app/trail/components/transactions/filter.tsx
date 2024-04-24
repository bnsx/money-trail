"use client";

import { Button } from "@/components/ui/button";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@react-hook/media-query";
import { SortByDate } from "./sort-by-date";
import { FilterByDateRange } from "./filter-date-range";
import { useAtom } from "jotai";
import { filterAtom } from "./state";
import { FilterType } from "./filter-type";
import { toDateTime, toUnixTime } from "@/lib/date";

export function Filter() {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [filter, setFilter] = useAtom(filterAtom);
    const [open, setOpen] = useState(false);
    const onOpenChange = () => setOpen(!open);
    const sortByDate = (searchParams.get("sortByDate") || "desc") as
        | "asc"
        | "desc";
    const fromDate = Number(searchParams.get("from") || undefined) || undefined;
    const toDate = Number(searchParams.get("to") || undefined) || undefined;
    const txType = (searchParams.get("type") || "all") as
        | "all"
        | "income"
        | "expense";
    const createQueryString = useCallback(
        (data: Array<{ name: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach((item) => params.set(item.name, item.value));
            return params.toString();
        },
        [searchParams]
    );
    const onSubmit = () => {
        router.push(
            pathname +
                "?" +
                createQueryString([
                    { name: "sortByDate", value: filter.sortByDate },
                    { name: "type", value: filter.type },
                    {
                        name: "from",
                        value: toUnixTime(filter.days?.from)?.toString() || "",
                    },
                    {
                        name: "to",
                        value: toUnixTime(filter.days?.to)?.toString() || "",
                    },
                ])
        );
        setOpen(false);
    };

    useEffect(() => {
        // default config
        setFilter({
            days: {
                from: toDateTime(fromDate),
                to: toDateTime(toDate),
            },
            type: txType,
            sortByDate,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogTrigger asChild>
                        <Button type="button" size={"icon"} variant={"outline"}>
                            <MixerHorizontalIcon />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[30%]">
                        <DialogHeader>
                            <DialogTitle>Sort & Filter</DialogTitle>
                            {/* <DialogDescription>
                                Sorting and Filtering Data
                            </DialogDescription> */}
                        </DialogHeader>
                        <div className="space-y-3">
                            <FilterByDateRange isDesktop={isDesktop} />
                            <div className="flex justify-evenly">
                                <FilterType />
                                <SortByDate />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={onSubmit}>
                                Submit
                            </Button>
                            <DialogClose asChild>
                                <Button variant={"outline"}>Close</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button type="button" size={"icon"} variant={"outline"}>
                            <MixerHorizontalIcon />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Sort & Filter</DrawerTitle>
                            <DrawerDescription>
                                Sorting and Filtering Data
                            </DrawerDescription>
                        </DrawerHeader>
                        <div className="space-y-1">
                            <FilterByDateRange isDesktop={isDesktop} />
                            <div className="flex gap-5 justify-center">
                                <FilterType />
                                <SortByDate />
                            </div>
                        </div>
                        <DrawerFooter>
                            <Button type="submit" onClick={onSubmit}>
                                Submit
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            )}
        </div>
    );
}
