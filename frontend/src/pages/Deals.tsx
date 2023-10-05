import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { Product } from "../../typings";
import { getDivWidth } from "./AddItem";
import ListedItem from "../components/util/ListedItem";
import ProductFilters from "../components/util/ProductFilters";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { Option } from "../components/util/ProductFilters";
import ViewProducts from "./users/ViewProducts";

export const getMaxPrice = (products: Product[]) => {
  if (!products) {
    return;
  }
  return Math.max(
    ...products.map((product) => product.salePrice || product.price)
  );
};
export const breakpoints = [
  { max: 768, class: "flex-col-items" },
  { max: 900, class: "flex-row-items" },
];

function Deals() {
  const { products } = useProducts();
  const { user } = useUser();
  const { categoryName } = useParams();
  const [categoryItems, setCategoryItems] = useState<Product[]>();
  const [flexDirection, setFlexDirection] = useState("");
  const [minimized, setMinimized] = useState<boolean>();
  const [scaledPrice, setScaledPrice] = useState<number>();
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
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);

  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const lastFlexDirection = useRef(flexDirection);

  const { filteredProducts, setPriceFilter, setRatingFilter, setTagsFilter } =
    useFilteredProducts(categoryItems || null);
  const areAnyFiltersActive = filtersState.some((filter) => filter.value);

  let maxPrice = getMaxPrice(categoryItems!);
  let scalingFactor = maxPrice ? maxPrice / 100 : 1;

  useEffect(() => {
    if (!products || !categoryName) return;

    const categoryItems = products?.filter((product) => {
      if (categoryName === "all") {
        return product.specialOffer;
      }
      return (
        product.category.toUpperCase() === categoryName.toUpperCase() &&
        product.specialOffer
      );
    });

    setCategoryItems(categoryItems);
  }, [products, categoryName, filtersState]);

  useEffect(() => {
    console.log("the filtered products are");
    console.log(filteredProducts);

    console.log("the paginated");
    console.log(paginatedProducts);
  }, [filteredProducts, paginatedProducts]);

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

  useLayoutEffect(() => {
    const currentWidth = getDivWidth(divRef.current);

    if (currentWidth > breakpoints[breakpoints.length - 1].max) {
      if (
        lastFlexDirection.current !== breakpoints[breakpoints.length - 1].class
      ) {
        setFlexDirection(breakpoints[breakpoints.length - 1].class);
        lastFlexDirection.current = breakpoints[breakpoints.length - 1].class;
      }

      return;
    }
  }, [divRef.current]);

  return (
    <div className="w-full h-screen  bg-ca1">
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
          className="h-full grow items-center max-h-[100vh] overflow-y-auto p-4 flex flex-col gap-4 bg-ca3"
        >
          <h1>Products</h1>
          {(!areAnyFiltersActive || filteredProducts.length > 0) &&
            paginatedProducts?.map((p) => (
              <ListedItem
                key={p._id}
                images={p.imageUrls}
                flexDirection={flexDirection}
                product={p}
              />
            ))}
          {areAnyFiltersActive &&
            filteredProducts &&
            filteredProducts.length === 0 && (
              <div className="md:h-[80vh]  h-[50vh] w-full items-center flex bg-ca3">
                <div className="flex items-center flex-col w-full space-y-4">
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
          <div>
            {(!areAnyFiltersActive ||
              (filteredProducts && filteredProducts.length > 0)) && (
              <ViewProducts
                itemsList={
                  (!areAnyFiltersActive
                    ? categoryItems && categoryItems.length > 0
                      ? [...categoryItems]
                      : []
                    : filteredProducts) ?? []
                }
                showItemsCallback={setPaginatedProducts}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deals;
