import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, screenLoading } = useSelector(
    (state) => state.userSlice
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated]);
if(screenLoading) return null;

  return children;
};

export default ProtectedRoute;