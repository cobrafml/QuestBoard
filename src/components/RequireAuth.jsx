import React from "react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }) {
const isLoggedIn = sessionStorage.getItem("loggedInUser");
return isLoggedIn ? children : <Navigate to="/login" />;
}