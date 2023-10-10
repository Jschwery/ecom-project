import { useEffect, useState } from "react";
import useUser from "./useUser";
import axios from "axios";
import { Transaction } from "../../typings";
import { useEnvironment } from "../global/EnvironmentProvider";
import { useError } from "../global/ErrorProvider";

export const useOrders = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Transaction[]>();
  const isDevelopment = useEnvironment();
  const { addErrorToQueue } = useError();

  useEffect(() => {
    const getOrders = async () => {
      if (user && user._id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/transactions/seller/${user?._id}`
          );
          if (response.status === 200) {
            setOrders(response.data);
          }
        } catch (err: any) {
          if (isDevelopment) {
            console.error(err);
          } else {
            addErrorToQueue(err);
          }
        }
      }
    };
    getOrders();
  }, [user]);

  const getOrderById = async (orderID: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/transactions/order/${orderID}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
    }
  };

  const updateOrder = async (
    itemToUpdate: Transaction
  ): Promise<Transaction> => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/transactions/${itemToUpdate._id}`,
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
    } catch (error: any) {
      if (isDevelopment) {
        console.error(error);
      } else {
        addErrorToQueue(error);
      }
      throw error;
    }
  };

  return { orders, setOrders, updateOrder, getOrderById };
};
