import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Transaction } from "../../typings";
import axios from "axios";

function useRemove(onDeleteCallback?: (item: any) => void, apiURL?: string) {
  const [items, setItems] = useState<any[]>([]);
  const toast = useToast();

  const removeItem = async (itemToRemove: any) => {
    try {
      const response = await fetch(
        `${apiURL ?? "http://localhost:5000/api"}/products/${itemToRemove._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (response.status === 200) {
        toast({
          title: "Item Cap Reached",
          description: "Item was successfully removed",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
      if (onDeleteCallback) {
        onDeleteCallback(itemToRemove);
      }
    } catch (error) {
      console.error("Failed to delete the item", error);
    }
  };

  const cancelOrder = async (
    itemToCancel: Transaction
  ): Promise<Transaction> => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/transactions/${itemToCancel._id}`,
        {
          ...itemToCancel,
          status: "Canceled",
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data);

        return response.data;
      } else {
        throw new Error("Failed to update the order");
      }
    } catch (error) {
      console.error("Failed to cancel the order");
      throw error;
    }
  };

  const removeItemByIndex = async (index: number) => {
    if (index < 0 || index >= items.length) return;

    const itemToRemove = items[index];
    if (!itemToRemove) {
      console.warn("Item at the provided index is null or undefined.");
      return;
    }

    try {
      await fetch(
        `${apiURL ?? "http://localhost:5000/api"}/products/${itemToRemove._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      setItems((prevItems) => prevItems.filter((_, indx) => index !== indx));

      if (onDeleteCallback) {
        onDeleteCallback(itemToRemove);
      }
    } catch (error) {
      console.error("Failed to delete the item", error);
    }
  };

  return {
    items,
    cancelOrder,
    removeItem,
    removeItemByIndex,
    setItems: (newItems: any[]) => setItems(newItems),
  };
}

export default useRemove;
