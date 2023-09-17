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
function Deals() {
  const { products } = useProducts();
  const { user } = useUser();
  const { categoryName } = useParams();
  const [categoryItems, setCategoryItems] = useState<Product[]>();
  const [flexDirection, setFlexDirection] = useState("");
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

  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const lastFlexDirection = useRef(flexDirection);

  const { filteredProducts, setPriceFilter, setRatingFilter, setTagsFilter } =
    useFilteredProducts(categoryItems || null);

  useEffect(() => {
    console.log("the filteredProducts are");
    console.log(filteredProducts);
  }, [filteredProducts]);

  useEffect(() => {
    if (!products || !categoryName) return;
    console.log("the category name is: " + categoryName);

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
  }, [products, categoryName]);

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

  //price values need to scale to the max number of all the elements
  // put the stars under the title for the element

  return (
    <div className="w-full h-screen bg-ca1">
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div className="flex flex-col md:flex-row w-full pt-16">
        <div
          className={`w-full  transition-all duration-500 ${
            minimized ? "md:w-[0] max-h-0" : "md:w-[40%] max-h-[550px]"
          }`}
        >
          <ProductFilters
            isEnabled={(filters: { filterName: string; value: boolean }[]) => {
              setFiltersState(filters);
            }}
            priceFilterCallback={
              filtersState.find((f) => f.filterName === "priceFilter")?.value
                ? (priceValue: number) => {
                    setPriceFilter(priceValue);
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
          className="grow justify-center p-4 pt-20 flex-wrap flex gap-4 bg-ca7"
        >
          {filteredProducts &&
            filteredProducts.map((p) => (
              <ListedItem
                key={p._id}
                images={p.imageUrls}
                flexDirection={flexDirection}
                product={p}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Deals;
