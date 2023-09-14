import { Key, useEffect, useState } from "react";
import useUser from "../../hooks/useUser";
import useProducts from "../../hooks/useProducts";
import useSWR from "swr";
import { Product } from "../../../typings";
import Counter from "../../components/Counter";
import { Button } from "@chakra-ui/react";
import { count } from "console";
import { CartItem, useCart } from "../../global/CartProvider";

interface CartProps {
  isCartVisible: boolean;
  setShowCart: (visible: boolean) => void;
  cartItems: CartItem[];
}

export default function Cart({ isCartVisible, setShowCart }: CartProps) {
  const { localCart, addToLocalCart, getProductQuantity, setLocalCart } =
    useCart();
  const { getProductById } = useProducts();

  const [products, setProducts] = useState<Product[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {}
  );
  const [countPrice, setCountPrice] = useState<number>();

  useEffect(() => {
    products.forEach((product) => {
      const quantity = getProductQuantity(product);

      setProductCounts((prev) => ({
        ...prev,
        [product._id || ""]: Number(
          ((product.salePrice || product.price) * quantity).toFixed(2)
        ),
      }));
    });
  }, [products, localCart]);

  useEffect(() => {
    let totalPrice = 0;
    products.forEach((product) => {
      if (product && product._id) {
        const count = productCounts[product._id] || 1;

        totalPrice += count;
        setCountPrice(totalPrice);
      }
    });
  }, [productCounts, products, localCart]);

  useEffect(() => {
    Promise.all(localCart.map((item: any) => getProductById(item.product)))
      .then((fetchedProducts) => {
        const validProducts = fetchedProducts.filter(Boolean);
        setProducts(validProducts);
      })
      .catch((error) => {
        setErrors((prevErrors) => [...prevErrors, error]);
      });
  }, [localCart, getProductById]);

  if (errors.length > 0) return <div>Error fetching products</div>;

  function handleCartCheckout(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    products.forEach((product) => {
      if (product) {
        setProductCounts((prev) => ({
          ...prev,
          [product._id || ""]: product.specialOffer
            ? Number(product.salePrice) * product.price
            : product.quantity * product.price,
        }));
      }
    });

    window.location.pathname = "/checkout";
  }
  const handleCounterChange = (count: number, product: Product) => {
    const newProductCount = count * product.price;

    setProductCounts((prev) => ({
      ...prev,
      [product._id || ""]: newProductCount,
    }));

    if (product && product._id) {
      addToLocalCart(product._id, Math.floor(newProductCount / product.price));
    }
  };

  function removeItemFromCart(productID: string): void {
    const currentCart: CartItem[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existingItemIndex = currentCart.findIndex(
      (item: CartItem) => item.product === productID
    );
    console.log("existingItemIndex: " + existingItemIndex);

    if (existingItemIndex !== -1) {
      currentCart.splice(existingItemIndex, 1);
      localStorage.setItem("cart", JSON.stringify(currentCart));
      const updatedCart = [...currentCart];
      setLocalCart(updatedCart);
    }
  }

  return (
    <>
      <div
        className={`cart-overlay  ${isCartVisible ? "block" : "hidden"}`}
        onClick={() => setShowCart(false)}
      ></div>

      <div className={`cart-slide-in  ${isCartVisible ? "visible" : ""}`}>
        <div className="flex flex-col p-2 md:p-4 space-y-2">
          <h1>Cart</h1>
          <div className="flex flex-col w-full  overflow-y-auto space-y-2">
            {products.map((product: Product, idx: Key | null | undefined) => {
              if (product) {
                return (
                  <div
                    key={idx}
                    className="w-full flex flex-col bg-ca4 rounded-md"
                  >
                    <div className="w-full flex flex-col justify-between md:flex-row  truncate line-clamp-2 px-0.5 bg-ca4 p-2 space-y-2 md:space-x-2 rounded-md">
                      <img
                        className="self-center md:mr-6 w-[60%] h-16 md:w-[30%] min-w-[30%]"
                        src={
                          product.imageUrls && product.imageUrls[0]
                            ? product.imageUrls[0]
                            : "/images/logo2.svg"
                        }
                        alt={product.name}
                      />
                      <div
                        title={product.name}
                        className="md:hidden w-full flex justify-center"
                      >
                        <h4 className=" md:hidden truncate">{product.name}</h4>
                      </div>
                      <div className="md:hidden flex flex-col  items-center space-y-2">
                        <div className="relative mx-auto mb-6 ">
                          <h5
                            className={`flex-shrink-0  text-ca9 mr-auto sale-item ${
                              product.specialOffer && product.salePrice
                                ? "line-through"
                                : ""
                            }`}
                            data-sale-price={
                              product.salePrice
                                ? `Sale: $${product.salePrice}`
                                : ""
                            }
                          >
                            {product.price ? "$" + product.price : "$15.00"}
                          </h5>
                        </div>
                        <Counter
                          initialCount={getProductQuantity(product)}
                          onCountChange={(count: number) => {
                            handleCounterChange(count, product);
                          }}
                        />
                      </div>

                      <div className="flex-col w-full flex-wrap md:flex-row space-y-2 md:space-x-2">
                        <div className="w-[62%]">
                          <h3
                            title={product.name}
                            className="leading-snug mt-0.5 hidden md:block grow overflow-hidden truncate min-w-0"
                          >
                            {product.name}
                          </h3>
                        </div>
                        <div className="md:flex space-x-5 py-3  hidden items-center">
                          {product.salePrice && product.specialOffer ? (
                            <div className="relative">
                              <h5
                                className={`text-ca9  sale-item ${
                                  product.specialOffer && product.salePrice
                                    ? "line-through"
                                    : ""
                                }`}
                                data-sale-price={
                                  product.salePrice
                                    ? `Sale: $${product.salePrice}`
                                    : ""
                                }
                              >
                                {product.price ? "$" + product.price : "$15.00"}
                              </h5>
                            </div>
                          ) : (
                            <h3 className="hidden md:block">
                              ${product.price}
                            </h3>
                          )}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6 min-w-[1rem] hidden md:block"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>

                          <div className="hidden md:block">
                            <Counter
                              initialCount={getProductQuantity(product)}
                              onCountChange={(count: number) => {
                                handleCounterChange(count, product);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col space-y-1  items-center md:w-[50px] md:!mr-5 md:!self-center md:px-0 justify-between md:!space-y-3">
                        <div className="flex flex-col md:hidden">
                          <h4>Total:</h4>
                          <h4 className="text-ca9 font-semibold">
                            ${productCounts[product._id || ""]}
                          </h4>
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 hover:scale-105 md:order-1 order-2 mx-1 md:hidden"
                          onClick={() => removeItemFromCart(product._id || "")}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="hidden  md:flex w-full justify-between items-end">
                      <div className="flex-col px-2 pb-2">
                        <h4>Total:</h4>
                        <div className="flex space-x-3 items-center">
                          <h4 className="text-ca9 font-semibold">
                            ${productCounts[product._id || ""]}
                          </h4>
                          {product.specialOffer && product.salePrice && (
                            <h5 className="text-red-500">
                              Saved: $
                              {(
                                product.price * getProductQuantity(product) -
                                productCounts[product._id || ""]
                              ).toFixed(2)}
                            </h5>
                          )}
                        </div>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-8 h-8 hover:scale-105 mx-3 mb-2"
                        onClick={() => removeItemFromCart(product._id || "")}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </div>
                  </div>
                );
              }
              return <div key={idx}>Loading...</div>;
            })}
          </div>
        </div>
        <div className="w-full flex justify-center mb-5 h-11">
          {localCart && localCart.length > 0 ? (
            <>
              <div className="flex flex-col w-full items-center mt-4 space-y-2 justify-center">
                <Button
                  onClick={handleCartCheckout}
                  className="w-1/2 py-2 !text-ca1 !bg-ca8 hover:!bg-ca7"
                >
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <h2>Cart is Empty</h2>
          )}
        </div>
      </div>
    </>
  );
}
