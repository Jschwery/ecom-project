import { Key, useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import useProducts from "../../hooks/useProducts";
import useSWR from "swr";
import { Product } from "../../../typings";

interface CartProps {
  isCartVisible: boolean;
  setShowCart: (visible: boolean) => void;
}

export default function Cart({ isCartVisible, setShowCart }: CartProps) {
  const { localCart } = useUser();
  const { getProductById } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  useEffect(() => {
    Promise.all(localCart.map((item: any) => getProductById(item.product)))
      .then((fetchedProducts) => {
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        setErrors((prevErrors) => [...prevErrors, error]);
      });
  }, [localCart, getProductById]);

  useEffect(() => {
    console.log("products");

    console.log(products);
  }, [products]);

  if (errors.length > 0) return <div>Error fetching products</div>;
  return (
    <>
      <div
        className={`cart-overlay ${isCartVisible ? "block" : "hidden"}`}
        onClick={() => setShowCart(false)}
      ></div>
      <div className={`cart-slide-in ${isCartVisible ? "visible" : ""}`}>
        <div className="flex flex-col w-full p-2 md:p-4 space-y-2 ">
          <h1>Cart</h1>
          {products.map((product: Product, idx: Key | null | undefined) => {
            if (product) {
              return (
                <>
                  <div
                    className="w-full flex bg-red-400 p-2 space-x-2 rounded-md"
                    key={idx}
                  >
                    <div className="flex grow space-x-4 truncate">
                      <img
                        className="w-[60%] h-16 md:w-[30%]"
                        src={
                          product.imageUrls && product.imageUrls[0]
                            ? product.imageUrls[0]
                            : "/images/logo2.svg"
                        }
                        alt={product.name}
                      />
                      <div className="truncate flex flex-col">
                        <h3 className="hidden md:block truncate ">
                          {product.name}
                        </h3>
                        <div className="flex justify-between">
                          <h3>${product.price}</h3>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col px-2 items-center space-y-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                      <h3>${product.price}</h3>
                    </div>
                  </div>
                </>
              );
            }
            return <div key={idx}>Loading...</div>;
          })}
        </div>
      </div>
    </>
  );
}
