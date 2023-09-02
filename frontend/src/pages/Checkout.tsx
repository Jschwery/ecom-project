import { Divider, Input } from "@chakra-ui/react";
import React from "react";
import { useCart } from "../global/CartProvider";
import useUser from "../hooks/useUser";

function Checkout() {
  const { localCart, syncCartWithBackend } = useCart();
  const { user } = useUser();

  const totalItems = localCart.reduce((accum, currItem) => {
    return accum + currItem.quantity;
  }, 0);

  return (
    <div className="w-full h-screen bg-ca2">
      <div className="flex flex-col items-center md:flex-row justify-between  p-6">
        <img className="w-48" src="/images/logo2.svg" alt="Logo" />
        <h1>{`Checkout (${totalItems} items)`}</h1>
        <div className=" hidden md:block"></div>
      </div>
      <div className="flex w-full bg-ca4">
        <div className="flex w-full flex-col md:flex-row p-6 md:space-x-10 bg-ca4">
          <h3>Shipping Address</h3>
          <Divider orientation="vertical" />
          {user?.shippingAddresses && user.shippingAddresses.length > 0 ? (
            <>
              <ul className="list-none">
                {user.shippingAddresses[0].name && (
                  <li>{user.shippingAddresses[0].name}</li>
                )}
                {user.shippingAddresses[0].state && (
                  <li>
                    {user.shippingAddresses[0].state},
                    {" " + user.shippingAddresses[0].zip}
                  </li>
                )}
              </ul>
            </>
          ) : (
            <p
              onClick={() => (window.location.pathname = "edit-profile")}
              className="text-ca7"
            >
              Add address
            </p>
          )}
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default Checkout;
