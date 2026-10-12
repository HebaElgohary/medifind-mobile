import { coreApi } from "./coreApi";

export const medicine = coreApi.injectEndpoints({
    endpoints: (build) => ({
        getAllMedicines: build.query({    //why i need it? -->for doctor view in offersReview 
            query: () => ({
                url: 'medicine',
                method: 'GET',
            }),
            transformResponse: (response) => {
                console.log('GetAllMedicines Response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('GetAllMedicines Error:', response);
                return response;
            },
            providesTags: ['Medicine']
        }),

        getUserOffers: build.query({    //for donation screen
            query: (id) => ({
                url: `medicine/${id}`,
                method: 'Get',

            }),
            providesTags: ['Medicine']

        }),
        getAcceptedMedicines: build.query({
            query: () => ({
                url: "acceptedMedicine",
                method: "GET"
            }),
            providesTags: ['Medicine']
        }),
        addMedicine: build.mutation({
            query: (body) => ({
                url: `medicine`,
                method: "POST",
                body,
                responseHandler: 'text',  // Add this to get raw response
            }),
            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: {
                    "content-type": meta.response.headers.get("content-type"),
                    "content-length": meta.response.headers.get("content-length"),
                    "authorization": meta.response.headers.get("authorization"),
                    "token": meta.response.headers.get("x-auth-token")
                }
            }),
            invalidatesTags: ['Medicine']
        }),

        updateMedicine: build.mutation({
            query: ({ id, ...body }) => ({
                url: `medicine/${id}`,
                method: 'PATCH',
                body,
                responseHandler: 'text',

            }),

            transformResponse: (response, meta) => ({
                data: JSON.parse(response),
                headers: {
                    "content-type": meta.response.headers.get("content-type"),
                    "content-length": meta.response.headers.get("content-length"),
                    "authorization": meta.response.headers.get("authorization"),
                    "token": meta.response.headers.get("x-auth-token")
                }

            }),
            invalidatesTags: ['Medicine']

        }),
        deleteMedicine: build.mutation({
            query: ({ user_id, medicine_id }) => ({
                url: `medicine/${user_id}`,
                method: "DELETE",
                responseHandler: "text",
                headers: {
                    "Content-Type": "application/json",
                    req_id: medicine_id
                },
            }),
            invalidatesTags: ["Medicine"], // Invalidate cache to refetch updated data
        }),

    }),
    overrideExisting: true,
})

export const { useGetAllMedicinesQuery
    , useGetUserOffersQuery
    , useGetAcceptedMedicinesQuery
    , useAddMedicineMutation
    , useUpdateMedicineMutation
    , useDeleteMedicineMutation

} = medicine