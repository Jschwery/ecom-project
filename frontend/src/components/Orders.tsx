import React, { useEffect, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { Transaction } from "../../typings";
import useProducts from "../hooks/useProducts";
import EditDelete from "./util/EditDelete";
import useRemove from "../hooks/useRemove";
import { useToast } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

interface OrderProps {
  isEnlarged: boolean;
}

function Orders({ isEnlarged }: OrderProps) {
  const { orders, setOrders } = useOrders();
  const { getProductById } = useProducts();
  const { cancelOrder } = useRemove();
  const [products, setProducts] = useState<{ [key: string]: any }>({});
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    async function fetchProductDetails() {
      let updatedProducts: { [key: string]: any } = {};

      if (orders && Array.isArray(orders)) {
        for (let order of orders) {
          if (Array.isArray(order.productAndCount)) {
            for (let productInfo of order.productAndCount) {
              const product = await getProductById(productInfo.productID);
              updatedProducts[productInfo.productID] = product;
            }
          }
        }
        setProducts(updatedProducts);
      }
    }

    fetchProductDetails();
  }, [orders]);

  const makeOrder = (order: Transaction, key: string) => {
    if (order.status === "Canceled" || order.status === "canceled") {
      return null;
    }

    return (
      <div
        onClick={() => (window.location.pathname = `/orders/${order._id}`)}
        key={key}
        onMouseEnter={() => setHoveredItem(order._id || "")}
        onMouseLeave={() => setHoveredItem(null)}
        className={`flex relative cursor-pointer w-full bg-ca2 overflow-hidden rounded-md flex-col ${
          !isEnlarged ? "p-4 space-y-3" : "p-4 space-y-1"
        }`}
      >
        <div
          className={`absolute right-2 w-full flex justify-end bg-ca3 ${
            hoveredItem === order._id
              ? "edit-delete-shown"
              : "edit-delete-hidden"
          }`}
        >
          <EditDelete
            itemEditDelete={order}
            deleteCallback={async function (
              itemToDelete: Transaction
            ): Promise<void> {
              if (itemToDelete) {
                const updatedOrder: Transaction = await cancelOrder(
                  itemToDelete
                );

                if (updatedOrder) {
                  setOrders((orders) => {
                    if (orders && orders.length > 0) {
                      return orders.map((ord) => {
                        if (ord._id === updatedOrder._id) {
                          return updatedOrder;
                        }
                        return ord;
                      });
                    }
                  });

                  toast({
                    title: "Item Canceled",
                    description: "Item was successfully canceled",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                }
              }
            }}
          />
        </div>

        {order?.productAndCount?.map((productInfo) => {
          const product = products?.[productInfo.productID];
          return (
            <div
              key={productInfo.productID}
              className="flex space-x-1 justify-between w-full items-center"
            >
              <h4
                className={`min-w-0 truncate ${
                  !isEnlarged ? "text-xl" : "text-lg"
                }`}
                title={product?.name}
              >
                {product?.name || "Loading..."} (Qty: {productInfo.productCount}
                )
              </h4>
            </div>
          );
        })}

        <p className={`${!isEnlarged ? "text-lg" : "text-sm"}`}>
          Total: ${order.total.toFixed(2)}
        </p>
        <span className={`tag ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </div>
    );
  };

  return (
    <div className="flex w-full space-y-2 items-center flex-col">
      {Array.isArray(orders) &&
        orders.map((order) => makeOrder(order, order._id || uuidv4()))}
    </div>
  );
}

export default Orders;
