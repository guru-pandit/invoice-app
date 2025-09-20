import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, selectIsAuthenticated, selectAuthLoading, logout } from '@/store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector(selectAuthLoading);

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    isAuthenticated,
    loading,
    logout: handleLogout,
  };
}
