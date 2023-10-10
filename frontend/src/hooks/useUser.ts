import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Product, User } from "../../typings";
import { useEnvironment } from "../global/EnvironmentProvider";
const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setUserProducts] = useState<Product[] | null>(null);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const isDevelopment = useEnvironment();

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
        `${process.env.REACT_APP_BACKEND_URL}/api/users/products`,
        {
          withCredentials: true,
        }
      );

      setUserProducts(productRequest.data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getAllUserProducts = async (userID: String) => {
    console.log("getAllUserProducts called with userID:", userID);

    try {
      const productRequest = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userID}/products`,
        {
          withCredentials: true,
        }
      );

      setAllProducts(productRequest.data);
    } catch (error) {
      console.error("Error fetching user products:", error);
    }
  };

  const returnUserProducts = useCallback(async (userID: String) => {
    try {
      const productRequest = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userID}/products`,
        {
          withCredentials: true,
        }
      );
      return productRequest;
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateUser = useCallback(
    async (
      user: User
    ): Promise<{ status: number | null; error: string | null }> => {
      setIsLoading(true);
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/edit`,
          user,
          {
            withCredentials: true,
          }
        );

        if (response.status >= 200 && response.status < 300) {
          setUser(response.data);
          return { status: response.status, error: null };
        } else {
          return {
            status: response.status,
            error: "Unexpected response code.",
          };
        }
      } catch (err: any) {
        console.error(err);
        return { status: null, error: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const atomicUserUpdate = async (buyer: User, seller: User) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/edit/atomic`,
        { buyer, seller },
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
  };

  const updateOtherUser = useCallback(async (user: User) => {
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/edit`,
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
        const resp = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/check`,
          {
            withCredentials: true,
          }
        );
        setUser(resp.data);
      } catch (err) {
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
    atomicUserUpdate,
    getAllUserProducts,
    allProducts,
    updateOtherUser,
    returnUserProducts,
  };
}
