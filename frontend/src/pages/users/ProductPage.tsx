import React, { ChangeEvent, useEffect, useState } from "react";
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
import { Button, Input } from "@chakra-ui/react";
import { loadingStyles, spinnerStyles } from "../Home";

function ProductPage() {
  let { productID } = useParams();
  const { getProductById, updateProduct, findProductOwner, productOwner } =
    useProducts();
  const { user, getUserById, isLoading } = useUser();
  const [foundProduct, setFoundProduct] = useState<Product | null>();
  const [reviewUsers, setReviewUsers] = useState<any[]>([]);
  const [userImages, setUserImages] = useState<User[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const getProduct = async () => {
      try {
        if (productID) {
          const product: Product = await getProductById(productID);

          if (product) {
            console.log(product);

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

  useEffect(() => {}, [foundProduct]);

  useEffect(() => {
    if (foundProduct?.reviews) {
      const fetchReviewUsers = async () => {
        const fetchedUsers: User[] = [];
        for (let review of foundProduct.reviews || []) {
          if (review._id) {
            console.log(review._id);

            const reviewUser = await getUserById(review._id);
            console.log(reviewUser);

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
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

      <div className="bg-ca2 w-full min-h-screen pt-20">
        <div className="w-full p-4 flex flex-col md:flex-row">
          <div className=" min-w-[30%] rounded-md md:w-[30%] mx-2 flex items-center flex-col bg-ca4">
            <h2>Seller</h2>
            <img
              className="w-14 h-14 rounded-full"
              src={"" || "/images/logo2.svg"}
              alt="user profile"
            />
            <div className="flex flex-col items-center">
              <h4>{user?.name}</h4>
              <h4>{user?.rating || "Rating: 5⭐"}</h4>

              <div className="flex flex-col w-full p-5"></div>
            </div>
          </div>
          <div className="flex flex-col md:w-[70%] px-2 my-5 md:my-0">
            <div className=" w-full bg-ca3 p-4 md:p-6 rounded-lg shadow-black mb-2 pl-3 shadow-sm flex flex-col md:flex-row">
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
                    <button className="self-end bg-ca6 hover:bg-ca5 text-white py-2 px-4 rounded-full">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col items-center bg-ca2">
              <h1>Product Reviews</h1>
              {reviewUsers &&
                reviewUsers.map((review, index) => {
                  const correspondingUser: User | undefined = userImages.find(
                    (user) => user._id === review._id
                  );

                  return (
                    <div className="flex items-center w-[75%] my-3 space-x-5 bg-ca4 rounded-md p-3">
                      <img
                        className="w-12 h-12 rounded-full"
                        src={
                          correspondingUser
                            ? correspondingUser.profilePicture
                            : "/path/to/default/image.jpg"
                        }
                        alt="Reviewer's profile picture"
                      />
                      <h3 className="flex-grow overflow-hidden bg-ca3 rounded-md p-1">
                        {review.review}
                      </h3>
                    </div>
                  );
                })}
              <div style={{ marginTop: "auto" }}>
                {foundProduct.reviews && (
                  <ViewProducts
                    itemsList={foundProduct.reviews}
                    showItemsCallback={(items) => setReviewUsers(items)}
                  />
                )}
              </div>
              <div className="w-[50%] bg-ca4 rounded-md justify-center py-5">
                <h3>Write your review:</h3>
                <Input
                  value={input}
                  className="!w-[100px]"
                  placeholder="Type your review here..."
                  onChange={handleInputChange}
                />
                <Button onClick={input !== "" ? handleSubmitReview : () => {}}>
                  Submit Review
                </Button>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
