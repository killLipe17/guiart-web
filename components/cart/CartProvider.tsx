"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const CART_STORAGE_KEY = "guiart-games-cart";

export type CartProduct = {
  id: string;
  title: string;
  slug: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  console?: string | null;
  condition?: string | null;
};

export type CartItem = CartProduct & {
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  isCartOpen: boolean;
  addItem: (
    product: CartProduct,
    quantity?: number
  ) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext =
  createContext<CartContextValue | null>(null);

function normalizeStoredItems(
  storedValue: unknown
): CartItem[] {
  if (!Array.isArray(storedValue)) {
    return [];
  }

  return storedValue.flatMap((item) => {
    if (
      typeof item !== "object" ||
      item === null
    ) {
      return [];
    }

    const storedItem = item as Partial<CartItem>;

    const id =
      typeof storedItem.id === "string"
        ? storedItem.id
        : "";

    const title =
      typeof storedItem.title === "string"
        ? storedItem.title
        : "";

    const slug =
      typeof storedItem.slug === "string"
        ? storedItem.slug
        : "";

    const price = Number(storedItem.price);
    const stock = Number(storedItem.stock);
    const quantity = Number(storedItem.quantity);

    if (
      !id ||
      !title ||
      !slug ||
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isInteger(stock) ||
      stock <= 0
    ) {
      return [];
    }

    const safeQuantity = Math.min(
      Math.max(
        Number.isInteger(quantity) ? quantity : 1,
        1
      ),
      stock
    );

    return [
      {
        id,
        title,
        slug,
        price,
        stock,
        quantity: safeQuantity,
        imageUrl:
          typeof storedItem.imageUrl === "string"
            ? storedItem.imageUrl
            : null,
        console:
          typeof storedItem.console === "string"
            ? storedItem.console
            : null,
        condition:
          typeof storedItem.condition === "string"
            ? storedItem.condition
            : null,
      },
    ];
  });
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(
    []
  );

  const [isHydrated, setIsHydrated] =
    useState(false);

  const [isCartOpen, setIsCartOpen] =
    useState(false);

  useEffect(() => {
    try {
      const storedCart =
        window.localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        setItems(normalizeStoredItems(parsedCart));
      }
    } catch (error) {
      console.error(
        "Erro ao carregar o carrinho:",
        error
      );

      window.localStorage.removeItem(
        CART_STORAGE_KEY
      );
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    try {
      window.localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Erro ao salvar o carrinho:",
        error
      );
    }
  }, [items, isHydrated]);

  const addItem = useCallback(
    (
      product: CartProduct,
      quantity = 1
    ) => {
      if (product.stock <= 0) {
        return;
      }

      const safeQuantity = Math.min(
        Math.max(Math.floor(quantity), 1),
        product.stock
      );

      setItems((currentItems) => {
        const existingItem =
          currentItems.find(
            (item) => item.id === product.id
          );

        if (!existingItem) {
          return [
            ...currentItems,
            {
              ...product,
              quantity: safeQuantity,
            },
          ];
        }

        return currentItems.map((item) => {
          if (item.id !== product.id) {
            return item;
          }

          return {
            ...item,
            ...product,
            quantity: Math.min(
              item.quantity + safeQuantity,
              product.stock
            ),
          };
        });
      });

      setIsCartOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) => item.id !== productId
        )
      );
    },
    []
  );

  const updateQuantity = useCallback(
    (
      productId: string,
      quantity: number
    ) => {
      setItems((currentItems) =>
        currentItems.flatMap((item) => {
          if (item.id !== productId) {
            return [item];
          }

          if (quantity <= 0) {
            return [];
          }

          return [
            {
              ...item,
              quantity: Math.min(
                Math.max(
                  Math.floor(quantity),
                  1
                ),
                item.stock
              ),
            },
          ];
        })
      );
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const openCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleCart = useCallback(() => {
    setIsCartOpen((current) => !current);
  }, []);

  const totalItems = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [items]
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [items]
  );

  const contextValue =
    useMemo<CartContextValue>(
      () => ({
        items,
        totalItems,
        totalPrice,
        isHydrated,
        isCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }),
      [
        items,
        totalItems,
        totalPrice,
        isHydrated,
        isCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      ]
    );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart precisa ser usado dentro de CartProvider."
    );
  }

  return context;
}