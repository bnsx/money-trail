import { category } from "@/lib/category";
import { member } from "@/lib/member";
import { categorySchema } from "@/zod/category";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req });
        const memberID = token?.id as string;
        const hasMember = await member.hasMember({ memberID });
        if (!hasMember) {
            return NextResponse.json(
                {
                    message: "Unauthorized!",
                    code: "UNAUTHORIZED",
                },
                { status: 401 }
            );
        }
        const rawData = await req.json();
        const body = categorySchema.create.safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        const { name, description } = body.data;
        const categories = await category.getMyCategories({ memberID });
        if (categories.length === 5) {
            // limit 5 category per account!
            return NextResponse.json(
                {
                    message: "Maximum categories limit reached(5)",
                    code: "MAX_CATEGORIES_REACHED",
                },
                { status: 400 }
            );
        }
        const data = await category.create({
            memberID,
            name,
            description,
        });
        return NextResponse.json(
            {
                ...data,
                // message: "Category created successfully",
                // code: "SUCCESS",
                // data: { categoryID },
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Internal Server Error", code: "INTERNAL_SERVER_ERROR" },
            { status: 500 }
        );
    }
}
