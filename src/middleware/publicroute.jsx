import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth) || {};
  const localToken = localStorage.getItem("token");

  // If user is already logged in, bounce them to dashboard
  if (token || localToken) {
    return <Navigate to="/dashboard" replace />;
  }

  // Else show the public route
  return children;
};

export default PublicRoute;
