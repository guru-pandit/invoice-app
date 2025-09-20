# Redux Store Setup

This directory contains the Redux Toolkit setup for global state management in the Invoice App.

## Structure

```
store/
├── store.js          # Main store configuration
├── hooks.js          # Typed Redux hooks
├── slices/
│   ├── authSlice.js      # Authentication state management
│   └── invoicesSlice.js  # Example invoices state management
└── README.md         # This file
```

## Usage

### 1. Accessing Auth State

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;
  
  return (
    <div>
      Welcome, {user.email}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 2. Using Redux Hooks Directly

```javascript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectUser, setUser } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  
  const handleUpdateUser = (userData) => {
    dispatch(setUser(userData));
  };
  
  return <div>{user?.email}</div>;
}
```

### 3. Adding New Slices

To add a new slice (e.g., for customers):

1. Create the slice file: `store/slices/customersSlice.js`
2. Import and add to store in `store/store.js`:
   ```javascript
   import customersReducer from './slices/customersSlice';
   
   export const store = configureStore({
     reducer: {
       auth: authReducer,
       customers: customersReducer,
     },
   });
   ```
3. Create selectors and actions as needed

## Available Actions

### Auth Slice
- `setUser(user)` - Set the current user
- `setLoading(boolean)` - Set loading state
- `logout()` - Clear user data
- `clearAuth()` - Reset auth state to initial

### Auth Selectors
- `selectUser(state)` - Get current user
- `selectIsAuthenticated(state)` - Get authentication status
- `selectAuthLoading(state)` - Get loading state

## Best Practices

1. **Use the custom hooks**: Prefer `useAuth()` over direct Redux hooks for auth
2. **Keep slices focused**: Each slice should manage a specific domain
3. **Use selectors**: Always use selectors instead of accessing state directly
4. **Immutable updates**: Redux Toolkit uses Immer, so you can write "mutative" logic
5. **Async operations**: Use Redux Toolkit Query or custom thunks for API calls

## Firebase Integration

The auth slice is automatically synchronized with Firebase Auth:
- `AuthProvider` listens to Firebase auth changes and updates Redux
- `signOutUser()` function clears both Firebase and Redux state
- User persistence is handled by Firebase Auth persistence settings
