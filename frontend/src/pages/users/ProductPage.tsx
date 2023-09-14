import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import SignedInNav from "../../components/SignedInNavBar";
import { Product, User } from "../../../typings";
import useProducts from "../../hooks/useProducts";
import PictureCarousel from "../../components/DealCarousel";
import ITag from "../../components/util/Tag";
import useUser from "../../hooks/useUser";
import useRemove from "../../hooks/useRemove";
import DetailedItem from "../../components/DetailedItem";
import ViewProducts from "./ViewProducts";
import { Button, Input, Toast, useToast } from "@chakra-ui/react";
import { loadingStyles, spinnerStyles } from "../Home";
import ReviewComponent from "./ReviewComponent";
import axios from "axios";
import { useCart } from "../../global/CartProvider";
import StarRating from "../../components/StarRating";
import useProductData from "../../hooks/useProductData";

function ProductPage() {
  let { productID } = useParams();
  const { updateProduct } = useProducts();
  const { user, updateOtherUser } = useUser();
  const { addToLocalCart, localCart } = useCart();
  const {
    foundProduct,
    reviewUsers,
    userImages,
    sellerRating,
    setReviewUsers,
    isLoading,
    allProducts,
    productOwner,
  } = useProductData(productID || "");
  const [productRating, setProductRating] = useState<number>(-1);
  const [input, setInput] = useState("");
  const toast = useToast();
  const pageRef = useRef<any>(null);

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

  useEffect(() => {
    const updateRecentView = async () => {
      try {
        if (user && productID) {
          const alreadyViewed = user.recentlyViewed?.some(
            (viewed) => viewed.product === productID
          );
          console.log("the user recently viewed");
          console.log(user.recentlyViewed);

          if (!alreadyViewed) {
            const newView = {
              product: productID,
              timeViewed: new Date(),
            };

            const updatedUser: User = {
              ...user,
              recentlyViewed: [...(user.recentlyViewed || []), newView],
            };

            await updateOtherUser(updatedUser);
          } else {
            const index = user.recentlyViewed?.findIndex(
              (rev) => rev.product === productID
            );
            if (
              typeof index === "number" &&
              index !== -1 &&
              user.recentlyViewed
            ) {
              const updatedItem = {
                ...user.recentlyViewed[index],
                timeViewed: new Date(),
              };

              const updatedRecentViews = [...user.recentlyViewed];
              updatedRecentViews[index] = updatedItem;

              const updatedUserWithTime: User = {
                ...user,
                recentlyViewed: updatedRecentViews,
              };

              await updateOtherUser(updatedUserWithTime);
            }
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    updateRecentView();
  }, [user, productID]);

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
        {
          review: input,
          _id: user?._id,
          rating: productRating != -1 ? productRating + 1 : 1,
        },
      ];
      updateProduct({
        ...foundProduct,
        reviews: updatedReviews,
      });
      setInput("");
      setProductRating(-1);
      window.location.pathname = `/products/${foundProduct._id}`;
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
        <div className="w-full grow p-4 flex flex-col md:flex-row bg-ca2">
          <div className="w-[80%] mx-auto min-w-[30%] rounded-md md:w-[30%] md:mx-2 flex items-center flex-col bg-ca4  shadow-md shadow-black">
            <h2 className="pt-2">Seller</h2>
            <img
              onClick={() =>
                (window.location.pathname = `/seller/${productOwner?._id}`)
              }
              className="w-14 h-14 rounded-full cursor-pointer"
              src={productOwner?.profilePicture || "/images/logo2.svg"}
              alt="user profile"
            />
            <div className="flex flex-col items-center w-[80%]">
              <h4>{productOwner?.sellerName || productOwner?.name}</h4>
              <div className="flex items-center space-x-0.5">
                <h4>{sellerRating || "No seller ratings"}</h4>
                {sellerRating && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="yellow"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="none"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                    />
                  </svg>
                )}
              </div>
              <h2 className="py-2">All Seller Items</h2>

              <div className="flex flex-col w-full max-h-[400px] overflow-y-auto scrollable-darker-scrollbar">
                {allProducts &&
                  allProducts.map((product, index) => {
                    const reviewTotal =
                      product?.reviews?.reduce((sum, review) => {
                        return sum + (review.rating || 0);
                      }, 0) || 0;

                    const ratedReviewsCount =
                      product?.reviews?.filter((review) => review.rating)
                        .length || 0;
                    const averageRating = (
                      reviewTotal / ratedReviewsCount || 1
                    ).toFixed(2);

                    return (
                      <div
                        key={`${product._id}-${index}`}
                        onClick={() =>
                          (window.location.pathname = `/products/${product._id}`)
                        }
                        className="flex flex-col cursor-pointer p-2 w-full justify-between  bg-ca2 rounded-md mb-3 items-center"
                      >
                        <div className="flex w-full  space-x-3 items-center  min-w-0">
                          <img
                            className="h-10 w-10 rounded-full min-w-[2.5rem]"
                            src={
                              (product.imageUrls && product.imageUrls[0]) ||
                              "/images/logo2.svg"
                            }
                            alt={product.name}
                          />
                          <div className="flex justify-between min-w-0  items-center w-full">
                            <h4
                              className="leading-snug mt-0.5 grow overflow-hidden truncate min-w-0"
                              title={product.name}
                            >
                              {product.name}
                            </h4>

                            <h5
                              className={`ml-1 flex-shrink-0  text-ca9 relative all-seller-item ${
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
                        </div>
                        <span className="self-start">
                          {(
                            <div className="flex items-center pt-1">
                              <h4>
                                {Number(averageRating) !== 1
                                  ? averageRating
                                  : "No ratings"}
                              </h4>
                              {Number(averageRating) !== 1 && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="yellow"
                                  viewBox="0 0 24 24"
                                  strokeWidth="1.5"
                                  stroke="none"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                  />
                                </svg>
                              )}
                            </div>
                          ) || "No ratings"}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full md:w-[70%] px-2 my-5 md:my-0 space-y-3">
            <div className=" w-[80%]  md:w-full mx-auto md:mx-0  bg-ca3 p-4 md:p-6 rounded-lg shadow-black mb-2 pl-3 shadow-sm flex flex-col md:flex-row ">
              <div className="order-1 min-h-[250px] p-2 md:min-h-0 overflow-hidden flex items-center grow mb-4 md:mb-0  px-4 w-full md:w-[40%] min-w-[300px]">
                <PictureCarousel
                  images={
                    foundProduct.imageUrls!.length > 0
                      ? foundProduct.imageUrls
                      : "/images/logo2.svg"
                  }
                />
              </div>
              <div className="px-3 md:px-0 order-2 md:order-1 w-[95%] md:w-[60%] min-w-0 truncate overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between min-w-0  items-center w-full">
                  <h2
                    className="leading-snug mt-0.5 grow overflow-hidden truncate min-w-0"
                    title={foundProduct.name}
                  >
                    {foundProduct.name}
                  </h2>

                  <h2
                    className={`ml-1 flex-shrink-0  text-ca9 relative sale-item ${
                      foundProduct.specialOffer && foundProduct.salePrice
                        ? "line-through"
                        : ""
                    }`}
                    data-sale-price={
                      foundProduct.salePrice
                        ? `Sale: $${foundProduct.salePrice}`
                        : ""
                    }
                  >
                    {foundProduct.price ? "$" + foundProduct.price : "$15.00"}
                  </h2>
                </div>
                <div className="flex items-center space-x-1">
                  <h5>
                    {foundProduct.reviews &&
                    foundProduct.reviews.length > 0 &&
                    foundProduct.reviews.some((review) => review.rating)
                      ? (
                          foundProduct.reviews.reduce(
                            (acum, current) =>
                              current.rating ? acum + current.rating : acum,
                            0
                          ) /
                          foundProduct.reviews.filter((review) => review.rating)
                            .length
                        ).toFixed(2)
                      : "No reviews yet"}
                  </h5>
                  {foundProduct.reviews &&
                    foundProduct.reviews.some((review) => review.rating) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="yellow"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="none"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    )}
                </div>

                <p className="text-gray-500 mt-2 md:mt-4">
                  {foundProduct.description}
                </p>
                <div className="flex flex-col truncate min-w-0 overflow-hidden">
                  <span className="text-ca8 font-semibold">
                    Category: {foundProduct.category}
                  </span>

                  <span className="text-ca6 font-semibold">
                    Quantity available: {foundProduct.quantity}
                  </span>
                  <div className="flex justify-between flex-wrap">
                    {foundProduct.tags && (
                      <div className="flex items-center space-x-1 flex-wrap mt-4">
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
                          if (!productFound) {
                            addToLocalCart(foundProduct._id, 1);
                            return;
                          }

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
                      className="self-end line-clamp-1 !min-w-[113px] bg-ca6 hover:bg-ca5 text-white py-2
                       px-4 rounded-full whitespace-nowrap overflow-hidden text-overflow-ellipsis ml-auto"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-[80%]  md:w-full mx-auto md:mx-0 flex flex-col items-center shadow-md shadow-black rounded-md bg-ca2 grow">
              <h1>Product Reviews</h1>
              {renderedReviews.length > 0 ? (
                renderedReviews
              ) : (
                <div className="flex flex-col items-center justify-center  my-auto">
                  <h2>No reviews found</h2>
                </div>
              )}

              <div className="w-full flex flex-col items-center mt-auto p-4 space-y-4">
                {foundProduct.reviews && (
                  <ViewProducts
                    itemsList={foundProduct.reviews}
                    showItemsCallback={(items) => setReviewUsers(items)}
                  />
                )}
                <div className="w-[80%] bg-ca4 mt-auto rounded-md space-y-2 justify-center p-5 flex flex-col">
                  <div className="flex items-center space-x-2 pl-4">
                    <h3>Leave a review?</h3>
                    <StarRating
                      value={productRating || 0}
                      onChange={function (value: number | null): void {
                        if (productRating === value) {
                          setProductRating((rating) => rating - 1);
                          return;
                        }
                        setProductRating(value || 0);
                      }}
                    />
                  </div>
                  <div className="flex flex-col space-y-2 justify-between px-4 pt-2 space-x-4">
                    <textarea
                      value={input}
                      className="w-full h-28 p-2 bg-ca2 rounded-md text-black border border-ca6 resize-none placeholder:text-ca9 focus:bg-ca1 "
                      placeholder="Type your review here..."
                      onChange={handleInputChange}
                    ></textarea>

                    <button
                      onClick={input !== "" ? handleSubmitReview : () => {}}
                      className="self-end min-w-[87px] !mt-4 bg-ca6 hover:bg-ca5 text-white rounded-md p-2"
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
