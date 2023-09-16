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

function RecentlyAdded() {
  const { products } = useProducts();
  const [recentProducts, setRecentProducts] = useState<Product[]>();
  const { user } = useUser();
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const flexDirection = useResponsiveFlex(divRef, breakpoints);
  const { filteredProducts, setRatingFilter } = useFilteredProducts(products);

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

  return (
    <div className="w-full h-full">
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div className="pt-20 flex items-center flex-col w-full bg-ca3">
        <h1>Recently Added</h1>
        <div>
          <label>
            Rating:
            <input
              type="number"
              onChange={(e) => setRatingFilter(Number(e.target.value))}
            />
          </label>
        </div>
        <div
          ref={divRef}
          className="w-full justify-center p-4 flex-wrap flex gap-4 bg-ca3"
        >
          {recentProducts?.map((product) => {
            return (
              <ListedItem
                key={product._id}
                images={product.imageUrls}
                product={product}
                flexDirection={flexDirection}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RecentlyAdded;
