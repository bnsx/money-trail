import { z } from "zod";

const currency = z.object({ isoNumeric: z.number().int().positive() });
export const setupSchema = { currency };
