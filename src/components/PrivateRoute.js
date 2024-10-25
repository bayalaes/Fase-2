import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Comprobar si hay un token

  return isAuthenticated ? children : <Navigate to="/" />; // Redirigir si no está autenticado
};

export default PrivateRoute;
