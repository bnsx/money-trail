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

export function Filter() {
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
                            Transaction Data
                        </Label>
                        <div className="flex gap-2 items-center">
                            <span className="text-xs">Newer</span> <Switch />{" "}
                            <span className="text-xs">Older</span>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
