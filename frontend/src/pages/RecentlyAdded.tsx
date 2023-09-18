import React, { useEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import { Product } from "../../typings";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";
import ListedItem from "../components/util/ListedItem";
import useResponsiveFlex from "../hooks/useResponsiveFlex";
import { breakpoints } from "./Home";
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
  const flexDirection = useResponsiveFlex(divRef, breakpoints);
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
  const { filteredProducts, setPriceFilter, setRatingFilter, setTagsFilter } =
    useFilteredProducts(recentProducts || null);
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

    setRecentProducts(filteredProducts);
  }, [products]);
  if (!products) {
    return <div>Loading products...</div>;
  }

  let maxPrice = getMaxPrice(recentProducts!);
  let scalingFactor = maxPrice ? maxPrice / 100 : 1;
  return (
    <div className="w-full h-screen bg-ca1">
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div className="flex flex-col md:flex-row h-full w-full pt-16">
        <div
          className={`w-full transition-all duration-500 ${
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
        <div className="pt-6 flex h-full items-center flex-col w-full bg-ca3">
          <h1>Recently Added</h1>
          <h4>Passed 24hrs</h4>
          <div
            ref={divRef}
            className="w-full justify-center p-4 flex-col items-center flex gap-4 bg-ca3"
          >
            {paginatedProducts?.map((product) => {
              return (
                <ListedItem
                  key={product._id}
                  images={product.imageUrls}
                  product={product}
                  flexDirection={flexDirection}
                />
              );
            })}
            <div>
              {filteredProducts && products.length > 0 && (
                <ViewProducts
                  itemsList={filteredProducts ?? []}
                  showItemsCallback={setPaginatedProducts}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecentlyAdded;
