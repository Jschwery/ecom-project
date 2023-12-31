import React, { useEffect, useRef, useState } from "react";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import ListedItem from "../components/util/ListedItem";
import useProducts from "../hooks/useProducts";
import useUser from "../hooks/useUser";
import { Product } from "../../typings";
import { v4 as uuidv4 } from "uuid";
import PictureCarousel from "../components/DealCarousel";
import useResponsiveFlex from "../hooks/useResponsiveFlex";
import CategoryScroll from "../components/util/CategoryScroll";
import ViewProducts from "./users/ViewProducts";
import SearchBar from "../components/SearchBar";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

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
  { max: 1800, class: "flex-row-items" },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  let query = useQuery();
  const navigate = useNavigate();
  let orderSuccess = query.get("order-success");

  const { user } = useUser();
  const toast = useToast();
  const { products, loading: productsLoading, getProductById } = useProducts();
  const [recentProducts, setRecentProduct] = useState<Product[]>();
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const [cartVisible, setCartVisible] = useState<boolean>();
  const [paginatedProducts, setPaginatedProduct] = useState<Product[]>([]);
  let initialFlexDirection = "";

  if (typeof window !== "undefined") {
    const windowWidth = window.innerWidth;

    for (let bp of breakpoints) {
      if (windowWidth <= bp.max) {
        initialFlexDirection = bp.class;
        break;
      }
    }
  }

  const flexDirection = useResponsiveFlex(
    divRef,
    breakpoints,
    initialFlexDirection
  );
  function isProduct(x: any): x is Product {
    return x && typeof x._id === "string";
  }

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
          if (!isProduct(a) || !isProduct(b)) {
            return 0;
          }
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

        setRecentProduct(validProducts as Product[]);
      }
    }

    fetchProducts();
  }, [user]);

  useEffect(() => {
    if (orderSuccess) {
      toast({
        title: "Success",
        description: "Order successfully placed!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      navigate(".", { replace: true });
    }
  }, [orderSuccess, navigate]);

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
  interface NavItem {
    label: string;
    subLabel?: string;
    children?: Array<NavItem>;
    href?: string;
  }

  return (
    <div className="w-full  bg-ca2">
      {user ? (
        <SignedInNav describeCart={(visible) => setCartVisible(visible)} />
      ) : (
        <NotSignedInNav signIn={true} />
      )}
      <div className="pt-16 bg-ca2 pb-4 w-full">
        <div className="flex pt-4 flex-col items-center h-24">
          <h4>Find Products</h4>
          <SearchBar />
        </div>
        <div className="flex my-5 h-[250px] overflow-hidden p-4 justify-center items-center">
          <PictureCarousel
            hideSvg={cartVisible}
            imageGrow={true}
            dealPackage={dealMetaData}
          />
        </div>
        {recentProducts && recentProducts.length > 0 && (
          <div className="flex flex-col space-y-4 w-[93%] md:w-[80%] mx-auto mt-8">
            <h2>Recently Viewed</h2>
            <div className="flex space-x-2 bg-ca3 rounded-md overflow-x-auto py-3 px-2">
              {recentProducts &&
                recentProducts.map((product) => (
                  <img
                    onClick={() =>
                      (window.location.pathname = `products/${product._id}`)
                    }
                    key={product._id || uuidv4()}
                    className="w-20 h-20 cursor-pointer hover:scale-110 shrink-0 rounded-full bg-ca1 p-1"
                    src={product?.imageUrls?.[0] || "/images/logo2.svg"}
                    alt="Product Image"
                  />
                ))}
            </div>
          </div>
        )}
        <div className="flex flex-col space-y-4 w-[93%] overflow-y-hidden md:w-[80%] mx-auto mt-8 h-[375px] drop-shadow-md">
          <h3>Technology & Electronics</h3>
          <div className="flex flex-col bg-ca3 rounded-md overflow-x-auto">
            <img
              className="w-full h-[65%] object-cover cursor-pointer"
              src="/images/tech2.jpg"
              alt="TechImg"
              onClick={() => (window.location.pathname = "category/Technology")}
            />
            <div className=" w-full flex items-center h-full">
              <CategoryScroll category={"Technology"} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-[93%] overflow-y-hidden md:w-[80%] mx-auto mt-8 h-[375px] drop-shadow-md">
          <h3>Clothing and Fashion</h3>
          <div className="flex flex-col bg-ca3 rounded-md overflow-x-auto">
            <img
              className="w-full h-[65%] object-cover cursor-pointer"
              src="/images/fashion2.jpg"
              alt="fashionimg"
              onClick={() =>
                (window.location.pathname = "category/clothingFashion")
              }
            />
            <div className=" w-full flex items-center h-full">
              <CategoryScroll category={"ClothingFashion"} />
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-4 w-[93%] overflow-y-hidden md:w-[80%] mx-auto mt-8 h-[375px] drop-shadow-md">
          <h3>Home Living</h3>
          <div className="flex flex-col bg-ca3 rounded-md overflow-x-auto">
            <img
              className="w-full h-[65%] object-cover cursor-pointer"
              src="/images/homedeco2.jpg"
              alt="decoImg"
              onClick={() => (window.location.pathname = "category/HomeLiving")}
            />
            <div className=" w-full flex items-center h-full">
              <CategoryScroll category={"HomeLiving"} />
            </div>
          </div>
        </div>
        <div
          ref={divRef}
          className="justify-center relative p-4 flex-wrap rounded-md mt-20 items-center flex flex-col w-[93%] md:w-[80%] mx-auto gap-4 bg-ca3"
        >
          <h2 className="py-5 absolute -top-[70px] left-0">All Products</h2>

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
