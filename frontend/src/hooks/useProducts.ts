import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Product } from "../../typings";

const BASE_URL = "http://localhost:5000";

export default function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async (endpoint: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProducts = async () => {
    try {
      const productsData = await fetchData("/api/products");
      setProducts(productsData);
    } catch (err) {
      console.error(err);
    }
  };

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

  return { products, getProducts, getProductById, loading, error };
}
