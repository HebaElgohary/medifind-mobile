import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, FEATURE_ENABLED } from '@env';


export const coreApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL || "http://localhost:7777",
    timeout: 10000, // Add a 10-second timeout
    prepareHeaders: (headers, { getState }) => {
      // Get the token from the state
      const token = getState().auth.token;

      // If we have a token, include it in the headers
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      return headers;
    },

  }),

  tagTypes: ['Medicine', 'User', 'Request', 'Orders', 'review'],
  endpoints: () => ({})
})
