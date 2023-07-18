import React from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Auth({children}) {
  const user = useSelector((state) => state.user.user);
 return !user ? <Navigate to="/" replace />:children;
}

export default Auth;
