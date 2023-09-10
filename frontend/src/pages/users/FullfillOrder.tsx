import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../../hooks/useOrders";
import { Product, Transaction, User } from "../../../typings";
import useUser from "../../hooks/useUser";
import { Divider, useToast } from "@chakra-ui/react";
import useProducts from "../../hooks/useProducts";
import { useFulfill } from "../../hooks/useFulfill";

function calculateSubtotal(product: Product) {
  const preTaxTotal = product.price * (product.quantity || 0);
  const tax = preTaxTotal * 0.08;
  return preTaxTotal + tax;
}

interface ProductProps {
  product: Product;
}

const MemoizedProductComponent: React.FC<ProductProps> = React.memo(
  ({ product }) => {
    const preTaxTotal = product.price * (product.quantity || 0);
    const tax = preTaxTotal * 0.08;
    const subtotal = preTaxTotal + tax;

    return (
      <div className="flex w-full flex-col bg-ca1 min-w-[320px] rounded p-2 my-1">
        <div className="flex items-center space-x-1">
          <h4>Product:</h4>
          <h4>{product.name}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <h4>Quantity:</h4>
          <h4>{product?.quantity}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <h4>Total (pre-tax):</h4>
          <h5>
            {product.price} X {product?.quantity}
          </h5>
          <h5>=</h5>
          <h5>${preTaxTotal.toFixed(2)}</h5>
        </div>
        <div className="flex items-center space-x-4">
          <h4>Tax:</h4>
          <h4>${tax.toFixed(2)}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <h4>SubTotal:</h4>
          <h4>${subtotal.toFixed(2)}</h4>
        </div>
      </div>
    );
  }
);

function FullfillOrder() {
  const { products, order, buyer } = useFulfill();
  const { updateOrder } = useOrders();
  const { updateProduct, getProductById } = useProducts();
  const { getUserById, atomicUserUpdate, user } = useUser();
  const toast = useToast();

  const productsRef = useRef(products);
  const memoizedProducts = useMemo(() => {
    return products.map((product) => {
      const existingProduct = productsRef.current.find(
        (p) => p._id === product._id
      );
      return existingProduct || product;
    });
  }, [products]);
  productsRef.current = memoizedProducts;

  const total = useMemo(() => {
    return memoizedProducts.reduce(
      (acc, product) => acc + calculateSubtotal(product),
      0
    );
  }, [memoizedProducts]);

  const handleProductUpdate = async (product: Product) => {
    console.log(product);
    try {
      const foundProduct = await getProductById(product._id as string);
      console.log("the found product: ");
      console.log(foundProduct);

      const updatedProduct = await updateProduct({
        ...product,
        quantity: foundProduct.quantity - product.quantity,
      });

      if (updatedProduct && order) {
        await updateOrder({ ...order, status: "Fulfilled" });
        window.location.pathname = "/your-items";
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFundsUpdate = async () => {
    if (order && order._id && user) {
      const buyerDetails: User = await getUserById(order._id);

      if (!buyerDetails) {
        console.error("Could not fetch the buyer details");
        return;
      }
      const buyer: User = {
        ...buyerDetails,
        cashBalance: (buyerDetails.cashBalance || 0) - total,
      };

      const seller: User = {
        ...user,
        cashBalance: (user.cashBalance || 0) + total,
      };

      try {
        await atomicUserUpdate(buyer, seller);
      } catch (err: any) {
        console.error(err);
        if (err.message.includes("Insufficient funds")) {
          toast({
            title: "Transaction Failed",
            description: "Buyer did not have sufficent funds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      }
    }
  };

  const handleFullFillOrder = async () => {
    const updatePromises: any = [];

    memoizedProducts.forEach((product) => {
      const updatePromise = handleProductUpdate(product);
      updatePromises.push(updatePromise);
    });

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("One or more product updates failed:", error);
    }
  };

  return (
    <div className="w-full h-screen bg-ca2 p-6">
      <div className="flex items-center rounded-md flex-col min-w-[350px] max-w-[600px] w-2/3 mx-auto bg-ca3">
        <div className="flex flex-col min-w-[300px] items-start ">
          <h1 className="mb-5">Fulfill Order</h1>
          <div className="flex min-w-[300px] items-center space-x-4">
            <h4>Order #</h4>
            <h5>{Number(order?.orderNumber) || 0}</h5>
          </div>
          <div className="flex min-w-[300px] items-center space-x-4">
            <h4>Buyer:</h4>
            <h5>{buyer?.name}</h5>
          </div>
          <div className="flex items-center space-x-4">
            <h4>Address:</h4>
            <h5>
              {buyer?.shippingAddresses && buyer.shippingAddresses.length > 0
                ? `${
                    (buyer.shippingAddresses[0] &&
                      buyer.shippingAddresses[0].name) ||
                    ""
                  }, ${
                    (buyer.shippingAddresses[0] &&
                      buyer.shippingAddresses[0].state) ||
                    ""
                  }, ${
                    (buyer.shippingAddresses[0] &&
                      buyer.shippingAddresses[0].zip) ||
                    ""
                  }`
                : "No Address Found"}
            </h5>
          </div>
          <Divider className="my-2" />

          {memoizedProducts.map((product) => (
            <MemoizedProductComponent key={product._id} product={product} />
          ))}
          <Divider className="my-2" />

          <div className="flex justify-between mb-3 min-w-[300px] items-center space-x-4">
            <div className="flex items-center space-x-2">
              <h4>Total</h4>
              <h4>${total.toFixed(2)}</h4>
            </div>
            <div title="Create Shipping Label">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer hover:scale-110 duration-200"
                onClick={() => handleFullFillOrder()}
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FullfillOrder;
