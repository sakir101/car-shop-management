import { baseApi } from "./baseApi";
import { tagTypes } from "../tag-types";
import { IFormattedServiceEstimate, IMeta } from "@/types";

const Technician_URL = "/technician";

export const technicianApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllServicesForTechnician: build.query({
            query: ({ args, id }: { args?: Record<string, any>; id: string }) => ({
                url: `${Technician_URL}/get-all-services-technician/${id}`,
                method: "GET",
                params: args,
            }),
            transformResponse: (response: IFormattedServiceEstimate[], meta: IMeta) => ({
                data: response,
                meta,
            }),
            providesTags: [tagTypes.technician],
        }),
        getSingleServiceTechnician: build.query({
            query: ({ id, serviceCode }: { id: string, serviceCode: string }) => ({
                url: `${Technician_URL}/get-services-technician/${id}/${serviceCode}`,
                method: "GET",
            })
        }),
        updateTechnicianServiceStatus: build.mutation({
            query: ({ data }) => ({
                url: `${Technician_URL}/update-service-status`,
                method: "PATCH",
                data,
            }),
            invalidatesTags: [tagTypes.technician],
        }),
        addTechnicianComment: build.mutation({
            query: ({ data }) => ({
                url: `${Technician_URL}/add-service-comment`,
                method: "POST",
                data,
            }),
            invalidatesTags: [tagTypes.technician],
        }),

    }),
});

export const {
    useGetAllServicesForTechnicianQuery,
    useAddTechnicianCommentMutation,
    useUpdateTechnicianServiceStatusMutation,
    useGetSingleServiceTechnicianQuery
} = technicianApi;
