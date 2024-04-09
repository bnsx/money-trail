import { z } from "zod";

const create = z
    .object({
        name: z
            .string()
            .min(1, { message: "Please fill this box" })
            .max(25)
            .trim(),
        description: z
            .string()
            .max(255, { message: "Maximum 255 character!" })
            .trim().nullable(),
    })
    .transform((x) => ({ ...x, description: x.description || null }));
const delete_ = z.object({
    categoryID: z.string().min(1).max(100),
});
const patch = z.object({
    categoryID: z.string().min(1).max(100),
    data: create,
});
export const categorySchema = { create, delete_, patch };
