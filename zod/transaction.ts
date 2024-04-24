import { z } from "zod";
const create = z
    .object({
        title: z
            .string()
            .min(1, { message: "Please fill this box" })
            .max(25, { message: "Maximum 25 character!" })
            .trim(),
        description: z
            .string()
            .max(255, { message: "Maximum 255 character!" })
            .trim()
            .nullable()
            .optional(),
        type: z.enum(["income", "expense"]),
        amount: z.number().multipleOf(0.01).min(0),
        date: z.coerce.date({
            errorMap: () => ({ message: "Please select date" }),
        }),
        categoryID: z.string().nullable().optional(),
    })
    .transform((x) => ({
        ...x,
        description: x.description || null,
        categoryID: x.categoryID || null,
        date: MapTimeToDate(x.date),
    }));
const delete_ = z.object({ txid: z.string().min(1).max(100) });
const patch = z.object({ txid: z.string().min(1).max(100), data: create });
export const transactionSchema = { create, delete_, patch };

function MapTimeToDate(data: Date): Date {
    const current = new Date(data);
    const time = new Date()
        .toLocaleTimeString()
        .split(/\s+(?:PM|AM)/)[0]
        .trim();
    const [hours, minutes, seconds] = time.split(":").map(Number);
    current.setHours(hours, minutes, seconds);
    return current;
}
