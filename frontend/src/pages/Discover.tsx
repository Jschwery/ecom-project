import { useState, useEffect, useRef } from "react";
import useProducts from "../hooks/useProducts";
import ListedItem from "../components/util/ListedItem";
import { Product } from "../../typings";
import NotSignedInNav from "../components/NotSignedIn";
import SignedInNav from "../components/SignedInNavBar";
import useUser from "../hooks/useUser";
import { getDivWidth } from "./AddItem";
import { breakpoints } from "./Home";
import { debounce } from "lodash";

function shuffleArray(array: Product[]) {
  let newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}
function Discover() {
  const { products, loading } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [productIndex, setProductIndex] = useState(10);
  const { user } = useUser();
  const [flexDirection, setFlexDirection] = useState("");
  const hasScrolled = useRef(false);
  const bottomRef = useRef(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const lastFlexDirection = useRef(flexDirection);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (products && products.length) {
      const shuffledProducts = shuffleArray(products);
      setDisplayedProducts((prevProducts) => {
        const newProducts = shuffledProducts.slice(0, productIndex);
        const combinedProducts = [...prevProducts, ...newProducts];
        return Array.from(new Set(combinedProducts.map((p) => p._id)))
          .map((id) => combinedProducts.find((p) => p._id === id))
          .filter(Boolean) as Product[];
      });
      setLoadingMore(false);
    }
  }, [products, productIndex]);

  const loadMoreProducts = debounce((products: Product[]) => {
    if (!loadingMore) {
      setLoadingMore(true);
      if (productIndex < products!.length) {
        setProductIndex((prevIndex) => prevIndex + 10);
      } else {
        setLoadingMore(false);
      }
    }
  }, 360);

  useEffect(() => {
    const handleScroll = () => {
      hasScrolled.current = true;
    };

    divRef.current?.addEventListener("scroll", handleScroll);
    return () => divRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (!loading && entries[0].isIntersecting && !loadingMore) {
        hasScrolled.current = true;
        if (!products) {
          return;
        }
        loadMoreProducts(products);
        if (bottomRef.current) {
          observer.unobserve(bottomRef.current);
        }
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [loading, loadingMore, products]);

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

  return (
    <div className="w-full h-screen items-center bg-ca1  flex flex-col">
      {user ? <SignedInNav /> : <NotSignedInNav signIn={true} />}

      <h2 className="sticky top-0 mt-24 mb-8 z-10">Discover New Products</h2>

      <div
        ref={divRef}
        className="flex flex-col w-full items-center pb-28 bg-ca1 space-y-4 overflow-y-auto py-4"
      >
        {displayedProducts.map((p, index) => (
          <ListedItem
            key={p._id + "-" + index}
            images={p.imageUrls}
            product={p}
            flexDirection={flexDirection}
          />
        ))}
        {displayedProducts && displayedProducts.length === 0 && (
          <div className="md:h-[80vh]  h-[50vh] w-full items-center flex bg-ca1">
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
        <div ref={bottomRef} style={{ height: "1px" }}></div>
      </div>
    </div>
  );
}

export default Discover;
