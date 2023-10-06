import React, { useEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import { Product } from "../../typings";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";
import ListedItem from "../components/util/ListedItem";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import ViewProducts from "./users/ViewProducts";
import { getMaxPrice } from "./Deals";
import ProductFilters from "../components/util/ProductFilters";
import { Option } from "../components/util/ProductFilters";

function RecentlyAdded() {
  const { products } = useProducts();
  const [recentProducts, setRecentProducts] = useState<Product[]>();
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>();
  const { user } = useUser();
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const [flexDirection, setFlexDirection] = useState<
    "flex-row-items" | "flex-col-items"
  >(window.innerWidth > 768 ? "flex-row-items" : "flex-col-items");
  const [scaledPrice, setScaledPrice] = useState<number>();
  const [minimized, setMinimized] = useState<boolean>();

  const [filtersState, setFiltersState] = useState<
    {
      filterName: string;
      value: boolean;
    }[]
  >([
    { filterName: "priceFilter", value: false },
    { filterName: "tagFilter", value: false },
    { filterName: "ratingFilter", value: false },
  ]);
  const {
    filteredProducts,
    setInternalProducts,
    setPriceFilter,
    setRatingFilter,
    setTagsFilter,
  } = useFilteredProducts(recentProducts || null);
  const areAnyFiltersActive = filtersState.some((filter) => filter.value);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setFlexDirection("flex-row-items");
      } else {
        setFlexDirection("flex-col-items");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    console.log("the filtered products are:");
    console.log(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    if (areAnyFiltersActive === false) {
      recentProducts &&
        setTimeout(() => {
          console.log("here are the recent products");
          console.log([...recentProducts]);

          setRecentProducts([...recentProducts]);
          setInternalProducts([...recentProducts]);
        }, 2000);
    }
  }, [areAnyFiltersActive, recentProducts]);

  useEffect(() => {
    if (!products) {
      return;
    }

    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const now = new Date().getTime();

    const filteredProducts = products.filter((prod) => {
      if (!prod.creationDate) {
        return false;
      }

      const productDate = new Date(prod.creationDate).getTime();
      return now - productDate < ONE_DAY_MS;
    });

    if (recentProducts && recentProducts.length === 0) {
      setRecentProducts(filteredProducts);
      return;
    }

    setRecentProducts(filteredProducts);
  }, [products, filtersState]);

  if (!products) {
    return <div>Loading products...</div>;
  }

  let maxPrice = getMaxPrice(recentProducts!);
  let scalingFactor = maxPrice ? maxPrice / 100 : 1;

  return (
    <div className="w-full h-screen bg-ca1">
      {user ? <SignedInNav /> : <NotSignedInNav signIn={true} />}
      <div className="flex flex-col md:flex-row h-full w-full pt-16">
        <div
          className={`w-full h-full transition-all duration-500 ${
            minimized ? "md:w-[0] max-h-0 h-0" : "md:w-[40%]"
          }`}
        >
          <ProductFilters
            price={scaledPrice}
            isEnabled={(filters: { filterName: string; value: boolean }[]) => {
              setFiltersState(filters);
            }}
            priceFilterCallback={
              filtersState.find((f) => f.filterName === "priceFilter")?.value
                ? (priceValue: number) => {
                    let scaledPrice = priceValue * scalingFactor;
                    setScaledPrice(Number(scaledPrice.toFixed(2)));
                    setPriceFilter(scaledPrice);
                  }
                : undefined
            }
            tagFilterCallback={
              filtersState.find((f) => f.filterName === "tagFilter")?.value
                ? (tagFilter: Option[]) => {
                    setTagsFilter(tagFilter.map((t) => t.value as string));
                  }
                : undefined
            }
            starRatingCallback={
              filtersState.find((f) => f.filterName === "ratingFilter")?.value
                ? (starRating: number) => {
                    setRatingFilter(starRating + 1);
                  }
                : undefined
            }
            isMinimized={(minimized: boolean) => setMinimized(minimized)}
          />
        </div>
        <div
          ref={divRef}
          className="h-full grow items-center p-4 flex flex-col gap-4 bg-ca3 max-h-[100vh] overflow-y-auto"
        >
          <div className="flex flex-col items-center ">
            <h1>Recently Added</h1>
            <h4>(Past 24 hours)</h4>
          </div>
          {(!areAnyFiltersActive || filteredProducts.length > 0) &&
            paginatedProducts?.map((product) => (
              <ListedItem
                key={product._id}
                images={product.imageUrls}
                product={product}
                flexDirection={flexDirection}
              />
            ))}
          {areAnyFiltersActive &&
            filteredProducts &&
            filteredProducts.length === 0 && (
              <div className="md:h-[80vh] h-[50vh] w-full items-center justify-center flex bg-ca3">
                <div className="flex items-center flex-col space-y-4">
                  <h3 className="text-ca6 text-2xl md:text-3xl">
                    No Products Found
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-28 h-28 md:w-36 md:h-36 text-ca5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
              </div>
            )}
          {(!areAnyFiltersActive ||
            (filteredProducts && filteredProducts.length > 0)) && (
            <ViewProducts
              itemsList={
                (!areAnyFiltersActive
                  ? recentProducts && recentProducts.length > 0
                    ? [...recentProducts]
                    : []
                  : filteredProducts) ?? []
              }
              showItemsCallback={setPaginatedProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentlyAdded;
