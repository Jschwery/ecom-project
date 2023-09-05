import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Product, User } from "../../typings";
import { getLocalCart } from "../components/util/CartUtil";
const BASE_URL = "http://localhost:5000";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setUserProducts] = useState<Product[] | null>(null);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);

  const fetchData = useCallback(async (endpoint: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getUserById = useCallback(async (userID: string) => {
    try {
      const userFound = await fetchData(`/api/users/${userID}`);

      return userFound;
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getUserProducts = useCallback(async () => {
    try {
      const productRequest = await axios.get(
        "http://localhost:5000/api/users/products",
        {
          withCredentials: true,
        }
      );

      setUserProducts(productRequest.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getAllUserProducts = useCallback(async (userID: String) => {
    try {
      const productRequest = await axios.get(
        `http://localhost:5000/api/users/${userID}/products`,
        {
          withCredentials: true,
        }
      );

      setAllProducts(productRequest.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateUser = useCallback(async (user: User) => {
    console.log("here is the user: ");
    console.log(user);

    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/edit",
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        setUser(response.data);
        return { status: response.status, error: null };
      } else {
        return { status: response.status, error: "Unexpected response code." };
      }
    } catch (err: any) {
      console.error(err);
      return { status: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateOtherUser = useCallback(async (user: User) => {
    console.log("here is the user: ");
    console.log(user);

    setIsLoading(true);
    try {
      const response = await axios.put(
        "http://localhost:5000/api/users/edit",
        user,
        {
          withCredentials: true,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        return { status: response.status, error: null };
      } else {
        return { status: response.status, error: "Unexpected response code." };
      }
    } catch (err: any) {
      console.error(err);
      return { status: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserProducts();
  }, []);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const resp = await axios.get("http://localhost:5000/api/users/check", {
          withCredentials: true,
        });
        setUser(resp.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  return {
    user,
    setIsLoading,
    updateUser,
    isLoading,
    products,
    setUserProducts,
    getUserById,
    getAllUserProducts,
    allProducts,
    updateOtherUser,
  };
}
