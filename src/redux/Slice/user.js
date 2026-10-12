import { coreApi } from "./coreApi"
import { BASE_URL } from '@env';

export const user = coreApi.injectEndpoints({
    endpoints: (build) => ({
        userLogin: build.mutation({
            query: (body) => ({
                url: 'login',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',

                },
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                // Only extract needed headers as plain values
                headers: {
                    contentType: meta.response.headers.get('content-type'),
                    authorization: meta.response.headers.get('authorization'),
                    token: meta.response.headers.get('x-auth-token')
                }
            }),
            invalidatesTags: ['User']
        }),
        getAllUsers: build.query({
            query: () => ({
                url: 'users',
                method: "GET"
            }),
            providesTags: ['User']
        }),
        userRegister: build.mutation({
            query: (body) => {
                console.log('Making registration request to:', `${BASE_URL}/register`);
                return {
                    url: `register`,
                    method: "POST",
                    body,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    responseHandler: 'text',
                };
            },
            transformResponse: (response, meta) => {
                console.log('Registration response:', response);
                return {
                    data: JSON.parse(response),
                    headers: {
                        contentType: meta.response.headers.get('content-type'),
                        authorization: meta.response.headers.get('authorization'),
                        token: meta.response.headers.get('x-auth-token')
                    }
                };
            },
            transformErrorResponse: (response) => {
                console.error('Registration error response:', response);
                return response;
            },
            invalidatesTags: ['User']

        }),
        updateUser: build.mutation({
            query: ({ id, body }) => ({
                url: `user/${id}`,
                method: 'PATCH',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => {
                console.log('Update response:', response);
                const parsedResponse = JSON.parse(response);
                return {
                    data: parsedResponse,
                    headers: {
                        authorization: meta.response.headers.get('authorization'),
                        token: meta.response.headers.get('x-auth-token')
                    }
                };
            },
            invalidatesTags: ['User'],
        }),
        getUserById: build.query({
            query: (id) => ({
                url: `user/${id}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }),
            transformResponse: (response) => {
                const parsedData = typeof response === 'string' ? JSON.parse(response) : response;
                console.log('User details response:', parsedData);

                // Handle nested data structure
                if (parsedData.data && Array.isArray(parsedData.data)) {
                    return parsedData.data[0];
                }

                // Handle direct array response
                if (Array.isArray(parsedData)) {
                    return parsedData[0];
                }

                // Return the user data for other cases
                return parsedData.data || parsedData.user || parsedData;
            },
            providesTags: (result) => [
                { type: 'User', id: 'PROFILE' }
            ]
        }),
    }),
    overrideExisting: true  // Add this line to allow endpoint overrides
})


export const { useUserLoginMutation, useGetAllUsersQuery, useUserRegisterMutation, useUpdateUserMutation, useGetUserByIdQuery } = user

