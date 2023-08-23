import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import React from "react";
interface ListedItemProps {
  flexDirection: "flex-col-items" | "flex-row-items";
  images?: string[];
  wrapTextStyle?: React.CSSProperties;
  formikValues?: {
    productName?: string;
    productDescription?: string;
    category?: string;
    price?: number | string;
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
}: ListedItemProps) {
  const defaultContent = {
    productName: "Product Name",
    productDescription: "Product Description",
    category: "",
    price: "15.00",
    quantity: "100",
  };

  const content = { ...defaultContent, ...formikValues };

  return (
    <div
      className={`${
        flexDirection === "flex-row-items"
          ? `${
              customStyles.flexRow || ""
            } flex  h-52 w-full bg-ca6 items-stretch`
          : "flex flex-col h-96 w-80 space-y-4 justify-between items-stretch"
      } rounded-md bg-ca6 max-w-[900px] overflow-auto`}
    >
      <div
        className={
          flexDirection === "flex-row-items"
            ? "w-1/2 min-w-[205px] max-w-[400px] h-full"
            : "w-full"
        }
      >
        <img
          className={`${
            flexDirection === "flex-row-items"
              ? "h-full w-full rounded-md"
              : "w-full h-48 rounded-md"
          } object-fill p-1`}
          src={images[0] || "/images/logo2.svg"}
          alt="product logo"
        />
      </div>

      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col justify-between px-4 max-w-1/3">
          <div className="flex flex-col space-y-1 pt-2 pb-12 pl-2">
            <h3 className="text-ca1" style={wrapTextStyle}>
              {content.productName ? content.productName : "Title"}
            </h3>
            <h2 className="text-ca1" style={wrapTextStyle}>{`${
              content.price ? "$" + content.price : "$15.00"
            }`}</h2>
          </div>
        </div>

        <div className="flex-grow flex-shrink-0 flex items-end max-w-1/3">
          <div className="w-full flex px-5 pb-2 justify-end space-x-2">
            <NumberInput
              w={"25%"}
              className="text-ca1"
              minW={"80px"}
              defaultValue={1}
              max={30}
              clampValueOnBlur={false}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <span className="bg-ca5 max-w-[140px] grow hover:bg-ca4 px-4 py-1 cursor-pointer rounded-full flex items-center justify-center">
              Add To Cart
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListedItem;
