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
            `http://localhost:5000/api/transactions/seller/${user?._id}`
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

  return { orders };
};
