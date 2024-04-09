"use client";
import { Control, Path } from "react-hook-form";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "./ui/form";
import { Schema } from "zod";
import { Switch } from "./ui/switch";

interface Props<T, K> {
    name: Path<T>;
    control: Control<T | any>;
    label?: string;
    placeholder?: string;
    schema?: Schema<T>;
}
export default function FormSwitch<T, K extends keyof T>({
    control,
    name,
    label = "",
    placeholder = "",
    schema,
}: Props<T, K>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <div>
                        <FormLabel>{label}</FormLabel>
                        <FormDescription>{placeholder}</FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
