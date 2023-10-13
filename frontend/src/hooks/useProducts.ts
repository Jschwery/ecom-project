import axios from "axios";
import { useCallback, useState } from "react";
import { Product, User } from "../../typings";
import { useEnvironment } from "../global/EnvironmentProvider";
import { useError } from "../global/ErrorProvider";
import useSWR from "swr";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function useProducts() {
  const [productOwner, setProductOwner] = useState<User>();
  const isDevelopment = useEnvironment();
  const { addErrorToQueue } = useError();
  const { data: foundProducts, error } = useSWR(
    `${BASE_URL}/api/products`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const updateProduct = async (product: Product) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/products/${product._id}`,
        product,
        { withCredentials: true }
      );
      if (response.status >= 200 && response.status < 300) {
        return response.data;
      } else {
        throw new Error("Unexpected response code.");
      }
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
    }
  };

  const findProductOwner = useCallback(async (productID: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/owner/${productID}`
      );
      setProductOwner(response.data);
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/category/${category}`
      );
      return response.data;
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
    }
  }, []);

  const getProductOwner = useCallback(async (productID: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/owner/${productID}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
    }
  }, []);

  const getProductById = useCallback(async (productId: string) => {
    try {
      const product = await axios.get(`${BASE_URL}/api/products/${productId}`, {
        withCredentials: true,
      });
      return product.data as Product;
    } catch (err: any) {
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
      return null;
    }
  }, []);

  return {
    products: foundProducts as Product[],
    getProductById,
    getProductOwner,
    updateProduct,
    getProductsByCategory,
    loading: !error && !foundProducts,
    error,
    findProductOwner,
    productOwner,
  };
}
