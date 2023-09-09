import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { Product, Transaction, User } from "../../../typings";
import useUser from "../../hooks/useUser";
import { Divider } from "@chakra-ui/react";
import useProducts from "../../hooks/useProducts";

function FullfillOrder() {
  const { orderID } = useParams();
  const { getOrderById } = useOrders();
  const { getProductById } = useProducts();
  const { getUserById } = useUser();
  const [order, setOrder] = useState<Transaction>();
  const [buyer, setBuyer] = useState<User>();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchOrderAndUser = async () => {
      try {
        if (orderID) {
          const fetchedOrder: Transaction = await getOrderById(orderID);
          setOrder(fetchedOrder);

          if (fetchedOrder?.buyerID) {
            const fetchedUser: User = await getUserById(fetchedOrder.buyerID);
            setBuyer(fetchedUser);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrderAndUser();
  }, [orderID]);

  useEffect(() => {
    const fetchProducts = async () => {
      console.log("the order");
      console.log(order);

      try {
        if (order?.productAndCount) {
          const fetchedProducts: Product[] = [];

          for (const productInfo of order.productAndCount) {
            const product: Product = await getProductById(
              productInfo.productID
            );
            fetchedProducts.push(product);
          }

          setProducts(fetchedProducts);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [order]);
  return (
    <div className="w-full h-screen bg-ca2 p-6">
      <div className="flex items-center rounded-md flex-col w-2/3 mx-auto bg-ca3">
        <div className="flex flex-col items-start ">
          <h1 className="mb-5">Fulfill Order</h1>
          <div className="flex items-center space-x-4">
            <h3>Order #</h3>
            <h4>{Number(order?.orderNumber) || 0}</h4>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center space-x-4">
            <h3>Quantity</h3>
            <h4>{order?.quantity}</h4>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center space-x-4">
            <h3>Total</h3>
            <h4>{order?.total}</h4>
          </div>
          <Divider className="my-2" />

          {products.map((product, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center space-x-4">
                <h3>PPU:</h3>
              </div>
              <div className="flex items-center space-x-4">
                <h3>Product:</h3>
                <h4>{product.name}</h4>
              </div>
              <Divider className="my-2" />
            </React.Fragment>
          ))}

          <div className="flex items-center space-x-4">
            <h3>Buyer:</h3>
            <h4>{buyer?.name}</h4>
          </div>
          <Divider className="my-2" />
          <div className="flex items-center space-x-4">
            <h3>Address:</h3>
            <h4>
              {buyer?.shippingAddresses
                ? `${buyer.shippingAddresses[0].name}, ${buyer.shippingAddresses[0].state}, ${buyer.shippingAddresses[0].zip}`
                : ""}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FullfillOrder;
