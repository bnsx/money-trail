"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export function Filter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sort = (searchParams.get("sort") || "newer") as "newer" | "older";
    const valueTranslator = () => {
        switch (sort) {
            case "newer":
                return false;
            case "older":
                return true;
            default:
                return false;
        }
    };
    const [checked, setChecked] = useState(() => valueTranslator());
    const createQueryString = useCallback(
        (data: Array<{ name: string; value: string }>) => {
            const params = new URLSearchParams(searchParams.toString());
            data.forEach((item) => params.set(item.name, item.value));
            return params.toString();
        },
        [searchParams]
    );
    const onCheckedChange = (value: boolean) => {
        setChecked(!checked);
        if (value === false) {
            router.push(
                pathname +
                    "?" +
                    createQueryString([{ name: "sort", value: "newer" }])
            );
        } else {
            router.push(
                pathname +
                    "?" +
                    createQueryString([{ name: "sort", value: "older" }])
            );
        }
    };

    return (
        <div className="">
            <Popover>
                <PopoverTrigger asChild>
                    <Button type="button" size={"icon"} variant={"outline"}>
                        <MixerHorizontalIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="space-y-2 w-fit">
                    <p className="text-xs">Sorting</p>
                    {/* <div className="grid gap-1">
                        <Label className="font-semibold">Recorded Date</Label>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs">Newer</span> <Switch />{" "}
                            <span className="text-xs">Older</span>
                        </div>
                    </div> */}
                    <div className="grid gap-1">
                        <Label className="text-xs font-semibold">
                            Recorded Date
                        </Label>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs">Newer</span>{" "}
                            <Switch
                                checked={checked}
                                onCheckedChange={onCheckedChange}
                            />{" "}
                            <span className="text-xs">Older</span>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
