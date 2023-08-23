import axios from "axios";
import { useEffect, useState } from "react";
import { User } from "../../typings";

export default function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  return { user, isLoading };
}
