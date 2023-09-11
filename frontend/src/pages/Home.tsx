import React, { useEffect, useRef, useState } from "react";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import ListedItem from "../components/util/ListedItem";
import useProducts from "../hooks/useProducts";
import useResizable from "../hooks/useResizable";
import useUser from "../hooks/useUser";
import { getDivWidth } from "./AddItem";
import { Product } from "../../typings";

export const loadingStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
};

export const spinnerStyles: React.CSSProperties = {
  border: "8px solid rgba(255, 255, 255, 0.1)",
  borderTop: "8px solid white",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 1s linear infinite",
};
function App() {
  const { user, isLoading: userLoading } = useUser();
  const {
    products,
    loading: productsLoading,
    getProducts,
    getProductById,
  } = useProducts();
  const [recentProducts, setRecentProduct] = useState<Product[]>();
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const [flexDirection, setFlexDirection] = useState("");
  const lastFlexDirection = useRef(flexDirection);

  const breakpoints = [
    { max: 768, class: "flex-col-items" },
    { max: 900, class: "flex-row-items" },
  ];

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = getDivWidth(divRef.current);

      for (let bp of breakpoints) {
        if (currentWidth <= bp.max) {
          if (lastFlexDirection.current !== bp.class) {
            setFlexDirection(bp.class);
            lastFlexDirection.current = bp.class;
          }
          break;
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log("the recent products");
    console.log(recentProducts);
  }, [recentProducts]);

  useEffect(() => {
    async function fetchProducts() {
      if (user && user.recentlyViewed) {
        const fetchedProducts = await Promise.all(
          user.recentlyViewed.map(
            async (id) => await getProductById(id.recentProduct)
          )
        );
        setRecentProduct(fetchedProducts);
      }
    }

    fetchProducts();
  }, [user]);

  if (productsLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-start p-4">
          <img
            className="mt-12"
            width={240}
            height={240}
            src="/images/logo2.svg"
            alt="Logo"
          />
        </div>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
        </div>
      </>
    );
  }

  return (
    <>
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div className="pt-16 bg-ca3 w-full h-screen">
        <div className="bg-ca4 flex-col rounded-md p-4 m-4 ">
          <h2 className="py-2 px-2">Recently Viewed</h2>
          <div className="flex space-x-2 overflow-x-auto py-3 px-2">
            {/* {recentProducts &&
              recentProducts.map((product) => (
                <img
                  key={product._id}
                  className="w-20 h-20 cursor-pointer hover:scale-110 rounded-full bg-ca3 p-1"
                  src={
                    (product.imageUrls && product.imageUrls[0]) ||
                    "/images/logo2.svg"
                  }
                  alt="Product Image"
                />
              ))} */}
          </div>
        </div>
        <div
          ref={divRef}
          className="w-full justify-center p-4 flex-wrap flex gap-4 bg-ca7"
        >
          {products &&
            products.map((p) => (
              <ListedItem
                key={p._id}
                images={p.imageUrls}
                flexDirection={flexDirection}
                product={p}
              />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;
