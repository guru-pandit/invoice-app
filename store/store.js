import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// import invoicesReducer from './slices/invoicesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // invoices: invoicesReducer, // Uncomment to add invoices to global state
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/setUser'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

// Export types for TypeScript usage (if needed later)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
