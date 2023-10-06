import React, { createContext, useContext, useState, ReactNode } from "react";
import { getLocalCart } from "../components/util/CartUtil";
import { Product } from "../../typings";
import useUser from "../hooks/useUser";
import useProducts from "../hooks/useProducts";

export type CartItem = {
  product: string | Product;
  quantity: number;
  dateAdded: Date;
};

type CartContextType = {
  localCart: CartItem[];
  setLocalCart: (cart: CartItem[]) => void;
  addToLocalCart: (productId: string | Product, quantity?: number) => void;
  getProductQuantity: (product: Product) => number;
  getCartTotalCost: () => Promise<number>;
  orderSavings?: number;
  setOrderSavings?: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const defaultContextValue: CartContextType = {
  localCart: [],
  setLocalCart: () => {},
  addToLocalCart: () => {},
  getProductQuantity: () => 1,
  getCartTotalCost: async () => 0,
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [localCart, setLocalCart] = useState<CartItem[]>(() => getLocalCart());
  const { getProductById } = useProducts();
  const { user, updateUser } = useUser();
  const [orderSavings, setOrderSavings] = useState<number>();
  const addToLocalCart = (
    productID: string | Product,
    quantity?: number,
    price?: number
  ) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (item: CartItem) => item.product === productID
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      const updatedItem = {
        ...localCart[existingItemIndex],
        quantity: quantity || localCart[existingItemIndex].quantity + 1,
        price: price,
      };

      updatedCart = [...localCart];
      updatedCart[existingItemIndex] = updatedItem;
    } else {
      const newCartItem = {
        product: productID,
        quantity: quantity || 1,
        dateAdded: new Date(),
      };
      updatedCart = [...localCart, newCartItem];
    }

    setLocalCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getProductQuantity = (product: Product) => {
    const cartItem = localCart.find((item) => item.product === product._id);

    return cartItem ? cartItem.quantity : 1;
  };

  const getCartTotalCost = async () => {
    if (localCart && localCart.length > 0) {
      try {
        const localCartItems: Product[] = await Promise.all(
          localCart.map((item) => getProductById(item.product as string))
        );

        const totalcost = localCartItems.reduce((acc, productDetail) => {
          if (productDetail.specialOffer) {
            const quantity = getProductQuantity(productDetail);
            const fullPrice = productDetail.price * quantity;
            const salePrice =
              (productDetail.specialOffer && productDetail.salePrice
                ? productDetail.salePrice
                : productDetail.price) * quantity;
            const savings = fullPrice - salePrice;

            setOrderSavings((prevSavings) => (prevSavings || 0) + savings);
          }

          const cartItem = localCart.find(
            (item) => item.product === productDetail._id
          );
          if (cartItem) {
            return (
              acc +
              cartItem.quantity *
                Number(
                  (productDetail.specialOffer && productDetail.salePrice
                    ? productDetail.salePrice
                    : productDetail.price
                  ).toFixed(2)
                )
            );
          }
          return acc;
        }, 0);

        return totalcost;
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    return 0;
  };

  return (
    <CartContext.Provider
      value={{
        localCart,
        setLocalCart,
        addToLocalCart,
        getProductQuantity,
        getCartTotalCost,
        orderSavings,
        setOrderSavings,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
