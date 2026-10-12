import { configureStore } from '@reduxjs/toolkit';
import { coreApi } from './Slice/coreApi';
import authReducer from './Slice/authSlice';

export const store = configureStore({

  reducer: {
    [coreApi.reducerPath]: coreApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(coreApi.middleware),
});

