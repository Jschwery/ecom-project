import React from "react";
import { Route, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  path: string;
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ path, element }) => {
  const isAuthenticated = Boolean(localStorage.getItem("jwtToken"));
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
  }

  return isAuthenticated ? <Route path={path} element={element} /> : null;
};

export default ProtectedRoute;
