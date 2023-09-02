import { Divider, Input } from "@chakra-ui/react";
import React from "react";
import { useCart } from "../global/CartProvider";
import useUser from "../hooks/useUser";

function Checkout() {
  const { localCart, syncCartWithBackend } = useCart();
  const { user } = useUser();
  return (
    <div className="w-full h-screen bg-ca2">
      <div className="flex justify-between">
        <img className="w-48" src="/images/logo2.svg" alt="Logo" />
        <h1>{`${localCart.length}`}</h1>
      </div>
    </div>
  );
}

export default Checkout;
