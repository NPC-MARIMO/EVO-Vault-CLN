import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth) || {};

  // fallback if Redux is empty on reload
  const localToken = localStorage.getItem("token");

  if (!token && !localToken) {
    return <Navigate to="/login" replace />;
  }

  

  return <Outlet />;
};

export default ProtectedRoute;
