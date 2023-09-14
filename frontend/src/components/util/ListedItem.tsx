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
  flexDirection: string | "flex-col-items" | "flex-row-items";
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
  const { addToLocalCart, localCart } = useCart();
  const [dealPercentage, setDealPercentage] = useState<number>();
  const { products, updateProduct } = useProducts();
  const toast = useToast();

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

  return (
    <div
      className={`${
        flexDirection === "flex-row-items"
          ? `${
              customStyles.flexRow || ""
            } flex  h-52 w-full bg-ca2 shadow-sm shadow-black items-stretch`
          : "flex flex-col h-96 w-80 space-y-4 justify-between items-stretch"
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
          <div className="flex relative flex-col  space-y-1 pt-2 pl-2 pb-6">
            <h3
              title={product.name}
              className="text-ca9 w-2/3 line-clamp-2"
              style={wrapTextStyle}
            >
              {product.name
                ? product.name
                : content.name
                ? content.name
                : "Product Name"}
            </h3>
            <h2
              className={`text-ca1 mr-auto sale-item ${
                product.specialOffer && product.salePrice ? "line-through" : ""
              }`}
              style={wrapTextStyle}
              data-sale-price={
                product.salePrice ? `Sale: $${product.salePrice}` : ""
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
          <div className="w-full flex px-5 pb-2 pt-5 justify-end space-x-2">
            <NumberInput
              w="25%"
              className="text-ca9"
              minW="80px"
              defaultValue={1}
              max={30}
              clampValueOnBlur={false}
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
              onClick={async () => {
                // console.log(product);
                // console.log(product._id);
                if (product && product._id) {
                  const productFound: CartItem | undefined = localCart.find(
                    (cartProduct) => product._id === cartProduct.product
                  );
                  if (!productFound) {
                    addToLocalCart(product._id);
                    return;
                  }
                  if (
                    productFound &&
                    (productFound as CartItem)?.quantity < 200
                  ) {
                    addToLocalCart(product._id);
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
              className="bg-ca7 text-ca1 max-w-[140px] grow hover:bg-ca5 px-4 py-1 cursor-pointer rounded-full flex items-center justify-center"
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
