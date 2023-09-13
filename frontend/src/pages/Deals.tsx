import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";
import { useParams } from "react-router-dom";
import { Product } from "../../typings";
import { getDivWidth } from "./AddItem";
import ListedItem from "../components/util/ListedItem";

function Deals() {
  const { products } = useProducts();
  const { user } = useUser();
  const { categoryName } = useParams();
  const [categoryItems, setCategoryItems] = useState<Product[]>();
  const [flexDirection, setFlexDirection] = useState("");
  const divRef: React.MutableRefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const lastFlexDirection = useRef(flexDirection);

  useEffect(() => {
    if (!products || !categoryName) return;

    const categoryItems = products?.filter((product) => {
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

  useEffect(() => {
    console.log("cat items");
    console.log(categoryItems);
  }, [categoryItems]);

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
    <div className="w-full h-screen bg-ca1">
      {user ? <SignedInNav /> : <NotSignedInNav />}
      <div
        ref={divRef}
        className="w-full justify-center p-4 pt-20 flex-wrap flex gap-4 bg-ca7"
      >
        {categoryItems &&
          categoryItems.map((p) => (
            <ListedItem
              key={p._id}
              images={p.imageUrls}
              flexDirection={flexDirection}
              product={p}
            />
          ))}
      </div>
    </div>
  );
}

export default Deals;
