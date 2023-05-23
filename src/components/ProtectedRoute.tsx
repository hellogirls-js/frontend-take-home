import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

export default function ProtectedRoute({ children }: { children: any }) {
  const user = useContext(AuthContext);

  if (!user?.user) {
    return <Navigate to="/login" />
  }

  return children;
}