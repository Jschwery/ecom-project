import React, { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useUser from "../../hooks/useUser";
import { User } from "../../../typings";
import SignedInNav from "../../components/SignedInNavBar";
import StarRating from "../../components/StarRating";

function SellerPage() {
  const { sellerID } = useParams();
  const { getUserById, updateUser, user } = useUser();
  const [productOwner, setProductOwner] = useState<User | null>();
  const [input, setInput] = useState("");
  const [value, setValue] = useState<number>(-1);
  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };
  const [sellerRating, setSellerRating] = useState<number>();

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
  }, [sellerRating]);

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
      console.log("here is the submit review");
      console.log({
        ...productOwner,
        reviews: updatedReviews,
      });

      updateUser({
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
      <div className="w-full h-screen bg-ca2 p-6 pt-20">
        <div className="flex flex-col md:flex-row w-full bg-ca3 md:p-10">
          <div className="flex flex-col items-center bg-ca3 rounded-l-md mx-auto w-full md:space-y-2 md:w-1/2">
            <img
              className="h-24 w-24 my-2 rounded-full"
              src={productOwner?.profilePicture}
              alt={productOwner?.name}
            />
            <div className="flex flex-col items-center space-y-5">
              <h2>{productOwner?.sellerName || productOwner?.name}</h2>
              {sellerRating ? (
                <h3>{sellerRating}</h3>
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
      </div>
    </>
  );
}

export default SellerPage;
