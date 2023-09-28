import { useEffect, useState } from "react";
import useUser from "./useUser";
import axios from "axios";
import { Transaction } from "../../typings";

export const useOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Transaction[]>();

  useEffect(() => {
    const getOrders = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `https://34.227.14.81:8080/api/transactions/seller/${user?._id}`
          );
          if (response.status === 200) {
            setOrders(response.data);
          } else {
            console.log(`Unsuccessful orders found with id: ${user?._id}`);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    getOrders();
  }, [user]);

  const getOrderById = async (orderID: string) => {
    try {
      const response = await axios.get(
        `https://34.227.14.81:8080/api/transactions/order/${orderID}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateOrder = async (
    itemToUpdate: Transaction
  ): Promise<Transaction> => {
    try {
      const response = await axios.put(
        `https://34.227.14.81:8080/api/transactions/${itemToUpdate._id}`,
        {
          ...itemToUpdate,
          status: "Fulfilled",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to update the order");
      }
    } catch (error) {
      console.error("Failed to cancel the order");
      throw error;
    }
  };

  return { orders, setOrders, updateOrder, getOrderById };
};
