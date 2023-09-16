import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import ListedItem from "../components/util/ListedItem";
import useProducts from "../hooks/useProducts";
import useResizable from "../hooks/useResizable";
import useUser from "../hooks/useUser";
import { getDivWidth } from "./AddItem";
import { Product } from "../../typings";
import { v4 as uuidv4 } from "uuid";
import PictureCarousel from "../components/DealCarousel";
import useResponsiveFlex from "../hooks/useResponsiveFlex";

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

export const dealMetaData = [
  {
    imagePath: "/images/deals/yellowTech.jpg",
    dealLink: "/category/technology/special-offer",
    dealHeader: "Shop Electronics",
    dealSubheader: "Get up to 20% off top of the line electronics",
    dealPercentage: "20",
    imageGrow: true,
  },
  {
    imagePath: "/images/deals/clothing.jpg",
    dealLink: "/category/ClothingFashion/special-offer",
    dealHeader: "Shop Clothing and Fashion",
    dealSubheader: "Get up to 35% off stylish clothing",
    dealPercentage: "35",
    imageGrow: true,
  },
  {
    imagePath: "/images/deals/whitehomedecor.jpg",
    dealLink: "/category/HomeLiving/special-offer",
    dealHeader: "Home Living Bliss",
    dealSubheader: "Get up to 15% off modern living essentials",
    dealPercentage: "15",
    imageGrow: true,
  },
];

export const breakpoints = [
  { max: 768, class: "flex-col-items" },
  { max: 900, class: "flex-row-items" },
];

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
  const flexDirection = useResponsiveFlex(divRef, breakpoints);
  const [cartVisible, setCartVisible] = useState<boolean>();

  useEffect(() => {
    async function fetchProducts() {
      if (user && user.recentlyViewed) {
        const fetchedProducts = await Promise.all(
          user.recentlyViewed.map(
            async (viewedProduct) =>
              await getProductById(viewedProduct.product).catch((e) => {
                console.error(
                  `Error fetching product with ID: ${viewedProduct.product}`,
                  e
                );
                return null;
              })
          )
        );

        const validProducts = fetchedProducts.filter(
          (product) => product !== null && product !== undefined
        );

        validProducts.sort((a, b) => {
          const aViewed = user.recentlyViewed!.find(
            (item) => item.product === a._id
          )?.timeViewed;
          const bViewed = user.recentlyViewed!.find(
            (item) => item.product === b._id
          )?.timeViewed;

          const aTimeViewed = aViewed ? new Date(aViewed) : undefined;
          const bTimeViewed = bViewed ? new Date(bViewed) : undefined;

          if (aTimeViewed && bTimeViewed) {
            return bTimeViewed.getTime() - aTimeViewed.getTime();
          } else if (aTimeViewed) {
            return 1;
          } else if (bTimeViewed) {
            return -1;
          }
          return 0;
        });

        setRecentProduct(validProducts);
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
      {user ? (
        <SignedInNav describeCart={(visible) => setCartVisible(visible)} />
      ) : (
        <NotSignedInNav />
      )}
      <div className="pt-16 bg-ca2 w-full h-screen">
        <div className="flex my-5 h-[250px] overflow-hidden !px-3 w-full justify-center items-center">
          <PictureCarousel
            hideSvg={cartVisible}
            imageGrow={true}
            dealPackage={dealMetaData}
          />
        </div>

        <div className="bg-ca3 flex-col rounded-md p-4 m-4 ">
          <h2 className="px-2">Recently Viewed</h2>
          <div className="flex space-x-2 overflow-x-auto py-3 px-2">
            {recentProducts &&
              recentProducts.map((product) => (
                <img
                  key={product._id || uuidv4()}
                  className="w-20 h-20 cursor-pointer hover:scale-110 rounded-full bg-ca1 p-1"
                  src={product?.imageUrls?.[0] || "/images/logo2.svg"}
                  alt="Product Image"
                />
              ))}
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
