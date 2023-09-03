import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import SignedInNav from "../../components/SignedInNavBar";
import { Product, User } from "../../../typings";
import useProducts from "../../hooks/useProducts";
import PictureCarousel from "../../components/DealCarousel";
import ITag from "./Tag";
import useUser from "../../hooks/useUser";
import useRemove from "../../hooks/useRemove";
import DetailedItem from "../../components/DetailedItem";
import ViewProducts from "./ViewProducts";
import { Button, Input, Toast, useToast } from "@chakra-ui/react";
import { loadingStyles, spinnerStyles } from "../Home";
import ReviewComponent from "./ReviewComponent";
import axios from "axios";
import { useCart } from "../../global/CartProvider";

function ProductPage() {
  let { productID } = useParams();
  const { getProductById, updateProduct, findProductOwner, productOwner } =
    useProducts();
  const {
    user,
    getUserById,
    isLoading,
    getAllUserProducts,
    updateUser,
    allProducts,
  } = useUser();
  const { addToLocalCart, localCart } = useCart();
  const [foundProduct, setFoundProduct] = useState<Product | null>();
  const [reviewUsers, setReviewUsers] = useState<any[]>([]);
  const [userImages, setUserImages] = useState<User[]>([]);
  const [input, setInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (productID) {
          const product: Product = await getProductById(productID);

          if (product) {
            setFoundProduct(product);
            setReviewUsers(product.reviews ?? []);
          } else {
            console.warn("Product not found or is undefined");
          }
        }
      } catch (e: any) {
        console.error(e);
      }
    };

    getProduct();
  }, [productID, getProductById]);

  useEffect(() => {
    findProductOwner(productID || "");
  }, [productID]);

  useEffect(() => {
    getAllUserProducts(productOwner?._id || "");
  }, [productOwner]);

  useEffect(() => {
    if (foundProduct?.reviews) {
      const fetchReviewUsers = async () => {
        const fetchedUsers: User[] = [];
        for (let review of foundProduct.reviews || []) {
          if (review._id) {
            const reviewUser = await getUserById(review._id);

            if (reviewUser) {
              fetchedUsers.push(reviewUser);
            }
          }
        }

        setUserImages(fetchedUsers);
      };

      fetchReviewUsers();
    }
  }, [foundProduct?.reviews, getUserById]);

  const renderedReviews = useMemo(() => {
    return reviewUsers?.map((review, index) => {
      const correspondingUser: User | undefined = userImages.find(
        (user) => user._id === review._id
      );

      return (
        <ReviewComponent
          key={index}
          review={review}
          correspondingUser={correspondingUser}
        />
      );
    });
  }, [reviewUsers, userImages]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  if (!foundProduct)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  function handleSubmitReview(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    if (foundProduct) {
      const updatedReviews = [
        ...(foundProduct.reviews || []),
        { review: input, _id: user?._id },
      ];
      updateProduct({ ...foundProduct, reviews: updatedReviews });
      setInput("");
    } else {
      console.error("Product not found!");
    }
  }

  if (isLoading) {
    return (
      <>
        <div className="w-full h-screen flex justify-center items-start p-4">
          <img
            className="mt-12"
            width={240}
            height={240}
            src="/images/logo2.svg"
            alt="Logo"
          />
        </div>
        <div style={loadingStyles}>
          <div style={spinnerStyles}></div>
        </div>
      </>
    );
  }

  return (
    <>
      <SignedInNav />

      <div className="bg-ca2 w-full h-screen min-h-screen pt-20">
        <div className="w-full grow  p-4 flex flex-col md:flex-row bg-ca2">
          <div className=" min-w-[30%] rounded-md md:w-[30%] mx-2 flex items-center flex-col bg-ca4  shadow-md shadow-black">
            <h2>Seller</h2>
            <img
              className="w-14 h-14 rounded-full"
              src={productOwner?.profilePicture || "/images/logo2.svg"}
              alt="user profile"
            />
            <div className="flex flex-col items-center w-[80%]">
              <h4>{productOwner?.sellerName || productOwner?.name}</h4>
              <h4>{productOwner?.rating || "Rating: 5⭐"}</h4>
              <h2>All Seller Items</h2>

              <div className="flex flex-col w-full ">
                {allProducts &&
                  allProducts.map((product, index) => {
                    return (
                      <div
                        key={`${product._id}-${index}`}
                        onClick={() =>
                          (window.location.pathname = `/products/${product._id}`)
                        }
                        className="flex flex-col cursor-pointer p-2 w-full justify-between bg-ca2 rounded-md my-2 items-center"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="flex w-full items-center space-x-5 min-w-0">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={
                                (product.imageUrls && product.imageUrls[0]) ||
                                "/images/logo2.svg"
                              }
                              alt={product.name}
                            />
                            <h3 className="leading-snug mt-0.5 grow overflow-hidden truncate min-w-0">
                              {product.name}
                            </h3>
                          </div>
                          <h3 className="ml-1 flex-shrink-0">
                            ${product.price}
                          </h3>
                        </div>
                        <span className="self-start">
                          {product.rating || "Rating: 5⭐"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex flex-col md:w-[70%] px-2 my-5 md:my-0 space-y-3">
            <div className=" w-full bg-ca3 p-4 md:p-6 rounded-lg shadow-black mb-2 pl-3 shadow-sm flex flex-col md:flex-row ">
              <div className="order-1 mb-4 md:mb-0 md:mr-4 w-full md:w-[40%]">
                <PictureCarousel images={foundProduct.imageUrls ?? []} />
              </div>

              <div className="order-2 md:order-1 w-full md:w-[60%]">
                <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                  <h1 className="text-gray-800 font-bold text-2xl md:text-3xl">
                    {foundProduct.name}
                  </h1>
                  <span className="text-ca8 text-lg md:text-xl">
                    ${foundProduct.price}
                  </span>
                </div>
                <p className="text-gray-500 mt-2 md:mt-4">
                  {foundProduct.description}
                </p>
                <div className="flex flex-col w-f">
                  <span className="text-ca8 font-semibold">
                    Category: {foundProduct.category}
                  </span>

                  <span className="text-ca6 font-semibold">
                    Quantity available: {foundProduct.quantity}
                  </span>
                  <div className="flex justify-between">
                    {foundProduct.tags && (
                      <div className="flex flex-wrap mt-4">
                        {foundProduct.tags.map((tag, idx) => (
                          <ITag key={idx} tagName={tag} />
                        ))}
                      </div>
                    )}
                    <button
                      onClick={async () => {
                        if (foundProduct && foundProduct._id) {
                          const productFound = localCart.find(
                            (product) => product.product === foundProduct._id
                          );
                          if (productFound && productFound?.quantity < 200) {
                            addToLocalCart(foundProduct._id);
                          } else {
                            toast({
                              title: "Item Cap Reached",
                              description:
                                "You have reached the maximum allowed quantity for this item.",
                              status: "warning",
                              duration: 5000,
                              isClosable: true,
                              position: "top",
                            });
                          }
                        } else {
                          console.error("foundProduct._id is undefined");
                        }
                      }}
                      className="self-end bg-ca6 hover:bg-ca5 text-white py-2 px-4 rounded-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center shadow-md shadow-black rounded-md bg-ca2 grow">
              <h1>Product Reviews</h1>
              {renderedReviews}

              <div className="w-full flex flex-col items-center mt-auto p-4 space-y-4">
                {foundProduct.reviews && (
                  <ViewProducts
                    itemsList={foundProduct.reviews}
                    showItemsCallback={(items) => setReviewUsers(items)}
                  />
                )}
                <div className="w-[80%] bg-ca4 mt-auto rounded-md space-y-2 justify-center p-5 flex flex-col">
                  <h3>Write your review:</h3>
                  <div className="flex justify-between space-x-4">
                    <textarea
                      value={input}
                      className="w-[75%] h-28 bg-ca5 rounded-md text-white resize-none placeholder:text-ca1 focus:bg-ca6 "
                      placeholder="Type your review here..."
                      onChange={handleInputChange}
                    ></textarea>

                    <button
                      onClick={input !== "" ? handleSubmitReview : () => {}}
                      className="self-end min-w-[87px] bg-ca6 hover:bg-ca5 text-white rounded-md p-2"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
