import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { getLocalCart } from "../components/util/CartUtil";
import { Product } from "../../typings";
import useUser from "../hooks/useUser";

type CartItem = {
  product: string;
  quantity: number;
  dateAdded: Date;
};

type CartContextType = {
  localCart: CartItem[];
  setLocalCart: (cart: CartItem[]) => void;
  addToLocalCart: (productId: string, quantity?: number) => void;
  getProductQuantity: (product: Product) => number;
  syncCartWithBackend: () => void;
};

const defaultContextValue: CartContextType = {
  localCart: [],
  setLocalCart: () => {},
  addToLocalCart: () => {},
  getProductQuantity: () => 1,
  syncCartWithBackend: () => {},
};

const CartContext = createContext<CartContextType>(defaultContextValue);

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [localCart, setLocalCart] = useState<CartItem[]>(() => getLocalCart());
  const { user, updateUser } = useUser();

  const addToLocalCart = (productID: string, quantity?: number) => {
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingItemIndex = currentCart.findIndex(
      (item: CartItem) => item.product === productID
    );

    let updatedCart;

    if (existingItemIndex !== -1) {
      const updatedItem = {
        ...localCart[existingItemIndex],
        quantity: quantity || localCart[existingItemIndex].quantity + 1,
      };

      updatedCart = [...localCart];
      updatedCart[existingItemIndex] = updatedItem;
    } else {
      const newCartItem = {
        product: productID,
        quantity: 1,
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

  const syncCartWithBackend = useCallback(() => {
    if (user) {
      const mergedCart = [...(user.cart || []), ...localCart];
      updateUser({ ...user, cart: mergedCart });
    }
  }, [localCart, user]);

  return (
    <CartContext.Provider
      value={{
        localCart,
        setLocalCart,
        addToLocalCart,
        getProductQuantity,
        syncCartWithBackend,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
