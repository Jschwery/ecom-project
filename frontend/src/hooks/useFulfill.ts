import { useParams } from "react-router-dom";
import { useOrders } from "./useOrders";
import useProducts from "./useProducts";
import useUser from "./useUser";
import { useEffect, useState } from "react";
import { Product, Transaction, User } from "../../typings";

export const useFulfill = () => {
  const { orderID } = useParams();
  const { getOrderById } = useOrders();
  const { getProductById } = useProducts();
  const { user } = useUser();
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
      try {
        if (order?.productAndCount) {
          const productPromises = order.productAndCount.map((productInfo) =>
            getProductById(productInfo.productID)
          );
          const allProducts: Product[] = await Promise.all(productPromises);
          console.log("All Products:", allProducts);

          const fetchedProducts: Product[] = allProducts.filter((product) =>
            user?.products?.some((p) => product._id === p)
          );

          const updatedProducts = fetchedProducts.map((product) => {
            const matchingProductInfo = order?.productAndCount?.find(
              (p) => p.productID === product?._id
            );

            return {
              ...product,
              quantity: matchingProductInfo
                ? matchingProductInfo.productCount
                : 0,
            };
          });
          setProducts(updatedProducts);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, [user]);

  return {
    products,
    buyer,
    order,
    setOrder,
    orderID,
  };
};