"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { HTMLInputTypeAttribute } from "react";
import { Control, Path } from "react-hook-form";
import { Schema } from "zod";
import { Textarea } from "./ui/textarea";

interface Props<T, K> {
    label: string;
    placeholder?: string;
    name: Path<T>;
    control: Control<T | any>;
    schema?: Schema<T>;
    type?: HTMLInputTypeAttribute;
    textArea?: boolean;
}

export default function FormInput<T, K extends keyof T>({
    label,
    control,
    placeholder,
    name,
    schema,
    type = "text",
    textArea = false,
}: Props<T, K>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel >
                        {label}
                        <FormMessage className="text-xs" />
                    </FormLabel>
                    <FormControl>
                        {textArea ? (
                            <Textarea
                                placeholder={placeholder}
                                {...field}
                                className="max-h-32"
                            />
                        ) : (
                            <Input
                                placeholder={placeholder}
                                {...field}
                                type={type}
                            />
                        )}
                    </FormControl>
                </FormItem>
            )}
        />
    );
}
