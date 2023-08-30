import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Product, User } from "../../typings";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setUserProducts] = useState<Product[] | null>(null);

  const BASE_URL = "http://localhost:5000";

  const fetchData = async (endpoint: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        withCredentials: true,
      });
      console.log(response);

      return response.data;
    } catch (err: any) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  const getUserById = useCallback(async (userID: string) => {
    try {
      const userFound = await fetchData(`/api/users/${userID}`);
 
      return userFound;
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getUserProducts = async () => {
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
  };

  const updateUser = async (user: User) => {
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
  };

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
    updateUser,
    isLoading,
    products,
    setUserProducts,
    getUserById,
  };
}
