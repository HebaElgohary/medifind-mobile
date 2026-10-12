import { coreApi } from './coreApi'


export const orders = coreApi.injectEndpoints({
    endpoints: (build) => ({
        addOrder: build.mutation({
            query: (body) => ({
                url: 'orders',
                method: 'POST',
                body,
                responseHandler: 'text',
            }),
            transformResponse: (response, meta) => {
                try {
                    console.log('Add order response:', response.substring(0, 100));
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
                    console.error('Error parsing add order response:', error);
                    throw new Error('Failed to parse server response');
                }
            },
            invalidatesTags: ['Orders']
        }),
        getOrder: build.query({
            query: (user_id) => {
                console.log('Fetching orders for user:', user_id);
                return {
                    url: `orders/${user_id}`,
                    method: 'GET'
                };
            },
            transformResponse: (response) => {
                console.log('Get orders response:', response);
                return response;
            },
            providesTags: ['Orders']
        }),

        updateOrder: build.mutation({

            query: ({ id, body }) => ({
                url: `orders/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',
            }),
            transformResponse: (response) => ({
                data: JSON.parse(response),
            }),
            invalidatesTags: ['Orders'],
        }),


        deleteOrder: build.mutation({
            query: ({ req_id, user_id }) => ({
                url: `orders/${user_id}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    req_id: req_id,
                },
            }),
            async onQueryStarted({ req_id }, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    console.log("✅ Order deleted successfully:", req_id);
                    dispatch(coreApi.util.invalidateTags(["Orders"]));
                } catch (error) {
                    console.error("❌ Error deleting order:", error);
                }
            },
        }),


        getAllOrders: build.query({  //for doctor view in requestsReview
            query: () => ({
                url: 'orders',
                method: 'GET'
            }),
            transformResponse: (response) => {
                console.log('Get all orders response:', response);
                return response;
            },
            providesTags: ['Orders']

        }),
    })
});

export const { useAddOrderMutation, useGetOrderQuery, useDeleteOrderMutation, useGetAllOrdersQuery, useUpdateOrderMutation } = orders;



