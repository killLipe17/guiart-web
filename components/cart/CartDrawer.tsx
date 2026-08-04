"use client";

import Link from "next/link";
import {
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import { useCart } from "@/components/cart/CartProvider";

const currencyFormatter =
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

type CreatedOrderItem = {
  productId: string;
  title: string;
  slug: string;
  console: string | null;
  imageUrl: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

type CreatedOrderResponse = {
  order: {
    id: string;
    number: number;
    status: string;
    total: number;
    createdAt: string;
    items: CreatedOrderItem[];
  };
};

type OrderErrorResponse = {
  error: string;
};

export function CartDrawer() {
  const {
    items,
    totalPrice,
    isCartOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const [
    customerName,
    setCustomerName,
  ] = useState("");

  const [notes, setNotes] =
    useState("");

  const [
    validationMessage,
    setValidationMessage,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  useEffect(() => {
    if (!isCartOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        closeCart();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isCartOpen, closeCart]);

  function handleClearCart() {
    const confirmed = window.confirm(
      "Deseja remover todos os produtos do carrinho?"
    );

    if (confirmed) {
      clearCart();
      setValidationMessage("");
    }
  }

  async function handleCheckout() {
    const normalizedName =
      customerName.trim();

    if (!normalizedName) {
      setValidationMessage(
        "Digite seu nome para finalizar o pedido."
      );

      return;
    }

    if (items.length === 0) {
      setValidationMessage(
        "Adicione pelo menos um produto ao carrinho."
      );

      return;
    }

    setValidationMessage("");
    setIsSubmitting(true);

    const whatsappWindow =
      window.open(
        "about:blank",
        "_blank"
      );

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }

    try {
      const response = await fetch(
        "/api/pedidos",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            customerName:
              normalizedName,

            notes: notes.trim(),

            items: items.map(
              (item) => ({
                productId: item.id,
                quantity:
                  item.quantity,
              })
            ),
          }),
        }
      );

      const responseData:
        | CreatedOrderResponse
        | OrderErrorResponse
        | null = await response
        .json()
        .catch(() => null);

      if (
        !response.ok ||
        !responseData ||
        !("order" in responseData)
      ) {
        const errorMessage =
          responseData &&
          "error" in responseData &&
          typeof responseData.error ===
            "string"
            ? responseData.error
            : "Não foi possível registrar o pedido.";

        throw new Error(errorMessage);
      }

      const { order } = responseData;
      const siteOrigin =
        window.location.origin;

      const productLines =
        order.items.map(
          (item, index) => {
            return [
              `${index + 1}. ${item.title}`,

              item.console
                ? `Plataforma: ${item.console}`
                : null,

              `Quantidade: ${item.quantity}`,

              `Valor unitário: ${currencyFormatter.format(
                item.price
              )}`,

              `Subtotal: ${currencyFormatter.format(
                item.subtotal
              )}`,

              `Produto: ${siteOrigin}/produto/${item.slug}`,
            ]
              .filter(Boolean)
              .join("\n");
          }
        );

      const message = [
        "Olá! Gostaria de confirmar um pedido na Guiart Games.",
        "",
        `Pedido #${order.number}`,
        `Cliente: ${normalizedName}`,
        "",
        ...productLines.flatMap(
          (productLine) => [
            productLine,
            "",
          ]
        ),
        `Total: ${currencyFormatter.format(
          order.total
        )}`,
        "",
        notes.trim()
          ? `Observações: ${notes.trim()}`
          : "Observações: nenhuma.",
        "",
        "O pedido foi registrado no site e aguarda confirmação da loja.",
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/5511962222045?text=${encodeURIComponent(
          message
        )}`;

      if (
        whatsappWindow &&
        !whatsappWindow.closed
      ) {
        whatsappWindow.location.href =
          whatsappUrl;
      } else {
        window.location.href =
          whatsappUrl;
      }

      clearCart();
      setCustomerName("");
      setNotes("");
      closeCart();
    } catch (error) {
      if (
        whatsappWindow &&
        !whatsappWindow.closed
      ) {
        whatsappWindow.close();
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Não foi possível finalizar o pedido.";

      setValidationMessage(
        errorMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isCartOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Fechar carrinho"
        onClick={closeCart}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de compras"
        className="absolute right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-zinc-800 bg-zinc-950 text-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
              <ShoppingCart
                size={20}
              />
            </div>

            <div>
              <h2 className="font-black">
                Seu carrinho
              </h2>

              <p className="text-xs text-zinc-500">
                {items.length === 1
                  ? "1 produto"
                  : `${items.length} produtos`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            disabled={isSubmitting}
            aria-label="Fechar carrinho"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center px-6">
            <div className="max-w-xs text-center">
              <ShoppingCart
                size={52}
                className="mx-auto text-zinc-700"
              />

              <h3 className="mt-5 text-xl font-bold">
                Seu carrinho está vazio
              </h3>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Adicione produtos do
                catálogo para montar seu
                pedido.
              </p>

              <Link
                href="/catalogo"
                onClick={closeCart}
                className="mt-6 inline-flex rounded-xl bg-yellow-400 px-5 py-3 font-bold text-black transition hover:bg-yellow-300"
              >
                Ver catálogo
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-zinc-800 bg-black p-3"
                  >
                    <div className="flex gap-3">
                      <Link
                        href={`/produto/${item.slug}`}
                        onClick={
                          closeCart
                        }
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-900"
                      >
                        {item.imageUrl ? (
                          <img
                            src={
                              item.imageUrl
                            }
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <ShoppingCart
                            size={26}
                            className="text-zinc-700"
                          />
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/produto/${item.slug}`}
                              onClick={
                                closeCart
                              }
                              className="font-bold transition hover:text-yellow-400"
                            >
                              {item.title}
                            </Link>

                            {item.console && (
                              <p className="mt-1 text-xs text-zinc-500">
                                {
                                  item.console
                                }
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={
                              isSubmitting
                            }
                            onClick={() =>
                              removeItem(
                                item.id
                              )
                            }
                            aria-label={`Remover ${item.title}`}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>

                        <p className="mt-2 font-black text-yellow-400">
                          {currencyFormatter.format(
                            item.price
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-3">
                      <div className="flex items-center rounded-xl border border-zinc-800 bg-zinc-950">
                        <button
                          type="button"
                          disabled={
                            isSubmitting ||
                            item.quantity <=
                              1
                          }
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity -
                                1
                            )
                          }
                          aria-label="Diminuir quantidade"
                          className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700"
                        >
                          <Minus
                            size={15}
                          />
                        </button>

                        <span className="min-w-8 text-center text-sm font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            isSubmitting ||
                            item.quantity >=
                              item.stock
                          }
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity +
                                1
                            )
                          }
                          aria-label="Aumentar quantidade"
                          className="flex h-9 w-9 items-center justify-center text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:text-zinc-700"
                        >
                          <Plus
                            size={15}
                          />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-zinc-600">
                          Subtotal
                        </p>

                        <p className="font-bold">
                          {currencyFormatter.format(
                            item.price *
                              item.quantity
                          )}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={
                  handleClearCart
                }
                className="mt-5 text-sm font-medium text-zinc-500 transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Limpar carrinho
              </button>

              <div className="mt-6 space-y-4 border-t border-zinc-800 pt-6">
                <div>
                  <label
                    htmlFor="cart-customer-name"
                    className="text-sm font-semibold text-zinc-300"
                  >
                    Seu nome
                  </label>

                  <input
                    id="cart-customer-name"
                    type="text"
                    value={
                      customerName
                    }
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event
                    ) => {
                      setCustomerName(
                        event.target
                          .value
                      );

                      if (
                        validationMessage
                      ) {
                        setValidationMessage(
                          ""
                        );
                      }
                    }}
                    maxLength={80}
                    placeholder="Digite seu nome"
                    className="mt-2 h-12 w-full rounded-xl border border-zinc-800 bg-black px-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cart-notes"
                    className="text-sm font-semibold text-zinc-300"
                  >
                    Observações
                  </label>

                  <textarea
                    id="cart-notes"
                    value={notes}
                    disabled={
                      isSubmitting
                    }
                    onChange={(
                      event
                    ) =>
                      setNotes(
                        event.target
                          .value
                      )
                    }
                    maxLength={500}
                    rows={3}
                    placeholder="Ex.: retirada na loja, dúvidas ou preferências"
                    className="mt-2 w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {validationMessage && (
                  <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400">
                    {
                      validationMessage
                    }
                  </p>
                )}
              </div>
            </div>

            <footer className="border-t border-zinc-800 bg-black px-4 py-5 sm:px-6">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">
                    Total estimado
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    O preço será validado
                    antes do pedido
                  </p>
                </div>

                <p className="shrink-0 text-2xl font-black">
                  {currencyFormatter.format(
                    totalPrice
                  )}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleCheckout
                }
                disabled={
                  isSubmitting
                }
                aria-busy={
                  isSubmitting
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-bold text-white transition hover:bg-emerald-400 disabled:cursor-wait disabled:bg-emerald-800 disabled:text-emerald-200"
              >
                <MessageCircle
                  size={20}
                />

                {isSubmitting
                  ? "Registrando pedido..."
                  : "Finalizar pelo WhatsApp"}
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}