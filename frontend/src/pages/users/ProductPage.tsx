import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SignedInNav from "../../components/SignedInNavBar";
import { Product } from "../../../typings";
import useProducts from "../../hooks/useProducts";
import PictureCarousel from "../../components/DealCarousel";
import ITag from "./Tag";
import useUser from "../../hooks/useUser";

function ProductPage() {
  let { productID } = useParams();
  const { getProductById } = useProducts();
  const { user, isLoading } = useUser();
  const [foundProduct, setFoundProduct] = useState<Product | null>();

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (productID) {
          const product = await getProductById(productID);
          setFoundProduct(product);
        }
      } catch (e: any) {
        console.error(e);
      }
    };
    getProduct();
  }, [productID, getProductById]);

  if (!foundProduct)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <>
      <SignedInNav />

      <div className="bg-ca1 w-full min-h-screen pt-20">
        <div className="w-full p-4 bg-red-500 flex flex-col md:flex-row">
          <div className="w-full md:w-[30%] flex items-center flex-col">
            <h2>Seller</h2>
            <img
              className="w-14 h-14 rounded-full"
              src={user?.profilePicture || "/images/logo2.svg"}
              alt="user profile"
            />
            <div className="flex flex-col items-center">
              <h4>{user?.name}</h4>
              <h4>{user?.rating || "Rating: 5⭐"}</h4>
            </div>
          </div>
          <div className=" w-[70%] mx-auto bg-ca3 p-4 md:p-6 rounded-lg shadow-lg flex flex-col md:flex-row">
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
        </div>
      </div>
    </>
  );
}

export default ProductPage;
