import React, { useEffect, useRef, useState } from "react";
import Pagination from "../../components/util/Pagination";
import useUser from "../../hooks/useUser";
import AddProduct from "./ViewProducts";
import SignedInNav from "../../components/SignedInNavBar";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import FileUpload from "../../components/util/UploadFile";
import { Product } from "../../../typings";
import ListedItem from "../../components/util/ListedItem";
import useResizable from "../../hooks/useResizable";
import { getDivWidth } from "../AddItem";
import DetailedItem from "../../components/DetailedItem";
import ViewProducts from "./ViewProducts";
import useRemove from "../../hooks/useRemove";

function YourItems() {
  const { user, isLoading, products, setUserProducts } = useUser();
  const [open, setNotOpen] = useState(false);
  const [closeUser, setCloseUser] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { setItems, removeItemByIndex, items } = useRemove();
  const validItems = items.filter((item) => item && item._id);

  return (
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
        <div className="flex h-full w-full bg-slate-500">
          <div
            className={`bg-slate-50 transition-all duration-500 ${
              open ? "w-1/12" : "w-3/12"
            }`}
          >
            <p>Lorem ipsum...</p>
          </div>
          <div
            ref={divRef}
            className={`flex flex-col p-5 justify-between  items-center h-full bg-slate-400 transition-all duration-500 ${
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
                {validItems.map((product, index) => (
                  <DetailedItem
                    key={`${product._id}-${index}`}
                    product={product}
                    removeItemByIndex={removeItemByIndex}
                    index={index}
                  />
                ))}
              </div>
              <div style={{ marginTop: "auto" }}>
                <ViewProducts showProductsCallback={setItems} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YourItems;
