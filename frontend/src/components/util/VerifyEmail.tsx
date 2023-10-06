import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const VerifyEmail: React.FC = () => {
  const { token } = useParams();

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/verify-email`, { token })
      .then((response) => {
        console.log("Email verified!");
      })
      .catch((error) => {
        console.log("Email verification failed:", error);
      });
  }, [token]);

  return <div>Verifying email...</div>;
};
