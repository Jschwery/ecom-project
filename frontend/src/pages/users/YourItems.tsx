import React, { useRef, useState } from "react";
import Pagination from "../../components/util/Pagination";
import useUser from "../../hooks/useUser";
import AddProduct from "./ViewProducts";
import SignedInNav from "../../components/SignedInNavBar";
import axios from "axios";
import { Button } from "@chakra-ui/react";
import FileUpload from "../../components/util/UploadFile";
import { Product } from "../../../typings";

function YourItems() {
  const { user, isLoading } = useUser();
  const [open, setNotOpen] = useState(false);
  const [closeUser, setCloseUser] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  return (
    <>
      <SignedInNav />

      <div className="pt-16 w-full h-screen bg-teal-900">
        <Button
          onClick={() => {
            setNotOpen(!open);
          }}
        >
          Hello
        </Button>
        {open && <div>SUP BRO</div>}
        <div className="flex h-full w-full bg-slate-500">
          <div
            className={`bg-slate-50 transition-all duration-500 ${
              open ? "w-1/12" : "w-3/12"
            }`}
          >
            <p>Lorem ipsum...</p>
          </div>
          <div
            className={`flex flex-col p-5 justify-between items-center h-full bg-slate-400 transition-all duration-500 ${
              open ? "w-11/12" : "w-9/12"
            }`}
          >
            <div className="flex flex-col justify-center items-center w-full">
              <h2>Your items</h2>
              {/* <ul>
                {products?.map((product) => {
                  return <UserProduct product={product} />;
                })}
              </ul> */}
              <p
                onClick={() => (window.location.pathname = "/add-item")}
                className="cursor cursor-pointer"
              >
                Add another?
              </p>
            </div>

            <div className="mb-4">
              <AddProduct
                showProductsCallback={(products: Product[]) => {
                  setProducts([...products]);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default YourItems;
