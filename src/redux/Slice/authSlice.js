import { createSlice } from '@reduxjs/toolkit';
import { user } from './user';
import { decodeToken } from '../../utils/tokenUtils';

const initialState = {
  token: null,
  isAuthenticated: false,
  user: null,
  tokenData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = !!token;

      // Decode and store token data
      if (token) {
        state.tokenData = decodeToken(token);

      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.tokenData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      user.endpoints.userLogin.matchFulfilled,
      (state, { payload }) => {
        const token = payload.headers.token || payload.headers.authorization;
        if (token) {
          state.token = token;
          state.isAuthenticated = true;

          // Decode and store token data
          state.tokenData = decodeToken(token);
        }
      }
    );
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectTokenData = (state) => state.auth.tokenData;