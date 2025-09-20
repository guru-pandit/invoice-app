// Public routes that don't require authentication
export const PUBLIC_ROUTES = new Set(["/login", "/"]);

// Protected routes that require authentication
export const PROTECTED_ROUTES = {
  INVOICES: "/invoices",
  CUSTOMERS: "/customers",
  DASHBOARD: "/dashboard",
};

// Route paths as constants
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  INVOICES: "/invoices",
  CUSTOMERS: "/customers",
  DASHBOARD: "/dashboard",
};

// Helper function to check if a route is public
export const isPublicRoute = (pathname) => {
  return PUBLIC_ROUTES.has(pathname || "/");
};

// Helper function to get default redirect route after login
export const getDefaultProtectedRoute = () => {
  return PROTECTED_ROUTES.INVOICES;
};
