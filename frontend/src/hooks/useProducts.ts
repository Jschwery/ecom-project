import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Product, User } from "../../typings";
import { useToast } from "@chakra-ui/react";

const BASE_URL = "http://localhost:5000";

export default function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [productOwner, setProductOwner] = useState<User>();
  const [error, setError] = useState<Error | null>(null);
  const toast = useToast();

  const fetchData = useCallback(async (endpoint: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (product: Product) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${product._id}`,
        product,
        {
          withCredentials: true,
        }
      );
      if (response.status >= 200 && response.status < 300) {
        toast({
          title: "Product updated.",
          description: "Success",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setProducts(response.data);
        return { status: response.status, error: null };
      } else {
        return { status: response.status, error: "Unexpected response code." };
      }
    } catch (err: any) {
      console.error(err);
      return { status: null, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducts = useCallback(async () => {
    try {
      const productsData = await fetchData("/api/products");
      setProducts(productsData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const findProductOwner = useCallback(async (productID: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/owner/${productID}`
      );
      setProductOwner(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getProductsByCategory = useCallback(async (category: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/category/${category}`
      );
      return response.data;
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getProductById = useCallback(async (productId: string) => {
    try {
      return await fetchData(`/api/products/${productId}`);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    getProducts,
    getProductById,
    getProductOwner,
    updateProduct,
    getProductsByCategory,
    loading,
    error,
    findProductOwner,
    productOwner,
  };
}
