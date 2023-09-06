import React, { useEffect, useRef, useState } from "react";
import Pagination from "../../components/util/Pagination";
import useUser from "../../hooks/useUser";
import SignedInNav from "../../components/SignedInNavBar";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import FileUpload from "../../components/util/UploadFile";
import { Product } from "../../../typings";
import ListedItem from "../../components/util/ListedItem";
import useResizable from "../../hooks/useResizable";
import { getDivWidth } from "../AddItem";
import DetailedItem from "../../components/DetailedItem";
import useRemove from "../../hooks/useRemove";
import { ref } from "yup";
import ViewProducts from "./ViewProducts";

function YourItems() {
  const { user, products, getAllUserProducts } = useUser();
  const [open, setNotOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { setItems, removeItemByIndex, items } = useRemove(
    () => (window.location.pathname = "/your-items")
  );
  const [validItems, setValidItems] = useState<any[]>();

  useEffect(() => {
    const itemReset = async () => {
      try {
        if (user) {
          await getAllUserProducts(user?._id);
        }
      } catch (err) {
        console.error(err);
      }
      const validItems = items.filter((item) => item && item._id);

      setValidItems(validItems);
    };
    itemReset();
  }, [items]);

  return user && user.isSeller ? (
    <>
      <SignedInNav />

      <div className="pt-16 w-full h-screen">
        <Button
          onClick={() => {
            setNotOpen(!open);
          }}
        >
          Hello
        </Button>
        <div className="flex h-full w-full bg-ca2">
          <div
            className={`bg-slate-50 transition-all duration-500 ${
              open ? "w-1/12" : "w-3/12"
            }`}
          >
            {user && user.isSeller}
          </div>
          <div
            ref={divRef}
            className={`flex flex-col p-5 justify-between  items-center h-full bg-ca2 transition-all duration-500 ${
              open ? "w-11/12" : "w-9/12"
            }`}
          >
            <div className="flex flex-col justify-center items-center w-full h-full">
              <h2>Your items</h2>
              <p
                onClick={() => (window.location.pathname = "/add-item")}
                className="cursor cursor-pointer"
              >
                Add another?
              </p>
              <div className="w-full space-y-4">
                {validItems &&
                  validItems.map((product, index) => (
                    <DetailedItem
                      key={`${product._id}-${index}`}
                      product={product}
                      removeItemByIndex={removeItemByIndex}
                      index={index}
                    />
                  ))}
              </div>
              <div style={{ marginTop: "auto" }}>
                <ViewProducts
                  itemsList={products ?? []}
                  showItemsCallback={setItems}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <div className="w-screen h-screen bg-ca2">
      <div className="flex flex-col w-full items-center">
        <h1>Please enable seller account</h1>
        <h4
          onClick={() => {
            window.location.pathname = "/edit-profile";
          }}
          className="cursor-pointer text-blue-500"
        >
          Edit profile
        </h4>
      </div>
    </div>
  );
}

export default YourItems;
