import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useTheme,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

import { Product } from "../../../typings";
import { CartItem, useCart } from "../../global/CartProvider";
import useProductData from "../../hooks/useProductData";
import { dealMetaData } from "../../pages/Home";
import useProducts from "../../hooks/useProducts";
interface ListedItemProps {
  flexDirection?: string | "flex-col-items" | "flex-row-items";
  product?: Product;
  images?: string[];
  salePercentage?: number;
  showScrollbar?: boolean;
  wrapTextStyle?: React.CSSProperties;
  formikValues?: {
    quantity?: number | string;
  };
  customStyles?: {
    flexRow?: string;
  };
}

function ListedItem({
  flexDirection,
  images = ["/images/logo.svg"],
  wrapTextStyle = {},
  formikValues = {},
  customStyles = {},
  showScrollbar,
  product = {
    accountId: "",
    _id: "",
    name: "",
    description: "",
    category: "",
    price: 0,
    quantity: 0,
  },
}: ListedItemProps) {
  const defaultContent = {
    name: "Product Name",
    description: "Product Description",
    category: "",
    price: "15.00",
    quantity: "100",
  };

  const content = { ...defaultContent, ...formikValues };
  const { colors } = useTheme();
  const { addToLocalCart, localCart, setLocalCart } = useCart();
  const [numberInputValue, setNumberInputValue] = useState(1);
  const { products, updateProduct } = useProducts();
  const toast = useToast();

  useEffect(() => {
    console.log("the number");
    console.log(numberInputValue);
  }, [numberInputValue]);

  useEffect(() => {
    const percentage = dealMetaData.find((deal) =>
      deal.dealLink.toLowerCase().includes(product.category.toLowerCase())
    )?.dealPercentage;

    if (product.specialOffer && !product.salePrice) {
      const updateProductWithSale = async () => {
        if (percentage) {
          try {
            const salePrice = parseFloat(
              (
                product.price -
                product.price * (Number(percentage) / 100)
              ).toFixed(2)
            );
            await updateProduct({
              ...product,
              salePrice: salePrice,
            });
          } catch (err) {
            console.error(err);
            toast({
              title: "Error updating product.",
              description: "Unable to apply sale percentage.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };
      updateProductWithSale();
    }
  }, [dealMetaData, product]);

  const getAverageRating = (reviews: any) => {
    const totalRating = reviews.reduce(
      (accum: number, review: any) => accum + (review.rating || 0),
      0
    );
    const reviewCount = reviews.filter((review: any) => review.rating).length;
    return reviewCount ? (totalRating / reviewCount).toFixed(2) : "0.00";
  };

  const productAverageRating = getAverageRating(product.reviews || []);

  return (
    <div
      className={`${
        flexDirection === "flex-row-items"
          ? `${
              customStyles.flexRow || ""
            } flex  h-52 w-full bg-ca2 shadow-sm shadow-black items-stretch`
          : "flex flex-col h-[26rem] w-80 space-y-4 justify-between items-stretch"
      } rounded-md bg-ca2 max-w-[900px]  ${
        showScrollbar ? "overflow-y-auto" : ""
      }`}
    >
      <div
        className={
          flexDirection === "flex-row-items"
            ? "w-1/2 min-w-[205px] max-w-[400px] h-full"
            : "w-full"
        }
      >
        <img
          onClick={() =>
            (window.location.pathname = `/products/${product._id}`)
          }
          className={`${
            flexDirection === "flex-row-items"
              ? "h-full w-full rounded-md"
              : "w-full h-48 rounded-md"
          } object-fill p-1 cursor-pointer`}
          src={images[0] || "/images/logo2.svg"}
          alt="product logo"
        />
      </div>

      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col justify-between px-4 max-w-1/3">
          <div className="flex items-start w-full justify-between pt-3 pl-1">
            <div className="flex flex-col min-w-[45%]">
              <h3
                title={product.name}
                className="text-ca9 pr-1 line-clamp-2"
                style={wrapTextStyle}
              >
                {product.name
                  ? product.name
                  : content.name
                  ? content.name
                  : "Product Name"}
              </h3>
              <div className="flex items-center">
                <p>{productAverageRating}</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="yellow"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="none"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </div>
            </div>
            <h2
              className={`text-ca1 px-1 pr-2 !whitespace-nowrap !top-0 
              sale-item-other
               ${
                 product.specialOffer && product.salePrice ? "line-through" : ""
               }`}
              style={wrapTextStyle}
              data-sale-price={
                product.salePrice && product.specialOffer
                  ? `Sale: $${product.salePrice}`
                  : ""
              }
            >
              {product.price
                ? "$" + product.price
                : content.price
                ? "$" + content.price
                : "$15.00"}
            </h2>
          </div>
        </div>

        <div className="flex-grow flex-shrink-0 flex items-end max-w-1/3">
          <div className="w-full flex px-5 pb-3 pt-6 justify-end mt-4  space-x-2">
            <NumberInput
              w="25%"
              className="text-ca9"
              minW="80px"
              value={numberInputValue}
              max={200}
              clampValueOnBlur={false}
              onChange={(valueAsString, valueAsNumber) => {
                if (valueAsNumber > 200) {
                  setNumberInputValue(200);
                  toast({
                    title: "Item Cap Reached",
                    description:
                      "You have reached the maximum allowed quantity for this item.",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                } else if (valueAsNumber < 1 || isNaN(valueAsNumber)) {
                  setNumberInputValue(1);
                  toast({
                    title: "Minimum Quantity",
                    description: "Minimum allowed quantity for this item is 1.",
                    status: "info",
                    duration: 5000,
                    isClosable: true,
                    position: "top",
                  });
                } else {
                  setNumberInputValue(valueAsNumber);
                }
              }}
              sx={{
                borderColor: "black",
                _hover: {
                  borderColor: colors.ca5,
                  outline: colors.ca5,
                },
                _focus: {
                  borderColor: colors.ca5,
                },
              }}
            >
              <NumberInputField
                sx={{
                  _hover: {
                    borderColor: colors.ca6,
                  },
                }}
              />
              <NumberInputStepper>
                <NumberIncrementStepper
                  sx={{
                    borderInlineStartColor: colors.ca5,
                    borderColor: colors.ca5,
                  }}
                />
                <NumberDecrementStepper
                  sx={{
                    borderInlineStartColor: colors.ca5,
                    borderColor: colors.ca5,
                  }}
                />
              </NumberInputStepper>
            </NumberInput>

            <span
              className="bg-ca6 hover:bg-ca5 flex items-center text-white p-2 rounded-md text-center cursor-pointer"
              onClick={async () => {
                if (product && product._id) {
                  const productFound: CartItem | undefined = localCart.find(
                    (cartProduct) => product._id === cartProduct.product
                  );

                  if (!productFound) {
                    addToLocalCart(product._id, numberInputValue);
                    return;
                  }

                  const newQuantity =
                    (productFound as CartItem)?.quantity + numberInputValue;

                  if (newQuantity <= 200) {
                    addToLocalCart(product._id, newQuantity);
                  } else {
                    toast({
                      title: "Item Cap Reached",
                      description:
                        "You have reached the maximum allowed quantity for this item.",
                      status: "warning",
                      duration: 5000,
                      isClosable: true,
                      position: "top",
                    });
                  }
                }
              }}
            >
              Add To Cart
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListedItem;
