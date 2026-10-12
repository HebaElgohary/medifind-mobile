import { coreApi } from "./coreApi";

export const review = coreApi.injectEndpoints({
    endpoints: (build) => ({

        addReview: build.mutation({
            query: ({ id, ...body }) => ({
                url: `medicine/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',

            }),
            providesTags: ['Medicine']
        }),
        transformResponse: (response, meta) => ({
            data: JSON.parse(response),
            headers: meta.response.headers

    }),
    invalidatesTags: ['Medicine']
})
   

})
export const { useAddReviewMutation } = review;
