import React, { useEffect } from "react";
import { useOrders } from "../hooks/useOrders";

function Orders() {
  const { orders } = useOrders();

  useEffect(() => {
    console.log("the orders");
    console.log(orders);
  }, [orders]);

  return (
    <div className="flex flex-col">
      <h3>Ello</h3>
    </div>
  );
}

export default Orders;
