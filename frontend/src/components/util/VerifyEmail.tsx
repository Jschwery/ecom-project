import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const VerifyEmail: React.FC = () => {
  const { token } = useParams();

  useEffect(() => {
    axios
      .post(`https://34.227.14.81:8080/verify-email`, { token })
      .then((response) => {
        console.log("Email verified!");
      })
      .catch((error) => {
        console.log("Email verification failed:", error);
      });
  }, [token]);

  return <div>Verifying email...</div>;
};
