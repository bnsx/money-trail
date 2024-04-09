"use client";
import { Path, Control } from "react-hook-form";
import { Schema } from "zod";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { ChangeEvent, useEffect, useState } from "react";

interface Props<T, K> {
    label: string;
    name: Path<T>;
    control: Control<T | any>;
    schema?: Schema<T>;
}
export function FormNumber<T, K>({
    label,
    name,
    control,
    schema,
}: Props<T, K>) {
    const { onChange } = control.register(name);
    const [amount, setAmount] = useState(0);
    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (isNaN(value) === false) {
            setAmount(value);
        } else {
            setAmount(0);
        }
    };
    const increase = () => setAmount(amount + 1);
    const decrease = () => {
        if (amount === 0) {
            setAmount(0);
        } else {
            setAmount(amount - 1);
        }
    };
    useEffect(() => {
        onChange({ target: { name, value: amount } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [amount]);
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        {label}
                        <FormMessage className="text-xs" />
                    </FormLabel>
                    <div className="flex gap-1">
                        <Button type="button" onClick={decrease}>
                            <MinusIcon />
                        </Button>
                        <FormControl>
                            <Input
                                onChange={onInputChange}
                                type={"number"}
                                step={1}
                                className="text-center"
                                value={field.value}
                                ref={field.ref}
                                name={field.name}
                                disabled={field.disabled}
                                onBlur={field.onBlur}
                            />
                        </FormControl>
                        <Button type="button" onClick={increase}>
                            <PlusIcon />
                        </Button>
                    </div>
                </FormItem>
            )}
        />
    );
}
