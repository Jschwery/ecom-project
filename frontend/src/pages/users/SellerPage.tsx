import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { User } from "../../../typings";
import SignedInNav from "../../components/SignedInNavBar";
import StarRating from "../../components/StarRating";
import ViewProducts from "./ViewProducts";
import ReviewComponent from "./ReviewComponent";

function SellerPage() {
  const { sellerID } = useParams();
  const {
    getUserById,
    updateOtherUser,
    getAllUserProducts,
    user,
    allProducts,
  } = useUser();
  const [productOwner, setProductOwner] = useState<User | null>();
  const [input, setInput] = useState("");
  const [value, setValue] = useState<number>(-1);
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const [sellerRating, setSellerRating] = useState<number>();
  const [reviews, setReviews] = useState<any>();
  const [renderedReviews, setRenderedReviews] = useState<JSX.Element[] | null>(
    null
  );
  const viewProductsRef = useRef<any>(null);

  useEffect(() => {
    if (productOwner && productOwner.reviews && !reviews) {
      setReviews(productOwner?.reviews);
    }
  }, [productOwner]);

  useEffect(() => {
    if (reviews && viewProductsRef.current) {
      setTimeout(() => {
        viewProductsRef.current.scrollIntoView({ behavior: "smooth" });
      }, 525);
    }
  }, [reviews]);

  useEffect(() => {
    const fetchReviewUsers = async () => {
      if (productOwner?.reviews && reviews) {
        const rendered = await Promise.all(
          reviews.map(async (review: any, index: any) => {
            if (review && review.reviewer) {
              const reviewUser = await getUserById(review.reviewer);

              return (
                <ReviewComponent
                  key={index}
                  review={review}
                  correspondingUser={reviewUser}
                />
              );
            }
            return null;
          })
        );

        setRenderedReviews(
          rendered.filter((review) => review !== null) as JSX.Element[]
        );
      }
    };

    fetchReviewUsers();
  }, [productOwner, reviews]);

  useEffect(() => {
    const findSeller = async () => {
      try {
        if (sellerID) {
          const owner = await getUserById(sellerID);
          setProductOwner(owner);
        }
      } catch (err) {
        console.error(err);
      }
    };
    findSeller();
  }, [sellerID]);

  useEffect(() => {
    if (productOwner?.reviews) {
      const reviews = productOwner.reviews.reduce((acum, review) => {
        return acum + (review.rating || 0);
      }, 0);

      const ratedReviewsCount = productOwner.reviews.filter(
        (review) => review.rating
      ).length;

      if (ratedReviewsCount > 0) {
        setSellerRating(reviews / ratedReviewsCount);
      }
    }
  }, [productOwner]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        if (productOwner) {
          await getAllUserProducts(productOwner._id);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getProducts();
  }, [productOwner]);

  function handleSubmitReview(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    if (productOwner) {
      const updatedReviews = [
        ...(productOwner.reviews || []),
        {
          review: input,
          reviewer: user?._id,
          rating: value != -1 ? value + 1 : 1,
        },
      ];
      setSellerRating(-1);

      updateOtherUser({
        ...productOwner,
        reviews: updatedReviews,
      });
      setInput("");
    } else {
      console.error("Product not found!");
    }
  }

  return (
    <>
      <SignedInNav />
      <div className="w-full h-screen bg-ca2 p-6 pt-20 overflow-y-auto scrollable-hidden-scrollbar">
        <div className="flex flex-col md:flex-row rounded-md shadow-md w-full bg-ca3 md:p-10">
          <div className="flex flex-col items-center bg-ca3 rounded-l-md mx-auto w-full md:space-y-2 md:w-1/2">
            <img
              className="h-24 w-24 my-2 rounded-full"
              src={productOwner?.profilePicture}
              alt={productOwner?.name}
            />
            <div className="flex flex-col items-center space-y-5">
              <h2>{productOwner?.sellerName || productOwner?.name}</h2>
              {sellerRating ? (
                <div className="flex items-center space-x-0.5">
                  <h5>Rating: </h5>
                  <h4>{sellerRating.toFixed(2)}</h4>
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
                </div>
              ) : (
                <>
                  <h4>No Seller Ratings</h4>
                  <StarRating
                    value={value || 0}
                    onChange={function (rating: number | null): void {
                      if (value === rating) {
                        setValue((prevValue) => prevValue - 1);
                        return;
                      }
                      setValue(rating || 0);
                    }}
                  />
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col grow bg-ca3 rounded-md mt-5 md:mt-0 p-5">
            <h2 className="px-4">Leave a seller review</h2>
            {sellerRating && (
              <div className="pl-4 pt-2">
                <StarRating
                  value={value || 0}
                  onChange={function (rating: number | null): void {
                    if (value === rating) {
                      setValue((prevValue) => prevValue - 1);
                      return;
                    }
                    setValue(rating || 0);
                  }}
                />
              </div>
            )}
            <div className="flex justify-between p-4 space-x-4">
              <textarea
                value={input}
                className="w-full h-28 p-2 border-ca5 bg-ca2 border rounded-md text-ca9 resize-none placeholder:text-ca9 focus:bg-ca1 "
                placeholder="Type your review here..."
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="flex px-4 items-center space-x-4">
              <button
                onClick={input !== "" ? handleSubmitReview : () => {}}
                className="self-end ml-auto min-w-[87px] grow max-w-[200px] bg-ca6 hover:bg-ca5 text-white rounded-md p-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="self-center my-16">Products from this seller</h1>

          <div className="flex flex-col w-full max-h-[500px] overflow-y-auto">
            {allProducts &&
              allProducts.map((product, index) => {
                const totalRating =
                  product.reviews?.reduce(
                    (acum, review) => acum + (review.rating || 0),
                    0
                  ) || 0;
                const numberOfRatings =
                  product.reviews?.filter((review) => review.rating).length ||
                  1;
                const averageRating = (totalRating / numberOfRatings).toFixed(
                  2
                );

                return (
                  <div
                    key={`${product._id}-${index}`}
                    onClick={() =>
                      (window.location.pathname = `/products/${product._id}`)
                    }
                    className="flex flex-col cursor-pointer p-2  px-5 w-full justify-between md:max-w-[60%] lg:max-w-[55%] xl:max-w-[45%] md:mx-auto bg-ca3 rounded-md mb-3 items-center"
                  >
                    <div className="flex w-full  items-center justify-between ">
                      <div className="flex w-full  items-center space-x-5 min-w-0">
                        <img
                          className="w-14 h-12 md:w-20"
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
                      <h3 className="ml-1 flex-shrink-0 min-w-[20%] ">
                        ${product.price}
                      </h3>
                    </div>
                    <span className="self-start font-semibold">
                      {(
                        <div className="flex items-center space-x-1">
                          <h4>
                            {Number(averageRating) !== 0
                              ? averageRating
                              : "No ratings"}
                          </h4>
                          {Number(averageRating) !== 0 ? (
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
                          ) : (
                            ""
                          )}
                        </div>
                      ) || "No ratings found"}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
        <div className="w-full flex flex-col items-center py-16 space-y-5">
          <h1>Seller Reviews</h1>
          <div className="flex flex-col w-full items-center">
            <>
              {renderedReviews}
              {productOwner && productOwner.reviews && (
                <div>
                  <ViewProducts
                    ref={viewProductsRef}
                    itemsList={productOwner.reviews}
                    showItemsCallback={(items) => {
                      setReviews(items);
                    }}
                  />
                </div>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerPage;
