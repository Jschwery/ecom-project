import { useEffect, useRef, useState } from "react";
import useUser from "../../hooks/useUser";
import SignedInNav from "../../components/SignedInNavBar";
import { Transaction } from "../../../typings";
import DetailedItem from "../../components/DetailedItem";
import useRemove from "../../hooks/useRemove";
import ViewProducts from "./ViewProducts";
import Orders from "../../components/Orders";
import FilterComponent from "../../components/util/FilterUtil";

function YourItems() {
  const { user, products, getAllUserProducts } = useUser();
  const [open, setNotOpen] = useState(false);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { setItems, removeItemByIndex, items } = useRemove(
    () => (window.location.pathname = "/your-items")
  );
  const [validItems, setValidItems] = useState<any[]>();
  const viewProductsRef = useRef<any>(null);
  const [returnedOrders, setReturnedOrders] = useState<Transaction[] | null>();
  const [filteredData, setFilteredData] = useState<any>();

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
  }, [items, user]);

  useEffect(() => {
    if (viewProductsRef.current) {
      if (window.innerWidth >= 768) {
        setTimeout(() => {
          viewProductsRef.current.scrollIntoView({ behavior: "smooth" });
        }, 525);
      }
    }
  }, [items]);

  useEffect(() => {
    setFilteredData(returnedOrders);
  }, [returnedOrders]);

  return user && user.isSeller ? (
    <>
      <SignedInNav />

      <div className="pt-16 w-full h-screen  bg-ca2">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row h-full w-full p-5 bg-ca2">
          <div
            className={`bg-ca3 md:mx-3 w-full overflow-y-auto rounded min-w-[150px] px-5 shadow-md shadow-black transition-all duration-500 ${
              open ? "md:w-3/12" : "md:w-5/12"
            }`}
          >
            {user && user.isSeller && (
              <div className="w-full flex flex-col py-4 ">
                {!open && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 cursor-pointer ml-auto hidden md:block"
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
                    className="w-6 h-6 cursor-pointer ml-auto hidden md:block"
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
                <div className="flex flex-col space-y-4 items-center">
                  <h2>Orders</h2>
                  <div className="flex items-center">
                    {returnedOrders && returnedOrders.length > 0 && (
                      <FilterComponent
                        data={returnedOrders || []}
                        onFilter={setFilteredData}
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <Orders
                      isEnlarged={open}
                      filteredOrders={filteredData}
                      getOrders={(orders: Transaction[]) =>
                        setReturnedOrders(orders)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            ref={divRef}
            className={`flex flex-col w-full justify-between items-center shadow-md shadow-black overflow-y-auto rounded-md bg-ca1 transition-all duration-500 ${
              open ? "md:w-9/12" : "md:w-7/12"
            }`}
          >
            <h1>Your items</h1>
            <h4
              onClick={() => (window.location.pathname = "/add-item")}
              className="cursor cursor-pointer hover:scale-105 add-product"
            >
              Add Product
            </h4>
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
              {products && products.length > 0 && (
                <div className="w-full px-2  bg-ca4 rounded-md">
                  <ViewProducts
                    itemsList={products ?? []}
                    showItemsCallback={setItems}
                    ref={viewProductsRef}
                  />
                </div>
              )}
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
