"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { deleteProductImage } from "@/lib/storage";

export type ProductActionState = { success: boolean; message: string; }; function createSlug(value: string) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); } function parsePrice(value: string) { const cleanedValue = value.replace("R$", "").replace(/\s/g, "").trim(); const normalizedValue = cleanedValue.includes(",") ? cleanedValue.replace(/\./g, "").replace(",", ".") : cleanedValue; return Number(normalizedValue); } async function createUniqueSlug(baseSlug: string) { let slug = baseSlug; let counter = 2; while (await prisma.product.findUnique({ where: { slug, }, select: { id: true, }, })) { slug = `${baseSlug}-${counter}`; counter++; } return slug; } export async function createProductAction(_previousState: ProductActionState, formData: FormData): Promise<ProductActionState> { const title = String(formData.get("title") ?? "").trim(); const description = String(formData.get("description") ?? "").trim(); const priceValue = String(formData.get("price") ?? "").trim(); const consoleName = String(formData.get("console") ?? "").trim(); const condition = String(formData.get("condition") ?? "").trim(); const categoryId = String(formData.get("categoryId") ?? "").trim(); const stockValue = String(formData.get("stock") ?? "1"); const hasBox = formData.get("hasBox") === "on"; const hasManual = formData.get("hasManual") === "on"; const featured = formData.get("featured") === "on"; const rarity = formData.get("rarity") === "on"; if (!title) { return { success: false, message: "Informe o nome do produto.", }; } if (!description) { return { success: false, message: "Informe a descrição do produto.", }; } if (!consoleName) { return { success: false, message: "Informe o console ou plataforma.", }; } if (!condition) { return { success: false, message: "Informe o estado de conservação.", }; } if (!categoryId) { return { success: false, message: "Selecione uma categoria.", }; } const price = parsePrice(priceValue); if (!Number.isFinite(price) || price <= 0) { return { success: false, message: "Informe um preço válido.", }; } const stock = Number(stockValue); if (!Number.isInteger(stock) || stock < 0) { return { success: false, message: "Informe um estoque válido.", }; } const category = await prisma.category.findUnique({ where: { id: categoryId, }, select: { id: true, }, }); if (!category) { return { success: false, message: "A categoria selecionada não existe.", }; } const baseSlug = createSlug(`${title}-${consoleName}`) || createSlug(title); const slug = await createUniqueSlug(baseSlug); let productSlug: string; try { const product = await prisma.product.create({ data: { title, slug, description, price, console: consoleName, condition, stock, hasBox, hasManual, featured, rarity, categoryId, }, select: { slug: true, }, }); productSlug = product.slug; } catch (error) { console.error("Erro ao cadastrar produto:", error); return { success: false, message: "Não foi possível cadastrar o produto.", }; } revalidatePath("/"); revalidatePath("/catalogo"); revalidatePath("/admin/produtos"); redirect(`/admin/produtos/${productSlug}/imagens`); } export async function updateProductAction(productId: string, _previousState: ProductActionState, formData: FormData): Promise<ProductActionState> { const title = String(formData.get("title") ?? "").trim(); const description = String(formData.get("description") ?? "").trim(); const priceValue = String(formData.get("price") ?? "").trim(); const consoleName = String(formData.get("console") ?? "").trim(); const condition = String(formData.get("condition") ?? "").trim(); const categoryId = String(formData.get("categoryId") ?? "").trim(); const stockValue = String(formData.get("stock") ?? "1"); const hasBox = formData.get("hasBox") === "on"; const hasManual = formData.get("hasManual") === "on"; const featured = formData.get("featured") === "on"; const rarity = formData.get("rarity") === "on"; if (!productId) { return { success: false, message: "Produto não informado.", }; } if (!title) { return { success: false, message: "Informe o nome do produto.", }; } if (!description) { return { success: false, message: "Informe a descrição do produto.", }; } if (!consoleName) { return { success: false, message: "Informe o console ou plataforma.", }; } if (!condition) { return { success: false, message: "Informe o estado de conservação.", }; } if (!categoryId) { return { success: false, message: "Selecione uma categoria.", }; } const price = parsePrice(priceValue); if (!Number.isFinite(price) || price <= 0) { return { success: false, message: "Informe um preço válido.", }; } const stock = Number(stockValue); if (!Number.isInteger(stock) || stock < 0) { return { success: false, message: "Informe um estoque válido.", }; } const [product, category] = await Promise.all([prisma.product.findUnique({ where: { id: productId, }, select: { id: true, slug: true, }, }), prisma.category.findUnique({ where: { id: categoryId, }, select: { id: true, }, }),]); if (!product) { return { success: false, message: "Produto não encontrado.", }; } if (!category) { return { success: false, message: "A categoria selecionada não existe.", }; } try { await prisma.product.update({ where: { id: product.id, }, data: { title, description, price, console: consoleName, condition, stock, hasBox, hasManual, featured, rarity, categoryId, }, }); } catch (error) { console.error("Erro ao atualizar produto:", error); return { success: false, message: "Não foi possível atualizar o produto.", }; } revalidatePath("/"); revalidatePath("/catalogo"); revalidatePath(`/produto/${product.slug}`); revalidatePath("/admin/produtos"); revalidatePath(`/admin/produtos/${product.slug}/editar`); revalidatePath(`/admin/produtos/${product.slug}/imagens`); redirect("/admin/produtos"); } export async function deleteProductAction(
    formData: FormData
): Promise<void> {
    const productId = String(formData.get("productId") ?? "");

    if (!productId) {
        return;
    }

    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        },
        select: {
            id: true,
            slug: true,
            images: {
                select: {
                    storagePath: true,
                },
            },
        },
    });

    if (!product) {
        return;
    }

    await prisma.product.delete({
        where: {
            id: product.id,
        },
    });

    const storageResults = await Promise.allSettled(
        product.images.map((image) =>
            deleteProductImage(image.storagePath)
        )
    );

    storageResults.forEach((result) => {
        if (result.status === "rejected") {
            console.error(
                "Produto excluído, mas uma imagem não foi removida do Storage:",
                result.reason
            );
        }
    });

    revalidatePath("/");
    revalidatePath("/catalogo");
    revalidatePath("/admin/produtos");
}
