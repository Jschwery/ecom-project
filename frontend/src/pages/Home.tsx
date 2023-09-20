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
import CategoryScroll from "../components/util/CategoryScroll";
import ViewProducts from "./users/ViewProducts";

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
  const [paginatedProducts, setPaginatedProduct] = useState<Product[]>([]);

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
    <div className="w-full  bg-ca2">
      {user ? (
        <SignedInNav describeCart={(visible) => setCartVisible(visible)} />
      ) : (
        <NotSignedInNav />
      )}
      <div className="pt-16 bg-ca2 pb-4 w-full">
        <div className="flex my-5 h-[250px] overflow-hidden p-4 justify-center items-center">
          <PictureCarousel
            hideSvg={cartVisible}
            imageGrow={true}
            dealPackage={dealMetaData}
          />
        </div>
        {recentProducts && recentProducts.length > 0 && (
          <div className="flex flex-col space-y-4 w-[85%] md:w-[80%] mx-auto mt-8">
            <h2>Recently Viewed</h2>
            <div className="flex space-x-2 bg-ca3 rounded-md overflow-x-auto py-3 px-2">
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
        )}
        <div className="flex flex-col space-y-4 w-[85%] md:w-[80%] mx-auto mt-8">
          <h3>Technology & Electronics</h3>
          <div className="flex bg-ca3 rounded-md overflow-x-auto py-2">
            <CategoryScroll category={"Technology"} />
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-[85%] md:w-[80%] mx-auto mt-8">
          <h3>Clothing and Fashion</h3>
          <div className="flex bg-ca3 rounded-md overflow-x-auto py-2">
            <CategoryScroll category={"ClothingFashion"} />
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-[85%] md:w-[80%] mx-auto mt-8">
          <h3>Home Living</h3>
          <div className="flex bg-ca3 rounded-md overflow-x-auto py-2">
            <CategoryScroll category={"HomeLiving"} />
          </div>
        </div>
        <div
          ref={divRef}
          className="justify-center p-4 flex-wrap rounded-md mt-20 items-center flex flex-col w-[85%] md:w-[80%] mx-auto gap-4 bg-ca3"
        >
          <h2 className="py-5">All Products</h2>
          {paginatedProducts &&
            paginatedProducts.map((p) => (
              <ListedItem
                key={p._id}
                images={p.imageUrls}
                flexDirection={flexDirection}
                product={p}
              />
            ))}
          <div>
            {products && products.length > 0 && (
              <ViewProducts
                itemsList={products ?? []}
                showItemsCallback={setPaginatedProduct}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
