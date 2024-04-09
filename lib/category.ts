import { prisma } from "./db";

interface getMyCategoriesProps {
    memberID: string;
    deletedAt?: null;
}
interface createCategoryProps {
    memberID: string;
    name: string;
    description: string | null;
}
interface deleteCategoryProps {
    categoryID: string;
    memberID: string;
}
interface patchCategoryProps {
    categoryID: string;
    memberID: string;
    name: string;
    description: string | null;
}
interface hasCategoryProps {
    categoryID: string;
    memberID: string;
}
class Category {
    async getMyCategories({ memberID, deletedAt }: getMyCategoriesProps) {
        return await prisma.categories.findMany({
            where: { memberID, deletedAt },
            select: {
                categoryID: true,
                name: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: false,
            },
        });
    }
    async create({ memberID, name, description }: createCategoryProps) {
        return await prisma.categories.create({
            data: { memberID, name, description },
        });
    }
    async delete({ categoryID }: deleteCategoryProps) {
        return await prisma.categories.update({
            where: { categoryID, deletedAt: null },
            data: { updatedAt: new Date(), deletedAt: new Date() },
        });
    }
    async patch({ categoryID, name, description }: patchCategoryProps) {
        return await prisma.categories.update({
            where: { categoryID, deletedAt: null },
            data: { name, description, updatedAt: new Date() },
        });
    }
    async hasCategory({ categoryID, memberID }: hasCategoryProps) {
        return await prisma.categories.findUnique({
            where: { categoryID, memberID, deletedAt: null },
        });
    }
}

export const category = new Category();
