import React, { useEffect, useRef, useState } from "react";
import useUser from "../hooks/useUser";
import useProducts from "../hooks/useProducts";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import { useParams } from "react-router-dom";
import { Product } from "../../typings";
import { useFilteredProducts } from "../hooks/useFilteredProducts";
import { getMaxPrice } from "./Deals";
import ProductFilters from "../components/util/ProductFilters";
import ViewProducts from "./users/ViewProducts";
import ListedItem from "../components/util/ListedItem";
import { Option } from "../components/util/ProductFilters";

function ProductCategory() {
  const { user } = useUser();
  const { categoryName } = useParams();
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const [scaledPrice, setScaledPrice] = useState<number>();
  const [minimized, setMinimized] = useState<boolean>();
  const [flexDirection, setFlexDirection] = useState<
    "flex-row-items" | "flex-col-items"
  >(window.innerWidth > 768 ? "flex-row-items" : "flex-col-items");
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>();
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
    useFilteredProducts(categoryProducts || null);
  const { getProductsByCategory } = useProducts();

  const formattedCategoryName = categoryName!
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

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
    if (!categoryName) {
      return;
    }
    const category = async () => {
      console.log("hello");

      try {
        const categories: Product[] = await getProductsByCategory(categoryName);
        setCategoryProducts(categories);
      } catch (err) {
        console.error(err);
      }
    };
    category();
  }, []);

  if (!categoryProducts) {
    return <div>Loading products...</div>;
  }

  let maxPrice = getMaxPrice(categoryProducts!);
  let scalingFactor = maxPrice ? maxPrice / 100 : 1;

  return (
    <div className="w-full h-screen">
      {user ? <SignedInNav /> : <NotSignedInNav signIn={true} />}

      <div className="flex flex-col md:flex-row w-full pt-16">
        <div
          className={`w-full transition-all bg-ca1 duration-500 ${
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

        <div className="pt-6 flex min-h-[93.3vh] items-center flex-col w-full bg-ca3">
          <h1>{formattedCategoryName}</h1>
          <h4>Past 24hrs</h4>

          <div
            ref={divRef}
            className="w-full justify-center p-4 flex-col items-center flex gap-4 bg-ca3"
          >
            {paginatedProducts?.map((product) => (
              <ListedItem
                key={product._id}
                images={product.imageUrls}
                product={product}
                flexDirection={flexDirection}
              />
            ))}

            <div>
              {filteredProducts && filteredProducts.length > 0 ? (
                <ViewProducts
                  itemsList={[...filteredProducts] ?? []}
                  showItemsCallback={setPaginatedProducts}
                />
              ) : (
                paginatedProducts &&
                paginatedProducts.length === 0 && (
                  <div className="md:h-[80vh] h-[50vh] w-full items-center flex bg-ca3">
                    <NoProductsFound />
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const NoProductsFound = () => (
  <div className="flex items-center flex-col space-y-4">
    <h3 className="text-ca6 text-2xl md:text-3xl">No Products Found</h3>
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
);

export default ProductCategory;
