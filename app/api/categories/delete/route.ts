import { category } from "@/lib/category";
import { member } from "@/lib/member";
import { categorySchema } from "@/zod/category";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
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
        const body = categorySchema.delete_.safeParse(rawData);
        if (!body.success) {
            return NextResponse.json(
                { message: "Invalid Schema", code: "INVALID_SCHEMA" },
                { status: 400 }
            );
        }
        const hasCategory = await category.hasCategory({
            categoryID: body.data.categoryID,
            memberID,
        });
        if (!hasCategory) {
            return NextResponse.json(
                {
                    message: "Category not found!",
                    code: "CATEGORY_404",
                },
                { status: 404 }
            );
        }
        await category.delete({ categoryID: body.data.categoryID, memberID });
        return NextResponse.json(
            {
                message: "Category deleted successfully",
                code: "SUCCESS",
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
