import { coreApi } from './coreApi'

export const request = coreApi.injectEndpoints({
    endpoints: (build) => ({
        addRequest: build.mutation({
            query: (body) => ({
                url: 'request',
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => {
                try {
                    // Check if response is empty or not valid JSON
                    if (!response || response.trim() === '') {
                        console.error('Empty response received');
                        throw new Error('Server returned an empty response');
                    }

                    // Check if response starts with HTML
                    if (response.trim().startsWith('<!DOCTYPE') || response.trim().startsWith('<html')) {
                        console.error('HTML response received instead of JSON:', response.substring(0, 100));
                        throw new Error('Server returned HTML instead of JSON. Please check if the server is running correctly.');
                    }

                    // Log the raw response for debugging
                    console.log('Raw response from server:', response.substring(0, 200));

                    return {
                        data: JSON.parse(response),
                        headers: {
                            "content-type": meta.response.headers.get("content-type"),
                            "content-length": meta.response.headers.get("content-length"),
                            "authorization": meta.response.headers.get("authorization"),
                            "token": meta.response.headers.get("x-auth-token")
                        }
                    };
                } catch (error) {
                    console.error('Failed to parse response:', error.message);
                    console.error('Response preview:', response ? response.substring(0, 100) : 'null');
                    throw new Error('Server returned an invalid response. Please check if the server is running correctly.');
                }
            },
            invalidatesTags: ['Request']
        }),
        updateRequest: build.mutation({
            query: ({ id, body }) => ({
                url: `request/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',
            }),
            transformResponse: (response) => ({
                data: JSON.parse(response),
            }),
            invalidatesTags: ['Request'],
        }),

        deleteRequest: build.mutation({
            query: ({ req_id, user_id }) => ({
                url: `request/${user_id}`,
                method: "DELETE",
                responseHandler: "text",
                headers: {
                    "Content-Type": "application/json",
                    req_id: req_id,
                }
            }),
            invalidatesTags: ["Request"], // Invalidate cache to refetch updated data
        }),
        getUserRequests: build.query({
            query: (id) => ({
                url: `request/${id}`,
                method: 'GET'
            }),
            providesTags: ['Request']
        }),
        getAllRequests: build.query({   //for doctor view in requestsReview
            query: () => ({
                url: `request`,
                method: `GET`
            }),
            providesTags: ['Request'],
            overrideExisting: true
        }),

    })

});

export const { useAddRequestMutation, useUpdateRequestMutation, useDeleteRequestMutation, useGetUserRequestsQuery, useGetAllRequestsQuery } = request;
