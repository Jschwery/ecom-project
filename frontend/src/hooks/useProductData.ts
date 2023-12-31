import { useEffect, useState } from "react";
import useProducts from "./useProducts";
import { Product, User } from "../../typings";
import useUser from "./useUser";
import { useEnvironment } from "../global/EnvironmentProvider";
import { useError } from "../global/ErrorProvider";

export default function useProductData(productID: string) {
  const { getProductById, findProductOwner, productOwner } = useProducts();
  const {
    getUserById,
    allProducts,
    getAllUserProducts,
    isLoading,
    setIsLoading,
  } = useUser();
  const [foundProduct, setFoundProduct] = useState<Product | null>();
  const [reviewUsers, setReviewUsers] = useState<any[]>([]);
  const [userImages, setUserImages] = useState<User[]>([]);
  const [sellerRating, setSellerRating] = useState<number>();
  const isDevelopment = useEnvironment();
  const { addErrorToQueue } = useError();

  useEffect(() => {
    console.log("the found product");
    console.log(foundProduct);
  }, [foundProduct]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const product = await getProductById(productID);

        if (product) {
          setFoundProduct(product);
          setReviewUsers(product.reviews ?? []);
        } else {
          console.warn("Product not found or is undefined");
        }
      } catch (e: any) {
        if (isDevelopment) {
          console.error(e);
        } else {
          addErrorToQueue(e);
        }
      }
    };

    getProduct();
  }, [productID, getProductById]);

  useEffect(() => {
    findProductOwner(productID || "");
  }, [productID]);

  useEffect(() => {
    const findProducts = async () => {
      try {
        if (productOwner) {
          setIsLoading(true);
          await getAllUserProducts(productOwner?._id);
        }
        setIsLoading(false);
      } catch (error: any) {
        if (isDevelopment) {
          console.error(error);
        } else {
          addErrorToQueue(error);
        }
      }
    };
    findProducts();
  }, [productOwner]);

  useEffect(() => {
    if (productOwner?.reviews) {
      const reviews = productOwner.reviews.reduce((acum, review) => {
        return acum + (review.rating || 0);
      }, 0);

      const ratedReviewsCount = productOwner.reviews.filter(
        (review) => review.rating
      ).length;

      if (ratedReviewsCount > 0) {
        setSellerRating(Number((reviews / ratedReviewsCount).toFixed(2)));
      }
    }
  }, [sellerRating, productOwner]);

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

  return {
    foundProduct,
    reviewUsers,
    userImages,
    sellerRating,
    setReviewUsers,
    allProducts,
    isLoading,
    productOwner,
  };
}
