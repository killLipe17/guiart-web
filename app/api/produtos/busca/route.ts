import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export const dynamic =
  "force-dynamic";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const query =
    searchParams
      .get("q")
      ?.trim()
      .slice(0, 80) ?? "";

  if (query.length < 2) {
    return NextResponse.json({
      products: [],
    });
  }

  try {
    const products =
      await prisma.product.findMany({
        where: {
          stock: {
            gt: 0,
          },

          OR: [
            {
              title: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              console: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              condition: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              category: {
                is: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },

        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        take: 6,

        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          console: true,

          category: {
            select: {
              name: true,
            },
          },

          images: {
            orderBy: [
              {
                isCover: "desc",
              },
              {
                order: "asc",
              },
            ],

            take: 1,

            select: {
              url: true,
            },
          },
        },
      });

    return NextResponse.json({
      products:
        products.map(
          (product) => ({
            id: product.id,
            title: product.title,
            slug: product.slug,
            console:
              product.console,
            category:
              product.category.name,
            price: Number(
              product.price
            ),
            imageUrl:
              product.images[0]
                ?.url ?? null,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Erro na busca rápida de produtos:",
      error
    );

    return NextResponse.json(
      {
        products: [],
        message:
          "Não foi possível buscar os produtos.",
      },
      {
        status: 500,
      }
    );
  }
}
