import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

function RequireAuth({ children, role }) {
  const location = useLocation();
  const { isAuthenticated, currentUser } = useUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && currentUser.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RequireAuth;
