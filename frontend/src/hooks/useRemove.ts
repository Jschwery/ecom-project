import { useEffect, useState } from "react";

function useRemove(onDeleteCallback?: (item: any) => void, apiURL?: string) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    console.log("items");
    console.log(items);
  }, [items]);

  const removeItem = async (itemToRemove: any) => {
    try {
      await fetch(
        `${apiURL ?? "http://localhost:5000/api"}/products/${itemToRemove._id}`,
        {
          method: "DELETE",
        }
      );

      if (onDeleteCallback) {
        onDeleteCallback(itemToRemove);
      }
    } catch (error) {
      console.error("Failed to delete the item", error);
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
    removeItem,
    removeItemByIndex,
    setItems: (newItems: any[]) => setItems(newItems),
  };
}

export default useRemove;
