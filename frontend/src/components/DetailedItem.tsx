import React, { useEffect, useState } from "react";
import { Product } from "../../typings";
import { useToast } from "@chakra-ui/react";
import useRemove from "../hooks/useRemove";

interface DetailedItemProps {
  removeItemByIndex: (index: number) => void;
  product: Product;
  index: number;
}

function DetailedItem({
  product,
  removeItemByIndex,
  index,
}: DetailedItemProps) {
  const [toBeRemoved, setToBeRemoved] = useState(false);

  const toast = useToast();

  const handleRemoval = async () => {
    try {
      await removeItemByIndex(index);
      toast({
        title: "Success",
        description: "Item deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setToBeRemoved(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  return (
    <div className="flex flex-col bg-ca6 p-4 rounded-md md:w-[70%] lg:w-[60%] xl:w-[50%] mx-auto">
      <div>
        <h2>{product.name}</h2>
      </div>
      <h3>Price: ${product.price}</h3>
      <h3>Quantity: {product.quantity}</h3>
      <h3>
        Date Created: {product.creationDate && formatDate(product.creationDate)}
      </h3>
      <div className=" flex justify-end">
        {toBeRemoved ? (
          <div className="inline-flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={() => {
                setToBeRemoved(false);
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={handleRemoval}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6 cursor-pointer"
            onClick={() => setToBeRemoved(true)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default DetailedItem;
