import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Product, User } from "../../typings";
import { useEnvironment } from "../global/EnvironmentProvider";
import { useError } from "../global/ErrorProvider";
import useSWR from "swr";

const BASE_URL = `${process.env.REACT_APP_BACKEND_URL}`;
const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setUserProducts] = useState<Product[] | null>(null);
  const [allProducts, setAllProducts] = useState<Product[] | null>(null);
  const isDevelopment = useEnvironment();
  const { addErrorToQueue } = useError();

  const { data: userProducts, error: userProductsError } = useSWR(
    user ? `${BASE_URL}/api/users/${user._id}/products` : null,
    fetcher
  );
  const { data: userStatus, error: userStatusError } = useSWR(
    `${BASE_URL}/api/users/check`,
    fetcher,
    { shouldRetryOnError: false }
  );
  useEffect(() => {
    if (userProducts) {
      setUserProducts(userProducts);
    }
    if (userProductsError) {
      addErrorToQueue(userProductsError);
    }
  }, [userProducts, userProductsError]);

  useEffect(() => {
    if (userStatus) {
      setUser(userStatus);
    }
    if (userStatusError) {
      addErrorToQueue(userStatusError);
    }
  }, [userStatus, userStatusError]);

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

  const getAllUserProducts = async (userID: String) => {
    try {
      const productRequest = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userID}/products`,
        {
          withCredentials: true,
        }
      );

      setAllProducts(productRequest.data);
    } catch (error: any) {
      if (isDevelopment) {
        console.error("Error fetching user products:", error);
      } else {
        addErrorToQueue(error);
      }
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
    } catch (error: any) {
      if (isDevelopment) {
        console.error(error);
      } else {
        addErrorToQueue(error);
      }
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
        if (isDevelopment) {
          console.error(err);
        } else {
          addErrorToQueue(err);
        }
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
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
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
      if (isDevelopment) {
        console.error(err);
      } else {
        addErrorToQueue(err);
      }
      return { status: null, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    setIsLoading,
    updateUser,
    isLoading,
    products,
    allProducts: userProducts as Product[],
    setUserProducts,
    getUserById,
    atomicUserUpdate,
    getAllUserProducts,
    updateOtherUser,
    returnUserProducts,
  };
}
