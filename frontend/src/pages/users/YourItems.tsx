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
import { deleteImgFromS3 } from "../../components/util/DeleteFromS3";

function YourItems() {
  const { user, products, getAllUserProducts } = useUser();
  const [open, setNotOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { setItems, removeItemByIndex, items } = useRemove(
    () => (window.location.pathname = "/your-items")
  );
  const [validItems, setValidItems] = useState<any[]>();
  const viewProductsRef = useRef<any>(null);

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

  useEffect(() => {
    if (viewProductsRef.current) {
      setTimeout(() => {
        viewProductsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 525);
    }
  }, [items]);

  return user && user.isSeller ? (
    <>
      <SignedInNav />

      <div className="pt-16 w-full h-screen overflow-y-auto bg-ca2">
        <div className="flex h-full w-full bg-ca2">
          <div
            className={`bg-slate-50 mx-3 rounded my-10 px-5shadow-md transition-all duration-500 ${
              open ? "w-2/12" : "w-4/12"
            }`}
          >
            {user && user.isSeller && (
              <div className="w-full flex flex-col p-4">
                {!open && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer ml-auto"
                    onClick={() => {
                      setNotOpen(!open);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                    />
                  </svg>
                )}
                {open && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer ml-auto"
                    onClick={() => {
                      setNotOpen(!open);
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                    />
                  </svg>
                )}
                <h2>Orders</h2>
              </div>
            )}
          </div>
          <div
            ref={divRef}
            className={`flex flex-col p-5 justify-between py-6 items-center h-full bg-ca2 transition-all duration-500 ${
              open ? "w-10/12" : "w-8/12"
            }`}
          >
            <div className="flex flex-col justify-center items-center 0 mt-2 w-full h-full">
              <div className="flex flex-col items-center pb-2">
                <h2>Your items</h2>
                <p
                  onClick={() => (window.location.pathname = "/add-item")}
                  className="cursor cursor-pointer"
                >
                  Add another?
                </p>
              </div>
              <div className="w-full space-y-4 my-3">
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
              <div className="pb-3" style={{ marginTop: "auto" }}>
                <ViewProducts
                  itemsList={products ?? []}
                  showItemsCallback={setItems}
                  ref={viewProductsRef}
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
