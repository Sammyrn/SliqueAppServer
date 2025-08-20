import { Navigate } from 'react-router-dom';
import useAuthStore from '../context/useAuth';

const PrivateRoute = ({children}) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== '2004') {
    return <Navigate to="/forbidden" replace  />;
  }

  return children;
};

export default PrivateRoute; 