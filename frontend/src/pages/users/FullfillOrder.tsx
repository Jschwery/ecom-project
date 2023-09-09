import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { Transaction } from "../../../typings";

function FullfillOrder() {
  const { orderID } = useParams();
  const { orders, getOrderById } = useOrders();

  const order = orders?.find(async (order) => {
    try {
      const orderFound: Transaction = await getOrderById(orderID || "");

      return order._id === orderFound._id;
    } catch (err) {
      console.error(err);
    }
  });

  useEffect(() => {
    console.log("the order is ");
    console.log(order);
  }, [order]);

  return (
    <div className="w-full h-screen bg-ca2 p-6">
      <div className="flex items-center rounded-md flex-col w-2/3 mx-auto bg-ca3">
        <h1>Fulfill Order</h1>
        <div className="flex">
          <h2></h2>
        </div>
      </div>
    </div>
  );
}

export default FullfillOrder;
