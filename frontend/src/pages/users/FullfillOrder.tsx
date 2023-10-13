import React, { useEffect, useMemo, useRef, useState } from "react";
import { useOrders } from "../../hooks/useOrders";
import { Product, User } from "../../../typings";
import useUser from "../../hooks/useUser";
import { Divider, useToast } from "@chakra-ui/react";
import useProducts from "../../hooks/useProducts";
import { useFulfill } from "../../hooks/useFulfill";
import { loadingStyles, spinnerStyles } from "../Home";
interface ProductProps {
  product: Product;
  index: number;
}

function calculateSubtotal(product: Product) {
  const preTaxTotal =
    (product.specialOffer && product.salePrice
      ? product.salePrice
      : product.price) * (product.quantity || 0);
  const tax = preTaxTotal * 0.08;
  return preTaxTotal + tax;
}

function formatDateAndTime(dateString: string | Date): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const MemoizedProductComponent: React.FC<ProductProps> = React.memo(
  ({ product, index }) => {
    const quantity = product.quantity || 1;

    const preTaxTotalWithoutSavings = product.price * quantity;

    const savings = product.salePrice
      ? (product.price -
          (product.specialOffer && product.salePrice
            ? product.salePrice
            : product.price)) *
        quantity
      : 0;

    const preTaxTotal = preTaxTotalWithoutSavings - savings;
    const tax = preTaxTotal * 0.08;
    const subtotal = preTaxTotal + tax;

    return (
      <>
        <h4 className="px-2 py-1">Product {index + 1}</h4>
        <div className="flex w-full flex-col px-3 space-y-1 bg-ca1 min-w-[320px] rounded p-2 my-1">
          <div className="flex items-baseline space-x-2 order-row">
            <h4>Product:</h4>
            <h4>{product.name}</h4>
          </div>
          <div className="flex items-center space-x-2 order-row">
            <h4>Quantity:</h4>
            <h4>{product?.quantity}</h4>
          </div>
          <div className="flex items-center space-x-2 order-row">
            <h4>Total (pre-tax):</h4>
            <h5>
              ${product.price} X {product?.quantity}
            </h5>
            <h5>=</h5>
            <h5>${preTaxTotalWithoutSavings.toFixed(2)}</h5>
          </div>
          {savings > 0 && (
            <div className="flex items-center space-x-2 order-row">
              <h4>Savings:</h4>
              <h4>-${savings.toFixed(2)}</h4>
            </div>
          )}
          <div className="flex items-center space-x-2 order-row">
            <h4>Tax:</h4>
            <h4>${tax.toFixed(2)}</h4>
          </div>
          <div className="flex items-center space-x-2 order-row">
            <h4>Total:</h4>
            <h4>${subtotal.toFixed(2)}</h4>
          </div>
        </div>
      </>
    );
  }
);

function FullfillOrder() {
  const { products, order, buyer, fetchProducts } = useFulfill();
  const { updateOrder } = useOrders();
  const { updateProduct, getProductById } = useProducts();
  const { getUserById, atomicUserUpdate, user } = useUser();
  const [needsRefresh, setNeedsRefresh] = useState(false);

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

  useEffect(() => {
    if (needsRefresh) {
      setNeedsRefresh(false);
      fetchProducts();
    }
  }, [needsRefresh]);

  productsRef.current = memoizedProducts;

  const total = useMemo(() => {
    if (!memoizedProducts) {
      setNeedsRefresh(true);
      return;
    }
    return memoizedProducts.reduce(
      (acc, product) => acc + calculateSubtotal(product),
      0
    );
  }, [memoizedProducts]);

  const handleProductUpdate = async (product: Product) => {
    try {
      const foundProduct = await getProductById(product._id as string);
      if (!foundProduct) {
        return;
      }
      if (foundProduct.quantity - product.quantity <= 0) {
        throw new Error("Insufficient product quantity");
      }

      const updatedProduct = await updateProduct({
        ...product,
        quantity: foundProduct.quantity - product.quantity,
      });

      if (updatedProduct && order) {
        await updateOrder({
          ...order,
          status: "Fulfilled",
          transactionDate: new Date(),
        });
        window.location.pathname = "/your-items";
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "Insufficient product quantity") {
        toast({
          title: "Product Out of Stock",
          description: "Please restock the product.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  const handleFullFillOrder = async () => {
    const invalidProducts = [];
    for (const product of memoizedProducts) {
      const foundProduct = await getProductById(product._id as string);
      if (!foundProduct) {
        return;
      }
      if (foundProduct.quantity - product.quantity <= 0) {
        invalidProducts.push(product);
      }
    }

    if (invalidProducts.length > 0) {
      const invalidProductNames = invalidProducts.map((p) => p.name).join(", ");

      toast({
        title: "Insufficient Stock",
        description: `The following products need to be restocked: ${invalidProductNames}`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const updatePromises = memoizedProducts.map((product) =>
      handleFundsUpdate(product)
    );
    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("One or more product updates failed:", error);
    }
  };

  const handleFundsUpdate = async (product: Product) => {
    if (order && order._id && user) {
      const buyerDetails: User = await getUserById(order.buyerID);

      await handleProductUpdate(product);

      if (!buyerDetails) {
        console.error("Could not fetch the buyer details");
        return;
      }

      const buyer: User = {
        ...buyerDetails,
        cashBalance: (buyerDetails.cashBalance || 0) - total!,
      };

      const seller: User = {
        ...user,
        cashBalance: (user.cashBalance || 0) + total!,
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
          return;
        }
      }
    }
  };

  return (
    <>
      {memoizedProducts && memoizedProducts.length === 0 ? (
        <>
          <div className="w-full h-screen flex justify-center items-start p-4">
            <img
              className="mt-12"
              width={240}
              height={240}
              src="/images/logo2.svg"
              alt="Logo"
            />
          </div>
          <div style={loadingStyles}>
            <div style={spinnerStyles}></div>
          </div>
        </>
      ) : (
        <div className="w-full h-screen bg-ca2 p-6">
          <div
            className={`flex items-center rounded-md flex-col max-h-[95vh] overflow-y-auto min-w-[350px] max-w-[600px] w-2/3 mx-auto bg-ca3 ${
              order?.status === "Fulfilled"
                ? "border border-dashed border-green-600"
                : order?.status === "Canceled"
                ? "border border-dashed border-red-600"
                : ""
            }`}
          >
            <div className="flex flex-col min-w-[300px] items-start ">
              {order?.status === "Fulfilled" ? (
                <>
                  <div className="flex flex-col ml-auto ">
                    <h3 className="py-2">Fulfilled</h3>
                    <h5>
                      {order.transactionDate
                        ? formatDateAndTime(order.transactionDate)
                        : "N/A"}
                    </h5>
                  </div>
                </>
              ) : (
                ""
              )}
              <h1 className="mb-5 mx-auto pt-2">Fulfill Order</h1>
              <div className="flex flex-col space-y-1 px-2 bg-ca1 w-full">
                <div className="flex min-w-[300px] items-center space-x-4 ">
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
                    {buyer?.shippingAddresses &&
                    buyer.shippingAddresses.length > 0
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
              </div>
              <Divider className="my-2" />

              {memoizedProducts.map((product, index) => (
                <MemoizedProductComponent
                  key={product._id || `product-${index}`}
                  index={index}
                  product={product}
                />
              ))}
              <Divider className="my-2" />

              <div className="flex w-full justify-between mb-3 min-w-[300px] items-center space-x-4 px-2">
                <div className="flex items-center space-x-2">
                  <h4>Order Total:</h4>
                  <h4>${total!.toFixed(2)}</h4>
                </div>
                {order?.status === "Pending" ? (
                  <div title="Fullfill order">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6  h-6 cursor-pointer hover:scale-110 duration-200"
                      onClick={() => handleFullFillOrder()}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                ) : (
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6  h-6 cursor-pointer scale-110"
                      onClick={() => (window.location.pathname = "your-items")}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default FullfillOrder;
