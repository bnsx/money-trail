"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Form } from "@/components/ui/form";
import { setupSchema } from "@/zod/setup";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Cross2Icon, DiscIcon } from "@radix-ui/react-icons";
import { useMediaQuery } from "@react-hook/media-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
    data: Country[];
}
type ResponseCode =
    | "INVALID_SCHEMA"
    | "UNAUTHORIZED"
    | "COUNTRY_404"
    | "SUCCESS"
    | "INTERNAL_SERVER_ERROR";
interface ResponseData {
    message: string;
    code: ResponseCode;
}
const schema = setupSchema.currency;
export function FormValue({ data }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const [country, setCountry] = useState<Country | null>(null);
    const [countryName, setCountryName] = useState("");
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
    });
    const onChange = (event: ChangeEvent<HTMLInputElement>) =>
        setCountryName(event.target.value);
    const filteredCountries = data.filter((country) =>
        country.name.toLowerCase().includes(countryName.toLowerCase())
    );
    const onClickByCountry = (isoNumeric: number) => {
        const getVal = data.find((x) => x.isoNumeric === isoNumeric);
        if (getVal) {
            setCountry(getVal);
            form.setValue("isoNumeric", getVal.isoNumeric);
            setOpen(true);
        }
    };
    const onOpenChange = () => setOpen(!open);
    const onSubmit = async (value: z.infer<typeof schema>) => {
        try {
            setSubmit(true);
            const r = await axios.post("/api/setup", JSON.stringify(value));
            if (r.status === 200) {
                setSubmit(false);
                return router.refresh();
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                const r = error.response?.data as ResponseData;
                switch (r.code) {
                    case "UNAUTHORIZED":
                        router.refresh();
                        break;
                    case "COUNTRY_404":
                        toast.error("Your country not found!", {
                            description: "Please contact WebAdmin!",
                        });
                        break;
                    default:
                        toast.error("Something wrong!", {
                            description: "Please contact WebAdmin!",
                        });
                        break;
                }
            }
            setSubmit(false);
        }
    };
    useEffect(() => {
        if (!open) {
            setCountry(null);
        }
    }, [open]);
    return (
        <div>
            <div className="space-y-5">
                <div className="grid gap-2">
                    <Label htmlFor="search">Your country name</Label>
                    <Input
                        id="search"
                        type="text"
                        placeholder="eg. Thailand, Thai, Norway, Nor, Australia, Aus... etc."
                        onChange={onChange}
                    />
                </div>
                <div className="grid xl:grid-cols-4 md:grid-cols-3 gap-1">
                    {filteredCountries.map((x) => (
                        <button
                            key={x.isoNumeric}
                            type="button"
                            onClick={() => onClickByCountry(x.isoNumeric)}
                            className="hover:border flex gap-3 p-1"
                        >
                            <Image
                                src={`https://flagcdn.com/256x192/${x.isoChar2.toLowerCase()}.webp`}
                                width={256}
                                height={192}
                                className="w-20"
                                alt={x.name}
                                priority={true}
                            />

                            <div className="text-start">
                                <h1 className="text-xs">{x.currencyCode}</h1>
                                <p className="text-sm font-semibold line-clamp-2">
                                    {x.name}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
            {isDesktop ? (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    {/* <DialogTrigger>Open</DialogTrigger> */}
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {country?.name} - {country?.isoChar2}
                            </DialogTitle>
                            <DialogDescription>
                                Currency Name is {country?.currencyName}
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <DialogFooter>
                                    <Button
                                        type="submit"
                                        disabled={isSubmit}
                                        className="space-x-1"
                                    >
                                        <span>Save</span>
                                        <DiscIcon />
                                    </Button>
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            className="space-x-1"
                                        >
                                            <span>Drop</span> <Cross2Icon />
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            ) : (
                <>
                    <Drawer open={open} onOpenChange={setOpen}>
                        {/* <DrawerTrigger asChild>
                            <Button variant="outline">Open</Button>
                        </DrawerTrigger> */}
                        <DrawerContent>
                            <DrawerHeader className="text-left">
                                <DrawerTitle>
                                    {country?.name} - {country?.isoChar2}
                                </DrawerTitle>
                                <DrawerDescription>
                                    Currency Name is {country?.currencyName}
                                </DrawerDescription>
                            </DrawerHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)}>
                                    <DrawerFooter>
                                        <Button
                                            type="submit"
                                            disabled={isSubmit}
                                            className="space-x-1"
                                        >
                                            <span>Save</span>
                                            <DiscIcon />
                                        </Button>
                                        <DrawerClose asChild>
                                            <Button
                                                type="button"
                                                variant={"outline"}
                                                className="space-x-1"
                                            >
                                                <span>Drop</span> <Cross2Icon />
                                            </Button>
                                        </DrawerClose>
                                    </DrawerFooter>
                                </form>
                            </Form>
                        </DrawerContent>
                    </Drawer>
                </>
            )}
        </div>
    );
}
